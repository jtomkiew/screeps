var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            //var sources = creep.room.find(FIND_SOURCES);
            var closestSource = Game.spawns['Spawn1'].pos.findClosestByRange(FIND_SOURCES)
            if(creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else{
                var spawn = creep.room.find(FIND_STRUCTURES, {
                    filter: (spawn) => {
                        return (spawn.structureType == STRUCTURE_SPAWN);
                    }
                });
                creep.moveTo(spawn[0]);
            }
        }
	}
};

module.exports = roleHarvester;