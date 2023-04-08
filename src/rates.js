import { assoc, append, assocPath, compose, findIndex, propEq, reduce, map, sortBy, prop, equals, filter } from "ramda";
import fs from 'fs';
import { CENTRAL_TEAMS, EAST_TEAMS, EXCHANGE_RATES, WEST_TEAMS } from "./constants.js";

const loadData = callback => fs.readFile("listings.json","utf-8",(err,data) => {

    callback(JSON.parse(data));
})
loadData(data => {


    // const teams = EAST_TEAMS
    // const teams = CENTRAL_TEAMS 
    const teams = WEST_TEAMS 

    console.log("t",teams)
    const centralData = filter(x => findIndex(equals(x.item.team_short_name))(teams) >= 0)(data)

    console.log("centralData",centralData.length)
    

    const report = reduce((acc, elem) => {
        //
        const ovr = elem.item.ovr;
        const best_buy_price = elem.best_buy_price;
        const best_sell_price = elem.best_sell_price;

        // console.log(`${ovr}-${best_buy_price}-${best_sell_price}`)
        const index = findIndex(propEq("overall",ovr))(acc)
        let foundThisRank = [];
        if(index >= 0) 
            foundThisRank = [acc[index]]

        if(foundThisRank.length == 1) {
            let bbp_name = foundThisRank[0].bbp_name
            let bbp = foundThisRank[0].best_buy_price
            let bsp_name = foundThisRank[0].bsp_name
            let bsp = foundThisRank[0].best_sell_price
            if(foundThisRank[0].best_buy_price > best_buy_price) {
                bbp_name = elem.listing_name;
                bbp = elem.best_buy_price;
            }

            if(foundThisRank[0].best_sell_price < best_sell_price) {
                bsp_name = elem.listing_name;
                bsp = elem.best_sell_price;
            }

            return compose(
                assocPath([index,"best_buy_price"],bbp),
                assocPath([index,"bbp_name"],bbp_name),
                assocPath([index,"bsp_name"],bsp_name),
                assocPath([index,"best_sell_price"],bsp)
            )(acc);
                
            

        }
        else {
            return append({bsp_name: elem.listing_name, bbp_name: elem.listing_name, overall: ovr, best_buy_price: best_buy_price, best_sell_price: best_sell_price})(acc)
        }

    }, [])(centralData)


    const getExchangeRatesForRank = rank => {
        const index = findIndex(x => x.rank == rank)(EXCHANGE_RATES)
        return ({index, details: EXCHANGE_RATES[index]})
    }
    // Fix any zeros
    const reportWithMins = map(x => {
        const erDetails = getExchangeRatesForRank(x.overall);

        const newX = x.best_buy_price < erDetails.details.min_bid ? 
                assoc("best_buy_price",erDetails.details.min_bid)(x) :
                x;

        const rate = erDetails.details.rate /newX.best_buy_price 

        return compose(assoc("rate",rate),assoc("exchange_points",erDetails.details.rate))(newX)
    })(report)


    const sortByExchangeRate = sortBy(prop("rate"))


   console.log(sortByExchangeRate(reportWithMins))
})