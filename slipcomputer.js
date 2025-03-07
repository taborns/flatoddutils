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

        return 0
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

        return this.placedbet

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

        return 0

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
    get_before_0 = () => {
        // return this.get_initial_tax() // disabled to make it compatible with legacy code
        return 0
    }

    get_before_01 = () => {
        return 0
    }
    get_after_0 = () => {
        // return this.calculate_tax() // disabled to make it compatible with legacy code
        return 0
    }




}

class NoTaxSlipCompMw500K extends SlipComp {
    static ConfigurationDescription = () => ({
    })
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
    static ConfigurationDescription = () => ({
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 5000000
        all_configurations['TAX_TYPE'] = 'none'
        all_configurations['SLIP_SIZE'] = 35
        return all_configurations[configuration_name]

    }
}

class NoTaxSlipCompMw500K_50SLPSZ extends NoTaxSlipCompMw500K {
    static ConfigurationDescription = () => ({
    })
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 500000
        all_configurations['TAX_TYPE'] = 'none'
        all_configurations['SLIP_SIZE'] = 50
        return all_configurations[configuration_name]

    }
}

class NoTaxSlipCompMw1M extends NoTaxSlipCompMw500K {
    static ConfigurationDescription = () => ({
    })
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }
}

class NoTaxSlipCompMw2M extends NoTaxSlipCompMw500K {
    static ConfigurationDescription = () => ({
    })
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 2000000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }
}

class NoTaxSlipCompMw10M extends NoTaxSlipCompMw500K {
    static ConfigurationDescription = () => ({
    })
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 10000000
        all_configurations['TAX_TYPE'] = 'none'
        return all_configurations[configuration_name]

    }
}


class NoTaxSlipCompMw15M extends NoTaxSlipCompMw500K {
    static ConfigurationDescription = () => ({
    })
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

class MulaSlipComp10PVatMW30K extends MulaSlipComp10PVatMW5K {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 30000
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

class AfroSlipCompNoBonusMW600KSlipSize50 extends AfroSlipCompNoBonusMW350KSlipSize50 {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 600000
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
        const all_configurations = this.get_all_configurations();
        all_configurations['BET_SLIP_BONUS'] = true;
        all_configurations['MAX_WIN'] = 350000;
        all_configurations['SLIP_SIZE'] = 40;
        all_configurations['MAX_BONUS'] = 52400;
        all_configurations["MIN_BONUS_ODD"] = 1.4;

        return all_configurations[configuration_name];
    }
}


class MultiBonus6Mw500SlpSz50 extends MultiBonus6 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    });

    get_configurations = (configuration_name) => {
        const all_configurations = this.get_all_configurations();
        all_configurations['BET_SLIP_BONUS'] = true;
        all_configurations['MAX_WIN'] = 500000;
        all_configurations['SLIP_SIZE'] = 50;
        all_configurations['MAX_BONUS'] = 52400;
        all_configurations["MIN_BONUS_ODD"] = 1.4;

        return all_configurations[configuration_name];
    }
}

class MultiBonus6Mw1MilSlpSz20 extends MultiBonus6 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    });

    get_configurations = (configuration_name) => {
        const all_configurations = this.get_all_configurations();
        all_configurations['BET_SLIP_BONUS'] = true;
        all_configurations['MAX_WIN'] = 1000000;
        all_configurations['SLIP_SIZE'] = 20;
        all_configurations['MAX_BONUS'] = 52400;
        all_configurations["MIN_BONUS_ODD"] = 1.4;

        return all_configurations[configuration_name];
    }
}

