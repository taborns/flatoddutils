/*
PlacedBet : represents the amount put
stake     : represents the placed bet amount after stake tax (VAT/TOT)
*/

const AccumulatorBonusValueType = {
    Percentage: 0,
    Fixed: 1,
}

// ---------------------------------------------------------------------------
// normalizeConfig
//   productConfig    – payout / tax settings (MAX_WIN, TAX_TYPE, etc.)
//   bonusApiResponse – raw API response from the control panel (untouched)
// ---------------------------------------------------------------------------
function normalizeConfig(productConfig = {}, bonusApiResponse = {}) {
    const bonusData = bonusApiResponse?.data ?? {}

    return {
        // Payout limits
        MAX_WIN:      productConfig.MAX_WIN      ?? 500000,
        SLIP_SIZE:    productConfig.SLIP_SIZE     ?? 20,
        MAX_BONUS:    productConfig.MAX_BONUS     ?? null,
        NET_PAY_CAP:  productConfig.NET_PAY_CAP  ?? null,
        REFUND_FLOOR: productConfig.REFUND_FLOOR ?? false,

        // Stake tax
        TAX_TYPE: productConfig.TAX_TYPE ?? 'none',
        VAT_TAX:  productConfig.VAT_TAX  ?? 0,
        TOT_TAX:  productConfig.TOT_TAX  ?? 0,

        // Win tax
        WIN_TAX_RATE: productConfig.WIN_TAX_RATE ?? 0.15,
        TAXABLE_WIN:  productConfig.TAXABLE_WIN  ?? 1000,
        // 'full_win'    – tax on (win + bonus)
        // 'profit_only' – tax on (win + bonus - stake)
        // 'threshold'   – tax only when win > TAXABLE_WIN
        // 'none'        – no win tax
        WIN_TAX_MODE: productConfig.WIN_TAX_MODE ?? 'none',

        // Bonus — API response owns these; copied verbatim, never reshaped
        BONUS_ACTIVE: bonusData.isActive     ?? false,
        BONUS_LABEL:  bonusData.displayLabel ?? null,
        BONUS_RULES:  bonusData.bonusRules   ?? [],

        // Bonus behaviour — product config can override
        // 'win_value' | 'stake' | 'initial_tax' | 'placedbet'
        BONUS_BASE:               productConfig.BONUS_BASE               ?? 'win_value',
        MIN_BONUS_ODD:            productConfig.MIN_BONUS_ODD            ?? null,
        INCLUDE_WIN_TAX_IN_BONUS: productConfig.INCLUDE_WIN_TAX_IN_BONUS ?? false,
    }
}

// ---------------------------------------------------------------------------
// SlipComp
//   constructor(productConfig, bonusApiResponse)
//   Both are optional; normalizeConfig resolves defaults.
// ---------------------------------------------------------------------------
class SlipComp {
    constructor(productConfig = {}, bonusApiResponse = {}) {
        this.cfg = normalizeConfig(productConfig, bonusApiResponse)
        this.placedbet   = 0
        this.total_odds  = 1
        this.match_count = 0
    }

    // -----------------------------------------------------------------------
    // Configuration access
    // -----------------------------------------------------------------------
    get_configurations = (name) => this.cfg[name]

    // -----------------------------------------------------------------------
    // Stake tax helpers
    // -----------------------------------------------------------------------

    get_tax_value = () => {
        if (this.cfg.TAX_TYPE === 'tot') return this.cfg.TOT_TAX
        if (this.cfg.TAX_TYPE === 'vat') return this.cfg.VAT_TAX
        return 0
    }

    // Stake after stake-level tax is removed
    get_stake = () => {
        if (this.cfg.TAX_TYPE === 'tot') return this.placedbet * (1 - this.get_tax_value())
        if (this.cfg.TAX_TYPE === 'vat') return this.placedbet / (1 + this.get_tax_value())
        return this.placedbet
    }

