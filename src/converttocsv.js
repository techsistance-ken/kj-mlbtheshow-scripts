import fs from 'fs'
import os from 'os'
import { compose, is, identity, filter, length, prop, split, map, assoc, sort, sortBy, reverse, pick, slice, keys, join, type, ifElse, assocPath, path, without, reduce, mergeLeft, range, flatten, concat, max, insert, forEach, values, replace, isNil } from 'ramda'
import { Parser } from '@json2csv/plainjs';


const loadData = callback => fs.readFile("items.json","utf-8",(err,data) => {

    callback(JSON.parse(data));
})

const col_conversions = {
    name: "Name",
    team: "Team",
    team_short_name: "Tm Abbr",
    ovr: "Ovr",
    series: "Series",
    series_year: "Series Year",
    display_position: "Pos",
    display_secondary_positions: "2nd Pos",
    jersey_number: "Jersey Number",
    age: "Age",
    weight: "Weight",
    height: "Height",
    bat_hand: "Bats",
    throw_hand: "Throws",
    born: "Born",
    is_hitter: "Hitter",
    stamina: "Stamina",
    pitching_clutch: "P Clutch",
    hits_per_bf: "Hits/9",
    k_per_bf: "Ks/9",
    bb_per_bf: "BBs/9",
    hr_per_bf: "HRs/9",
    pitch_velocity: "P Velo",
    pitch_control: "P Control",
    pitch_movement: "P Break",
    contact_left: "Con L",
    contact_right: "Con R",
    power_left: "Pwr L",
    power_right: "Pwr R",
    plate_vision: "Vision",
    plate_discipline: "Discipl",
    batting_clutch: "Clutch",
    bunting_ability: "Bunt",
    drag_bunting_ability: "Drag Bunt",
    hitting_durability: "H Durability",
    fielding_durability: "F Durability",
    fielding_ability: "Fielding",
    arm_strength: "Arm Str",
    arm_accuracy: "Arm Acc",
    reaction_time: "Reaction",
    blocking: "Blocking",
    speed: "Speed",
    baserunning_ability: "Base Run",
    baserunning_aggression: "Base Aggression",
    pitches: [{
        props: [
            "name",
            "speed",
            "control",
            "movement"
        ],
        len: 5,
        prefix: "pitch"
    }],
    // quirks: [],
    is_sellable: "Sellable"


}

const convertToCsv = cols => player => {
    const col_names = keys(cols);
    let data = {}
    const flds1 = map(col => {


        const col_val = prop(col)(cols)
        const valRaw = prop(col)(player)
        const val = type(valRaw) == "String" ? valRaw.replace('"','') : valRaw


        let col_name = col;
        let col_fun = identity;
        if(type(col_val) == "Object") {

            col_name = col_val.col_name
            col_fun = col_val.f
        }
        else if(is(Array,col_val)) {
            return null;
            
        }

        return assoc(col,col_fun(val))(data);

    })(col_names)

    const flds2 = without([null])(flds1)

    const colsWithArrays = filter(is(Array))(cols)

    const processArr = player => col_name => {
        const my_col_arr = path([col_name,0],cols);
        const val_arr = prop(col_name,player)
        const my_props = prop("props",my_col_arr)
        const my_prefix = prop("prefix",my_col_arr)
        const my_len = prop("len",my_col_arr)

        const arr_final = map(index => {
            return map(prp => {
                const val_arr_item = prop(index,val_arr)
                const col_name = `${my_prefix}_${index+1}_${prp}`;
                if(!val_arr_item) return assoc(col_name,"")({})

                const val = prop(prp,val_arr_item)
                const c = assoc(col_name,val)({})
                return c
            })(my_props)})(range(0,my_len))


        return flatten(arr_final)
        
    }

    const flds3 = map(processArr(player))(keys(colsWithArrays))
    const flds4 = reduce(concat,[])(flds3)
    const flds5 = concat(flds4,flds2)
    const entry = reduce(mergeLeft,{},flds5) 

    return entry
}
loadData(data => {


    const max99 = filter(x=>x.ovr==99)(data)
    const max99_sox = filter(x=>x.team=="White Sox")(max99)

    // console.log(map(x=>({
    //     uuid: x.uuid,
    //     name: x.name,
    //     team: x.team,
    //     series: x.series
    // }))(max99_sox))

    const arr = map(x=>length(prop("quirks",x)))(data)
    const max_quirks=reduce(max,0)(arr)
    const cols2 = assoc("quirks",[{
        props: ["name","description"],
        len: max_quirks,
        prefix: "Qrk",
    }])(col_conversions)
    const csvArr = map(convertToCsv(cols2))(data);
    //   console.log(keys(data[0]))

    const csvKeys = keys(csvArr[0]);
    
    const csvHeaders = reduce((acc,elem) => assoc(elem,elem)(acc),{})(csvKeys)

    const csvArrWithHeaders = insert(0,csvHeaders)(csvArr);


    const writeRow = index => callback => arr => {
        const rowData = arr[index];
        const row =
        fs.writeFile('log.csv', `${row}${os.EOL}`, function (err) {
            if (err) {
            // append failed
            } else {
                callback(index+1)
            // done
            }
        })

    }

    const lines = map(elem => `${join(",")(map(x=>`"${x}"`)(values(Object.assign(col_conversions, elem))))}`)(csvArrWithHeaders)


     fs.writeFile('log.csv', join(os.EOL)(lines), function (err) {
         if (err) {
         // append failed
         } else {
             console.log("DONE")
         // done
         }
    })
    
    console.log("keys",keys(data[0]))
    }


)