class MultiBonus6Mw1MilSlpSz50 extends MultiBonus6 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    });

    get_configurations = (configuration_name) => {
        const all_configurations = this.get_all_configurations();
        all_configurations['BET_SLIP_BONUS'] = true;
        all_configurations['MAX_WIN'] = 1000000;
        all_configurations['SLIP_SIZE'] = 50;
        all_configurations['MAX_BONUS'] = 52400;
        all_configurations["MIN_BONUS_ODD"] = 1.4;

        return all_configurations[configuration_name];
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

class MultiBonus8Mw350K_VAT extends MultiBonus8 {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'vat'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.2
        all_configurations["TAX_TYPE"] = 'vat'
        all_configurations["WIN_TAX"] = 0.15

        return all_configurations[configuration_name]

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

        if (net_pay >= this.get_configurations("NET_PAY_CAP")) {
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
        TAX_TYPE: 'none'
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

class MultiBonus12_1Mil extends MultiBonus12 {

    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
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
        if (match_count >= 45) return 5;
        else if (match_count >= 44) return 4.75;
        else if (match_count >= 43) return 4.5;
        else if (match_count >= 42) return 4.2;
        else if (match_count >= 41) return 4;
        else if (match_count >= 40) return 3.8;
        else if (match_count >= 39) return 3.6;
        else if (match_count >= 38) return 3.4;
        else if (match_count >= 37) return 3.2;
        else if (match_count >= 36) return 3.05;
        else if (match_count >= 35) return 2.9;
        else if (match_count >= 34) return 2.7;
        else if (match_count >= 33) return 2.55;
        else if (match_count >= 32) return 2.4;
        else if (match_count >= 31) return 2.25;
        else if (match_count >= 30) return 2.1;
        else if (match_count >= 29) return 1.95;
        else if (match_count >= 28) return 1.85;
        else if (match_count >= 27) return 1.7;
        else if (match_count >= 26) return 1.6;
        else if (match_count >= 25) return 1.5;
        else if (match_count >= 24) return 1.4;
        else if (match_count >= 23) return 1.3;
        else if (match_count >= 22) return 1.2;
        else if (match_count >= 21) return 1.1;
        else if (match_count >= 20) return 1;
        else if (match_count >= 19) return 0.9;
        else if (match_count >= 18) return 0.8;
        else if (match_count >= 17) return 0.75;
        else if (match_count >= 16) return 0.65;
        else if (match_count >= 15) return 0.6;
        else if (match_count >= 14) return 0.55;
        else if (match_count >= 13) return 0.5;
        else if (match_count >= 12) return 0.45;
        else if (match_count >= 11) return 0.4;
        else if (match_count >= 10) return 0.35;
        else if (match_count >= 9) return 0.3;
        else if (match_count >= 8) return 0.25;
        else if (match_count >= 7) return 0.2;
        else if (match_count >= 6) return 0.15;
        else if (match_count >= 5) return 0.1;
        else if (match_count >= 4) return 0.05;
        else if (match_count >= 3) return 0.03;
    }
}


class MBNS_MW1M_50SLP_1MILCAP_3_14MMCH extends MultiBonus11_20EVN {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 1000000
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

        if (net_pay >= this.get_configurations("NET_PAY_CAP")) {
            net_pay = this.get_configurations("NET_PAY_CAP")
        }

        return net_pay
    }


    get_percentages = (match_count) => {

        // >= 14
        if (match_count >= 14)
            return 0.75

        // >= 13, 60
        else if (match_count >= 13)
            return 0.6

        // >= 12, 50%
        else if (match_count >= 12)
            return 0.5

        // >= 11, 40%
        else if (match_count >= 11)
            return 0.4

        // >= 10, 35%
        else if (match_count >= 10)
            return 0.35

        // >= 9, 30%
        else if (match_count >= 9)
            return 0.3


        // >= 8, 25%
        else if (match_count >= 8)
            return 0.25

        // >= 7, 20% 
        else if (match_count >= 7)
            return 0.2

        // >= 6, 10%
        else if (match_count >= 6)
            return 0.1

        // >= 5
        else if (match_count >= 5)
            return 0.05

        // >= 4
        else if (match_count >= 4)
            return 0.04

        // >= 3
        else if (match_count >= 3)
            return 0.03

        else
            return 0

    }
}

// Add time - May 1
class MBNS_MW500K_50SLP_3_24MCH extends MBNS_MW1M_50SLP_1MILCAP_3_14MMCH {
    static ConfigurationDescription = () => ({
        TAX_TYPE: 'none'
    })

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 500000
        all_configurations['NET_PAY_CAP'] = 500000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    get_percentages = (match_count) => {
        // >= 24
        if (match_count >= 24)
            return 0.8

        // >= 23
        if (match_count >= 23)
            return 0.7

        // >= 22
        if (match_count >= 22)
            return 0.6

        // >= 21
        if (match_count >= 21)
            return 0.5

        // >= 20
        if (match_count >= 20)
            return 0.4

        // >= 19
        if (match_count >= 19)
            return 0.35

        // >= 18
        if (match_count >= 18)
            return 0.3

        // >= 17, 25
        else if (match_count >= 17)
            return 0.25

        // >= 16, 20%
        else if (match_count >= 16)
            return 0.2

        // >= 15, 17%
        else if (match_count >= 15)
            return 0.17

        // >= 14, 14%
        else if (match_count >= 14)
            return 0.14

        // >= 13, 11%
        else if (match_count >= 13)
            return 0.11


        // >= 12, 9%
        else if (match_count >= 12)
            return 0.09

        // >= 11, 7% 
        else if (match_count >= 11)
            return 0.07

        // >= 10, 5%
        else if (match_count >= 10)
            return 0.05

        // >= 9
        else if (match_count >= 9)
            return 0.03

        // >= 8
        else if (match_count >= 8)
            return 0.02

        // >= 7
        else if (match_count >= 7)
            return 0.01

        else
            return 0
    }
}

class MBNS_MW500K_50SLP_3_40MCH extends MBNS_MW1M_50SLP_1MILCAP_3_14MMCH {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 500000
        all_configurations['NET_PAY_CAP'] = 500000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    get_percentages = (match_count) => {


        // >= 40
        if (match_count >= 40)
            return 4

        // >= 39
        else if (match_count >= 39)
            return 3.8

        // >= 38
        else if (match_count >= 38)
            return 3.6

        // >= 37
        else if (match_count >= 37)
            return 3.4

        // >= 36
        else if (match_count >= 36)
            return 3.2

        // >= 35
        else if (match_count >= 35)
            return 3.1

        // >= 34
        else if (match_count >= 34)
            return 2.9

        // >= 33
        else if (match_count >= 33)
            return 2.7

        // >= 32
        else if (match_count >= 32)
            return 2.5

        // >= 31
        else if (match_count >= 31)
            return 2.3

        // >= 30
        else if (match_count >= 30)
            return 2.1

        // >= 29
        else if (match_count >= 29)
            return 2

        // >= 28
        else if (match_count >= 28)
            return 1.7

        // >= 27
        else if (match_count >= 27)
            return 1.5

        // >= 26
        else if (match_count >= 26)
            return 1.3

        // >= 25
        else if (match_count >= 25)
            return 1.1

        // >= 24
        else if (match_count >= 24)
            return 1

        // >= 23
        else if (match_count >= 23)
            return 0.95

        // >= 22
        else if (match_count >= 22)
            return 0.9

        // >= 21
        if (match_count >= 21)
            return 0.85

        // >= 20
        if (match_count >= 20)
            return 0.8

        // >= 19
        if (match_count >= 19)
            return 0.75

        // >= 18
        if (match_count >= 18)
            return 0.7

        // >= 17
        if (match_count >= 17)
            return 0.65

        // >= 16
        if (match_count >= 16)
            return 0.6

        // >= 15
        if (match_count >= 15)
            return 0.55

        // >= 14
        if (match_count >= 14)
            return 0.5

        // >= 13
        else if (match_count >= 13)
            return 0.45

        // >= 12
        else if (match_count >= 12)
            return 0.4

        // >= 11
        else if (match_count >= 11)
            return 0.35

        // >= 10
        else if (match_count >= 10)
            return 0.3

        // >= 9
        else if (match_count >= 9)
            return 0.25


        // >= 8
        else if (match_count >= 8)
            return 0.2

        // >= 7
        else if (match_count >= 7)
            return 0.15

        // >= 6
        else if (match_count >= 6)
            return 0.1

        // >= 5
        else if (match_count >= 5)
            return 0.09

        // >= 4
        else if (match_count >= 4)
            return 0.08

        // >= 3
        else if (match_count >= 3)
            return 0.05

        else
            return 0
    }
}

class MBNS_MW350K_50SLP_4_23MCH extends MBNS_MW1M_50SLP_1MILCAP_3_14MMCH {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['NET_PAY_CAP'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    get_percentages = (match_count) => {


        // >= 23
        if (match_count >= 23)
            return 1

        // >= 22
        else if (match_count >= 22)
            return 0.95

        // >= 21
        if (match_count >= 21)
            return 0.9

        // >= 20
        if (match_count >= 20)
            return 0.85

        // >= 19
        if (match_count >= 19)
            return 0.8

        // >= 18
        if (match_count >= 18)
            return 0.75

        // >= 17
        if (match_count >= 17)
            return 0.7

        // >= 16
        if (match_count >= 16)
            return 0.65

        // >= 15
        if (match_count >= 15)
            return 0.6

        // >= 14
        if (match_count >= 14)
            return 0.55

        // >= 13
        else if (match_count >= 13)
            return 0.5

        // >= 12
        else if (match_count >= 12)
            return 0.45

        // >= 11
        else if (match_count >= 11)
            return 0.4

        // >= 10
        else if (match_count >= 10)
            return 0.35

        // >= 9
        else if (match_count >= 9)
            return 0.3


        // >= 8
        else if (match_count >= 8)
            return 0.25

        // >= 7
        else if (match_count >= 7)
            return 0.2

        // >= 6
        else if (match_count >= 6)
            return 0.15

        // >= 5
        else if (match_count >= 5)
            return 0.1

        // >= 4
        else if (match_count >= 4)
            return 0.05


        else
            return 0
    }
}

class MBNS_MW350K_50SLP_7_35MCH extends MBNS_MW1M_50SLP_1MILCAP_3_14MMCH {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350000
        all_configurations['NET_PAY_CAP'] = 350000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }

    get_percentages = (match_count) => {
        // >= 35
        if (match_count >= 35)
            return 3

        // >= 34
        else if (match_count >= 34)
            return 2.8


        // >= 33
        else if (match_count >= 33)
            return 2.6

        // >= 32
        else if (match_count >= 32)
            return 2.4

        // >= 31
        else if (match_count >= 31)
            return 2.2

        // >= 30
        else if (match_count >= 30)
            return 2

        // >= 29
        else if (match_count >= 29)
            return 1.9

        // >= 28
        else if (match_count >= 28)
            return 1.6

        // >= 27
        else if (match_count >= 27)
            return 1.4

        // >= 26
        else if (match_count >= 26)
            return 1.2

        // >= 25
        else if (match_count >= 25)
            return 1

        // >= 24
        else if (match_count >= 24)
            return 0.8

        // >= 23
        else if (match_count >= 23)
            return 0.7

        // >= 22
        else if (match_count >= 22)
            return 0.6

        // >= 21
        else if (match_count >= 21)
            return 0.5

        // >= 20
        else if (match_count >= 20)
            return 0.4

        // >= 19
        else if (match_count >= 19)
            return 0.35

        // >= 18
        else if (match_count >= 18)
            return 0.3

        // >= 17
        else if (match_count >= 17)
            return 0.25

        // >= 16
        else if (match_count >= 16)
            return 0.2

        // >= 15
        else if (match_count >= 15)
            return 0.17

        // >= 14
        else if (match_count >= 14)
            return 0.14

        // >= 13
        else if (match_count >= 13)
            return 0.11

        // >= 12
        else if (match_count >= 12)
            return 0.09


        // >= 11
        else if (match_count >= 11)
            return 0.07

        // >= 10
        else if (match_count >= 10)
            return 0.05

        // >= 9
        else if (match_count >= 9)
            return 0.03

        // >= 8
        else if (match_count >= 8)
            return 0.02

        // >= 7
        else if (match_count >= 7)
            return 0.01


        else
            return 0
    }
}

class MBNS_MW500K_50SLP_7_35MCH extends MBNS_MW350K_50SLP_7_35MCH {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 500000
        all_configurations['NET_PAY_CAP'] = 500000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]

    }
}

