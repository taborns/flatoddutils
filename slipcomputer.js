/* 
PlacedBet : represents the amount put 
stake : represent the placed bet amount after tax 
*/
class SlipComp {

    constructor(placedbet, total_odds, match_count, min_odd, max_odd) {

        this.placedbet = placedbet || 0
        this.total_odds = total_odds || 0
        this.match_count = match_count || 0
        this.min_odd = min_odd || 1
        this.max_odd = max_odd || 1000000

    }

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_all_configurations = () => {

        return {

            'MAX_WIN': 5000,
            'TAXABLE_WIN': 1000,
            'WIN_TAX': 0.15,
            'TOT_TAX': 0.1,
            'VAT_TAX': 0.15,
            "VAT_TAX_LABEL": "VAT",
            'TAX_TYPE': 'vat',
            'WITHHOLDING_TAX': 0.14,
            'SLIP_SIZE': 20,
            'NUM_ELIGIBLE_MATCHES': 0
        }

    }

    get_configurations = (configuration_name) => {
        return this.get_all_configurations()[configuration_name]
    }

    get_tax_value = () => {

        if (this.get_configurations('TAX_TYPE') == 'tot')
            return this.get_configurations('TOT_TAX')

        else if (this.get_configurations('TAX_TYPE') == 'vat')
            return this.get_configurations('VAT_TAX')

    }

    get_placed_bet = () => {
        return this.placedbet
    }
    //Represnets the stake 
    get_stake = () => {

        if (this.get_configurations('TAX_TYPE') == 'tot')
            return this.placedbet * (1 - this.get_tax_value())

        else if (this.get_configurations('TAX_TYPE') == 'vat')
            return this.placedbet / (1 + this.get_tax_value())

        return 0

    }

    // Cacluates the tot from the stake 
    get_tot_tax = () => {

        let tot_tax = this.placedbet * this.get_configurations('TOT_TAX')

        return tot_tax

    }

    // Calculates the vat from the stake 
    get_vat_tax = () => {

        let vat_tax = this.get_stake() * this.get_configurations('VAT_TAX')

        return vat_tax

    }

    // this represnets taxes applied on the betting amount. 
    //Vat or Tot are two taxes considered in this stage of the calculation 
    get_initial_tax = () => {

        if (this.get_configurations('TAX_TYPE') == 'tot')
            return this.get_tot_tax()

        else if (this.get_configurations('TAX_TYPE') == 'vat')
            return this.get_vat_tax()

    }

    // represents the maximum winning value with no bonus and before winning tax
    get_win_value = () => {

        let netstake = this.get_stake()
        let tentedstake = this.get_configurations('MAX_WIN') / this.total_odds

        let win_value = netstake * this.total_odds


        if (win_value > this.get_configurations('MAX_WIN')) {
            let extrastake = netstake - tentedstake
            win_value = this.get_configurations('MAX_WIN') + extrastake
        }

        return win_value
    }

    get_bonus_value = () => {

        // if slip bonus is not allowed, return 0

        if (!this.get_configurations('BET_SLIP_BONUS'))
            return 0

        let bonus_value = this.get_initial_tax() * this.total_odds

        return bonus_value
    }

    get_bonus = () => {
        return this.get_bonus_value()
    }
    get_max_win = () => {
        return this.get_win_value()
    }

    get_net_pay = () => {
        return this.get_net_pay()
    }

    is_slip_limit_reached = () => {
        return this.match_count() > this.get_configurations("SLIP_SIZE")
    }

    get_stake_tax = () => {
        return this.get_initial_tax()
    }

    get_stake_after_tax = () => {
        this.get_stake()
    }

    get_stake_label = () => {
        return "Stake"
    }

    get_stake_tax_label = () => {
        return 'VAT(15%)'
    }

    get_income_tax = () => {
        return this.calculate_tax()
    }

    get_income_tax_label = () => {
        return "Win Tax"
    }

    // calculates the winning tax 
    calculate_tax = () => {

        let win_value = this.get_win_value() + this.get_bonus_value()
        let tax_value = 0

        if (win_value > 1000)
            tax_value = 0.15 * win_value

        return tax_value
    }

    get_net_pay = () => {
        let win_value = this.get_win_value()
        let bonus_value = this.get_bonus_value()
        let net_pay = win_value + bonus_value

        let win_tax = this.calculate_tax()
        net_pay = net_pay - win_tax

        return net_pay
    }

    get_total_odds = () => {
        return this.total_odds
    }



    get_note = () => {
        return null
    }

    get_match_count = () => {
        return this.match_count
    }

    get_after_0_label = () => {
        return "Win Tax"
    }
    get_before_0_label = () => {
        if (this.get_configurations("TAX_TYPE") == 'vat')
            return "V.A.T"

        if (this.get_configurations("TAX_TYPE") == 'tot')
            return "TOT"
        return "Stake Tax"


    }
    get_before_01_label = () => {
        return "NAT. Lot"
    }




}

class NoTaxSlipCompMw500K extends SlipComp {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 500000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }

    get_stake = () => {

        return this.get_placed_bet()

    }

    get_initial_tax = () => {

        return 0

    }


    get_bonus_value = () => {

        return 0;
    }

    // calculates the winning tax 
    calculate_tax = () => {

        return 0;
    }

}

class NoTaxSlipCompMw500K_35SLPSZ extends NoTaxSlipCompMw500K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 5000000
        all_configurations['TAX_TYPE'] = Constants.TAX_TYPE_NONE
        all_configurations['SLIP_SIZE'] = 35
        return all_configurations[configuration_name]

    }
}

class NoTaxSlipCompMw500K_50SLPSZ extends NoTaxSlipCompMw500K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 500000
        all_configurations['TAX_TYPE'] = Constants.TAX_TYPE_NONE
        all_configurations['SLIP_SIZE'] = 50
        return all_configurations[configuration_name]

    }
}

class NoTaxSlipCompMw1M extends NoTaxSlipCompMw500K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }
}

class NoTaxSlipCompMw2M extends NoTaxSlipCompMw500K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 2000000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }
}

class NoTaxSlipCompMw10M extends NoTaxSlipCompMw500K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 10000000
        all_configurations['TAX_TYPE'] = Constants.TAX_TYPE_NONE
        return all_configurations[configuration_name]

    }
}


class NoTaxSlipCompMw15M extends NoTaxSlipCompMw500K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 15000000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }
}


class MulaSlipComp extends SlipComp {

    static ConfigurationDescription = () => ({
    })

    get_win_value = () => {

        let tentedstake = this.get_configurations('MAX_WIN') / this.total_odds
        let win_value = this.placedbet * this.total_odds
        if (win_value > this.get_configurations('MAX_WIN')) {
            let extrastake = this.placedbet - tentedstake
            win_value = this.get_configurations('MAX_WIN') + extrastake
        }
        return win_value
    }

    calculate_tax = () => {
        let win_tax = 0.14 * this.get_win_value()

        return win_tax
    }

    get_net_pay = () => {

        let win_value = this.get_win_value()
        let withhold_tax = this.calculate_tax()
        let net_pay = win_value - withhold_tax
        return net_pay

    }

}

class MulaSlipCompMW5K extends SlipComp {

    static ConfigurationDescription = () => ({
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 5000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }

    get_win_value = () => {

        let tentedstake = this.get_configurations('MAX_WIN') / this.total_odds
        let win_value = this.placedbet * this.total_odds
        if (win_value > this.get_configurations('MAX_WIN')) {
            let extrastake = this.placedbet - tentedstake
            win_value = this.get_configurations('MAX_WIN') + extrastake
        }
        return win_value
    }

    calculate_tax = () => {
        let win_tax = 0.14 * this.get_win_value()

        return win_tax
    }

    get_net_pay = () => {

        let win_value = this.get_win_value()
        let withhold_tax = this.calculate_tax()
        let net_pay = win_value - withhold_tax
        return net_pay

    }

}

class MulaSlipComp10PVatMW5K extends MulaSlipCompMW5K {
    static ConfigurationDescription = () => ({

    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 5000
        all_configurations['TAX_TYPE'] = 'vat'
        all_configurations['VAT_TAX'] = 0.1
        all_configurations['VAT_TAX_LABEL'] = "LEVY"

        return all_configurations[configuration_name]

    }

    get_vat_tax = () => {

        return this.placedbet * this.get_configurations('VAT_TAX')

    }

    get_stake = () => {
        return this.placedbet - this.get_vat_tax()
    }

    calculate_tax = () => {
        return 0
    }

    get_win_value = () => {

        let tentedstake = this.get_configurations('MAX_WIN') / this.total_odds
        let win_value = this.get_stake() * this.total_odds
        if (win_value > this.get_configurations('MAX_WIN')) {
            let extrastake = this.get_stake() - tentedstake
            win_value = this.get_configurations('MAX_WIN') + extrastake
        }

        return win_value
    }

}


class MulaSlipComp10PVatMW10K extends MulaSlipComp10PVatMW5K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 10000
        all_configurations['TAX_TYPE'] = 'vat'
        all_configurations['VAT_TAX'] = 0.1
        all_configurations['VAT_TAX_LABEL'] = "LEVY"
        all_configurations['SLIP_SIZE'] = 30


