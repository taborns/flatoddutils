import slipcomp from './index.js'

function bonusCalculator(className){
    return  slipcomp.getSlipComputer(
        className,
        10,      // Example bet amount
        9324.37,      // Example total odds
        8,      // Example match count
    )
}

function testAllClasses(){
    const AllAvailableClasses=[
        'NoTaxSlipCompMw500K',
    'NoTaxSlipCompMw500K_35SLPSZ',
    'NoTaxSlipCompMw500K_50SLPSZ',
    'NoTaxSlipCompMw1M',
    'NoTaxSlipCompMw2M',
    'NoTaxSlipCompMw10M',
    'NoTaxSlipCompMw15M',
    'MulaSlipComp',
    'AfroSlipCompNoBonusMW50KSlipSize30',
    'MulaSlipCompMW5K',
    'MulaSlipComp10PVatMW5K',
    'MulaSlipComp10PVatMW10K',
    'MulaSlipComp10PVatMW30K',
    'LesothoMulaSlipCompMW5K',
    'LesothoMulaSlipCompMW10K',
    'AfroSlipCompNoBonusMW100KSlipSize50',
    'AfroSlipCompNoBonusMW350KSlipSize50',
    'AfroSlipCompNoBonusMW600KSlipSize50',
    'AfroSlipCompNoBonusMW500KSlipSize50',
    'AfroSlipCompBonusTOTMW50KSlipSize50',
    'AfroSlipCompMW50KSlpSz50BGT100BV10p',
    'AfroSlipCompMW350KSlpSz50BGT20BV10p',
    'AfroSlipCompMW350KSlpSz50BGT20BVAT',
    'AfroSlipCompMW1MKSlpSz50BGT20BVAT',
    'AfroSlipCompMW350KSlpSz50BGT20_1000BV10p',
    'AfroSlipCompMW350WinTaxNoStake',
    'AfroSlipCompNOBnsMW350KRfndNOTLessStake',
    'AfroSlipCompBonusMW350KRfndNOTLessStake',
    'AfroSlipComp2PRCBnsMW350KRFDNOTLTStake',
    'AfroSlipComp10PRCBnsMW350KRFDNOTLTStake',
    'AfroSlipMW150RFNDNOTLTSTKSLSZ50',
    'AfroSlipCompNoBonusMW150KSlipSize50',
    'AfroSlipCompVAT_5PRCBnsMW350KRFNOTLTSTK',
    'AfroSlip10PRCBnsMW150RFNDNOTLTSTKSLSZ50',
    'AfroSlipComp10PRCBnsMW1MRFDNOTLTStake',
    'AfroSlipCompMW350_BNSGT1000_8NOTLTSTK',
    'AfroSlipCompMW350_BNSGT1000NOTLTSTK',
    'AfroSlipCompMW350_BNSGT1000',
    'AfroSlipComp10PRCBnsGT1000MW1M',
    'AfroSlipComp10PRCBnsMW1M',
    'AfroSlipCompMW1M_BNSGT1000',
    'MultiBonusMaxBonus100K',
    'MultiBonusMaxBns100KStakeWinTaxed',
    'MultiBonusMaxBns100KStakeWTaxdSlpSz35',
    'MultiBonusMaxBnsWinTaxBonus',
    'MultiBonusMaxVATWinTaxBonus',
    'MultiBonusMaxVATWinTaxBonus2',
    'MultiBonus2',
    'MultiBonus3',
    'MultiBonus4',
    'MultiBonus5',
    'MultiBonus6',
    'MultiBonus6SlpSz40',
    'MultiBonus6Mw500SlpSz50',
    'MultiBonus6Mw1MilSlpSz20',
    'MultiBonus6Mw1MilSlpSz50',
    'MultiBonus7',
    'MultiBonus8',
    'MultiBonus8Mw350K_VAT',
    'MultiBonus9',
    'MultiBonus9Mw500KMB5240SlpSz35',
    'MultiBonus9Mw1MilMB5240SlpSz35',
    'MultiBonus10',
    'MultiBonus11',
    'MultiBonus11MW1Mil',
    'WinTaxBonusSlpSz50MW350K',
    'WinTaxBonusSlpSz50MW500K',
    'WinTaxBonusSlpSz50MW1Mil',
    'SC54MW350KSPS50',
    'SC54MW500KSPS50',
    'SC54MW1MilSPS50',
    'LesMultiBonus1',
    'BasicKenyaSlipComputer',
    'BasicMultibetBonusKenyaSlipComputer',
    'BasicKenyaSlipComp12_5ET',
    'BasicMulbetKenyaSlipComp12_5ET',
    'MulbetSlipCompMO12_MW2MNoTax',
    'MulbetSlipCompMO12_MW2MNoTax2',
    'MultiBonus11_20EVN',
    'MBNS11_50SLPSZ_1Mil',
    'MBNS11_50SLPSZ_1Mil_850K_CAP',
    'MultiBonus12',
    'MultiBonus12_1Mil',
    'MBNS_MW1M_50SLP_1MILCAP_3_14MMCH',
    'MBNS_MW500K_50SLP_3_24MCH',
    'MBNS_MW500K_50SLP_3_40MCH',
    'MBNS_MW350K_50SLP_4_23MCH',
    'MBNS_MW350K_50SLP_7_35MCH',
    'MBNS_MW500K_50SLP_7_35MCH',
    'MBNS_MW1M_50SLP_6_38MCH_10P_VAT_WIN',
    'MBNS_MW1M_50SLP_6_38MCH_NO_TAX',
    'MBNS_MW1M_50SLP_3_40MCH_10P_VAT_WIN',
    'MBNS_MW1M_50SLP_3_40MCH_NO_TAX',
    'MBNS_MW350K_40SLP_4_36MCH',
    'MBNS_MW1M_50SLP_3_14MCH',
    'MBNS_MW300K_50SLP_7_35MCH',
    'MBNS_MW300K_50SLP_3_20MCH',
    'MBNS_MW300K_50SLP_3_38MCH',
    'MBNS_MW500K_25SLP',
    'MBNS_MW500K_25SLP_6_38MCH',
    'MBNS_MW350K_50SLP_6_38MCH',
    'MBNS_MW350K_40SLP',
    'MultiBonus11_MW350K_SLP40',
    'MBNS_MW350K_SlpSz35_3_20MCH',
    'NoTaxSlipCompMw250MSlpSz60',
    'MBNS_MW300K_SlpSz35_3_20MCH',
    'MBNS_MW350K_SlpSz30_3_18MCH',
    'MBNS_MW350K_55SLP_6_38MCH',
    'MBNS_MW350K_SlpSz35_3_40MCH',
    'MultiBonus10_No_Tax',
    'MBNS_MW350K_SlpSz50_3_18MCH',
    'MBNS_MW1M_SlpSz35_3_40MCH',
    'MW350_SlpSz40',
    'MBNS_MW500K_SlpSz40_3_14MCH',
    'MBNS_MW500K_SlpSz35_3_20MCH',
    'MBNS_MW350K_SlpSz40_3_14MCH',
    'MBNS1_MW1M_SlpSz50_3_50MCH',
    'MultiBonusMw1MilSlpSz50',
    'MBNS2_MW1M_SlpSz50_3_50MCH',
    'MBNS3_MW1M_SlpSz50_3_50MCH',
    'MBNS_MW1M_SlpSz20_3_20MCH',
    'MBNS_MW350K_SlpSz50_3_35MCH',
    'MBNS_MW350K_SlpSz50_3_40MCH',
    'MultiBonus10_No_Tax2',
    'MBS_SLP_MW_1M_SZ_35_3_20MCH',
    'MBNS_MW1M_50SLP_3_40MCH_NO_VAT',
    'MBNS_MW1M_SlpSz50_3_14MCH_NO_VAT',
    'MBNS_100K_BNS_MW350K_SlpSz50_3_18MCH',
    'MultiBonus10_No_Tax4',
    'MBNS75K_MW1M_50SLP_1MILCAP_3_14MMCH',
    'MBNS_MW300K_SlpSz50_3_40MCH_NO_VAT',
    'MBNS_MW1M_25SLP_6_38MCH',
    'MBNS_MW1M_50SLP_3_40MCH_NO_VAT_1',
    ]
    
    let errorCount=0
    AllAvailableClasses.forEach(className => {
        try {
            main(className)
            console.log('-------------------------------------------------')
        } catch (error) {
            errorCount++
            console.log(`-----------------------------${className}-------------------------`,errorCount, error)
        }
    })
}