class MBNS_MW1M_50SLP_6_38MCH_10P_VAT_WIN extends MBNS_MW350K_50SLP_7_35MCH {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 900000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations['VAT_TAX'] = 0.1
        all_configurations['WIN_TAX'] = 0.1
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]

    }

    get_min_bonus_eligble_match_count = () => {
        return 6
    }

    get_max_bonus_eligble_match_count = () => {
        return this.get_configurations("SLIP_SIZE")
    }

    calculate_tax = () => {

        let win_value = this.get_win_value()
        let tax_value = 0

        if (this.is_win_taxable(win_value))
            tax_value = this.get_configurations("WIN_TAX") * win_value

        return tax_value
    }
    get_win_tax_bonus = () => {
        return 0


    }

    get_percentages = (match_count) => {

        // >= 38
        if (match_count >= 38)
            return 3

        // >= 32
        else if (match_count >= 32)
            return 2.5

        // >= 28
        else if (match_count >= 28)
            return 2

        // >= 24
        else if (match_count >= 24)
            return 1.5

        // >= 21
        else if (match_count >= 21)
            return 0.72

        // >= 19
        else if (match_count >= 19)
            return 0.42

        // >= 17
        else if (match_count >= 17)
            return 0.29

        // >= 15
        else if (match_count >= 15)
            return 0.22

        // >= 13
        else if (match_count >= 13)
            return 0.18


        // >= 11
        else if (match_count >= 11)
            return 0.14

        // >= 9
        else if (match_count >= 9)
            return 0.1

        // >= 8
        else if (match_count >= 8)
            return 0.09

        // >= 7
        else if (match_count >= 7)
            return 0.06

        // >= 6
        else if (match_count >= 6)
            return 0.04


        else
            return 0
    }
}
class MBNS_MW350K_40SLP_4_36MCH extends MBNS_MW1M_50SLP_1MILCAP_3_14MMCH {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 350_000
        all_configurations['NET_PAY_CAP'] = 350_000
        all_configurations['SLIP_SIZE'] = 40
        all_configurations['MAX_BONUS'] = 52400
        all_configurations['VAT_TAX'] = 0.1
        all_configurations['WIN_TAX'] = 0.1
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]

    }

    get_min_bonus_eligble_match_count = () => {
        return 4
    }

    get_max_bonus_eligble_match_count = () => {
        return 36
    }

    calculate_bonus_value = () => {
        if (!this.is_odd_bonus_eligible()) return 0

        let percentage = this.get_percentages(this.get_percentage_match_count())
        let max_percentage = this.get_percentages(this.get_max_bonus_eligble_match_count())
        if (!percentage) return 0

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
    get_percentages = (match_count) => {

        // >= 36
        if (match_count >= 36)
            return 3

        // >= 31
        else if (match_count >= 31)
            return 2.5

        // >= 26
        else if (match_count >= 26)
            return 2

        // >= 21
        else if (match_count >= 21)
            return 1.5

        // >= 16
        else if (match_count >= 16)
            return 0.8

        // >= 15
        else if (match_count >= 15)
            return 0.6

        // >= 14
        else if (match_count >= 14)
            return 0.55

        // >= 13
        else if (match_count >= 13)
            return 0.5

        // >= 12
        else if (match_count >= 12)
            return 0.45


        // >= 11
        else if (match_count >= 11)
            return 0.4

        // >= 10
        else if (match_count >= 10)
            return 0.35

        // >= 9
        else if (match_count >= 9)
            return 0.3

        // >= 8
        else if (match_count >= 8)
            return 0.25

        // >= 7
        else if (match_count >= 7)
            return 0.2
        // >= 6
        else if (match_count >= 6)
            return 0.15
        // >= 5
        else if (match_count >= 5)
            return 0.1
        // >= 4
        else if (match_count >= 4)
            return 0.05


        else
            return 0
    }
}
class MBNS_MW1M_50SLP_3_14MCH extends MBNS_MW1M_50SLP_1MILCAP_3_14MMCH {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1_000_000
        all_configurations['NET_PAY_CAP'] = 1_000_000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations['WIN_TAX'] = 0.1
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]

    }

    get_max_bonus_eligble_match_count = () => {
        return 14
    }

    calculate_bonus_value = () => {
        if (!this.is_odd_bonus_eligible()) return 0

        let percentage = this.get_percentages(this.get_percentage_match_count())
        let max_percentage = this.get_percentages(this.get_max_bonus_eligble_match_count())
        if (!percentage) return 0

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

    get_percentages = (match_count) => {

        // >= 14
        if (match_count >= 14)
            return 0.75

        // >= 13
        else if (match_count >= 13)
            return 0.6

        // >= 12
        else if (match_count >= 12)
            return 0.5

        // >= 11
        else if (match_count >= 11)
            return 0.4

        // >= 10
        else if (match_count >= 10)
            return 0.35

        // >= 9
        else if (match_count >= 9)
            return 0.3

        // >= 8
        else if (match_count >= 8)
            return 0.25

        // >= 7
        else if (match_count >= 7)
            return 0.2

        // >= 6
        else if (match_count >= 6)
            return 0.1

        // >= 5
        else if (match_count >= 5)
            return 0.05

        // >= 4
        else if (match_count >= 4)
            return 0.04

        // >= 3
        else if (match_count >= 3)
            return 0.03

        else
            return 0
    }
}
class MBNS_MW300K_50SLP_7_35MCH extends MBNS_MW350K_50SLP_7_35MCH {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 300_000
        all_configurations['NET_PAY_CAP'] = 300_000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        // all_configurations['VAT_TAX'] = 0.1
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]

    }

    get_max_bonus_eligble_match_count = () => {
        return 7
    }

    get_max_bonus_eligble_match_count = () => {
        return 35
    }

    get_percentage_match_count = () => {

        let percentage_match_count = this.get_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count())
            percentage_match_count = this.get_max_bonus_eligble_match_count()

        return percentage_match_count

    }

    calculate_bonus_value = () => {
        if (!this.is_odd_bonus_eligible()) return 0

        let percentage = this.get_percentages(this.get_percentage_match_count())
        if (!percentage) return 0

        let max_percentage = this.get_percentages(this.get_max_bonus_eligble_match_count())
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
}
class MBNS_MW300K_50SLP_3_20MCH extends MBNS_MW300K_50SLP_7_35MCH {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 300_000
        all_configurations['NET_PAY_CAP'] = 300_000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        // all_configurations['VAT_TAX'] = 0.1
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]

    }

    get_max_bonus_eligble_match_count = () => {
        return 3
    }

    get_max_bonus_eligble_match_count = () => {
        return 20
    }

    get_percentage_match_count = () => {

        let percentage_match_count = this.get_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count())
            percentage_match_count = this.get_max_bonus_eligble_match_count()

        return percentage_match_count

    }

    get_percentages = (match_count) => {
        if (match_count >= 20)
            return 0.75  // 75%
        else if (match_count >= 19)
            return 0.7  // 70%
        else if (match_count >= 18)
            return 0.65  // 65%
        else if (match_count >= 17)
            return 0.6  // 60%
        else if (match_count >= 16)
            return 0.55  // 55%
        else if (match_count >= 15)
            return 0.5  // 50%
        else if (match_count >= 14)
            return 0.45  // 45%
        else if (match_count >= 13)
            return 0.4  // 40%
        else if (match_count >= 12)
            return 0.35  // 35%
        else if (match_count >= 11)
            return 0.3  // 30%
        else if (match_count >= 10)
            return 0.25  // 25%
        else if (match_count >= 9)
            return 0.2  // 20%
        else if (match_count >= 8)
            return 0.15  // 15%
        else if (match_count >= 7)
            return 0.1  // 10%
        else if (match_count >= 6)
            return 0.06  // 6%
        else if (match_count >= 5)
            return 0.05  // 5%
        else if (match_count >= 4)
            return 0.04  // 4%
        else if (match_count >= 3)
            return 0.03  // 3%
        else
            return 0  // No bonus
    }
}
class MBNS_MW300K_50SLP_3_38MCH extends MBNS_MW300K_50SLP_7_35MCH {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 300_000
        all_configurations['NET_PAY_CAP'] = 300_000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]

    }

    get_max_bonus_eligble_match_count = () => {
        return 3
    }

    get_max_bonus_eligble_match_count = () => {
        return 20
    }

    get_percentage_match_count = () => {

        let percentage_match_count = this.get_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count())
            percentage_match_count = this.get_max_bonus_eligble_match_count()

        return percentage_match_count

    }

    get_percentages = (match_count) => {
        if (match_count >= 38)
            return 3.00  // 300%
        else if (match_count >= 32)
            return 2.50  // 250%
        else if (match_count >= 28)
            return 2.00  // 200%
        else if (match_count >= 24)
            return 1.50  // 150%
        else if (match_count >= 21)
            return 0.72  // 72%
        else if (match_count >= 19)
            return 0.42  // 42%
        else if (match_count >= 17)
            return 0.29  // 29%
        else if (match_count >= 15)
            return 0.22  // 22%
        else if (match_count >= 13)
            return 0.14  // 14%
        else if (match_count >= 11)
            return 0.10  // 10%
        else if (match_count >= 9)
            return 0.07  // 7%
        else if (match_count >= 8)
            return 0.04  // 4%
        else if (match_count >= 5)
            return 0.03  // 3%
        else if (match_count >= 3)
            return 0.02  // 2%
        else
            return 0  // No bonus
    }
}

