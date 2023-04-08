/**
 * 
 *
 * (C) 2023 Ken Nance
 */

import { map, compose, range, flatten, prop, length, slice, defaultTo, has, isNil, identity} from "ramda";
import fs from 'fs';
import { logger } from "./mylogger.js";
import { performance } from "perf_hooks";
import esMain from 'es-main';


const TYPE_URLS = {
  items: "https://mlb23.theshow.com/apis/items.json?type=player&page=",
  listings: "https://mlb23.theshow.com/apis/listings.json?type=mlb_card&page="
}
export const TYPE_FILENAMES = {
  items: "items.json",
  listings: "listings.json"
}
export const DEFAULT_FETCH_TYPE_FROM_ARGS = compose(
  x => has(x,TYPE_FILENAMES) ? x : "listings",
  x => defaultTo("listings",prop(2,x))
);


/**
 * Starts the fetch process by making a call to an empty page to get just 
 * The page data (how many pages).  If the call completes, it will
 * call back the accept function with the total number of pages.  If the
 * call fails it will call the reject function with the errors
 *
 * @param {string} fetchType The fetch type found in TYPE_URLS
 * @param {number} page The page number, 999 is used to only return page data.
 * @param {Function} accept A function to call once this returns successfully
 * @param {Function} reject A function to call once this returns with failure 
 */
const startFetch = (fetchType, page,accept,reject) => {

    // Get the url from the constants for this fetch type
    const url = `${prop(fetchType,TYPE_URLS)}${page}`
    
    if(isNil(url)) {
      reject("No URL found for fetch type")
      return;
    }

    logger.info(`Fetching from URL: ${url}`)

    fetch(url)
    .then(x => x.json())
    .then(x => accept(x.total_pages))
    .catch(err => {
      logger.error("PAGE FETCH ERROR",err)
      reject(err)
    })
}

const run = fetchType => (accept,reject) => {

   logger.info("-------- NEW FETCH STARTING ---------")

  /**
  * The accept callback, if we get total pages back, we then build a query to call
  * all the pages in a Promise.all
  *
  * @param {string} fetchType The fetch type found in TYPE_URLS
  * @param {number} pages The page number, 999 is used to only return page data.
  */ 
   const pageQueryCallback = fetchType => pages => {

      // Creates an array of promises to fetch every page.
      const allPromises = map(x => fetch(`${prop(fetchType,TYPE_URLS)}${x}`))(range(1,pages))

      // setup logging and performance tracking
      logger.info(`Fetching ${pages} pages of ${fetchType}`)
      const startTime = performance.now();

      // call all the promises
      Promise.all(allPromises)
        .then(x => Promise.all(map(y=>y.json())(x)))
        .then(x => flatten(map(prop(fetchType))(x)))
        .then(x => {
            console.log(`len ${fetchType}:`,length(x));
            const endTime = performance.now();
            logger.info(`Fetch Took ${endTime-startTime}`)
            fs.writeFile(prop(fetchType,TYPE_FILENAMES),JSON.stringify(x), err => {
                if (err) logger.error("WRITE FILE ERROR",err)
                accept();
            })
        })
        .catch(err => {
          logger.error("ALL FETCH ERROR",err)
          reject(err)
        })
   } 



   // get the total number of pages
   startFetch(fetchType, 999,pageQueryCallback(fetchType), reject);
}

export const fetchAndCreateFile = fetchType => {
  return new Promise((acc,rej) => {
    run(fetchType)(acc,rej)
  })
}

if (esMain(import.meta)) {
  const fetchType = DEFAULT_FETCH_TYPE_FROM_ARGS(process.argv)
  logger.info(`Fetching ${fetchType}`)
  run(fetchType)(() => logger.info("-------- FETCH COMPLETED SUCCESSFULLY ---------"),err => console.log("e",err));
}