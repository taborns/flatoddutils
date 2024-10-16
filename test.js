import slipcomp from './index.js'
const bonus_calculator = slipcomp.getSlipComputer(
    'MBNS_MW350K_40SLP',
    10,      // Example bet amount
    800.0,      // Example total odds
    4,      // Example match count
)

//  Call the method to get the bonus percentage for the match count
let percentage = bonus_calculator.get_percentages(bonus_calculator.match_count)
let stake = bonus_calculator.get_stake()
let vat_tax = bonus_calculator.get_initial_tax()
let get_bonus_value = bonus_calculator.get_bonus_value()
let max_bonus = bonus_calculator.get_configurations("MAX_BONUS")
let calculate_tax = bonus_calculator.calculate_tax()
let get_net_pay = bonus_calculator.get_net_pay()
let note = bonus_calculator.get_note()
let eligible = bonus_calculator.is_odd_bonus_eligible()
let pct_match_count = bonus_calculator.get_percentage_match_count()
let get_win_value = bonus_calculator.get_win_value()
let max_bonus_eligble_match_count = bonus_calculator.get_max_bonus_eligble_match_count()
let min_bonus_eligble_match_count = bonus_calculator.get_min_bonus_eligble_match_count()
let total_odd_match_count = bonus_calculator.get_total_odd_match_count()
// get_win_tax_bonus = bonus_calculator.get_win_tax_bonus()
// is_win_taxable = bonus_calculator.is_win_taxable()

// Output the result
console.log(`Match count: ${bonus_calculator.match_count}`)
console.log(`Bonus percentage: ${percentage * 100}`)  // Multiply by 100 to show as a percentae
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
console.log(`total_odd_match_count: ${total_odd_match_count}`)