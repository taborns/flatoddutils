import slipcomp from "./slipcomputer.js";

/* 
    given the slip computer name and all the parameters required 
    to instantiate a slip computer, getSlipComputer returns a slip computer
    object
*/

const getSlipComputer = ( 
    slip_computer_name, placedbet, total_odds, match_count
) => {
    return new slipcomp[slip_computer_name](
        placedbet, total_odds, match_count
    )
}

let exports = {}

exports.getSlipComputer = getSlipComputer
  