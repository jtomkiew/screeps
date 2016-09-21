var MinerRole = require('role.miner');
var HaulerRole = require('role.hauler');
var UpgraderRole = require('role.upgrader');
var BuilderRole = require('role.builder');

var Spawner = require('structure.spawner');
var Tower = require('structure.tower');

var MIN_MINERS = 1;
var MIN_HAULERS = 1;

module.exports.loop = function () {

    Spawner.calculateSpawningAbility();
    var room = Spawner.spawns[0].room;
    
    var minerCount = MinerRole.manage(room, Spawner, 2);
    var haulerCount = HaulerRole.manage(room, Spawner, 2);
    var canTakeFromSpawn = true;

    if(minerCount < MIN_MINERS || haulerCount < MIN_HAULERS) {
        canTakeFromSpawn = false;
    }
    var upgraderCount = UpgraderRole.manage(Spawner, 3, canTakeFromSpawn);
    var builderCount = BuilderRole.manage(room, Spawner, 2, canTakeFromSpawn);
    console.log('STATUS: minerCount: ' + minerCount + ', haulerCount: ' + haulerCount + ', upgraderCount: ' + upgraderCount + ', builderCount: ' + builderCount);
    Tower.run(room);
}