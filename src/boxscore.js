import { parse } from 'node-html-parser';
import { forEach, keys, length, prop } from 'ramda';

const makeFetch = (callback) => {

    fetch(`https://mlb23.theshow.com/games/941899?username=ritti34`)
    .then(x => x.text())
    .then(x => callback(x))
    .catch(e => console.log("e",e))
}

const pageQueryCallback = htmlText => {

//    console.log("pages",pages.substring(0,10))
    const root = parse(htmlText)
    const tables = root.querySelectorAll('table');


    const boxScoreTable = tables[0];
    const innings = boxScoreTable.querySelectorAll("tr")[0];
    const away = boxScoreTable.querySelectorAll("tr")[1];
    const home = boxScoreTable.querySelectorAll("tr")[2];
    const awayCells = away.querySelectorAll("td");
    console.log(away.childNodes[0])
    forEach(x => x.rawTagName == "td" ? console.log("r",x.rawText) : console.log("k",x))(awayCells)

 } 

const root = parse('<ul id="list"><li>Hello World</li></ul>');

console.log(root.firstChild.structure);

makeFetch(pageQueryCallback);