        return all_configurations[configuration_name]

    }

}

class LesothoMulaSlipCompMW5K extends MulaSlipCompMW5K {
    static ConfigurationDescription = () => ({
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 5000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }

    calculate_tax = () => {
        return 0
    }
}

class LesothoMulaSlipCompMW10K extends LesothoMulaSlipCompMW5K {
    static ConfigurationDescription = () => ({
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 10000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }

}

class AfroSlipCompNoBonusMW50KSlipSize30 extends SlipComp {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 50000
        all_configurations['SLIP_SIZE'] = 30

        return all_configurations[configuration_name]

    }

}

class AfroSlipCompNoBonusMW100KSlipSize50 extends SlipComp {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 100000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }

}

class AfroSlipCompNoBonusMW350KSlipSize50 extends SlipComp {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }

}

class AfroSlipCompNoBonusMW500KSlipSize50 extends AfroSlipCompNoBonusMW350KSlipSize50 {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 500000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }


}

class AfroSlipCompNoBonusMW150KSlipSize50 extends SlipComp {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 150000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }

}

class AfroSlipCompBonusTOTMW50KSlipSize50 extends SlipComp {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'tot'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['TAX_TYPE'] = 'tot'
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BET_SLIP_BONUS'] = true

        return all_configurations[configuration_name]

    }

}

class AfroSlipCompMW50KSlpSz50BGT100BV10p extends SlipComp {
    /*
        Bonus is considered only if the placed amount is >= 100 
        if the palced amount is >=100, bonus the 10% of the palced amount. 
        The 10% amoutn is not liable to TOT 
    */

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['TAX_TYPE'] = 'tot'
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BET_SLIP_BONUS'] = true

        return all_configurations[configuration_name]

    }

    get_bonus_value = () => {

        // if slip bonus is not allowed, return 0
        let win_value = this.get_win_value()

        if (this.placedbet < 100)
            return 0

        let bonus_value = (this.placedbet * 0.1) * this.total_odds

        if ((win_value + bonus_value) > this.get_configurations('MAX_WIN'))
            bonus_value = this.get_configurations('MAX_WIN') - win_value

        if (bonus_value < 0)
            bonus_value = 0

        return bonus_value
    }


}

class AfroSlipCompMW350KSlpSz50BGT20BV10p extends SlipComp {

    /*
    Bonus is considered only if the placed amount is >= 100 
    if the palced amount is >=100, bonus the 10% of the palced amount. 
    The 10% amoutn is not liable to TOT 
*/

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['TAX_TYPE'] = 'tot'
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BET_SLIP_BONUS'] = true

        return all_configurations[configuration_name]

    }

    get_bonus_value = () => {

        // if slip bonus is not allowed, return 0
        let win_value = this.get_win_value()

        if (this.placedbet < 20)
            return 0

        let bonus_value = (this.placedbet * 0.1) * this.total_odds

        if ((win_value + bonus_value) > this.get_configurations('MAX_WIN'))
            bonus_value = this.get_configurations('MAX_WIN') - win_value

        if (bonus_value < 0)
            bonus_value = 0

        return bonus_value
    }

}

class AfroSlipCompMW350KSlpSz50BGT20BVAT extends AfroSlipCompMW350KSlpSz50BGT20BV10p {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['TAX_TYPE'] = 'vat'
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BET_SLIP_BONUS'] = true

        return all_configurations[configuration_name]

    }
}

class AfroSlipCompMW1MKSlpSz50BGT20BVAT extends AfroSlipCompMW350KSlpSz50BGT20BVAT {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['TAX_TYPE'] = 'vat'
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BET_SLIP_BONUS'] = true

        return all_configurations[configuration_name]

    }
}

class AfroSlipCompMW350KSlpSz50BGT20_1000BV10p extends AfroSlipCompMW350KSlpSz50BGT20BV10p {

    /*
        Bonus is considered only if the placed amount is >= 20  and Win amount > 1000
        bonus the 10% of the palced amount. 
        The 10% amoutn is not liable to TOT 
    */

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['TAX_TYPE'] = 'tot'
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BET_SLIP_BONUS'] = true

        return all_configurations[configuration_name]

    }

    get_bonus_value = () => {

        // if slip bonus is not allowed, return 0
        let win_value = this.get_win_value()

        if (win_value <= 1000)
            return 0

        if (this.placedbet < 20)
            return 0

        let bonus_value = (this.placedbet * 0.1) * this.total_odds

        if ((win_value + bonus_value) > this.get_configurations('MAX_WIN'))
            bonus_value = this.get_configurations('MAX_WIN') - win_value

        if (bonus_value < 0)
            bonus_value = 0

        return bonus_value
    }

}

class AfroSlipCompMW350WinTaxNoStake extends SlipComp {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['TAX_TYPE'] = 'vat'
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20

        return all_configurations[configuration_name]

    }

    calculate_tax = () => {

        let win_value = this.get_win_value() + this.get_bonus_value()
        let tax_value = 0

        if (win_value > 1000)
            tax_value = (win_value - this.get_stake()) * 0.15

        return tax_value
    }

}

class AfroSlipCompNOBnsMW350KRfndNOTLessStake extends AfroSlipCompMW350WinTaxNoStake {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['TAX_TYPE'] = 'vat'
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20

        return all_configurations[configuration_name]

    }

    get_net_pay = () => {
        let win_value = this.get_win_value()
        let bonus_value = this.get_bonus_value()
        let net_pay = win_value + bonus_value

        let win_tax = this.calculate_tax()
        net_pay = net_pay - win_tax

        if (net_pay < this.placedbet)
            net_pay = this.placedbet

        return net_pay
    }

}

class AfroSlipCompBonusMW350KRfndNOTLessStake extends AfroSlipCompNOBnsMW350KRfndNOTLessStake {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20

        return all_configurations[configuration_name]

    }


    get_bonus_value = () => {

        /** 
        Bonus is calcuated : The initital tax value multiplied 
        by the total odd value. 
        **/

        let win_value = this.get_win_value()

        let bonus_value = this.get_initial_tax() * this.total_odds

        if ((win_value + bonus_value) > this.get_configurations('MAX_WIN'))
            bonus_value = this.get_configurations('MAX_WIN') - win_value

        if (bonus_value < 0)
            bonus_value = 0

        return bonus_value
    }
}

class AfroSlipComp2PRCBnsMW350KRFDNOTLTStake extends AfroSlipCompBonusMW350KRfndNOTLessStake {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20
        all_configurations['BONUS_PERCENT'] = 0.02

        return all_configurations[configuration_name]

    }

    get_bonus_value = () => {
        /** 
        Bonus is calcuated : The initital tax value multiplied 
        by the total odd value. 
        **/

        let win_value = this.get_win_value()

        let bonus_value = this.get_configurations('BONUS_PERCENT') * win_value

        if ((win_value + bonus_value) > this.get_configurations('MAX_WIN'))
            bonus_value = this.get_configurations('MAX_WIN') - win_value

        if (bonus_value < 0)
            bonus_value = 0

        return bonus_value
    }

}

class AfroSlipComp10PRCBnsMW350KRFDNOTLTStake extends AfroSlipComp2PRCBnsMW350KRFDNOTLTStake {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20
        all_configurations['BONUS_PERCENT'] = 0.1

        return all_configurations[configuration_name]

    }

}

class AfroSlip10PRCBnsMW150RFNDNOTLTSTKSLSZ50 extends AfroSlipComp10PRCBnsMW350KRFDNOTLTStake {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 150000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BONUS_PERCENT'] = 0.1

        return all_configurations[configuration_name]

    }

}

class AfroSlipComp10PRCBnsMW1MRFDNOTLTStake extends AfroSlipComp10PRCBnsMW350KRFDNOTLTStake {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BONUS_PERCENT'] = 0.1

        return all_configurations[configuration_name]

    }

}

class AfroSlipComp10PRCBnsGT1000MW1M extends AfroSlipComp10PRCBnsMW1MRFDNOTLTStake {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BONUS_PERCENT'] = 0.1

        return all_configurations[configuration_name]

    }

    get_bonus_value = () => {
        /** 
        Bonus is calcuated : The initital tax value multiplied 
        by the total odd value. 
        **/

        let win_value = this.get_win_value()

        if (win_value < 1000)
            return 0

        let bonus_value = this.get_configurations('BONUS_PERCENT') * win_value

        if ((win_value + bonus_value) > this.get_configurations('MAX_WIN'))
            bonus_value = this.get_configurations('MAX_WIN') - win_value

        if (bonus_value < 0)
            bonus_value = 0

        return bonus_value
    }

    get_net_pay = () => {
        let win_value = this.get_win_value()
        let bonus_value = this.get_bonus_value()
        let net_pay = win_value + bonus_value

        let win_tax = this.calculate_tax()
        net_pay = net_pay - win_tax


        return net_pay
    }

}

class AfroSlipComp10PRCBnsMW1M extends AfroSlipComp10PRCBnsGT1000MW1M {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BONUS_PERCENT'] = 0.1

