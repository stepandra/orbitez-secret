const signalR = require("@microsoft/signalr");

class Mode {
    constructor() {
        this.ID = -1;
        this.name = "Blank";
        this.decayMod = 1.0; // Modifier for decay rate (Multiplier)
        this.packetLB = 49; // Packet id for leaderboard packet (48 = Text List, 49 = List, 50 = Pie chart)
        this.haveTeams = false; // True = gamemode uses teams, false = gamemode doesnt use teams
        this.specByLeaderboard = false; // false = spectate from player list instead of leaderboard
        this.IsTournament = false;
    }
    // Override these
    onServerInit(server) {
        const signalR = require("@microsoft/signalr");

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://api.hangzhou2net.tzkt.io/v1/events") //https://api.tzkt.io/ MAINNEt
            .build();

        async function init() {
            // open connection
            await connection.start();
            // subscribe to head
            await connection.invoke("SubscribeToBlocks");

            await connection.invoke('SubscribeToOperations', {
                address: 'KT1NXgqXUfYFowmoZK6FhUTxmcqkjzZnV5rg',
                types: 'transaction'
            })
        };

        // auto-reconnect
        connection.onclose(init);

        connection.on("blocks", (msg) => {
            // console.log('BLKS', msg);
        });

        connection.on("operations", (msg) => {
            // console.log('TRANS', msg);
        });

        init();
        // Called when the server starts
        server.run = true;
    }
    onTick(server) {
        // Called on every game tick
    }
    onPlayerInit(player) {
        // Called after a player object is constructed
    }
    onPlayerSpawn(server, player) {
        // Called when a player is spawned
        player.color = server.getRandomColor(); // Random color
        server.spawnPlayer(player, server.randomPos());
    }
    onCellAdd(cell) {
        // Called when a player cell is added
    }
    onCellRemove(cell) {
        // Called when a player cell is removed
    }
    updateLB(server) {
        // Called when the leaderboard update function is called
        server.leaderboardType = this.packetLB;
    }
}

module.exports = Mode;
