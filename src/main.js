var MinerRole = require('role.miner');
var HaulerRole = require('role.hauler');
var UpgraderRole = require('role.upgrader');
var BuilderRole = require('role.builder');

var Spawner = require('structure.spawner');
var Tower = require('structure.tower');

var MIN_MINERS = 2;
var MIN_HAULERS = 2;

module.exports.loop = function () {

    Spawner.calculateSpawningAbility();
    var room = Spawner.spawns[0].room;
    
    var minerCount = MinerRole.manage(room, Spawner, 2);
    var haulerCount = HaulerRole.manage(room, Spawner, 2);
    var canTakeFromSpawn = true;

    if(minerCount < MIN_MINERS || haulerCount < MIN_HAULERS) {
        canTakeFromSpawn = false;
    }
    UpgraderRole.manage(Spawner, 2, canTakeFromSpawn);
    BuilderRole.manage(room, Spawner, 1, canTakeFromSpawn);

    Tower.run(room);
}