        return all_configurations[configuration_name]

    }

    get_bonus_value = () => {
        /** 
        Bonus is calcuated : The initital tax value multiplied 
        by the total odd value. 
        **/

        let win_value = this.get_win_value()

        let bonus_value = this.get_configurations('BONUS_PERCENT') * win_value

        if ((win_value + bonus_value) > this.get_configurations('MAX_WIN'))
            bonus_value = this.get_configurations('MAX_WIN') - win_value

        if (bonus_value < 0)
            bonus_value = 0

        return bonus_value
    }
}

class AfroSlipMW150RFNDNOTLTSTKSLSZ50 extends AfroSlipComp10PRCBnsMW350KRFDNOTLTStake {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = false
        all_configurations['MAX_WIN'] = 150000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }

    get_bonus_value = () => {
        return 0
    }

    calculate_tax = () => {

        let win_value = this.get_win_value()
        let tax_value = 0

        if (win_value > 1000)
            tax_value = win_value * 0.15

        return tax_value
    }

}

class AfroSlipCompVAT_5PRCBnsMW350KRFNOTLTSTK extends AfroSlipCompBonusMW350KRfndNOTLessStake {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20
        all_configurations['BONUS_PERCENT'] = 0.05

        return all_configurations[configuration_name]

    }

    calculate_bonus_value = () => {

        /** 
        Bonus is calcuated : The initital tax value multiplied 
        by the total odd value. 
        **/

        let win_value = this.get_win_value()

        let tax_bonus_value = this.get_initial_tax() * this.total_odds
        let win_value_bonus = win_value * this.get_configurations('BONUS_PERCENT')
        let bonus_on_tax_bonus_value = this.get_configurations('BONUS_PERCENT') * tax_bonus_value

        let bonus_value = bonus_on_tax_bonus_value + tax_bonus_value + win_value_bonus

        if ((win_value + bonus_value) > this.get_configurations('MAX_WIN'))
            bonus_value = this.get_configurations('MAX_WIN') - win_value

        if (bonus_value < 0)
            bonus_value = 0

        return bonus_value
    }

    get_bonus_value = () => {
        return this.calculate_bonus_value()
    }

    calculate_tax = () => {

        let win_value = this.get_win_value() + this.get_bonus_value()
        let tax_value = 0

        if (win_value > 1000)
            tax_value = win_value * 0.15

        return tax_value
    }

}

class AfroSlipCompMW350_BNSGT1000_8NOTLTSTK extends AfroSlipCompVAT_5PRCBnsMW350KRFNOTLTSTK {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20
        all_configurations['BONUS_PERCENT'] = 0.05
        all_configurations['NUM_ELIGIBLE_MATCHES'] = 8

        return all_configurations[configuration_name]

    }

    get_bonus_value = () => {
        let win_value = this.get_win_value()

        if (this.total_odds >= this.get_configurations(
            "NUM_ELIGIBLE_MATCHES"
        ) || win_value > this.get_configurations("TAXABLE_WIN"))
            return this.calculate_bonus_value()

        return 0

    }
}


class AfroSlipCompMW350_BNSGT1000NOTLTSTK extends AfroSlipCompVAT_5PRCBnsMW350KRFNOTLTSTK {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20
        all_configurations['BONUS_PERCENT'] = 0.05

        return all_configurations[configuration_name]

    }

    get_bonus_value = () => {
        let win_value = this.get_win_value()

        if (win_value > this.get_configurations("TAXABLE_WIN")) {
            return this.calculate_bonus_value()
        }

        return 0

    }
}

class AfroSlipCompMW350_BNSGT1000 extends AfroSlipCompMW350_BNSGT1000NOTLTSTK {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20
        all_configurations['BONUS_PERCENT'] = 0.05

        return all_configurations[configuration_name]

    }

    get_net_pay = () => {
        let win_value = this.get_win_value()
        let bonus_value = this.get_bonus_value()
        let net_pay = win_value + bonus_value

        let win_tax = this.calculate_tax()
        net_pay = net_pay - win_tax


        return net_pay
    }


}

class AfroSlipCompMW1M_BNSGT1000 extends AfroSlipCompMW350_BNSGT1000NOTLTSTK {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BONUS_PERCENT'] = 0.22

        return all_configurations[configuration_name]

    }

    calculate_bonus_value = () => {

        /** 
        Bonus is calcuated : The initital tax value multiplied 
        by the total odd value. 
        **/

        let win_value = this.get_win_value()


        let bonus_value = this.get_configurations('BONUS_PERCENT') * win_value


        if ((win_value + bonus_value) > this.get_configurations('MAX_WIN'))
            bonus_value = this.get_configurations('MAX_WIN') - win_value

        if (bonus_value < 0)
            bonus_value = 0

        return bonus_value
    }

    get_net_pay = () => {
        let win_value = this.get_win_value()
        let bonus_value = this.get_bonus_value()
        let net_pay = win_value + bonus_value

        let win_tax = this.calculate_tax()
        net_pay = net_pay - win_tax


        return net_pay
    }


}

class MultiBonusMaxBonus100K extends SlipComp {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 100000

        return all_configurations[configuration_name]

    }

    get_min_bonus_eligble_match_count = () => {
        return 8
    }

    get_max_bonus_eligble_match_count = () => {
        return 30
    }

    get_percentage_dict = () => {

        return {
            8: 0.01,
            9: 0.03,
            10: 0.05,
            11: 0.07,
            12: 0.09,
            13: 0.11,
            14: 0.14,
            15: 0.17,
            16: 0.20,
            17: 0.25,
            18: 0.30,
            19: 0.35,
            20: 0.40,
            21: 0.50,
            22: 0.60,
            23: 0.70,
            24: 0.80,
            25: 1,
            26: 1.2,
            27: 1.4,
            28: 1.6,
            29: 1.9,
            30: 2.0,
        }

    }
    get_percentages = (match_count) => {
        return this.get_percentage_dict()[match_count]
    }

    is_odd_bonus_eligible = () => {
        return true;
    }


    get_percentage_match_count = () => {

        let percentage_match_count = this.get_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count())
            percentage_match_count = this.get_max_bonus_eligble_match_count()


        return percentage_match_count

    }

    calculate_bonus_value = () => {
        if (!this.is_odd_bonus_eligible())
            return 0
        let percentage = this.get_percentages(this.get_percentage_match_count())
        let max_percentage = this.get_percentages(this.get_max_bonus_eligble_match_count())
        if (!percentage)
            return 0
        let win_value = this.get_win_value()
        let max_possible_bonus = win_value * max_percentage
        let bonus_value = win_value * percentage

        if (bonus_value > max_possible_bonus)
            bonus_value = max_possible_bonus

        if (bonus_value > this.get_configurations("MAX_BONUS"))
            bonus_value = this.get_configurations("MAX_BONUS")

        return bonus_value
    }

    get_bonus_value = () => {
        return this.calculate_bonus_value()
    }

    get_note = () => {

        let percentage = this.get_percentages(this.get_percentage_match_count())
        let note = null
        if (percentage) {
            note = `Current Bonus ${(percentage * 100).toFixed(2)}%`
        }
        else if (this.get_match_count() < this.get_min_bonus_eligble_match_count()) {
            percentage = this.get_percentages(this.get_min_bonus_eligble_match_count()) * 100

            note = `Select ${this.get_min_bonus_eligble_match_count() - this.get_match_count()} more matches and get a ${percentage}% win bonus`

        }

        return note
    }

    get_win_value = () => {

        let netstake = this.get_stake()
        let tentedstake = this.get_configurations('MAX_WIN') / this.total_odds

        let win_value = netstake * this.total_odds


        if (win_value > this.get_configurations('MAX_WIN')) {
            let extrastake = netstake - tentedstake
            win_value = this.get_configurations('MAX_WIN') + extrastake
        }

        return win_value
    }

    calculate_tax = () => {
        return 0
    }
    get_net_pay = () => {
        let win_value = this.get_win_value()
        let bonus_value = this.get_bonus_value()
        let net_pay = win_value + bonus_value

        let win_tax = this.calculate_tax()
        net_pay = net_pay - win_tax


        return net_pay
    }
}

class MultiBonus2 extends MultiBonusMaxBonus100K {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 500000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 100000
        all_configurations["MIN_BONUS_ODD"] = 1.5

        return all_configurations[configuration_name]

    }

    get_percentages = (match_count) => {
        return {
            5: 0.1,
            6: 0.15,
            7: 0.20,
            8: 0.25,
            9: 0.3,
            10: 0.35,
            12: 0.4,
            13: 0.45,
            14: 0.5,
            15: 0.55,
            16: 0.6,
            17: 0.65,
            18: 0.7,
            19: 0.75,
            20: 0.8,
            21: 0.85,
            22: 0.9,
            23: 0.95,
            24: 1,
        }[match_count]

    }

    get_min_bonus_eligble_match_count = () => {
        return 5
    }

    get_max_bonus_eligble_match_count = () => {
        return 24
    }

    get_minimum_total_eligible_odd = () => {
        return this.get_configurations("MIN_BONUS_ODD") ** this.match_count
    }
    is_odd_bonus_eligible = () => {
        return this.total_odds >= this.get_minimum_total_eligible_odd()

    }

    get_note = () => {

        let percentage = this.get_percentages(this.get_percentage_match_count())
        let note = null
        let min_bonus_odd = this.get_configurations("MIN_BONUS_ODD")
        let min_bonus_total_odd = this.get_minimum_total_eligible_odd()

        if (percentage) {

            if (this.is_odd_bonus_eligible())
                note = `Current Bonus ${(percentage * 100).toFixed(2)}%`
            else
                note = `The total value of the selected odds has to be atleast ${min_bonus_total_odd} and  each odd needs to be ${min_bonus_odd} or more`
        }
        else if (this.get_match_count() < this.get_min_bonus_eligble_match_count()) {
            note = `Select ${this.get_min_bonus_eligble_match_count() - this.get_match_count()} more matches and get a 1% win bonus`

        }

        return note
    }


}

