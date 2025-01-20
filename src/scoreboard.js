
function Scoreboard() {
const MAX_PLAYERS = 32;
const gamesProgress = {};

    function onMessage(packet) {
        const game_id = parseInt(packet.game_id, 10);
    
        // Set up a new game
        if (typeof gamesProgress[game_id] === typeof undefined) {
            gamesProgress[game_id] = {
                scores: new Array(MAX_PLAYERS).fill(0)
            };
        }

        // Only two messages: one to change the scores, and everything else to get the current
        if (packet.msg === 'e_delta') {
            const team = parseInt(packet.team, 10);
            const delta = parseInt(packet.delta, 10);
            
            gamesProgress[game_id].scores[team] += delta;
        }

        return getState(game_id);
    }

    function getState(game_id) {
        const state = { 
            msg: "scores", 
            scores: gamesProgress[game_id].scores
        };
        return state;
    }


    return {
        onMessage,
        getState,
    }

}

module.exports = Scoreboard;