    get_tot_tax = () => this.placedbet * this.cfg.TOT_TAX

    get_vat_tax = () => this.get_stake() * this.cfg.VAT_TAX

    // The stake-level tax amount (what was deducted before betting)
    get_initial_tax = () => {
        if (this.cfg.TAX_TYPE === 'tot') return this.get_tot_tax()
        if (this.cfg.TAX_TYPE === 'vat') return this.get_vat_tax()
        return 0
    }

    // -----------------------------------------------------------------------
    // Win value (maximum raw winnings before bonus and win tax)
    // -----------------------------------------------------------------------
    get_win_value = () => {
        const stake      = this.get_stake()
        const tentedstake = this.cfg.MAX_WIN / this.total_odds
        let win_value    = stake * this.total_odds

        if (win_value > this.cfg.MAX_WIN) {
            const extrastake = stake - tentedstake
            win_value = this.cfg.MAX_WIN + extrastake
        }

        return win_value
    }

    // -----------------------------------------------------------------------
    // Bonus helpers
    // -----------------------------------------------------------------------

    _find_active_tier = () => {
        if (!this.cfg.BONUS_ACTIVE) return null
        const rules = this.cfg.BONUS_RULES
        if (!Array.isArray(rules) || rules.length === 0) return null

        return rules.find(rule => {
            const meetsMin = this.match_count >= rule.minSelection
            const meetsMax = rule.maxSelection === 0 || this.match_count <= rule.maxSelection
            return meetsMin && meetsMax
        }) ?? null
    }

    get_bonus_value = () => {
        const tier = this._find_active_tier()
        if (!tier) return 0

        const baseMap = {
            win_value:   this.get_win_value(),
            stake:       this.get_stake(),
            initial_tax: this.get_initial_tax(),
            placedbet:   this.placedbet,
        }
        const base = baseMap[this.cfg.BONUS_BASE] ?? this.get_win_value()

        let bonus_value = 0
        if (tier.bonusValueType === AccumulatorBonusValueType.Percentage) {
            bonus_value = base * (tier.bonusValue / 100)
        } else if (tier.bonusValueType === AccumulatorBonusValueType.Fixed) {
            bonus_value = tier.bonusValue
        }

        // Tier-level cap from API response
        if (tier.maxBonusAmount != null) {
            bonus_value = Math.min(bonus_value, tier.maxBonusAmount)
        }

        // Product-level cap from product config
        if (this.cfg.MAX_BONUS != null) {
            bonus_value = Math.min(bonus_value, this.cfg.MAX_BONUS)
        }

        // Optionally recover win tax into the bonus (product config flag)
        if (this.cfg.INCLUDE_WIN_TAX_IN_BONUS) {
            bonus_value += this.calculate_tax()
            if (this.cfg.MAX_BONUS != null) {
                bonus_value = Math.min(bonus_value, this.cfg.MAX_BONUS)
            }
        }

        // Never push (win + bonus) above MAX_WIN
        const win_value = this.get_win_value()
        if (win_value + bonus_value > this.cfg.MAX_WIN) {
            bonus_value = this.cfg.MAX_WIN - win_value
        }

        return Math.max(bonus_value, 0)
    }

    // -----------------------------------------------------------------------
    // Win tax
    // -----------------------------------------------------------------------
    is_win_taxable = (amount = this.get_win_value()) => {
        if (this.cfg.WIN_TAX_MODE === 'none') return false
        if (this.cfg.WIN_TAX_MODE === 'threshold') return amount > this.cfg.TAXABLE_WIN
        return amount > this.cfg.TAXABLE_WIN
    }