class MultiBonus3 extends MultiBonusMaxBonus100K {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20
        all_configurations['MAX_BONUS'] = 100000
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    get_min_bonus_eligble_match_count = () => {
        return 3
    }

    get_max_bonus_eligble_match_count = () => {
        return 20
    }

    calculate_tax = () => {

        let win_value = this.get_win_value() + this.get_bonus_value()
        let tax_value = 0

        if (win_value >= this.get_configurations("TAXABLE_WIN"))
            tax_value = this.get_configurations("WIN_TAX") * win_value

        return tax_value
    }

    get_percentages = (match_count) => {
        return {
            3: 0.03,
            4: 0.04,
            5: 0.05,
            6: 0.06,
            7: 0.1,
            8: 0.15,
            9: 0.2,
            10: 0.25,
            11: 0.3,
            12: 0.35,
            13: 0.4,
            14: 0.45,
            15: 0.5,
            16: 0.55,
            17: 0.6,
            18: 0.65,
            19: 0.7,
            20: 0.75,
        }[match_count]
    }

    is_odd_bonus_eligible = () => {
        return this.total_odds >= this.get_configurations("MIN_BONUS_ODD") ** this.match_count

    }
}

class MultiBonus4 extends MultiBonus2 {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 500000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 100000
        all_configurations["MIN_BONUS_ODD"] = 1.5

        return all_configurations[configuration_name]

    }

    get_percentages = (match_count) => {
        return {
            5: 0.1,
            6: 0.15,
            7: 0.20,
            8: 0.25,
            9: 0.3,
            10: 0.35,
            11: 0.4,
            12: 0.45,
            13: 0.5,
            14: 0.55,
            15: 0.6,
            16: 0.65,
            17: 0.7,
            18: 0.75,
            19: 0.8,
            20: 0.85,
            21: 0.9,
            22: 0.95,
            23: 1,
        }[match_count]

    }

    calculate_tax = () => {

        let win_value = this.get_win_value() + this.get_bonus_value()
        let tax_value = 0

        if (win_value >= this.get_configurations("TAXABLE_WIN"))
            tax_value = this.get_configurations("WIN_TAX") * win_value

        return tax_value
    }

    get_minimum_total_eligible_odd = () => {
        return 80
    }

    get_max_bonus_eligble_match_count = () => {
        return 23
    }

    is_odd_bonus_eligible = () => {
        let min_allowed_odd = 0

        if (this.total_odds < this.get_configurations("MIN_BONUS_ODD") ** this.match_count)
            return false


        if (this.match_count > this.get_min_bonus_eligble_match_count())
            min_allowed_odd = this.get_configurations("MIN_BONUS_ODD") ** (this.match_count - this.get_min_bonus_eligble_match_count())


        return this.total_odds >= min_allowed_odd + this.get_minimum_total_eligible_odd()

    }

}

class MultiBonus5 extends MultiBonus3 {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    get_note = () => {

        let percentage = this.get_percentages(this.get_percentage_match_count())
        let note = null
        let min_bonus_odd = this.get_configurations("MIN_BONUS_ODD")

        if (percentage) {

            if (this.is_odd_bonus_eligible())
                note = `Current Bonus ${(percentage * 100).toFixed(2)}%`
            else
                note = `Each odd needs to be ${min_bonus_odd} or more`
        }
        else if (this.get_match_count() < this.get_min_bonus_eligble_match_count()) {
            note = `Select ${this.get_min_bonus_eligble_match_count() - this.get_match_count()} more matches and get a 1% win bonus`

        }

        return note
    }

}

class MultiBonus6 extends MultiBonus3 {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 20
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    get_total_odd_match_count = () => {

        // returns the number of matchs it requires to get to the total odd if 
        // the value of the selected odds is 1.5 each. 

        let total_odd = this.get_configurations("MIN_BONUS_ODD")
        let match_count = 0
        let acceptable_total_odd = this.get_configurations("MIN_BONUS_ODD") ** this.match_count

        while (true) {
            if (this.total_odds > total_odd) {
                match_count += 1
                total_odd *= this.get_configurations("MIN_BONUS_ODD")
            }
            else if (total_odd > acceptable_total_odd) {
                match_count = this.match_count
                break
            }

            else if (match_count >= this.get_configurations("SLIP_SIZE"))
                break

            else {
                break
            }
        }

        console.log("match_counttt", match_count)

        return match_count

    }

    get_percentage_match_count = () => {
        if (this.match_count < this.get_min_bonus_eligble_match_count())
            return this.match_count



        let percentage_match_count = this.get_total_odd_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count())
            percentage_match_count = this.get_max_bonus_eligble_match_count()



        return percentage_match_count

    }

    is_odd_bonus_eligible = () => {
        return true
    }

}

class MultiBonus6SlpSz40 extends MultiBonus6 {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 40
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }
}


class MultiBonus6Mw500SlpSz50 extends MultiBonus6 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 500000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

}

class MultiBonus6Mw1MilSlpSz50 extends MultiBonus6 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

}

class MultiBonus7 extends MultiBonus6 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 500000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

}

class MultiBonus8 extends MultiBonus3 {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'tot'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1
        all_configurations["TAX_TYPE"] = 'tot'

        return all_configurations[configuration_name]

    }

    get_stake = () => {
        return this.placedbet / (1 + this.get_tax_value())

    }

    get_tot_tax = () => {
        return this.get_stake() * this.get_tax_value()
    }


    get_min_bonus_eligble_match_count = () => {
        return 6
    }

    get_max_bonus_eligble_match_count = () => {
        return this.get_configurations("MAX_WIN")
    }

    get_percentages = (match_count) => {

        // >= 38
        if (match_count >= 38)
            return 3

        // >= 32 and <=37
        else if (match_count >= 32)
            return 2.5

        // >= 28 and <=31
        else if (match_count >= 28)
            return 2

        // >= 24 and <=27
        else if (match_count >= 24)
            return 1.5

        // >= 21 and <=23
        else if (match_count >= 21)
            return 0.72

        // >= 19 and <=20
        else if (match_count >= 19)
            return 0.42

        // >= 17 and <=18
        else if (match_count >= 17)
            return 0.29

        // >= 15 and <=16
        else if (match_count >= 15)
            return 0.22

        // >= 13 and <=14
        else if (match_count >= 13)
            return 0.14

        // >= 11 and <=12
        else if (match_count >= 11)
            return 0.1

        // >= 9 and <=10
        else if (match_count >= 9)
            return 0.07

        // >= 8
        else if (match_count >= 8)
            return 0.04

        // >= 7
        else if (match_count >= 7)
            return 0.03

        // >= 6
        else if (match_count >= 6)
            return 0.02

    }

    is_odd_bonus_eligible = () => {
        return true
    }

}

class MultiBonus9 extends MultiBonus6 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 35
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    is_win_taxable = (amount) => {
        return amount > this.get_configurations("TAXABLE_WIN")
    }


    calculate_tax = () => {

        let win_value = this.get_win_value()
        let tax_value = 0

        if (this.is_win_taxable(win_value))
            tax_value = 0.15 * win_value

        return tax_value
    }

    get_win_tax_bonus = () => {
        return this.calculate_tax()

    }

    get_bonus_value = () => {
        let multi_bonus_value = this.calculate_bonus_value()
        let win_tax_bonus = this.get_win_tax_bonus()

        let total_bonus = multi_bonus_value + win_tax_bonus
        if (total_bonus > this.get_configurations("MAX_BONUS"))
            total_bonus = this.get_configurations("MAX_BONUS")

        return total_bonus

    }

}

class MultiBonus9Mw500KMB5240SlpSz35 extends MultiBonus9 {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 500000
        all_configurations['SLIP_SIZE'] = 35
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

}


class MultiBonus9Mw1MilMB5240SlpSz35 extends MultiBonus9 {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 35
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

}

class MultiBonus10 extends MultiBonus5 {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 500000
        all_configurations['SLIP_SIZE'] = 30
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }
}


