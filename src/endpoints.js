require('dotenv').config();

const host = process.env.HOST;

module.exports = {
    seasonSchedule: `${host}/season-schedule`,
    driverStandings: `${host}/driver-standings`,
    constructorStandings: `${host}/constructor-standings`
}