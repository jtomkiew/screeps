var towerHandler = {

    /** @param {Room} room **/
    run: function(room) {
        var towers = room.find(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER &&
                                    structure.energy >= 10);
                        }
        });
        towers.forEach(tower => {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }

            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType != STRUCTURE_WALL &&
                            structure.hits < structure.hitsMax);
                    }
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
            else{
                closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL &&
                                structure.hits < structure.hitsMax);
                        }
                });
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        });
	}
};

module.exports = towerHandler;