class MultiBonus11 extends MultiBonus6 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }


    get_percentages = (match_count) => {

        // >= 15
        if (match_count >= 15)
            return 0.5

        // >= 14
        else if (match_count >= 14)
            return 0.45

        // >= 13
        else if (match_count >= 13)
            return 0.4

        // >= 12
        else if (match_count >= 12)
            return 0.35

        // >= 11
        else if (match_count >= 11)
            return 0.3

        // >= 10
        else if (match_count >= 10)
            return 0.25

        // >= 9
        else if (match_count >= 9)
            return 0.20


        // >= 8
        else if (match_count >= 8)
            return 0.15

        // >= 7
        else if (match_count >= 7)
            return 0.1

        // >= 6
        else if (match_count >= 6)
            return 0.06

        // >= 5
        else if (match_count >= 5)
            return 0.05

        // >= 4
        else if (match_count >= 4)
            return 0.04

        // >= 3
        else if (match_count >= 3)
            return 0.03

    }


    is_win_taxable = (amount) => {
        return amount > this.get_configurations("TAXABLE_WIN")
    }


    calculate_tax = () => {

        let win_value = this.get_win_value()
        let tax_value = 0

        if (this.is_win_taxable(win_value))
            tax_value = 0.15 * win_value

        return tax_value
    }

    get_win_tax_bonus = () => {
        return this.calculate_tax()

    }

    get_bonus_value = () => {
        let multi_bonus_value = this.calculate_bonus_value()
        let win_tax_bonus = this.get_win_tax_bonus()

        let total_bonus = multi_bonus_value + win_tax_bonus
        if (total_bonus > this.get_configurations("MAX_BONUS"))
            total_bonus = this.get_configurations("MAX_BONUS")

        return total_bonus

    }
}

class MultiBonus11_20EVN extends MultiBonus11 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    get_percentages = (match_count) => {
        // >= 20
        if (match_count >= 20)
            return 0.75

        // >= 19
        if (match_count >= 19)
            return 0.7

        // >= 18
        if (match_count >= 18)
            return 0.65

        // >= 17
        if (match_count >= 17)
            return 0.6

        // >= 16
        if (match_count >= 16)
            return 0.55

        // >= 15
        if (match_count >= 15)
            return 0.5

        // >= 14
        else if (match_count >= 14)
            return 0.45

        // >= 13
        else if (match_count >= 13)
            return 0.4

        // >= 12
        else if (match_count >= 12)
            return 0.35

        // >= 11
        else if (match_count >= 11)
            return 0.3

        // >= 10
        else if (match_count >= 10)
            return 0.25

        // >= 9
        else if (match_count >= 9)
            return 0.20


        // >= 8
        else if (match_count >= 8)
            return 0.15

        // >= 7
        else if (match_count >= 7)
            return 0.1

        // >= 6
        else if (match_count >= 6)
            return 0.06

        // >= 5
        else if (match_count >= 5)
            return 0.05

        // >= 4
        else if (match_count >= 4)
            return 0.04

        // >= 3
        else if (match_count >= 3)
            return 0.03

    }

}

class MBNS11_50SLPSZ_1Mil extends MultiBonus11_20EVN {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }



}


class MBNS11_50SLPSZ_1Mil_850K_CAP extends MultiBonus11_20EVN {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 850000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    get_net_pay = () => {
        let win_value = this.get_win_value()
        let bonus_value = this.get_bonus_value()

        let net_pay = win_value + bonus_value

        let win_tax = this.calculate_tax()

        net_pay = net_pay - win_tax
        
        if( net_pay >= this.get_configurations("NET_PAY_CAP")) { 
            net_pay = this.get_configurations("NET_PAY_CAP")
        }

        return net_pay
    }



}


class MultiBonus11MW1Mil extends MultiBonus11 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }
}

class MultiBonus12 extends MultiBonus11 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: Constants.TAX_TYPE_NONE
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]

    }


    get_percentages = (match_count) => {

        // >= 14
        if (match_count >= 14)
            return 0.7

        // >= 13
        else if (match_count >= 13)
            return 0.58

        // >= 12
        else if (match_count >= 12)
            return 0.45

        // >= 11
        else if (match_count >= 11)
            return 0.38

        // >= 10
        else if (match_count >= 10)
            return 0.34

        // >= 9
        else if (match_count >= 9)
            return 0.24


        // >= 8
        else if (match_count >= 8)
            return 0.2

        // >= 7
        else if (match_count >= 7)
            return 0.16

        // >= 6
        else if (match_count >= 6)
            return 0.06

        // >= 5
        else if (match_count >= 5)
            return 0.05

        // >= 4
        else if (match_count >= 4)
            return 0.04

        // >= 3
        else if (match_count >= 3)
            return 0.03

    }


    is_win_taxable = (amount) => {
        return amount > this.get_configurations("TAXABLE_WIN")
    }


    calculate_tax = () => {

        let win_value = this.get_win_value()
        let tax_value = 0

        if (this.is_win_taxable(win_value))
            tax_value = Constants.CONFIG.WIN_TAX * win_value

        return tax_value
    }

    get_win_tax_bonus = () => {
        return this.calculate_tax()

    }

    get_bonus_value = () => {
        let multi_bonus_value = this.calculate_bonus_value()
        let win_tax_bonus = this.get_win_tax_bonus()

        let total_bonus = multi_bonus_value + win_tax_bonus
        if (total_bonus > this.get_configurations("MAX_BONUS"))
            total_bonus = this.get_configurations("MAX_BONUS")

        return total_bonus

    }
}

class MultiBonus12_1Mil extends MultiBonus12 {

    static ConfigurationDescription = () => ({
        TAX_TYPE: Constants.TAX_TYPE_NONE
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]

    }
}

class MultiBonusMaxBns100KStakeWinTaxed extends MultiBonusMaxBonus100K {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400

        return all_configurations[configuration_name]

    }

    calculate_tax = () => {

        let win_value = this.get_win_value() + this.get_bonus_value()
        let tax_value = 0

        if (win_value > 1000)
            tax_value = 0.15 * win_value

        return tax_value
    }

}

class MultiBonusMaxBns100KStakeWTaxdSlpSz35 extends MultiBonusMaxBns100KStakeWinTaxed {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 35
        all_configurations['MAX_BONUS'] = 100000

        return all_configurations[configuration_name]

    }

}

class MultiBonusMaxBnsWinTaxBonus extends MultiBonusMaxBns100KStakeWTaxdSlpSz35 {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 35
        all_configurations['MAX_BONUS'] = 100000

        return all_configurations[configuration_name]

    }

    is_win_taxable = (amount) => {
        return amount >= this.get_configurations("TAXABLE_WIN")
    }

    calculate_tax = () => {

        let win_value = this.get_win_value()
        let tax_value = 0

        if (this.is_win_taxable(win_value))
            tax_value = 0.15 * win_value

        return tax_value
    }

    get_win_tax_bonus = () => {
        return this.calculate_tax()

    }

    get_bonus_value = () => {
        let multi_bonus_value = this.calculate_bonus_value()
        let win_tax_bonus = this.get_win_tax_bonus()

        let total_bonus = multi_bonus_value + win_tax_bonus
        if (total_bonus > this.get_configurations("MAX_BONUS"))
            total_bonus = this.get_configurations("MAX_BONUS")

        return total_bonus

    }

    get_net_pay = () => {
        let win_value = this.get_win_value()
        let total_bonus = this.get_bonus_value()


        let net_pay = win_value + total_bonus

        let win_tax = this.calculate_tax()
        net_pay = net_pay - win_tax


        return net_pay
    }

}

class MultiBonusMaxVATWinTaxBonus extends MultiBonusMaxBnsWinTaxBonus {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 35
        all_configurations['MAX_BONUS'] = 100000

        return all_configurations[configuration_name]

    }


    get_bonus_value = () => {
        let multi_bonus_value = this.calculate_bonus_value()
        let win_tax_bonus = this.get_win_tax_bonus()
        let win_value = this.get_win_value()

        let total_bonus = multi_bonus_value + win_tax_bonus
        if (total_bonus > this.get_configurations("MAX_BONUS"))
            total_bonus = this.get_configurations("MAX_BONUS")

        if (!this.is_win_taxable(win_value))
            total_bonus += this.get_initial_tax()

        return total_bonus

    }

}

class MultiBonusMaxVATWinTaxBonus2 extends MultiBonusMaxVATWinTaxBonus {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 35
        all_configurations['MAX_BONUS'] = 100000

        return all_configurations[configuration_name]

    }


    get_bonus_value = () => {
        let multi_bonus_value = this.calculate_bonus_value()
        let win_tax_bonus = this.get_win_tax_bonus()

        let total_bonus = multi_bonus_value + win_tax_bonus
        if (total_bonus > this.get_configurations("MAX_BONUS"))
            total_bonus = this.get_configurations("MAX_BONUS")

        if (!this.is_win_taxable(this.get_placed_bet()))
            total_bonus += this.get_initial_tax() * this.total_odds

        return total_bonus

    }
}

