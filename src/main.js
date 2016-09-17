// TODO role miner
// TODO role hauler
// TODO refactor other roles
// TODO state machines?
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var towerHandler = require('towerHandler');

var creepLevel_300 = [[300],[WORK,WORK,CARRY,MOVE]]; // 300 energy
var creepLevel_400 = [[350],[WORK,WORK,CARRY,MOVE,MOVE]]; // 350 energy
var creepLevel_550 = [[500],[WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]]; // 500 energy
var creepLevel_800 = [[800],[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE]]; // 800 energy

var MAX_HARVESTERS = 4;
var MAX_UPGRADERS = 1;
var MAX_BUILDERS = 0;

module.exports.loop = function () {
    // CLEANUP
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var spawn = Game.spawns['Spawn1']

    // TOWERS
    towerHandler(spawn.room);
    
    // ENERGY
    var energyCurrent = spawn.room.energyAvailable;
    var energyMax = spawn.room.energyCapacityAvailable;
    console.log('Room "'+spawn.room.name+'" energy: '+energyCurrent+'/'+energyMax);
    if(energyMax >= creepLevel_800[0][0]){
        var currentCreepLevel = creepLevel_800;
    }
    else if(energyMax >= creepLevel_550[0][0]){
        var currentCreepLevel = creepLevel_550;
    }
    else if(energyMax >= creepLevel_400[0][0]){
        var currentCreepLevel = creepLevel_400;
    }
    else{
        var currentCreepLevel = creepLevel_300;
    }
    
    // HARVESTERS
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);
    // BACKUP
    if(harvesters.length == 0 && energyCurrent < currentCreepLevel[0][0]){
        currentCreepLevel = creepLevel_300;
    }
    if(harvesters.length < MAX_HARVESTERS) {
        var newName = spawn.createCreep(currentCreepLevel[1], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }
    else{
        // UPGRADERS
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        console.log('Upgraders: ' + upgraders.length);
        if(upgraders.length < MAX_UPGRADERS) {
            var newName = spawn.createCreep(currentCreepLevel[1], undefined, {role: 'upgrader'});
            console.log('Spawning new upgrader: ' + newName);
        }
        else{
            // BUILDERS
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            console.log('Builders: ' + builders.length);
            if(builders.length < MAX_BUILDERS) {
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