class MBNS_MW1M_50SLP_6_38MCH_NO_TAX extends MBNS_MW1M_50SLP_6_38MCH_10P_VAT_WIN {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 900000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 52400
        all_configurations['VAT_TAX'] = 0
        all_configurations['WIN_TAX'] = 0
        all_configurations['TAX_TYPE'] = 'none'
        all_configurations["MIN_BONUS_ODD"] = 1.2
        return all_configurations[configuration_name]

    }
}

class MBNS_MW1M_50SLP_3_40MCH_10P_VAT_WIN extends MBNS_MW1M_50SLP_6_38MCH_10P_VAT_WIN {
    is_odd_bonus_eligible = () => {
        return this.get_total_odds() >= this.get_configurations("MIN_BONUS_ODD") ** this.get_match_count()
    }
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 900000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 100000
        all_configurations['VAT_TAX'] = 0.1
        all_configurations['WIN_TAX'] = 0.1
        all_configurations["MIN_BONUS_ODD"] = 1.2
        return all_configurations[configuration_name]

    }
    get_min_bonus_eligble_match_count = () => {
        return 3
    }

    get_percentages = (match_count) => {

        // >= 40
        if (match_count >= 40)
            return 4

        // >= 39
        if (match_count >= 39)
            return 3.8

        // >= 38
        if (match_count >= 38)
            return 3.6

        // >= 37
        if (match_count >= 37)
            return 3.4

        // >= 36
        else if (match_count >= 36)
            return 3.2

        // >= 35
        else if (match_count >= 35)
            return 3.1

        // >= 34
        else if (match_count >= 34)
            return 2.9

        // >= 33
        else if (match_count >= 33)
            return 2.7

        // >= 32
        else if (match_count >= 32)
            return 2.5

        // >= 31
        else if (match_count >= 31)
            return 2.3

        // >= 30
        else if (match_count >= 30)
            return 2.1

        // >= 29
        else if (match_count >= 29)
            return 2

        // >= 28
        else if (match_count >= 28)
            return 1.7

        // >= 27
        else if (match_count >= 27)
            return 1.5

        // >= 26
        else if (match_count >= 26)
            return 1.3

        // >= 25
        else if (match_count >= 25)
            return 1.1


        // >= 24
        else if (match_count >= 24)
            return 1

        // >= 23
        else if (match_count >= 23)
            return 0.95


        // >= 22
        else if (match_count >= 22)
            return 0.90

        // >= 21
        else if (match_count >= 21)
            return 0.85

        // >= 20
        else if (match_count >= 20)
            return 0.80


        // >= 19
        else if (match_count >= 19)
            return 0.75

        // >= 18
        else if (match_count >= 18)
            return 0.7

        // >= 17
        else if (match_count >= 17)
            return 0.65

        // >= 16
        else if (match_count >= 16)
            return 0.6

        // >= 15
        else if (match_count >= 15)
            return 0.55

        // >= 14
        else if (match_count >= 14)
            return 0.5


        // >= 13
        else if (match_count >= 13)
            return 0.45

        // >= 12
        else if (match_count >= 12)
            return 0.4


        // >= 11
        else if (match_count >= 11)
            return 0.35

        // >= 10
        else if (match_count >= 10)
            return 0.3

        // >= 9
        else if (match_count >= 9)
            return 0.25

        // >= 8
        else if (match_count >= 8)
            return 0.20

        // >= 7
        else if (match_count >= 7)
            return 0.15

        // >= 6
        else if (match_count >= 6)
            return 0.1

        // >= 5
        else if (match_count >= 5)
            return 0.09

        // >= 4
        else if (match_count >= 4)
            return 0.08

        // >= 3
        else if (match_count >= 3)
            return 0.05

        else
            return 0
    }

    is_odd_bonus_eligible = () => {
        return this.get_total_odds() >= this.get_configurations("MIN_BONUS_ODD") ** this.get_match_count()
    }


    get_bonus_value = () => {
        let percentage = this.get_percentages(this.get_percentage_match_count())
        let odd_bonus_eligiblity = this.is_odd_bonus_eligible()
        if (!odd_bonus_eligiblity) {
            return 0
        }

        if (!percentage) {
            return 0
        }


        let multi_bonus_value = this.calculate_bonus_value()
        let win_tax_bonus = this.get_win_tax_bonus()

        let total_bonus = multi_bonus_value + win_tax_bonus
        if (total_bonus > this.get_configurations("MAX_BONUS"))
            total_bonus = this.get_configurations("MAX_BONUS")

        return total_bonus

    }
}

class MBNS_MW1M_50SLP_3_40MCH_NO_TAX extends MBNS_MW1M_50SLP_3_40MCH_10P_VAT_WIN {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 900000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['MAX_BONUS'] = 100000
        all_configurations['VAT_TAX'] = 0
        all_configurations['WIN_TAX'] = 0
        all_configurations['TAX_TYPE'] = 'none'
        all_configurations["MIN_BONUS_ODD"] = 1.2
        return all_configurations[configuration_name]

    }
}

class MBNS_MW500K_25SLP extends AfroSlipCompNoBonusMW350KSlipSize50 {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 500_000
        all_configurations['NET_PAY_CAP'] = 500_000
        all_configurations['SLIP_SIZE'] = 25

        return all_configurations[configuration_name]
    }
}

class MBNS_MW500K_25SLP_6_38MCH extends MBNS_MW300K_50SLP_3_38MCH {

    get_configurations = (configuration_name) => {
        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 500_000
        all_configurations['NET_PAY_CAP'] = 500_000
        all_configurations['SLIP_SIZE'] = 25
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_BONUS'] = 52_400
        all_configurations["MIN_BONUS_ODD"] = 1.01
        return all_configurations[configuration_name];
    }


    get_min_bonus_eligble_match_count = () => {
        return 6;
    }

    get_max_bonus_eligble_match_count = () => {
        return 38;
    }

    get_percentage_match_count = () => {
        let percentage_match_count = this.get_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count())
            percentage_match_count = this.get_max_bonus_eligble_match_count()

        return percentage_match_count
    }

    get_percentages = (match_count) => {
        //  >= 38 300%
        if (match_count >= 38) {
            return 3
        }

        //  >= 32 and <=37 250%
        else if (match_count >= 32) {
            return 2.5
        }

        //  >= 28 and <=31 200%
        else if (match_count >= 28) {
            return 2
        }

        //  >= 24 and <=27 150%
        else if (match_count >= 24) {
            return 1.5
        }

        //  >= 21 and <=23 72%
        else if (match_count >= 21) {
            return 0.72
        }

        //  >= 19 and <=20 42%
        else if (match_count >= 19) {
            return 0.42
        }

        //  >= 17 and <=18 29%
        else if (match_count >= 17) {
            return 0.29
        }

        //  >= 15 and <=16 22%
        else if (match_count >= 15) {
            return 0.22
        }

        //  >= 13 and <=14 14%
        else if (match_count >= 13) {
            return 0.14
        }

        //  >= 11 and <=12 10%
        else if (match_count >= 11) {
            return 0.1
        }

        //  >= 9 and <=10 7%
        else if (match_count >= 9) {
            return 0.07
        }

        //  >= 8 4%
        else if (match_count >= 8) {
            return 0.04
        }

        //  >= 7 3%
        else if (match_count >= 7) {
            return 0.03
        }

        //  >= 6 2%
        else if (match_count >= 6) {
            return 0.02
        }

        else return 0
    }

}


class MBNS_MW350K_50SLP_6_38MCH extends MBNS_MW500K_25SLP_6_38MCH {



    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350_000
        all_configurations['NET_PAY_CAP'] = 350_000
        all_configurations['SLIP_SIZE'] = 50
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_BONUS'] = 52_400
        all_configurations["MIN_BONUS_ODD"] = 1.01
        return all_configurations[configuration_name]
    }

    get_min_bonus_eligble_match_count = () => { return 6 }

    get_max_bonus_eligble_match_count = () => { return 38 }

    get_percentage_match_count = () => {
        let percentage_match_count = this.get_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count()) {
            percentage_match_count = this.get_max_bonus_eligble_match_count()
        }

        return percentage_match_count
    }

    get_percentages = (match_count) => {
        if (match_count >= 38)
            return 3.00 // # 300%
        else if (match_count >= 32)
            return 2.50  //250%
        else if (match_count >= 28)
            return 2.00  //200%
        else if (match_count >= 24)
            return 1.50  //150%
        else if (match_count >= 21)
            return 0.72  //72%
        else if (match_count >= 19)
            return 0.59  //59%
        else if (match_count >= 17)
            return 0.46  //46%
        else if (match_count >= 15)
            return 0.35  //35%
        else if (match_count >= 13)
            return 0.31  //31%
        else if (match_count >= 11)
            return 0.27  //27%
        else if (match_count >= 9)
            return 0.22  //22%
        else if (match_count >= 8)
            return 0.20  //20%
        else if (match_count >= 7)
            return 0.18  //18%
        else if (match_count >= 6)
            return 0.14  //14%
        else
            return 0  // No bonus for fewer than 6 games

    }
}