class WinTaxBonusSlpSz50MW350K extends AfroSlipCompNoBonusMW350KSlipSize50 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })


    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }

    get_win_value = () => {

        let netstake = this.get_stake()

        let win_value = netstake * this.total_odds


        if (win_value > this.get_configurations('MAX_WIN')) {
            win_value = this.get_configurations('MAX_WIN')
        }

        return win_value
    }

    is_win_taxable = (amount) => {
        return amount > this.get_configurations("TAXABLE_WIN")
    }

    calculate_tax = () => {

        let win_value = this.get_win_value()
        let tax_value = 0

        if (this.is_win_taxable(win_value))
            tax_value = this.get_configurations("WIN_TAX") * win_value
        return tax_value

    }

    get_win_tax_bonus = () => {
        return this.calculate_tax()
    }

    get_net_pay = () => {
        let win_value = this.get_win_value()
        let bonus_value = this.get_bonus_value()
        let net_pay = win_value + bonus_value

        let win_tax = this.calculate_tax()
        net_pay = net_pay - win_tax

        return net_pay
    }

    get_bonus_value = () => {

        let win_value = this.get_win_value()

        if (win_value < this.get_configurations("TAXABLE_WIN"))
            return 0

        let bonus_value = this.get_win_tax_bonus()

        if (bonus_value < 0)
            bonus_value = 0

        return bonus_value

    }

}

class WinTaxBonusSlpSz50MW500K extends WinTaxBonusSlpSz50MW350K {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 500000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }
}

class WinTaxBonusSlpSz50MW1Mil extends WinTaxBonusSlpSz50MW350K {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }
}

class SC54MW350KSPS50 extends SlipComp {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }
    get_vat_tax = () => {
        return 0;
    }
    get_tot_tax = () => {
        return 0;
    }

    get_initial_tax = () => {
        return 0
    }

    get_tax_value = () => {
        return 0
    }

}
class SC54MW500KSPS50 extends SC54MW350KSPS50 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 500000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }
}

class SC54MW1MilSPS50 extends SC54MW350KSPS50 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }
}

class LesMultiBonus1 extends MultiBonus6 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 10000
        all_configurations['SLIP_SIZE'] = 20
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_BONUS'] = 8000
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    get_tax_value = () => {
        return 0;
    }
    calculate_tax = () => {
        return 0;
    }

    get_initial_tax = () => {
        return 0;
    }
}

class BasicKenyaSlipComputer extends SlipComp {


    get_all_configurations = () => {

        //
        // Contains list of all common configuration values that can be applied to
        // a slip computer
        //
        return {
            "EXCISE_RATE": 0.075,
            "WITHHOLD_RATE": 0.2,
            "NUM_ELIGIBLE_MATCHES": 8,
            "MAX_WIN": 1000000,
            "SLIP_SIZE": 50,
        }
    }


    __get_excise_rate = () => {
        return this.get_configurations("EXCISE_RATE")
    }

    __get_withholding_rate = () => {
        return this.get_configurations("WITHHOLD_RATE")
    }

    get_gross_stake = () => {
        return this.placedbet
    }

    get_total_odds = () => {
        return this.total_odds
    }

    get_match_count = () => {
        return this.match_count
    }

    get_excise_amount = () => {
        // Excise Amount = Gross stake - (1 / (1 + Excise rate ))
        // Example - Excise amount = 1000 - (1 / (1 + 0.075))

        return this.get_gross_stake() - (
            this.get_gross_stake() / (1 + this.__get_excise_rate())
        )
    }


    get_net_stake = () => {
        return this.get_gross_stake() - this.get_excise_amount()
    }

    get_gross_winning = () => {
        // Gross Winning - Net Stake * Total Odds
        // Gross winning can't be higer than the max possible payout
        let gros_winning = this.get_net_stake() * this.get_total_odds()

        if (gros_winning > this.get_configurations("MAX_WIN"))
            gros_winning = this.get_configurations("MAX_WIN")

        return gros_winning

    }

    get_net_winning = () => {
        return this.get_gross_winning() - this.get_net_stake()

    }

    get_withholding_amount = () => {
        return this.get_net_winning() * this.__get_withholding_rate()

    }

    get_net_payout = () => {
        return this.get_gross_winning() - this.get_withholding_amount()

    }

    get_bonus_value = () => {
        return 0
    }

    get_initial_tax = () => {
        return this.get_before_0()
    }
    get_win_value = () => {
        // Gross Winning
        let win_value = this.get_gross_winning()
        console.log("WinValue", win_value)
        return win_value
    }

    get_net_pay = () => {
        let net_payout = this.get_gross_winning() - this.get_withholding_amount()
        net_payout += this.get_bonus_value()

        if (net_payout > this.get_configurations("MAX_WIN"))
            net_payout = this.get_configurations("MAX_WIN")

        return net_payout
    }

    calculate_tax = () => {
        return this.get_withholding_amount()

    }

    get_before_0 = () => {
        return this.get_excise_amount()

    }

    get_before_01 = () => {
        return 0
    }

    get_natlottery_taxable = () => {
        return 0
    }

    get_after_0 = () => {
        return this.get_withholding_amount()
    }

    get_after_0_label = () => {
        return "Withholding Tax"
    }
    get_before_0_label = () => {
        return "Excise Tax"
    }
    get_before_01_label = () => {
        return ""
    }



}

class BasicMultibetBonusKenyaSlipComputer extends BasicKenyaSlipComputer {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_BONUS'] = 100000
        all_configurations['MIN_BONUS_ODD'] = 1.2

        return all_configurations[configuration_name]

    }

    is_odd_bonus_eligible = () => {
        return (
            this.get_total_odds()
            >= this.get_configurations("MIN_BONUS_ODD") ** this.get_match_count()
        )
    }

    get_min_bonus_eligble_match_count = () => {
        return 6
    }

    get_max_bonus_eligble_match_count = () => {
        return 50
    }


    get_percentages = (match_count) => {

        // >= 38
        if (match_count >= 38)
            return 3

        // >= 32 and <=37
        else if (match_count >= 32)
            return 2.5

        // >= 28 and <=31
        else if (match_count >= 28)
            return 2

        // >= 24 and <=27
        else if (match_count >= 24)
            return 1.5

        // >= 21 and <=23
        else if (match_count >= 21)
            return 0.72

        // >= 19 and <=20
        else if (match_count >= 19)
            return 0.42

        // >= 17 and <=18
        else if (match_count >= 17)
            return 0.29

        // >= 15 and <=16
        else if (match_count >= 15)
            return 0.22

        // >= 13 and <=14
        else if (match_count >= 13)
            return 0.14

        // >= 11 and <=12
        else if (match_count >= 11)
            return 0.1

        // >= 9 and <=10
        else if (match_count >= 9)
            return 0.07

        // >= 8
        else if (match_count >= 8)
            return 0.04

        // >= 7
        else if (match_count >= 7)
            return 0.03

        // >= 6
        else if (match_count >= 6)
            return 0.02

    }

    calculate_bonus_value = () => {
        if (!this.is_odd_bonus_eligible())
            return 0
        let percentage = this.get_percentages(this.get_percentage_match_count())
        let max_percentage = this.get_percentages(this.get_max_bonus_eligble_match_count())
        if (!percentage)
            return 0
        let win_value = this.get_win_value()
        let max_possible_bonus = win_value * max_percentage
        let bonus_value = win_value * percentage

        if (bonus_value > max_possible_bonus)
            bonus_value = max_possible_bonus

        if (bonus_value > this.get_configurations("MAX_BONUS"))
            bonus_value = this.get_configurations("MAX_BONUS")

        return bonus_value
    }

    get_bonus_value = () => {
        return this.calculate_bonus_value()
    }

    get_percentage_match_count = () => {

        let percentage_match_count = this.get_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count())
            percentage_match_count = this.get_max_bonus_eligble_match_count()


        return percentage_match_count

    }

    get_note = () => {

        let percentage = this.get_percentages(this.get_percentage_match_count())
        let note = null
        let min_odd = this.get_configurations("MIN_BONUS_ODD")
        if (percentage) {
            if (this.is_odd_bonus_eligible()) {
                note = `Current Bonus ${(percentage * 100).toFixed(2)}%`
            } else {
                note = `Your picks needs to have odd value of ${min_odd} or above.`
            }
        }
        else if (this.get_match_count() < this.get_min_bonus_eligble_match_count()) {
            percentage = this.get_percentages(this.get_min_bonus_eligble_match_count()) * 100

            note = `Select ${this.get_min_bonus_eligble_match_count() - this.get_match_count()} more matches and get a ${percentage}% win bonus`

        }

        return note
    }
}

class BasicKenyaSlipComp12_5ET extends BasicKenyaSlipComputer {
    get_all_configurations = () => {

        //
        // Contains list of all common configuration values that can be applied to
        // a slip computer
        //
        return {
            "EXCISE_RATE": 0.125,
            "WITHHOLD_RATE": 0.2,
            "NUM_ELIGIBLE_MATCHES": 8,
            "MAX_WIN": 1000000,
            "SLIP_SIZE": 50,
        }
    }

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['EXCISE_RATE'] = true

        return all_configurations[configuration_name]

    }

}

class BasicMulbetKenyaSlipComp12_5ET extends BasicMultibetBonusKenyaSlipComputer {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_BONUS'] = 100000
        all_configurations['MIN_BONUS_ODD'] = 1.2
        all_configurations['EXCISE_RATE'] = 0.125
        all_configurations['WITHHOLD_RATE'] = 0.2
        all_configurations['NUM_ELIGIBLE_MATCHES'] = 8
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }
}

