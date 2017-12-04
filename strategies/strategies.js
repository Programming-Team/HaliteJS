const constants = require('../hlt/Constants');
const Geometry = require('../hlt/Geometry');

/**
 * strategy is a function that accepts the current game map and return a list of next steps to take
 * @param {GameMap} gameMap
 * @returns {string[]} moves that needs to be taken. null values are ignored
 */
function defaultStrategy(gameMap) {
    // Here we build the set of commands to be sent to the Halite engine at the end of the turn
    // one ship - one command
    // in this particular strategy we only give new commands to ships that are not docked
    const moves = gameMap.myShips
        .filter(s => s.isUndocked())
        .map(ship => {
            // find the planets that are free or occupied by you
            const planetsOfInterest = gameMap.planets.filter(p => p.isFree() ||
                (p.isOwnedByMe() && p.hasDockingSpot() ));

            const enemyPlanets = gameMap.planets.filter(p => p.isOwnedByEnemy());
            const sortedEnemyPlanets = [...enemyPlanets].sort((a,b) => Geometry.distance(ship, a) - Geometry.distance(ship, b));
            const chosenEnemyPlanet = sortedEnemyPlanets[0];

            if (planetsOfInterest.length === 0) {
              if (enemyPlanets.length === 0){
                return null;
              }
              else{
                return ship.navigate({
                  target:chosenEnemyPlanet,
                  keepDistanceToTarget: chosenEnemyPlanet.radius,
                  speed: constants.MAX_SPEED,
                  avoidObstacles: true,
                  ignoreShips: false
                });
              }
            }

            // sorting planets based on the distance to the ship
            const sortedPlanets = [...planetsOfInterest].sort((a, b) => Geometry.distance(ship, a) - Geometry.distance(ship, b));
            const chosenPlanet = sortedPlanets[0];


            if (ship.canDock(chosenPlanet)) {
                return ship.dock(chosenPlanet);
            } else {
                /*
                 If we can't dock, we approach the planet with constant speed.
                 Don't worry about pathfinding for now, as the command will do it for you.
                 We run this navigate command each turn until we arrive to get the latest move.
                 Here we move at half our maximum speed to better control the ships.
                 Navigate command is an example and most likely you will have to design your own.
                 */
                return ship.navigate({
                    target: chosenPlanet,
                    keepDistanceToTarget: chosenPlanet.radius + 3,
                    speed: constants.MAX_SPEED,
                    avoidObstacles: true,
                    ignoreShips: true
                });
            }
        });

    return moves; // return moves assigned to our ships for the Halite engine to take
}

function westernDuel(gameMap) {
    const ship = gameMap.myShips[0];
    const thrustMove = ship.navigate({
        target: ship.pointApproaching({x: 0, y: 0}, 4),
        speed: constants.MAX_SPEED / 2,
        avoidObstacles: true,
        ignoreShips: true
    });

    return [thrustMove];
}
function circlePlanet(){
      while (p.isOwnedByEnemy){
        if(ship.isOwnedByEnemy && isDocked()){
          return ship.navigate({
            target: ship.isOwnedByEnemy,
            speed: constants.MAX_SPEED,
            avoidObstacles: true,
            ignoreShips: true
          });
        }
      }
  }

module.exports = {defaultStrategy, westernDuel};