class MBNS_MW350K_40SLP extends MBNS_MW500K_25SLP_6_38MCH {


    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350_000
        all_configurations['NET_PAY_CAP'] = 350_000
        all_configurations['SLIP_SIZE'] = 40
        all_configurations['MAX_BONUS'] = 0
        return all_configurations[configuration_name]
    }

    get_percentages = (match_count) => { return 0 }
}

class MBNS_MW300K_SlpSz35_3_20MCH extends MultiBonus9Mw1MilMB5240SlpSz35 {

    get_configurations = (configuration_name) => {
        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 300_000
        all_configurations['NET_PAY_CAP'] = 300_000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52_400
        all_configurations["SLIP_SIZE"] = 35
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]
    }

    get_percentages = (match_count) => {
        let count = match_count > 20 ? 20 : match_count
        return {
            1: 0.00,
            2: 0.00,
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
        }[count]
    }
}

class MultiBonus11_MW350K_SLP40 extends MultiBonus11_20EVN {


    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350_000
        all_configurations['NET_PAY_CAP'] = 350_000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52_400
        all_configurations["SLIP_SIZE"] = 40
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]
    }
}

class MBNS_MW350K_SlpSz35_3_20MCH extends MBNS_MW300K_SlpSz35_3_20MCH {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350_000
        all_configurations['NET_PAY_CAP'] = 350_000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52_400
        all_configurations["SLIP_SIZE"] = 35
        all_configurations["MIN_BONUS_ODD"] = 1.01

        return all_configurations[configuration_name]
    }
}
class NoTaxSlipCompMw250MSlpSz60 extends NoTaxSlipCompMw15M {

    get_configurations = (configuration_name) => {
        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 250_000_000
        all_configurations['NET_PAY_CAP'] = 250_000_000
        all_configurations["SLIP_SIZE"] = 60

        return all_configurations[configuration_name]
    }
}

class MBNS_MW350K_SlpSz30_3_18MCH extends MBNS_MW300K_SlpSz35_3_20MCH {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350_000
        all_configurations['NET_PAY_CAP'] = 350_000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52_000
        all_configurations["SLIP_SIZE"] = 30
        all_configurations["MIN_BONUS_ODD"] = 1.3

        return all_configurations[configuration_name]
    }

    get_percentages = (match_count) => {
        let count = match_count > 20 ? 20 : match_count

        return {
            1: 0.00,
            2: 0.00,
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
            16: 0.6,
            17: 0.7,
            18: 0.75,
        }[count]
    }
}


class MBNS_MW350K_55SLP_6_38MCH extends MBNS_MW500K_25SLP_6_38MCH {


    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350_000
        all_configurations['NET_PAY_CAP'] = 350_000
        all_configurations['SLIP_SIZE'] = 55
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_BONUS'] = 52_400
        all_configurations["MIN_BONUS_ODD"] = 1.01
        return all_configurations[configuration_name]
    }

    get_min_bonus_eligble_match_count = () => 6

    get_max_bonus_eligble_match_count = () => 38

    get_percentage_match_count = () => {
        let percentage_match_count = this.get_match_count()

        if (percentage_match_count > this.get_max_bonus_eligble_match_count()) {
            percentage_match_count = this.get_max_bonus_eligble_match_count()
        }

        return percentage_match_count
    }

    get_percentages = (match_count) => {
        if (match_count >= 38) {

            return 3.00 // 300%
        }
        else if (match_count >= 32) {

            return 2.50 // 250%
        }
        else if (match_count >= 28) {

            return 2.00 // 200%
        }
        else if (match_count >= 24) {

            return 1.50 // 150%
        }
        else if (match_count >= 21) {

            return 0.72 // 72%
        }
        else if (match_count >= 19) {

            return 0.61 // 59%
        }
        else if (match_count >= 17) {

            return 0.55 // 46%
        }
        else if (match_count >= 15) {

            return 0.51 // 35%
        }
        else if (match_count >= 13) {

            return 0.45 // 31%
        }
        else if (match_count >= 11) {

            return 0.39 // 27%
        }
        else if (match_count >= 9) {

            return 0.34 // 22%
        }
        else if (match_count >= 8) {

            return 0.30 // 20%
        }
        else if (match_count >= 7) {

            return 0.25 // 18%
        }
        else if (match_count >= 6) {

            return 0.2 // 14%
        }
        else {

            return 0 // No bonus for fewer than 6 games
        }
    }
}

class MBNS_MW350K_SlpSz35_3_40MCH extends MBNS_MW300K_SlpSz35_3_20MCH {


    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350000
        all_configurations['NET_PAY_CAP'] = 350000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52000
        all_configurations["SLIP_SIZE"] = 35
        all_configurations["MIN_BONUS_ODD"] = 1.15

        return all_configurations[configuration_name]
    }

    get_percentages=(match_count)=> {
        let count = match_count > 40 ? 40 : match_count

        return {
            1: 0.00,
            2: 0.00,
            3: 0.05,
            4: 0.08,
            5: 0.09,
            6: 0.1,
            7: 0.15,
            8: 0.2,
            9: 0.25,
            10: 0.3,
            11: 0.35,
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
            25: 1.1,
            26: 1.3,
            27: 1.5,
            28: 1.7,
            29: 2,
            30: 2.1,
            31: 2.3,
            32: 2.5,
            33: 2.7,
            34: 2.9,
            35: 3.1,
            36: 3.2,
            37: 3.4,
            38: 3.6,
            39: 3.8,
            40: 4,
        }[count]
    }
}


class MBNS_MW350K_SlpSz50_3_18MCH extends MBNS_MW350K_SlpSz30_3_18MCH {
    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350_000
        all_configurations['NET_PAY_CAP'] = 350_000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52_000
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.3

        return all_configurations[configuration_name]
    }
}

class MBNS_MW1M_SlpSz35_3_40MCH extends MBNS_MW350K_SlpSz35_3_40MCH {

    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 1000000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52000
        all_configurations["SLIP_SIZE"] = 35
        all_configurations["MIN_BONUS_ODD"] = 1.15

        return all_configurations[configuration_name]
    }
}

class MW350_SlpSz40 extends MBNS_MW350K_SlpSz35_3_40MCH {

    get_configurations=(configuration_name)=> {

        all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350_000
        all_configurations['NET_PAY_CAP'] = 350_000
        all_configurations["SLIP_SIZE"] = 40

        return all_configurations[configuration_name]
    }

    get_percentages=(match_count)=> {
        return 0
    }
}

class MBNS_MW500K_SlpSz40_3_14MCH extends MBNS_MW300K_SlpSz35_3_20MCH {

    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 500000
        all_configurations['NET_PAY_CAP'] = 500000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52_00
        all_configurations["SLIP_SIZE"] = 40
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]
    }

    get_percentages=(match_count)=> {
        return {
            1: 0.00,
            2: 0.00,
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
}

class MBNS_MW500K_SlpSz35_3_20MCH extends MBNS_MW300K_SlpSz35_3_20MCH {
    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 500000
        all_configurations['NET_PAY_CAP'] = 500000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52_400
        all_configurations["SLIP_SIZE"] = 35
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]
    }
}


class MBNS_MW350K_SlpSz40_3_14MCH extends MBNS_MW350K_SlpSz35_3_40MCH {

    get_configurations( configuration_name) {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350000
        all_configurations['NET_PAY_CAP'] = 350000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52000
        all_configurations["SLIP_SIZE"] = 40
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]
    }

    get_percentages=(match_count)=> {
        let count = match_count > 14 ? 14 : match_count
        return {
            1: 0.00,
            2: 0.00,
            3: 0.03,
            4: 0.04,
            5: 0.05,
            6: 0.06,
            7: 0.16,
            8: 0.2,
            9: 0.24,
            10: 0.34,
            11: 0.38,
            12: 0.45,
            13: 0.58,
            14: 0.7,
        }[count]
    }
}

class MultiBonusMw1MilSlpSz50 extends MBNS_MW350K_SlpSz35_3_40MCH {

    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_WIN"] = 1000000
        all_configurations['NET_PAY_CAP'] = 1000000
        all_configurations["MAX_BONUS"] = 52400
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.3