class BasicMulbetNoTaxSlipCompMw500K extends NoTaxSlipCompMw500K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_BONUS'] = 100000
        all_configurations['MIN_BONUS_ODD'] = 1.2

        return all_configurations[configuration_name]

    }

    is_odd_bonus_eligible = () => {
        return (
            this.get_total_odds()
            >= this.get_configurations("MIN_BONUS_ODD") ** this.get_match_count()
        )
    }

    get_min_bonus_eligble_match_count = () => {
        return 6
    }

    get_max_bonus_eligble_match_count = () => {
        return 50
    }


    get_percentages = (match_count) => {

        // >= 38
        if (match_count >= 38)
            return 3

        // >= 32 and <=37
        else if (match_count >= 32)
            return 2.5

        // >= 28 and <=31
        else if (match_count >= 28)
            return 2

        // >= 24 and <=27
        else if (match_count >= 24)
            return 1.5

        // >= 21 and <=23
        else if (match_count >= 21)
            return 0.72

        // >= 19 and <=20
        else if (match_count >= 19)
            return 0.42

        // >= 17 and <=18
        else if (match_count >= 17)
            return 0.29

        // >= 15 and <=16
        else if (match_count >= 15)
            return 0.22

        // >= 13 and <=14
        else if (match_count >= 13)
            return 0.14

        // >= 11 and <=12
        else if (match_count >= 11)
            return 0.1

        // >= 9 and <=10
        else if (match_count >= 9)
            return 0.07

        // >= 8
        else if (match_count >= 8)
            return 0.04

        // >= 7
        else if (match_count >= 7)
            return 0.03

        // >= 6
        else if (match_count >= 6)
            return 0.02

    }

    calculate_bonus_value = () => {
        if (!this.is_odd_bonus_eligible())
            return 0
        let percentage = this.get_percentages(this.get_percentage_match_count())
        let max_percentage = this.get_percentages(this.get_max_bonus_eligble_match_count())
        if (!percentage)
            return 0
        let win_value = this.get_win_value()
        let max_possible_bonus = win_value * max_percentage
        let bonus_value = win_value * percentage

        if (bonus_value > max_possible_bonus)
            bonus_value = max_possible_bonus

        if (bonus_value > this.get_configurations("MAX_BONUS"))
            bonus_value = this.get_configurations("MAX_BONUS")

        return bonus_value
    }

    get_bonus_value = () => {
        return this.calculate_bonus_value()
    }

    get_percentage_match_count = () => {

        let percentage_match_count = this.get_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count())
            percentage_match_count = this.get_max_bonus_eligble_match_count()


        return percentage_match_count

    }

    get_note = () => {

        let percentage = this.get_percentages(this.get_percentage_match_count())
        let note = null
        if (percentage) {
            note = `Current Bonus ${(percentage * 100).toFixed(2)}% `
        }
        else if (this.get_match_count() < this.get_min_bonus_eligble_match_count()) {
            percentage = this.get_percentages(this.get_min_bonus_eligble_match_count()) * 100

            note = `Select ${this.get_min_bonus_eligble_match_count() - this.get_match_count()} more matches and get a ${percentage}% win bonus`

        }

        return note
    }
}

class MulbetNoTaxSlipCompMw1M extends BasicMulbetNoTaxSlipCompMw500K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }
}

class MulbetNoTaxSlipCompMw2M extends BasicMulbetNoTaxSlipCompMw500K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 2000000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }
}



class MulbetSlipCompMO12_MW2MNoTax extends NoTaxSlipCompMw2M {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_BONUS'] = 500000
        all_configurations['MAX_WIN'] = 2000000
        all_configurations['MIN_BONUS_ODD'] = 1.2
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }

    is_odd_bonus_eligible = () => {
        return (
            this.get_total_odds()
            >= this.get_configurations("MIN_BONUS_ODD") ** this.get_match_count()
        )
    }

    get_min_bonus_eligble_match_count = () => {
        return 6
    }

    get_max_bonus_eligble_match_count = () => {
        return 50
    }


    get_percentages = (match_count) => {

        // >= 38
        if (match_count >= 38)
            return 3

        // >= 32 and <=37
        else if (match_count >= 32)
            return 2.5

        // >= 28 and <=31
        else if (match_count >= 28)
            return 2

        // >= 24 and <=27
        else if (match_count >= 24)
            return 1.5

        // >= 21 and <=23
        else if (match_count >= 21)
            return 0.72

        // >= 19 and <=20
        else if (match_count >= 19)
            return 0.42

        // >= 17 and <=18
        else if (match_count >= 17)
            return 0.29

        // >= 15 and <=16
        else if (match_count >= 15)
            return 0.22

        // >= 13 and <=14
        else if (match_count >= 13)
            return 0.14

        // >= 11 and <=12
        else if (match_count >= 11)
            return 0.1

        // >= 9 and <=10
        else if (match_count >= 9)
            return 0.07

        // >= 8
        else if (match_count >= 8)
            return 0.04

        // >= 7
        else if (match_count >= 7)
            return 0.03

        // >= 6
        else if (match_count >= 6)
            return 0.02

    }

    calculate_bonus_value = () => {
        if (!this.is_odd_bonus_eligible())
            return 0
        let percentage = this.get_percentages(this.get_percentage_match_count())
        let max_percentage = this.get_percentages(this.get_max_bonus_eligble_match_count())
        if (!percentage)
            return 0
        let win_value = this.get_win_value()
        let max_possible_bonus = win_value * max_percentage
        let bonus_value = win_value * percentage

        if (bonus_value > max_possible_bonus)
            bonus_value = max_possible_bonus

        if (bonus_value > this.get_configurations("MAX_BONUS"))
            bonus_value = this.get_configurations("MAX_BONUS")

        return bonus_value
    }

    get_bonus_value = () => {
        return this.calculate_bonus_value()
    }

    get_percentage_match_count = () => {

        let percentage_match_count = this.get_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count())
            percentage_match_count = this.get_max_bonus_eligble_match_count()


        return percentage_match_count

    }

    get_note = () => {

        let percentage = this.get_percentages(this.get_percentage_match_count())
        let note = null
        if (percentage) {
            note = `Current Bonus ${(percentage * 100).toFixed(2)}% `
        }
        else if (this.get_match_count() < this.get_min_bonus_eligble_match_count()) {
            percentage = this.get_percentages(this.get_min_bonus_eligble_match_count()) * 100

            note = `Select ${this.get_min_bonus_eligble_match_count() - this.get_match_count()} more matches and get a ${percentage}% win bonus`

        }

        return note
    }
}

class MulbetSlipCompMO12_MW2MNoTax2 extends MulbetSlipCompMO12_MW2MNoTax {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_BONUS'] = 500000
        all_configurations['MAX_WIN'] = 2000000
        all_configurations['MIN_BONUS_ODD'] = 1.2
        all_configurations['SLIP_SIZE'] = 50

        return all_configurations[configuration_name]

    }

    get_min_bonus_eligble_match_count = () => {
        return 3
    }

    get_max_bonus_eligble_match_count = () => {
        return 50
    }

    get_percentages = (match_count) => {

        // >= 45 500%
        if (match_count >= 45)
            return 5

        // >= 44 475%
        else if (match_count >= 44)
            return 4.75

        // >= 43 450%
        else if (match_count >= 43)
            return 4.5

        // >= 42 420%
        else if (match_count >= 42)
            return 4.2

        // >= 41 400%
        else if (match_count >= 41)
            return 4

        // >= 40 380%
        else if (match_count >= 40)
            return 3.8

        // >= 39 360%
        else if (match_count >= 39)
            return 3.6

        // >= 38 340%
        else if (match_count >= 38)
            return 3.4

        // >= 37 320%
        else if (match_count >= 37)
            return 3.2

        // >= 36 and 305%
        else if (match_count >= 36)
            return 3.05

        // >= 35 290%
        else if (match_count >= 35)
            return 2.9

        // >= 34 270%
        else if (match_count >= 34)
            return 2.7

        // >= 33 2.55%
        else if (match_count >= 33)
            return 2.55

        // >= 32 240%
        else if (match_count >= 32)
            return 2.4

        // >= 31 225%
        else if (match_count >= 31)
            return 2.25

        // >= 30 210%
        else if (match_count >= 30)
            return 2.1

        // >= 29 195%
        else if (match_count >= 29)
            return 1.95

        // >= 28 185%
        else if (match_count >= 28)
            return 1.85

        // >= 27 170%
        else if (match_count >= 27)
            return 1.7

        // >= 26 160%
        else if (match_count >= 26)
            return 1.6

        // >= 25 150%
        else if (match_count >= 25)
            return 1.5

        // >= 24 140%
        else if (match_count >= 24)
            return 1.4

        // >= 23 130%
        else if (match_count >= 23)
            return 1.3

        // >= 22 120%
        else if (match_count >= 22)
            return 1.2

        // >= 21 110%
        else if (match_count >= 21)
            return 1.1

        // >= 20 100%
        else if (match_count >= 20)
            return 1

        // >= 19 90%
        else if (match_count >= 19)
            return 0.9

        // >= 18 80%
        else if (match_count >= 18)
            return 0.8

        // >= 17 75%
        else if (match_count >= 17)
            return 0.75

        // >= 16 65%
        else if (match_count >= 16)
            return 0.65

        // >= 15 60%
        else if (match_count >= 15)
            return 0.6

        // >= 14 55%
        else if (match_count >= 14)
            return 0.55

        // >= 13 50%
        else if (match_count >= 13)
            return 0.5

        // >= 12 45%
        else if (match_count >= 12)
            return 0.45

        // >= 11 40%
        else if (match_count >= 11)
            return 0.4

        // >= 10 35%
        else if (match_count >= 10)
            return 0.35

        // >= 9 30%
        else if (match_count >= 9)
            return 0.3

        // >= 8 25%
        else if (match_count >= 8)
            return 0.25

        // >= 7 20%
        else if (match_count >= 7)
            return 0.2

        // >= 6 15%
        else if (match_count >= 6)
            return 0.15

        // >= 5 10%
        else if (match_count >= 5)
            return 0.1

        // >= 4 5%
        else if (match_count >= 4)
            return 0.05

        // >= 3 3%
        else if (match_count >= 3)
            return 0.03
    }
}


