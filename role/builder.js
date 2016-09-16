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
	        //var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	        var prioritySites = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
                    filter: (site) => {
                        return (site.structureType == STRUCTURE_EXTENSION ||
                                site.structureType == STRUCTURE_WALL);
                    }
	        });
            if(prioritySites) {
                if(creep.build(prioritySites) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(prioritySites);
                }
            }
            else{
                var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if(closestDamagedStructure) {
                    creep.repair(closestDamagedStructure);
                }
                else{
                    var site = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
                    if(site) {
                        if(creep.build(site) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(site);
                        }
                    }
                    else{
                        creep.moveTo(33,33);
                    }
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