    calculate_tax = () => {
        const win_value   = this.get_win_value()
        const bonus_value = this.get_bonus_value()
        const taxable_amount = win_value + bonus_value

        if (this.cfg.WIN_TAX_MODE === 'none') return 0

        if (!this.is_win_taxable(win_value)) return 0

        if (this.cfg.WIN_TAX_MODE === 'profit_only') {
            return (taxable_amount - this.get_stake()) * this.cfg.WIN_TAX_RATE
        }

        // 'full_win' or 'threshold' — tax on full (win + bonus)
        return taxable_amount * this.cfg.WIN_TAX_RATE
    }

    // -----------------------------------------------------------------------
    // Net pay
    // -----------------------------------------------------------------------
    get_net_pay = () => {
        const win_value   = this.get_win_value()
        const bonus_value = this.get_bonus_value()
        let net_pay       = win_value + bonus_value - this.calculate_tax()

        if (this.cfg.REFUND_FLOOR && net_pay < this.placedbet) {
            net_pay = this.placedbet
        }

        if (this.cfg.NET_PAY_CAP != null && net_pay > this.cfg.NET_PAY_CAP) {
            net_pay = this.cfg.NET_PAY_CAP
        }

        return net_pay
    }

    // -----------------------------------------------------------------------
    // Bonus tier API — for UI display and test.js compatibility
    // -----------------------------------------------------------------------

    // Returns the decimal percentage for a given match count (e.g. 0.10 for 10%)
    get_percentages = (matchCount) => {
        const rules = this.cfg.BONUS_RULES
        if (!Array.isArray(rules)) return 0

        const tier = rules.find(rule => {
            const meetsMin = matchCount >= rule.minSelection
            const meetsMax = rule.maxSelection === 0 || matchCount <= rule.maxSelection
            return meetsMin && meetsMax
        })

        if (!tier) return 0
        // Percentage type: API stores e.g. 10.0 meaning 10% → return 0.10
        if (tier.bonusValueType === AccumulatorBonusValueType.Percentage) {
            return tier.bonusValue / 100
        }
        return 0
    }

    get_min_bonus_eligble_match_count = () => {
        const rules = this.cfg.BONUS_RULES
        if (!Array.isArray(rules) || rules.length === 0) return 0
        return rules[0].minSelection
    }

    get_max_bonus_eligble_match_count = () => {
        const rules = this.cfg.BONUS_RULES
        if (!Array.isArray(rules) || rules.length === 0) return 0
        const last = rules[rules.length - 1]
        // maxSelection === 0 means unbounded; fall back to SLIP_SIZE as practical cap
        return last.maxSelection === 0 ? this.cfg.SLIP_SIZE : last.maxSelection
    }

    get_percentage_match_count = () => {
        let count = this.match_count
        const max = this.get_max_bonus_eligble_match_count()
        if (count > max) count = max
        return count
    }

    is_odd_bonus_eligible = () => {
        if (!this.cfg.BONUS_ACTIVE) return false
        if (this.cfg.MIN_BONUS_ODD != null && this.total_odds < this.cfg.MIN_BONUS_ODD) return false
        return this.match_count >= this.get_min_bonus_eligble_match_count()
    }

    // Uses displayLabel from the API response — no string-building from numbers
    get_note = () => {
        if (!this.cfg.BONUS_ACTIVE || !this.cfg.BONUS_RULES.length) return null

        const activeTier = this._find_active_tier()
        if (activeTier) return activeTier.displayLabel

        const firstTier = this.cfg.BONUS_RULES[0]
        const needed    = firstTier.minSelection - this.match_count
        if (needed > 0) {
            return `Add ${needed} more selection${needed > 1 ? 's' : ''} to unlock: ${firstTier.displayLabel}`
        }

        return null
    }

    // Legacy aliases used by some consumers
    get_stake_tax       = () => this.get_initial_tax()
    get_stake_after_tax = () => this.get_stake()
    get_match_count     = () => this.match_count
    get_placed_bet      = () => this.placedbet
}

