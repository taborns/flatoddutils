/* 
PlacedBet : represents the amount put 
stake : represent the placed bet amount after tax 
*/
class SlipComp {
    constructor(config) {
        this.config = config;
        this.placedbet = 0; // This should be set based on actual bet placed
        this.total_odds = 1; // This should be set based on actual odds
        this.match_count = 0; // This should be set based on actual match count
    }

    get_configurations = (configuration_name) => {
        return this.config[configuration_name];
    }

    get_win_value = () => {
        let tentedstake = this.get_configurations('MAX_WIN') / this.total_odds;
        let win_value = this.placedbet * this.total_odds;
        if (win_value > this.get_configurations('MAX_WIN')) {
            let extrastake = this.placedbet - tentedstake;
            win_value = this.get_configurations('MAX_WIN') + extrastake;
        }
        return win_value;
    }

    calculate_tax = () => {
        if (this.get_configurations('TAX_TYPE') === 'vat') {
            return this.placedbet * this.get_configurations('VAT_TAX');
        } else if (this.get_configurations('TAX_TYPE') === 'tot') {
            return 0.14 * this.get_win_value();
        }
        return 0;
    }

    get_net_pay = () => {
        let win_value = this.get_win_value();
        let withhold_tax = this.calculate_tax();
        let net_pay = win_value - withhold_tax;
        return net_pay;
    }

    get_bonus_value = () => {
        if (!this.get_configurations('BET_SLIP_BONUS')) return 0;

        let win_value = this.get_win_value();
        let bonus_threshold = this.get_configurations('BONUS_THRESHOLD') || 100;
        if (this.placedbet < bonus_threshold) return 0;

        let bonus_value = (this.placedbet * 0.1) * this.total_odds;
        if ((win_value + bonus_value) > this.get_configurations('MAX_WIN')) {
            bonus_value = this.get_configurations('MAX_WIN') - win_value;
        }
        return Math.max(bonus_value, 0);
    }
}

// Example usage:
const noTaxSlipCompMw500K = new SlipComp({
    MAX_WIN: 500000,
    TAX_TYPE: 'none',
    SLIP_SIZE: 50
});

const afroSlipCompMW350KSlpSz50BGT20BVAT = new SlipComp({
    MAX_WIN: 350000,
    TAX_TYPE: 'vat',
    SLIP_SIZE: 50,
    BET_SLIP_BONUS: true,
    BONUS_THRESHOLD: 20,
    VAT_TAX: 0.1
});

// Set placed bet and total odds for calculations
noTaxSlipCompMw500K.placedbet = 1000;
noTaxSlipCompMw500K.total_odds = 2.5;

afroSlipCompMW350KSlpSz50BGT20BVAT.placedbet = 150;
afroSlipCompMW350KSlpSz50BGT20BVAT.total_odds = 3.0;

// Calculate net pay and bonus
console.log(noTaxSlipCompMw500K.get_net_pay());
console.log(afroSlipCompMW350KSlpSz50BGT20BVAT.get_bonus_value());
