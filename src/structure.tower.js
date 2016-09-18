var tower = {

    run: function(room) {
        var towers = room.find(FIND_MY_STRUCTURES, {
                        filter: (s) => {
                            return (s.structureType == STRUCTURE_TOWER &&
                                    s.energy >= 10);
                        }
        });
        towers.forEach(tower => {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }

            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s => s.hits < s.hitsMax)
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        });
	}
};

module.exports = tower;