        return all_configurations[configuration_name]
    }

    get_percentages = (match_count) => {
        let count = match_count > 50 ? 50 : match_count
        console.log("match count report", match_count, count)

        return {
            1: 0.00,
            2: 0.00,
            3: 0.03,
            4: 0.04,
            5: 0.06,
            6: 0.08,
            7: 0.15,
            8: 0.20,
            9: 0.25,
            10: 0.35,
            11: 0.40,
            12: 0.45,
            13: 0.50,
            14: 0.55,
            15: 0.60,
            16: 0.65,
            17: 0.70,
            18: 0.75,
            19: 0.80,
            20: 0.85,
            21: 0.90,
            22: 0.95,
            23: 1.00,
            24: 1.05,
            25: 1.10,
            26: 1.15,
            27: 1.20,
            28: 1.25,
            29: 1.30,
            30: 1.35,
            31: 1.40,
            32: 1.45,
            33: 1.50,
            34: 1.55,
            35: 1.60,
            36: 1.65,
            37: 1.70,
            38: 1.75,
            39: 1.80,
            40: 1.90,
            41: 2.00,
            42: 2.10,
            43: 2.20,
            44: 2.30,
            45: 2.40,
            46: 2.50,
            47: 2.60,
            48: 2.70,
            49: 2.80,
            50: 2.90,
        }[count]
    }
}


class MBNS1_MW1M_SlpSz50_3_50MCH extends MBNS_MW350K_SlpSz35_3_40MCH {
    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 1000000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 75000
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]
    }

    get_percentages=(match_count)=> {
        let count = match_count > 50 ? 50 : match_count
        return {
            1: 0.00,
            2: 0.00,
            3: 0.03,
            4: 0.04,
            5: 0.06,
            6: 0.08,
            7: 0.20,
            8: 0.25,
            9: 0.30,
            10: 0.35,
            11: 0.40,
            12: 0.45,
            13: 0.50,
            14: 0.55,
            15: 0.60,
            16: 0.65,
            17: 0.70,
            18: 0.75,
            19: 0.80,
            20: 0.85,
            21: 0.90,
            22: 0.95,
            23: 1.00,
            24: 1.05,
            25: 1.10,
            26: 1.15,
            27: 1.20,
            28: 1.25,
            29: 1.30,
            30: 1.35,
            31: 1.40,
            32: 1.45,
            33: 1.50,
            34: 1.55,
            35: 1.60,
            36: 1.65,
            37: 1.70,
            38: 1.80,
            39: 1.90,
            40: 2.00,
            41: 2.10,
            42: 2.20,
            43: 2.30,
            44: 2.40,
            45: 2.50,
            46: 2.60,
            47: 2.70,
            48: 2.80,
            49: 2.90,
            50: 3.00,
        }[count]
    }
}


class MBNS2_MW1M_SlpSz50_3_50MCH extends MBNS1_MW1M_SlpSz50_3_50MCH {
    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 1000000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 65000
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.35

        return all_configurations[configuration_name]
    }
}


class MBNS3_MW1M_SlpSz50_3_50MCH extends MBNS1_MW1M_SlpSz50_3_50MCH {

    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 1000000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 60000
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.3

        return all_configurations[configuration_name]
    }
}


class MBNS_MW1M_SlpSz20_3_20MCH extends MBNS1_MW1M_SlpSz50_3_50MCH {

    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1_000_000
        all_configurations['NET_PAY_CAP'] = 1_000_000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52_000
        all_configurations["SLIP_SIZE"] = 20
        all_configurations["MIN_BONUS_ODD"] = 1.3

        return all_configurations[configuration_name]
    }

    get_percentages=(match_count)=> {
        let count = match_count > 20 ? 20 : match_count
        return {
            1: 0.00,
            2: 0.00,
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
        }[count]
    }
}
class MBNS_MW350K_SlpSz50_3_35MCH extends MBNS_MW1M_SlpSz20_3_20MCH {

    get_configurations=(configuration_name)=> {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350000
        all_configurations['NET_PAY_CAP'] = 350000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52000
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.3

        return all_configurations[configuration_name]
    }
}

class MBNS_MW350K_SlpSz50_3_40MCH extends MBNS_MW1M_SlpSz20_3_20MCH {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350000
        all_configurations['NET_PAY_CAP'] = 350000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52000
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]
    }

    get_percentages = (match_count) => {
        let count = match_count > 20 ? 20 : match_count
        return {
            1: 0.00,
            2: 0.00,
            3: 0.05,
            4: 0.08,
            5: 0.09,
            6: 0.10,
            7: 0.15,
            8: 0.20,
            9: 0.25,
            10: 0.30,
            11: 0.35,
            12: 0.40,
            13: 0.45,
            14: 0.50,
            15: 0.55,
            16: 0.60,
            17: 0.65,
            18: 0.70,
            19: 0.75,
            20: 0.80,
            21: 0.85,
            22: 0.90,
            23: 0.95,
            24: 1.00,
            25: 1.10,
            26: 1.30,
            27: 1.50,
            28: 1.70,
            29: 2.00,
            30: 2.10,
            31: 2.30,
            32: 2.50,
            33: 2.70,
            34: 2.90,
            35: 3.10,
            36: 3.20,
            37: 3.40,
            38: 3.60,
            39: 3.80,
            40: 4.00,
        }[count]
    }
}

class MultiBonus10_No_Tax extends MBNS_MW1M_SlpSz20_3_20MCH {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_WIN"] = 500000
        all_configurations["MAX_BONUS"] = 52400
        all_configurations["SLIP_SIZE"] = 30
        all_configurations["MIN_BONUS_ODD"] = 1.4
        all_configurations["TAX_TYPE"] = 'none'

        return all_configurations[configuration_name]
    }

    get_min_bonus_eligble_match_count = () =>{return 3}

    get_max_bonus_eligble_match_count = () =>{return 20}

    get_percentages = (match_count) => {
        let count = match_count > 20 ? 20 : match_count
        return {
            1: 0.00,
            1: 0.00,
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
        }[count]
    }
}

class MultiBonus10_No_Tax2 extends MBNS_MW1M_SlpSz20_3_20MCH {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_WIN"] = 500000
        all_configurations["MAX_BONUS"] = 52400
        all_configurations["SLIP_SIZE"] = 30
        all_configurations["MIN_BONUS_ODD"] = 1.4
        all_configurations["TAX_TYPE"] = 'none'

        return all_configurations[configuration_name]
    }

    get_min_bonus_eligble_match_count = () =>{return 3}

    get_max_bonus_eligble_match_count = () =>{return 20}

    get_percentages = (match_count) => {
        let count = match_count > 20 ? 20 : match_count
        return {
            1: 0.00,
            1: 0.00,
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
        }[count]
    }
}

class MBS_SLP_MW_1M_SZ_35_3_20MCH extends MBNS_MW1M_SlpSz20_3_20MCH {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_WIN"] = 1000000
        all_configurations['NET_PAY_CAP'] = 1000000
        all_configurations["MAX_BONUS"] = 52400
        all_configurations["SLIP_SIZE"] = 35
        all_configurations["MIN_BONUS_ODD"] = 1.3

        return all_configurations[configuration_name]
    }

    get_percentages = (match_count) => {
        let count = match_count > 20 ? 20 : match_count
        return {
            1: 0.00,
            2: 0.00,
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
        }[count]
    }
}


class MBNS_MW1M_SlpSz40_3_20MCH extends MultiBonus10_No_Tax2 {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 1000000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 52000
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.2

        return all_configurations[configuration_name]
    }
}

class MBNS_MW1M_SlpSz50_3_14MCH_NO_VAT extends MBNS_MW1M_SlpSz40_3_20MCH{

 get_configurations=(configuration_name)=>{
    let all_configurations = this.get_all_configurations()
    all_configurations["BET_SLIP_BONUS"] = true
    all_configurations["MAX_WIN"] = 1000000
    all_configurations["MAX_BONUS"] = 52400
    all_configurations["SLIP_SIZE"] = 50
    all_configurations["MIN_BONUS_ODD"] = 1.2
    all_configurations["TAX_TYPE"] = 'none'
    all_configurations["VAT_TAX"] = 0

    return all_configurations[configuration_name]
}

 get_percentages=( match_count)=>{
    let count = match_count > 14 ? 14 : match_count
    return {
        1: 0.00,
        2: 0.00,
        3: 0.03,
        4: 0.04,
        5: 0.05,
        6: 0.06,
        7: 0.16,
        8: 0.20,
        9: 0.24,
        10: 0.34,
        11: 0.38,
        12: 0.45,
        13: 0.58,
        14: 0.7,
    }[count]
}

