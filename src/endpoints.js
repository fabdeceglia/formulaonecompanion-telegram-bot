//todo: read the host from env

const host = 'https://f1beplayground.now.sh';

module.exports = {
    seasonSchedule: `${host}/season-schedule`,
    driverStandings: `${host}/driver-standings`,
    constructorStandings: `${host}/constructor-standings`
}