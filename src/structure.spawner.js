var Translate = require('util.translate');

var BreakException = {};

var spawner = {

    spawns: _.filter(Game.spawns, (s => s.my)),

    calculatePartCost: function(parts) {
        var cost = 0;
        parts.forEach(p => {
            switch(p) {
                case WORK:
                    cost += 100;
                    break;
                case CARRY:
                case MOVE:
                    cost += 50;
                    break;
            }
        });
        return cost;
    },

    calculateSpawningAbility: function() {
        this.spawns.forEach(s => {
            if(!s.spawning && s.room.energyAvailable >= 300) {
                s.memory.canSpawn = true;
            }
        });
    },

    getEnergyCapacity: function() {
        return this.spawns[0].room.energyCapacityAvailable;
    },

    tryCreate: function(roleObject, parentId) {
        var parts = roleObject.baseParts;
        var moreParts = parts.concat(roleObject.levelUpParts);
        var level = 0;
        while((this.calculatePartCost(moreParts) < this.getEnergyCapacity()) && (level++ < roleObject.maxLevel)) {
            parts = moreParts;
            moreParts = parts.concat(roleObject.levelUpParts);
        }

        try {
            this.spawns.forEach(spawn => {
                var success;
                if(spawn.memory.canSpawn) {
                    var tryCreate = spawn.createCreep(parts, undefined, {role: roleObject.roleName, assignedTo: parentId});
                    var message = 'Spawning new ' + roleObject.roleName + ' with parts: ' + parts;
                    if(parentId) {
                        message += ' and assigned to ' + parentId;
                    }
                    if(tryCreate < 0) {
                        success = false;
                        message += ' - error: ' + Translate.errorCode(tryCreate);
                    }
                    else {
                        success = true;
                        spawn.memory.canSpawn = false;
                    }
                    console.log(message);
                }
                if(success) {
                    throw BreakException;
                }
            });
        }
        catch (e) {
            if(e !== BreakException)
                throw e;
        }
    }
}

module.exports = spawner;