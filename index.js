import slipcomp from "./slipcomputer.js";

/* 
    given the slip computer name and all the parameters required 
    to instantiate a slip computer, getSlipComputer returns a slip computer
    object
*/

const getSlipComputer = (
    slip_computer_name,
    placedbet,
    total_odds,
    match_count,
    min_odd,
    max_odd
) => {

    let class_name = slipcomp[slip_computer_name]
    return new class_name(
        placedbet,
        total_odds,
        match_count,
        min_odd,
        max_odd
    )

}


export default {
    getSlipComputer: getSlipComputer

}
