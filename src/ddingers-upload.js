import { UPLOAD_TOKEN,UPLOAD_URL } from "./config.js"
import fs from 'fs';
import { has, replace, map, prop, defaultTo, find, reject, assoc} from "ramda";
import { TYPE_FILENAMES, DEFAULT_FETCH_TYPE_FROM_ARGS } from './ddingers-fetch.js';
import { logger } from './mylogger.js';
import esMain from 'es-main';
import { EXCHANGE_RATES } from './constants.js';

const getQuickSellPriceForOverall = ovr => {
    const data = find(x => x.rank == ovr)(EXCHANGE_RATES)
    return data ? data.min_bid : 5
}
const cleanListings = map(x => ({
    uuid: x.item.uuid,
    buy: x.best_buy_price == 0 ? getQuickSellPriceForOverall(x.item.ovr) : x.best_buy_price,
    sell: x.best_sell_price
}))

const cleanItems = map(x => ({ 
uuid: x.uuid,
type: x.type,
name: replace("'","''",x.name),
rarity: x.rarity,
team: x.team_short_name,
ovr: x.ovr,
series: x.series,
series_year: x.series_year,
pos: x.display_position,
secondary_pos: x.display_secondary_positions,
jersey_number: x.jersey_number,
age: x.age,
bat_hand: x.bat_hand,
throw_hand: x.throw_hand,
height: replace("'","''",x.height),
weight: parseInt(x.weight),
born: x.born,
is_hitter: x.is_hitter ? 1 : 0,
stamina: x.stamina,
pitching_clutch: x.pitching_clutch,
hits_per_bf: x.hits_per_bf,
k_per_bf: x.k_per_bf,
bb_per_bf: x.bb_per_bf,
hr_per_bf: x.hr_per_bf,
pitch_velocity: x.pitch_velocity,
pitch_control: x.pitch_control,
pitch_movement: x.pitch_movement,
contact_left: x.contact_left,
contact_right: x.contact_right,
power_left: x.power_left,
power_right: x.power_right,
plate_vision: x.plate_vision,
plate_discipline: x.plate_discipline,
batting_clutch: x.batting_clutch,
bunting_ability: x.bunting_ability,
drag_bunting_ability: x.drag_bunting_ability,
hitting_durability: x.hitting_durability,
fielding_durability: x.fielding_durability,
fielding_ability: x.fielding_ability,
arm_strength: x.arm_strength,
arm_accuracy: x.arm_accuracy,
reaction_time: x.reaction_time,
blocking: x.blocking,
speed: x.speed,
baserunning_ability: x.baserunning_ability,
baserunning_aggression: x.baserunning_aggression,
is_sellable: x.is_sellable ? 1 : 0,
has_augment: x.has_augment,
augment_text: x.augment_text,
augment_end_date: x.augment_end_date,
has_matchup: x.has_matchup,
stars: x.stars,
trend: x.trend,
new_rank: x.new_rank,
has_rank_change: x.has_rank_change,
event: x.event ? 1 : 0
}))

const TYPE_CLEAN_FUNCTIONS = {
    items: cleanItems,
    listings: cleanListings
}

const TYPE_UPLOAD_URL = {
    items: `${UPLOAD_URL}/items.php`,
    listings: `${UPLOAD_URL}/listing_history.php`
}

function* chunks(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n);
    }
}

const loadData = fetchType => callback => fs.readFile(prop(fetchType,TYPE_FILENAMES),"utf-8",(err,data) => {
    callback(fetchType)(JSON.parse(data));
})

const processData = fetchType => data => {
    const pageSize = 100;

    const runUpload = version => {
        const f = prop(fetchType,TYPE_CLEAN_FUNCTIONS);
        logger.info(`Logging version ${version}`)
        const dataCleansed = map(assoc("version",version))(f(data));

        const chunk = [...chunks(dataCleansed,pageSize)]
        
        const allPromises = map(x => fetch(prop(fetchType,TYPE_UPLOAD_URL),{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `bearer ${UPLOAD_TOKEN}`
            },
            body: JSON.stringify(x)
        }
        ))(chunk)

        // setup logging and performance tracking
        logger.info(`Uploading ${chunk.length} pages of ${fetchType}`)
        const startTime = performance.now();

        // call all the promises
        Promise.all(allPromises)
        .then(x => logger.info("-----UPLOAD COMPLETE-----"))
        .catch(err => {
            logger.error("ALL UPLOAD ERROR",err)
            reject(err)
        })
    }

    fetch(`${UPLOAD_URL}/versions.php`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${UPLOAD_TOKEN}`
        },
        body: JSON.stringify([
            {
                "type": fetchType
            }
        ])
    })
    .then(x => x.json())
    .then(x => runUpload(prop(fetchType,x)))
    .catch(err => reject(err))

    
}

export const upload = fetchType => {
    return new Promise((acc,rej) => {
      loadData(fetchType)(processData)
      acc();
    })
  }
if (esMain(import.meta)) {
    const fetchType = DEFAULT_FETCH_TYPE_FROM_ARGS(process.argv)

    logger.info(`Processing ${fetchType}`)
    loadData(fetchType)(processData);
  }
