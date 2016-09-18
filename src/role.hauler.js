var S_COLLECT = 0;
var S_HAUL = 1;

var haulerRole = {

    baseParts: [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], // 300e
    levelUpParts: [CARRY,CARRY,MOVE,MOVE], // 200e
    maxLevel: 3,
    roleName: 'hauler',

    _collect: function(creep, container) {
        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.state = S_HAUL;
            return;
        }
        if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
            return;
        }
    },

    _haul: function(creep, deposits) {
        if(creep.carry.energy == 0){
            creep.memory.state = S_COLLECT;
            return;
        }
        var deposit = creep.pos.findClosestByRange(deposits, {
            filter: (d => {
                return d.energy < d.energyCapacity &&
                    d.structureType != STRUCTURE_TOWER
            })
        });
        if(!deposit) {
            deposit = creep.pos.findClosestByRange(deposits, {
                filter: (d => {
                    return d.energy < d.energyCapacity &&
                        d.structureType == STRUCTURE_TOWER
                })
            });
        }
        if(creep.transfer(deposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(deposit);
            return;
        }
    },

    /// {creep} haul from {container} to a closest from {deposits}
    run: function(creep, container, deposits) {
        if(creep.memory.state == undefined) {
            creep.memory.state = S_COLLECT;
        }
        if(creep.memory.state == S_COLLECT) {
            this._collect(creep, container);
        }
        if(creep.memory.state == S_HAUL) {
            this._haul(creep, deposits);
        }
    },

    /// manage all haulers
    manage: function(room, spawner, maxHaulers) {
        var energyStorages = room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_SPAWN ||
                        s.structureType == STRUCTURE_TOWER);
            }
        });
        var containers = room.find(FIND_STRUCTURES, {
                filter: (c => c.structureType == STRUCTURE_CONTAINER)
        });
        var count = 0;
        containers.forEach(container => {
            var haulers = _.filter(Game.creeps, (creep) => {
                return (creep.memory.role == this.roleName &&
                        creep.memory.assignedTo == container.id);
            });
            if(haulers.length == 0) {
                this.maxLevel = 0;
            }
            if(haulers.length < maxHaulers) {
                spawner.tryCreate(this, container.id);
            }
            haulers.forEach(h => this.run(h, container, energyStorages));
            count = count + haulers.length;
        });
        return count;
    }
};

module.exports = haulerRole;