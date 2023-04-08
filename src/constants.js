import { concat } from "ramda"

export const EXCHANGE_RATES = [
    {
        "rank": 48,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 49,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 50,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 51,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 52,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 53,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 54,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 55,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 56,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 57,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 58,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 59,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 60,
        "rate": 100,
        "min_bid": 5,
    },
    {
        "rank": 61,
        "rate": 106,
        "min_bid": 5,
    },
    {
        "rank": 62,
        "rate": 128,
        "min_bid": 5,
    },
    {
        "rank": 63,
        "rate": 156,
        "min_bid": 5,
    },
    {
        "rank": 64,
        "rate": 191,
        "min_bid": 5,
    },
    { // bronze
        "rank": 65,
        "rate": 233,
        "min_bid": 25,
    },
    {
        "rank": 66,
        "rate": 285,
        "min_bid": 25,
    },
    {
        "rank": 67,
        "rate": 349,
        "min_bid": 25,
    },
    {
        "rank": 68,
        "rate": 429,
        "min_bid": 25,
    },
    {
        "rank": 69,
        "rate": 528,
        "min_bid": 25,
    },
    {
        "rank": 70,
        "rate": 651,
        "min_bid": 25,
    },
    {
        "rank": 71,
        "rate": 805,
        "min_bid": 25,
    },
    {
        "rank": 72,
        "rate": 997,
        "min_bid": 25,
    },
    {
        "rank": 73,
        "rate": 1238,
        "min_bid": 25,
    },
    {
        "rank": 74,
        "rate": 1541,
        "min_bid": 25,
    },
    {
        "rank": 75,
        "rate": 1922,
        "min_bid": 100,
    },
    {
        "rank": 76,
        "rate": 2404,
        "min_bid": 100,
    },
    {
        "rank": 77,
        "rate": 3013,
        "min_bid": 100,
    },
    {
        "rank": 78,
        "rate": 3788,
        "min_bid": 100,
    },
    {
        "rank": 79,
        "rate": 4775,
        "min_bid": 150,
    },
    {
        "rank": 80,
        "rate": 6037,
        "min_bid": 400,
    },
    {
        "rank": 81,
        "rate": 7655,
        "min_bid": 600,
    },
    {
        "rank": 82,
        "rate": 9737,
        "min_bid": 900,
    },
    {
        "rank": 83,
        "rate": 12425,
        "min_bid": 1200,
    },
    {
        "rank": 84,
        "rate": 15909,
        "min_bid": 1500,
    },
    {
        "rank": 85,
        "rate": 20442,
        "min_bid": 2500,
    },
    {
        "rank": 86,
        "rate": 26363,
        "min_bid": 3500,
    },
    {
        "rank": 87,
        "rate": 34130,
        "min_bid": 4500,
    },
    {
        "rank": 88,
        "rate": 44363,
        "min_bid": 5500,
    },
    {
        "rank": 89,
        "rate": 57909,
        "min_bid": 7000,
    },
    {
        "rank": 90,
        "rate": 75926,
        "min_bid": 9000
    },
    {
        "rank": 91,
        "rate": 100000,
        "min_bid": 10000
    },
    {
        "rank": 92,
        "rate": 100000, 
        "min_bid": 10000
    },
    {
        "rank": 93,
        "rate": 100000, 
        "min_bid": 10000
    },
    {
        "rank": 94,
        "rate": 100000, 
        "min_bid": 10000
    },
    {
        "rank": 95,
        "rate": 100000, 
        "min_bid": 10000
    },
    {
        "rank": 96,
        "rate": 100000, 
        "min_bid": 10000
    },
    {
        "rank": 97,
        "rate": 100000, 
        "min_bid": 10000
    },
    {
        "rank": 98,
        "rate": 100000,
        "min_bid": 10000
    },
    {
        "rank": 99,
        "rate": 100000,
        "min_bid": 10000
    },
]


export const NL_EAST_TEAMS = [
    "NYM",
    "PHI",
    "WAS",
    "MIA",
    "ATL",
]
export const NL_CENTRAL_TEAMS = [
    "MIL",
    "CHC",
    "STL",
    "MIL",
    "PIT"
]
export const NL_WEST_TEAMS = [
    "COL",
    "SF",
    "SD",
    "LAD",
    "ARI"
]

export const AL_EAST_TEAMS = [
    "NYY",
    "BOS",
    "TOR",
    "TB",
    "BAL"
]
export const AL_CENTRAL_TEAMS = [
    "MIN",
    "CWS",
    "DET",
    "KC",
    "CLE"
]
export const AL_WEST_TEAMS = [
    "LAA",
    "HOU",
    "TEX",
    "OAK",
    "SEA"
]

export const EAST_TEAMS = concat(NL_EAST_TEAMS,AL_EAST_TEAMS)
export const CENTRAL_TEAMS = concat(NL_CENTRAL_TEAMS,AL_CENTRAL_TEAMS)
export const WEST_TEAMS = concat(NL_WEST_TEAMS,AL_WEST_TEAMS)