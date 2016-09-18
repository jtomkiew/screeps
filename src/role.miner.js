var BuilderRole = require('role.builder');

var S_MAINTAIN = 0;
var S_HARVEST = 1;
var S_STORE = 2;

var minerRole = {

    baseParts: [WORK,WORK,CARRY,MOVE], // 300e
    levelUpParts: [WORK,MOVE], // 150e
    maxLevel: 3,
    roleName: 'miner',

    _maintainContainer: function(creep, container) {
        if(!container) {
            creep.memory.state = S_STORE;
            return;
        }
	    if(creep.carry.energy == 0) {
            creep.memory.state = S_HARVEST;
            return;
	    }
        if(container.progress < container.progressTotal) {
            BuilderRole._build(creep, container);
            return;
        }
        if(container.hits < container.hitsMax) {
            BuilderRole._repair(creep, container);
            return;
        }
        creep.memory.state = S_STORE;
    },

    _storeEnergy: function(creep, container) {
        if(!container){
            // creep.drop(RESOURCE_ENERGY, creep.carry.energy);
            // creep.memory.state = S_HARVEST;
            return;
        }
        if(creep.carry.energy == 0) {
            creep.memory.state = S_HARVEST;
            return;
        }
        var tryTransfer = creep.transfer(container, RESOURCE_ENERGY);
        if(tryTransfer == OK) {
            creep.memory.state = S_HARVEST;
            return;
        }
        if(tryTransfer == ERR_FULL) {
            // creep.drop(RESOURCE_ENERGY, creep.carry.energy);
            // creep.memory.state = S_HARVEST;
            creep.memory.state = S_MAINTAIN;
            return
        }
        if(tryTransfer == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
            return;
        }
        creep.memory.state = S_MAINTAIN;
    },

    _harvest: function(creep, source) {
        if(creep.carry.energy == creep.carryCapacity) {
            creep.memory.state = S_MAINTAIN;
            return;
        }
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            return;
        }
    },

    /// {creep} mine {source}, build and maintain nearby {container}, transfer energy when {container} is in good condition
    run: function(creep, source, container) {
        if(creep.memory.state == undefined) {
            creep.memory.state = S_HARVEST;
        }
        if(creep.memory.state == S_HARVEST) {
            this._harvest(creep, source);
        }
        if(creep.memory.state == S_MAINTAIN) {
            this._maintainContainer(creep, container);
        }
        if(creep.memory.state == S_STORE) {
            this._storeEnergy(creep, container);
        }
    },

    /// manage all miners
    manage: function(room, spawner, maxMiners) {
        var sources = room.find(FIND_SOURCES);
        var count = 0;
        sources.forEach(source => {
            // if(source.id == 'id') {return;} // exclude problematic sources
            // if(source.id == 'id2') {maxMiners = 2;} // set maxMiners per source

            var miners = _.filter(Game.creeps, (creep) => {
                return (creep.memory.role == this.roleName &&
                        creep.memory.assignedTo == source.id);
            });
            if(miners.length == 0) {
                this.maxLevel = 0;
            }
            if(miners.length < maxMiners) {
                spawner.tryCreate(this, source.id);
            }
            // find closest storage
            var closestContainerStructure = source.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (c => c.structureType == STRUCTURE_CONTAINER)
            });
            var closestContainerSite = source.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
                filter: (c) => {
                    return (c.structureType == STRUCTURE_CONTAINER &&
                            c.my);
                }
            });
            var container = source.pos.findClosestByRange([closestContainerStructure,closestContainerSite]);
            
            miners.forEach(c => this.run(c, source, container));
            count = count + miners.length;
        });
        return count;
    }
};

module.exports = minerRole;