function main(className){


    const bonus_calculator = bonusCalculator(
        className
    )
    //  Call the method to get the bonus percentage for the match count
    let percentage = bonus_calculator.get_percentages(bonus_calculator.match_count)
    let stake = bonus_calculator.get_stake()
    let vat_tax = bonus_calculator.get_initial_tax()
    let get_bonus_value = bonus_calculator.get_bonus_value()
    let calculate_tax = bonus_calculator.calculate_tax()
    let max_bonus = bonus_calculator.get_configurations("MAX_BONUS")
    let get_net_pay = bonus_calculator.get_net_pay()
    let note = bonus_calculator.get_note()
    let eligible = bonus_calculator.is_odd_bonus_eligible()
    let pct_match_count = bonus_calculator.get_percentage_match_count()
    let get_win_value = bonus_calculator.get_win_value()
    let max_bonus_eligble_match_count = bonus_calculator.get_max_bonus_eligble_match_count()
    let min_bonus_eligble_match_count = bonus_calculator.get_min_bonus_eligble_match_count()
    // let total_odd_match_count = bonus_calculator.get_total_odd_match_count()
    // get_win_tax_bonus = bonus_calculator.get_win_tax_bonus()
    let is_win_taxable = bonus_calculator.is_win_taxable()
    
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
    console.log(`isWinTaxable: ${is_win_taxable}`)
    // console.log(`total_odd_match_count: ${total_odd_match_count}`)

}





main('MBNS_MW1M_SIpSz50_MXBNS_100K')
// testAllClasses()