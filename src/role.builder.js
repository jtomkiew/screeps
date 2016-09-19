var UpgraderRole = require('role.upgrader');

var S_COLLECT = 0;
var S_MAINTAIN = 1;

var builderRole = {

    baseParts: [WORK,WORK,CARRY,MOVE], // 300e
    levelUpParts: [WORK,CARRY,MOVE,MOVE], // 250e
    maxLevel: 3,
    roleName: 'builder',

    _build: function(creep, structure) {
        if(creep.build(structure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure);
            creep.build(structure);
        }
    },

    _repair: function(creep, structure) {
        if(creep.repair(structure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure);
            creep.repair(structure);
        }
    },

    _maintain: function(creep, structure) {
        if(creep.carry.energy == 0) {
            creep.memory.state = S_COLLECT;
            return;
	    }
        if(!structure) {
            return;
        }
        if(structure.progress < structure.progressTotal) {
            this._build(creep, structure);
            return;
        }
        if(structure.hits < structure.hitsMax) {
            this._repair(creep, structure);
            return;
        }
        creep.memory.state = S_COLLECT;
    },

    run: function(creep, source, structure, canTakeFromSpawn) {
        if(creep.memory.state == undefined) {
            creep.memory.state = S_COLLECT;
        }
        if(creep.memory.state == S_COLLECT) {
            UpgraderRole._collect(creep, source, canTakeFromSpawn);
        }
        if(creep.memory.state == S_MAINTAIN) {
            this._maintain(creep, structure);
        }
	},

    manage: function(room, spawner, maxBuilders, canTakeFromSpawn) {
        var structures = room.find(FIND_STRUCTURES, {
            filter: (s => s.hits < s.hitsMax)
        });
        var constructions = room.find(FIND_CONSTRUCTION_SITES, {
            filter: (s => s.my)
        });

        var allSites = [];
        allSites = allSites.concat(constructions);
        allSites = allSites.concat(structures);

        var builders = _.filter(Game.creeps, (creep) => {
            return (creep.memory.role == this.roleName);
        });
        if(allSites.length > 0 && builders.length < maxBuilders) {
            spawner.tryCreate(this);
        }
        builders.forEach(b => this.run(b, spawner.spawns[0], allSites[0], canTakeFromSpawn));
        return builders.length;
    }
};

module.exports = builderRole;