// TODO role miner
// TODO role hauler
// TODO refactor other roles
// TODO state machines?
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var creepLevel300 = [[300],[WORK,WORK,CARRY,MOVE]]; // 300 energy
var creepLevel400 = [[350],[WORK,WORK,CARRY,MOVE,MOVE]]; // 350 energy
var creepLevel550 = [[500],[WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]]; // 500 energy
var creepLevel800 = [[500],[WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]]; // 800 energy

var NO_OF_HARVESTERS = 3;
var NO_OF_UPGRADERS = 5;
var NO_OF_BUILDERS = 4;

module.exports.loop = function () {

    var spawn = Game.spawns['Spawn1']
    
    // CLEANUP
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    var energyCurrent = spawn.room.energyAvailable;
    var energyMax = spawn.room.energyCapacityAvailable;
    console.log('Room "'+spawn.room.name+'" energy: '+energyCurrent+'/'+energyMax);
    if(energyMax >= creepLevel550[0][0]){
        var currentCreepLevel = creepLevel550;
    }
    else if(energyMax >= creepLevel400[0][0]){
        var currentCreepLevel = creepLevel400;
    }
    else{
        var currentCreepLevel = creepLevel300;
    }
    
    // HARVESTERS
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);
    // BACKUP
    if(harvesters.length == 0 && energyCurrent < currentCreepLevel[0][0]){
        currentCreepLevel = creepLevel300;
    }
    if(harvesters.length < NO_OF_HARVESTERS) {
        var newName = spawn.createCreep(currentCreepLevel[1], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }
    else{
        // UPGRADERS
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        console.log('Upgraders: ' + upgraders.length);
        if(upgraders.length < NO_OF_UPGRADERS) {
            var newName = spawn.createCreep(currentCreepLevel[1], undefined, {role: 'upgrader'});
            console.log('Spawning new upgrader: ' + newName);
        }
        else{
            // BUILDERS
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            console.log('Builders: ' + builders.length);
            if(builders.length < NO_OF_BUILDERS) {
                var newName = spawn.createCreep(currentCreepLevel[1], undefined, {role: 'builder'});
                console.log('Spawning new builder: ' + newName);
            }
        }
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}