export default {

    SlipComp: SlipComp,
    NoTaxSlipCompMw500K: NoTaxSlipCompMw500K,
    NoTaxSlipCompMw500K_35SLPSZ : NoTaxSlipCompMw500K_35SLPSZ,
    NoTaxSlipCompMw500K_50SLPSZ : NoTaxSlipCompMw500K_50SLPSZ,
    NoTaxSlipCompMw1M: NoTaxSlipCompMw1M,
    NoTaxSlipCompMw2M: NoTaxSlipCompMw2M,
    NoTaxSlipCompMw10M: NoTaxSlipCompMw10M,
    NoTaxSlipCompMw15M: NoTaxSlipCompMw15M,
    MulaSlipComp: MulaSlipComp,
    AfroSlipCompNoBonusMW50KSlipSize30: AfroSlipCompNoBonusMW50KSlipSize30,
    MulaSlipCompMW5K: MulaSlipCompMW5K,
    MulaSlipComp10PVatMW5K: MulaSlipComp10PVatMW5K,
    MulaSlipComp10PVatMW10K: MulaSlipComp10PVatMW10K,
    LesothoMulaSlipCompMW5K: LesothoMulaSlipCompMW5K,
    LesothoMulaSlipCompMW10K: LesothoMulaSlipCompMW10K,
    AfroSlipCompNoBonusMW100KSlipSize50: AfroSlipCompNoBonusMW100KSlipSize50,
    AfroSlipCompNoBonusMW350KSlipSize50: AfroSlipCompNoBonusMW350KSlipSize50,
    AfroSlipCompNoBonusMW500KSlipSize50: AfroSlipCompNoBonusMW500KSlipSize50,
    AfroSlipCompBonusTOTMW50KSlipSize50: AfroSlipCompBonusTOTMW50KSlipSize50,
    AfroSlipCompMW50KSlpSz50BGT100BV10p: AfroSlipCompMW50KSlpSz50BGT100BV10p,
    AfroSlipCompMW350KSlpSz50BGT20BV10p: AfroSlipCompMW350KSlpSz50BGT20BV10p,
    AfroSlipCompMW350KSlpSz50BGT20BVAT: AfroSlipCompMW350KSlpSz50BGT20BVAT,
    AfroSlipCompMW1MKSlpSz50BGT20BVAT: AfroSlipCompMW1MKSlpSz50BGT20BVAT,
    AfroSlipCompMW350KSlpSz50BGT20_1000BV10p: AfroSlipCompMW350KSlpSz50BGT20_1000BV10p,
    AfroSlipCompMW350WinTaxNoStake: AfroSlipCompMW350WinTaxNoStake,
    AfroSlipCompNOBnsMW350KRfndNOTLessStake: AfroSlipCompNOBnsMW350KRfndNOTLessStake,
    AfroSlipCompBonusMW350KRfndNOTLessStake: AfroSlipCompBonusMW350KRfndNOTLessStake,
    AfroSlipComp2PRCBnsMW350KRFDNOTLTStake: AfroSlipComp2PRCBnsMW350KRFDNOTLTStake,
    AfroSlipComp10PRCBnsMW350KRFDNOTLTStake: AfroSlipComp10PRCBnsMW350KRFDNOTLTStake,
    AfroSlipMW150RFNDNOTLTSTKSLSZ50: AfroSlipMW150RFNDNOTLTSTKSLSZ50,
    AfroSlipCompNoBonusMW150KSlipSize50: AfroSlipCompNoBonusMW150KSlipSize50,
    AfroSlipCompVAT_5PRCBnsMW350KRFNOTLTSTK: AfroSlipCompVAT_5PRCBnsMW350KRFNOTLTSTK,
    AfroSlip10PRCBnsMW150RFNDNOTLTSTKSLSZ50: AfroSlip10PRCBnsMW150RFNDNOTLTSTKSLSZ50,
    AfroSlipComp10PRCBnsMW1MRFDNOTLTStake: AfroSlipComp10PRCBnsMW1MRFDNOTLTStake,
    AfroSlipCompMW350_BNSGT1000_8NOTLTSTK: AfroSlipCompMW350_BNSGT1000_8NOTLTSTK,
    AfroSlipCompMW350_BNSGT1000NOTLTSTK: AfroSlipCompMW350_BNSGT1000NOTLTSTK,
    AfroSlipCompMW350_BNSGT1000: AfroSlipCompMW350_BNSGT1000,
    AfroSlipComp10PRCBnsGT1000MW1M: AfroSlipComp10PRCBnsGT1000MW1M,
    AfroSlipComp10PRCBnsMW1M: AfroSlipComp10PRCBnsMW1M,
    AfroSlipCompMW1M_BNSGT1000: AfroSlipCompMW1M_BNSGT1000,
    MultiBonusMaxBonus100K: MultiBonusMaxBonus100K,
    MultiBonusMaxBns100KStakeWinTaxed: MultiBonusMaxBns100KStakeWinTaxed,
    MultiBonusMaxBns100KStakeWTaxdSlpSz35: MultiBonusMaxBns100KStakeWTaxdSlpSz35,
    MultiBonusMaxBnsWinTaxBonus: MultiBonusMaxBnsWinTaxBonus,
    MultiBonusMaxVATWinTaxBonus: MultiBonusMaxVATWinTaxBonus,
    MultiBonusMaxVATWinTaxBonus2: MultiBonusMaxVATWinTaxBonus2,
    MultiBonus2: MultiBonus2,
    MultiBonus3: MultiBonus3,
    MultiBonus4: MultiBonus4,
    MultiBonus5: MultiBonus5,
    MultiBonus6: MultiBonus6,
    MultiBonus6SlpSz40: MultiBonus6SlpSz40,
    MultiBonus6Mw500SlpSz50: MultiBonus6Mw500SlpSz50,
    MultiBonus6Mw1MilSlpSz50: MultiBonus6Mw1MilSlpSz50,
    MultiBonus7: MultiBonus7,
    MultiBonus8: MultiBonus8,
    MultiBonus9: MultiBonus9,
    MultiBonus9Mw500KMB5240SlpSz35: MultiBonus9Mw500KMB5240SlpSz35,
    MultiBonus9Mw1MilMB5240SlpSz35: MultiBonus9Mw1MilMB5240SlpSz35,
    MultiBonus10: MultiBonus10,
    MultiBonus11: MultiBonus11,
    MultiBonus11MW1Mil: MultiBonus11MW1Mil,
    WinTaxBonusSlpSz50MW350K: WinTaxBonusSlpSz50MW350K,
    WinTaxBonusSlpSz50MW500K: WinTaxBonusSlpSz50MW500K,
    WinTaxBonusSlpSz50MW1Mil: WinTaxBonusSlpSz50MW1Mil,
    SC54MW350KSPS50: SC54MW350KSPS50,
    SC54MW500KSPS50: SC54MW500KSPS50,
    SC54MW1MilSPS50: SC54MW1MilSPS50,
    LesMultiBonus1: LesMultiBonus1,
    BasicKenyaSlipComputer: BasicKenyaSlipComputer,
    BasicMultibetBonusKenyaSlipComputer: BasicMultibetBonusKenyaSlipComputer,
    BasicKenyaSlipComp12_5ET: BasicKenyaSlipComp12_5ET,
    BasicMulbetKenyaSlipComp12_5ET: BasicMulbetKenyaSlipComp12_5ET,
    MulbetSlipCompMO12_MW2MNoTax: MulbetSlipCompMO12_MW2MNoTax,
    MulbetSlipCompMO12_MW2MNoTax2: MulbetSlipCompMO12_MW2MNoTax2,
    MultiBonus11_20EVN : MultiBonus11_20EVN,
    MBNS11_50SLPSZ_1Mil : MBNS11_50SLPSZ_1Mil,
    MBNS11_50SLPSZ_1Mil_850K_CAP : MBNS11_50SLPSZ_1Mil_850K_CAP,
    MultiBonus12 : MultiBonus12,
    MultiBonus12_1Mil : MultiBonus12_1Mil

}