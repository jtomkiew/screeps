var S_COLLECT = 0;
var S_UPGRADE = 1;

var upgraderRole = {

    baseParts: [WORK,WORK,CARRY,MOVE], // 300e
    levelUpParts: [WORK,CARRY,MOVE,MOVE], // 250e
    maxLevel: 3,
    roleName: 'upgrader',

    _collect: function(creep, source, canTakeFromSpawn) {
        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.state = S_UPGRADE;
            return;
        }
        if(!canTakeFromSpawn){
            creep.memory.state = S_UPGRADE;
            return;
        }
        if(source.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            return;
        }
    },

    _upgrade: function(creep) {
        if(creep.carry.energy == 0) {
            creep.memory.state = S_COLLECT;
            return;
	    }
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
            return;
        }
    },

    run: function(creep, source, canTakeFromSpawn) {
        if(creep.memory.state == undefined) {
            creep.memory.state = S_COLLECT;
        }
        if(creep.memory.state == S_COLLECT) {
            this._collect(creep, source, canTakeFromSpawn);
        }
        if(creep.memory.state == S_UPGRADE) {
            this._upgrade(creep);
        }
	},

    manage: function(spawner, maxUpgraders, canTakeFromSpawn) {
        var upgraders = _.filter(Game.creeps, (creep) => {
            return (creep.memory.role == this.roleName);
        });
        if(upgraders.length < maxUpgraders) {
            spawner.tryCreate(this);
        }
        upgraders.forEach(u => this.run(u, spawner.spawns[0], canTakeFromSpawn));
    }
};

module.exports = upgraderRole;