// ---------------------------------------------------------------------------
// API response from the control panel (untouched contract)
// ---------------------------------------------------------------------------
const sample_configurations = {
    "success": true,
    "data": {
        "isActive": true,
        "currency": "USD",
        "bonusRules": [
            {
                "minSelection": 3,
                "maxSelection": 5,
                "bonusValueType": AccumulatorBonusValueType.Percentage,
                "bonusValue": 5.0,
                "maxBonusAmount": 500.00,
                "displayLabel": "3 to 5 selections: 5% extra on your win, up to 500.00"
            },
            {
                "minSelection": 6,
                "maxSelection": 10,
                "bonusValueType": AccumulatorBonusValueType.Percentage,
                "bonusValue": 10.0,
                "maxBonusAmount": 1000.00,
                "displayLabel": "6 to 10 selections: 10% extra on your win, up to 1000.00"
            },
            {
                "minSelection": 11,
                "maxSelection": 0,
                "bonusValueType": AccumulatorBonusValueType.Percentage,
                "bonusValue": 20.0,
                "displayLabel": "11 or more selections: 20% extra on your win"
            }
        ],
        "displayLabel": "Accumulator bonus",
        "description": "When your accumulator bet wins, you get an extra bonus on top of your winnings. The more selections in your bet, the higher the bonus tier you can get."
    },
    "message": "Accumulator bonus offer retrieved."
}

// ---------------------------------------------------------------------------
// main — pass productConfig + bonusApiResponse, then calculate
// ---------------------------------------------------------------------------
function main(productConfig, bonusApiResponse = {}) {
    const bonus_calculator = new SlipComp(productConfig, bonusApiResponse)

    bonus_calculator.placedbet   = 10
    bonus_calculator.total_odds  = 9324.37
    bonus_calculator.match_count = 8

    const percentage                  = bonus_calculator.get_percentages(bonus_calculator.match_count)
    const stake                       = bonus_calculator.get_stake()
    const vat_tax                     = bonus_calculator.get_initial_tax()
    const get_bonus_value             = bonus_calculator.get_bonus_value()
    const max_bonus                   = bonus_calculator.get_configurations("MAX_BONUS")
    const calculate_tax               = bonus_calculator.calculate_tax()
    const get_net_pay                 = bonus_calculator.get_net_pay()
    const note                        = bonus_calculator.get_note()
    const eligible                    = bonus_calculator.is_odd_bonus_eligible()
    const pct_match_count             = bonus_calculator.get_percentage_match_count()
    const get_win_value               = bonus_calculator.get_win_value()
    const max_bonus_eligble_match_count = bonus_calculator.get_max_bonus_eligble_match_count()
    const min_bonus_eligble_match_count = bonus_calculator.get_min_bonus_eligble_match_count()
    const is_win_taxable              = bonus_calculator.is_win_taxable()

    console.log(`Match count: ${bonus_calculator.match_count}`)
    console.log(`Bonus percentage: ${percentage * 100}`)
    console.log(`Stake: ${stake}`)
    console.log(`vat_tax: ${vat_tax}`)
    console.log(`get_bonus_value: ${get_bonus_value}`)
    console.log(`Max bonus: ${max_bonus}`)
    console.log(`calculate_tax: ${calculate_tax}`)
    console.log(`get_net_pay: ${get_net_pay}`)
    console.log(`note: ${note}`)
    console.log(`eligible: ${eligible}`)
    console.log(`pct_match_count: ${pct_match_count}`)
    console.log(`get_win_value: ${get_win_value}`)
    console.log(`max_bonus_eligble_match_count: ${max_bonus_eligble_match_count}`)
    console.log(`min_bonus_eligble_match_count: ${min_bonus_eligble_match_count}`)
    console.log(`isWinTaxable: ${is_win_taxable}`)
}

main(
    { MAX_WIN: 350000, TAX_TYPE: 'vat', VAT_TAX: 0.15, WIN_TAX_MODE: 'threshold', TAXABLE_WIN: 1000 },
    sample_configurations
)
