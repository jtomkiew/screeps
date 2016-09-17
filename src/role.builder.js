var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	        var site = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            if(site) {
                if(creep.build(site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site);
                }
            }
            else{
                var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType != STRUCTURE_WALL && 
                                structure.hits < structure.hitsMax);
                    }
                });
                if(closestDamagedStructure) {
                    if(creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestDamagedStructure);
                    }
                }
                else{
                    creep.moveTo(33,33);
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
	    }
	}
};

module.exports = roleBuilder;