 get_bonus_value=()=>{
    if (!this.is_odd_bonus_eligible()) return 0

    let percentage = this.get_percentages(this.get_percentage_match_count())
    if (!percentage) return 0

    let win_value = this.get_win_value()
    let max_percentage = this.get_percentages(this.get_max_bonus_eligble_match_count())
    let max_possible_bonus = win_value * max_percentage
    let bonus_value = Math.min(win_value * percentage, max_possible_bonus)

    let max_bonus_limit = this.get_configurations("MAX_BONUS")
    return Math.min(bonus_value, max_bonus_limit)
 }
}


class MBNS_MW1M_50SLP_3_40MCH_NO_VAT extends MBNS_MW1M_SlpSz40_3_20MCH   {

get_configurations=(configuration_name)=>{

    let all_configurations = this.get_all_configurations()
    all_configurations["MIN_BONUS_ODD"] = 1.2
    all_configurations["MAX_BONUS"] = 100000
    all_configurations["BET_SLIP_BONUS"] = true
    all_configurations["SLIP_SIZE"] = 50
    all_configurations["MAX_WIN"] = 1000000
    all_configurations["NET_PAY_CAP"] = 900000
    all_configurations["TAX_TYPE"] = 'none'
    all_configurations["WIN_TAX"] = 0
    

    return all_configurations[configuration_name]
}

 get_percentages=( match_count)=>{
    let count = match_count > 40 ? 40 : match_count
    return {
        1: 0,
        2: 0,
        3: 0.05,
        4: 0.08,
        5: 0.09,
        6: 0.1,
        7: 0.15,
        8: 0.20,
        9: 0.25,
        10: 0.3,
        11: 0.35,
        12: 0.4,
        13: 0.45,
        14: 0.5,
        15: 0.55,
        16: 0.6,
        17: 0.65,
        18: 0.7,
        19: 0.75,
        20: 0.80,
        21: 0.85,
        22: 0.90,
        23: 0.95,
        24: 1,
        25: 1.1,
        26: 1.3,
        27: 1.5,
        28: 1.7,
        29: 2,
        30: 2.1,
        31: 2.3,
        32: 2.5,
        33: 2.7,
        34: 2.9,
        35: 3.1,
        36: 3.2,
        37: 3.4,
        38: 3.6,
        39: 3.8,
        40: 4
    }[count]}
}

class MBNS_100K_BNS_MW350K_SlpSz50_3_18MCH extends MBNS_MW350K_SlpSz30_3_18MCH {

    get_configurations = (configuration_name) => {
        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 350000
        all_configurations['NET_PAY_CAP'] = 350000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_BONUS"] = 100_000
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.3

        return all_configurations[configuration_name]
    }
}

class MultiBonus10_No_Tax4 extends MBNS_MW1M_SlpSz20_3_20MCH {

    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_WIN"] = 500000
        all_configurations["MAX_BONUS"] = 52400
        all_configurations["SLIP_SIZE"] = 35
        all_configurations["MIN_BONUS_ODD"] = 1.2
        all_configurations["TAX_TYPE"] = 'none'
        all_configurations["VAT_TAX"] = 0
        all_configurations["WIN_TAX"] = 0

        return all_configurations[configuration_name]
    }

    get_min_bonus_eligble_match_count = () => 3

    get_max_bonus_eligble_match_count = () => 20

    get_percentages = (match_count) => {
        let count = match_count > 20 ? 20 : match_count
        return {
            1: 0.00,
            2: 0.00,
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
        }[count]
    }
    calculate_tax = () => {

        let win_value = this.get_win_value()
        let tax_value = 0
        console.log('win_value: ',win_value)

        if (this.is_win_taxable(win_value))
            tax_value = this.get_configurations("WIN_TAX") * win_value
        console.log('tax_value:',tax_value)
        return tax_value
    }
    is_odd_bonus_eligible = () => {
        return (
            this.total_odds
            >= this.get_configurations("MIN_BONUS_ODD") ** this.match_count
        )
    }
}

class MBNS75K_MW1M_50SLP_1MILCAP_3_14MMCH extends MultiBonus11_20EVN {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_WIN"] = 1000000
        all_configurations["NET_PAY_CAP"] = 1000000
        all_configurations["MAX_BONUS"] = 75000
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.4

        return all_configurations[configuration_name]
    }


    get_net_pay = () => {
        let net_pay = this.get_win_value() + this.get_bonus_value()
        let winning_tax = this.calculate_tax()

        net_pay = net_pay - winning_tax
        let net_pay_cap = this.get_configurations("NET_PAY_CAP")
        if (net_pay > net_pay_cap) net_pay = net_pay_cap

        return net_pay
    }

    get_percentages = (match_count) => {

        // >= 14
        if (match_count >= 14) return 0.75

        // >= 13, 60
        else if (match_count >= 13) return 0.6

        // >= 12, 50%
        else if (match_count >= 12) return 0.5

        // >= 11, 40%
        else if (match_count >= 11) return 0.4

        // >= 10, 35%
        else if (match_count >= 10) return 0.35

        // >= 9, 30%
        else if (match_count >= 9) return 0.3


        // >= 8, 25%
        else if (match_count >= 8) return 0.25

        // >= 7, 20% 
        else if (match_count >= 7) return 0.2

        // >= 6, 10%
        else if (match_count >= 6) return 0.1

        // >= 5
        else if (match_count >= 5) return 0.05

        // >= 4
        else if (match_count >= 4) return 0.04

        // >= 3
        else if (match_count >= 3) return 0.03

        else return 0
    }
}


// 117
class MBNS_MW300K_SlpSz50_3_40MCH_NO_VAT extends MBNS_MW1M_SlpSz20_3_20MCH {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["MAX_WIN"] = 300000
        all_configurations['NET_PAY_CAP'] = 300000
        all_configurations["MAX_BONUS"] = 200000
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MIN_BONUS_ODD"] = 1.3


        return all_configurations[configuration_name]
    }

    is_odd_bonus_eligible = () => {
        return (
            this.total_odds
            >= this.get_configurations("MIN_BONUS_ODD") ** this.match_count
        )
    }

    get_percentages = (match_count) => {
        let count = match_count > 40 ? 40 : match_count
        return {
            0: 0.00,
            1: 0.00,
            2: 0.00,
            3: 0.05,
            4: 0.08,
            5: 0.10,
            6: 0.12,
            7: 0.18,
            8: 0.25,
            9: 0.30,
            10: 0.35,
            11: 0.40,
            12: 0.45,
            13: 0.50,
            14: 0.55,
            15: 0.60,
            16: 0.65,
            17: 0.70,
            18: 0.80,
            19: 0.90,
            20: 1.00,
            21: 1.10,
            22: 1.30,
            23: 1.50,
            24: 1.70,
            25: 1.90,
            26: 2.10,
            27: 2.30,
            28: 2.50,
            29: 2.70,
            30: 2.90,
            31: 3.10,
            32: 3.30,
            33: 3.50,
            34: 3.70,
            35: 3.90,
            36: 4.10,
            37: 4.30,
            38: 4.50,
            39: 4.75,
            40: 5.00,
        }[count]
    }
}

// 118
class MBNS_MW1M_25SLP_6_38MCH extends MBNS_MW500K_25SLP_6_38MCH{

     get_configurations=(configuration_name)=>{

        let all_configurations = this.get_all_configurations()
        all_configurations['MAX_WIN'] = 1000000
        all_configurations['NET_PAY_CAP'] = 1000000
        all_configurations['SLIP_SIZE'] = 25
        all_configurations['BET_SLIP_BONUS'] = true
        all_configurations['MAX_BONUS'] = 52_400
        all_configurations["MIN_BONUS_ODD"] = 1.01
        return all_configurations[configuration_name]}
    }


    // 119
class MBNS_MW1M_50SLP_3_40MCH_NO_VAT_1 extends MBNS_MW1M_50SLP_3_40MCH_NO_VAT {
    get_configurations = (configuration_name) => {

        let all_configurations = this.get_all_configurations()
        all_configurations["MIN_BONUS_ODD"] = 1.2
        all_configurations["MAX_BONUS"] = 100000
        all_configurations["BET_SLIP_BONUS"] = true
        all_configurations["SLIP_SIZE"] = 50
        all_configurations["MAX_WIN"] = 900000
        all_configurations["NET_PAY_CAP"] = 900000
        all_configurations["TAX_TYPE"] = 'none'
        all_configurations["WIN_TAX"] = 0

        return all_configurations[configuration_name]
    }

    is_odd_bonus_eligible = () => {
        return (
            this.total_odds
            >= this.get_configurations("MIN_BONUS_ODD") ** this.match_count
        )
    }
}
export default {

    SlipComp: SlipComp,
    NoTaxSlipCompMw500K: NoTaxSlipCompMw500K,
    NoTaxSlipCompMw500K_35SLPSZ: NoTaxSlipCompMw500K_35SLPSZ,
    NoTaxSlipCompMw500K_50SLPSZ: NoTaxSlipCompMw500K_50SLPSZ,
    NoTaxSlipCompMw1M: NoTaxSlipCompMw1M,
    NoTaxSlipCompMw2M: NoTaxSlipCompMw2M,
    NoTaxSlipCompMw10M: NoTaxSlipCompMw10M,
    NoTaxSlipCompMw15M: NoTaxSlipCompMw15M,
    MulaSlipComp: MulaSlipComp,
    AfroSlipCompNoBonusMW50KSlipSize30: AfroSlipCompNoBonusMW50KSlipSize30,
    MulaSlipCompMW5K: MulaSlipCompMW5K,
    MulaSlipComp10PVatMW5K: MulaSlipComp10PVatMW5K,
    MulaSlipComp10PVatMW10K: MulaSlipComp10PVatMW10K,
    MulaSlipComp10PVatMW30K: MulaSlipComp10PVatMW30K,
    LesothoMulaSlipCompMW5K: LesothoMulaSlipCompMW5K,
    LesothoMulaSlipCompMW10K: LesothoMulaSlipCompMW10K,
    AfroSlipCompNoBonusMW100KSlipSize50: AfroSlipCompNoBonusMW100KSlipSize50,
    AfroSlipCompNoBonusMW350KSlipSize50: AfroSlipCompNoBonusMW350KSlipSize50,
    AfroSlipCompNoBonusMW600KSlipSize50: AfroSlipCompNoBonusMW600KSlipSize50,
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
    MultiBonus6Mw1MilSlpSz20: MultiBonus6Mw1MilSlpSz20,
    MultiBonus6Mw1MilSlpSz50: MultiBonus6Mw1MilSlpSz50,
    MultiBonus7: MultiBonus7,
    MultiBonus8: MultiBonus8,
    MultiBonus8Mw350K_VAT: MultiBonus8Mw350K_VAT,
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
    MultiBonus11_20EVN: MultiBonus11_20EVN,
    MBNS11_50SLPSZ_1Mil: MBNS11_50SLPSZ_1Mil,
    MBNS11_50SLPSZ_1Mil_850K_CAP: MBNS11_50SLPSZ_1Mil_850K_CAP,
    MultiBonus12: MultiBonus12,
    MultiBonus12_1Mil: MultiBonus12_1Mil,
    MBNS_MW1M_50SLP_1MILCAP_3_14MMCH: MBNS_MW1M_50SLP_1MILCAP_3_14MMCH,
    MBNS_MW500K_50SLP_3_24MCH: MBNS_MW500K_50SLP_3_24MCH,
    MBNS_MW500K_50SLP_3_40MCH: MBNS_MW500K_50SLP_3_40MCH,
    MBNS_MW350K_50SLP_4_23MCH: MBNS_MW350K_50SLP_4_23MCH,
    MBNS_MW350K_50SLP_7_35MCH: MBNS_MW350K_50SLP_7_35MCH,
    MBNS_MW500K_50SLP_7_35MCH: MBNS_MW500K_50SLP_7_35MCH,
    MBNS_MW1M_50SLP_6_38MCH_10P_VAT_WIN: MBNS_MW1M_50SLP_6_38MCH_10P_VAT_WIN,
    MBNS_MW1M_50SLP_6_38MCH_NO_TAX: MBNS_MW1M_50SLP_6_38MCH_NO_TAX,
    MBNS_MW1M_50SLP_3_40MCH_10P_VAT_WIN: MBNS_MW1M_50SLP_3_40MCH_10P_VAT_WIN,
    MBNS_MW1M_50SLP_3_40MCH_NO_TAX: MBNS_MW1M_50SLP_3_40MCH_NO_TAX,
    MBNS_MW350K_40SLP_4_36MCH: MBNS_MW350K_40SLP_4_36MCH,
    MBNS_MW1M_50SLP_3_14MCH: MBNS_MW1M_50SLP_3_14MCH,
    MBNS_MW300K_50SLP_7_35MCH: MBNS_MW300K_50SLP_7_35MCH,
    MBNS_MW300K_50SLP_3_20MCH: MBNS_MW300K_50SLP_3_20MCH,
    MBNS_MW300K_50SLP_3_38MCH: MBNS_MW300K_50SLP_3_38MCH,
    MBNS_MW500K_25SLP: MBNS_MW500K_25SLP,
    MBNS_MW500K_25SLP_6_38MCH: MBNS_MW500K_25SLP_6_38MCH,
    MBNS_MW350K_50SLP_6_38MCH: MBNS_MW350K_50SLP_6_38MCH,
    MBNS_MW350K_40SLP: MBNS_MW350K_40SLP,
    MultiBonus11_MW350K_SLP40: MultiBonus11_MW350K_SLP40,
    MBNS_MW350K_SlpSz35_3_20MCH: MBNS_MW350K_SlpSz35_3_20MCH,
    NoTaxSlipCompMw250MSlpSz60: NoTaxSlipCompMw250MSlpSz60,
    MBNS_MW300K_SlpSz35_3_20MCH: MBNS_MW300K_SlpSz35_3_20MCH,
    MBNS_MW350K_SlpSz30_3_18MCH: MBNS_MW350K_SlpSz30_3_18MCH,
    MBNS_MW350K_55SLP_6_38MCH: MBNS_MW350K_55SLP_6_38MCH,
    MBNS_MW350K_SlpSz35_3_40MCH: MBNS_MW350K_SlpSz35_3_40MCH,
    MultiBonus10_No_Tax: MultiBonus10_No_Tax,
    MBNS_MW350K_SlpSz50_3_18MCH: MBNS_MW350K_SlpSz50_3_18MCH,
    MBNS_MW1M_SlpSz35_3_40MCH: MBNS_MW1M_SlpSz35_3_40MCH,
    MW350_SlpSz40: MW350_SlpSz40,
    MBNS_MW500K_SlpSz40_3_14MCH: MBNS_MW500K_SlpSz40_3_14MCH,
    MBNS_MW500K_SlpSz35_3_20MCH: MBNS_MW500K_SlpSz35_3_20MCH,
    MBNS_MW350K_SlpSz40_3_14MCH: MBNS_MW350K_SlpSz40_3_14MCH,
    MBNS1_MW1M_SlpSz50_3_50MCH: MBNS1_MW1M_SlpSz50_3_50MCH,
    MultiBonusMw1MilSlpSz50: MultiBonusMw1MilSlpSz50,
    MBNS2_MW1M_SlpSz50_3_50MCH: MBNS2_MW1M_SlpSz50_3_50MCH,
    MBNS3_MW1M_SlpSz50_3_50MCH: MBNS3_MW1M_SlpSz50_3_50MCH,
    MBNS_MW1M_SlpSz20_3_20MCH: MBNS_MW1M_SlpSz20_3_20MCH,
    MBNS_MW350K_SlpSz50_3_35MCH: MBNS_MW350K_SlpSz50_3_35MCH,
    MBNS_MW350K_SlpSz50_3_40MCH:MBNS_MW350K_SlpSz50_3_40MCH,
    MultiBonus10_No_Tax2:MultiBonus10_No_Tax2,
    MBS_SLP_MW_1M_SZ_35_3_20MCH:MBS_SLP_MW_1M_SZ_35_3_20MCH,
    MBNS_MW1M_50SLP_3_40MCH_NO_VAT:MBNS_MW1M_50SLP_3_40MCH_NO_VAT,
    MBNS_MW1M_SlpSz50_3_14MCH_NO_VAT:MBNS_MW1M_SlpSz50_3_14MCH_NO_VAT,
    MBNS_100K_BNS_MW350K_SlpSz50_3_18MCH:MBNS_100K_BNS_MW350K_SlpSz50_3_18MCH,
    MultiBonus10_No_Tax4:MultiBonus10_No_Tax4,
    MBNS75K_MW1M_50SLP_1MILCAP_3_14MMCH:MBNS75K_MW1M_50SLP_1MILCAP_3_14MMCH,
    MBNS_MW300K_SlpSz50_3_40MCH_NO_VAT:MBNS_MW300K_SlpSz50_3_40MCH_NO_VAT,
    MBNS_MW1M_25SLP_6_38MCH:MBNS_MW1M_25SLP_6_38MCH,
    MBNS_MW1M_50SLP_3_40MCH_NO_VAT_1:MBNS_MW1M_50SLP_3_40MCH_NO_VAT_1
}
