const game_id = (new URL(location.href)).searchParams.get('game_id');

function Scoreboard(gameData, socketClient) {
    let gameID;
    let presentationMode;
    let compactMode;
    let showPlayerImages;

    (function ctor() {
        const sp = (new URL(location.href)).searchParams;
        gameID = sp.get('game_id') || 0;
        presentationMode = sp.get('presentation') === null ? false : true;
        compactMode = sp.get('compact') === null ? false : true;
        showPlayerImages = true;

        if (compactMode) {
            $('body').css({ "transform" : "scale(0.5)" });
        }

        // Create mock game
        if (!gameData) {
            gameData = {
                game: {
                    title: "The Quiz"
                },
                players: [{},{}]
            }
        }
        
        // If the URL provides us with a player count, we override those fields in gameData
        // Similarly, in standalone we don't (currently) support importing player names
        let playerCount = sp.get('players');
        if (playerCount !== null || isStandalone()) {
            showPlayerImages = false;
            playerCount = parseInt(playerCount);
            playerCount ||= gameData.players.length;

            // Create dummy names
            gameData.players = [];
            for(let idx=0;idx<playerCount;++idx) {
                gameData.players[idx] = { name: `Player ${idx+1}` };
            }
        }
        
        uiPrepareGameData(gameData.game);
        uiCreatePlayerElements(gameData.players.length);
        uiPreparePlayerData(gameData.players);
        uiPrepareControls();
    })();


    function isStandalone() {
        return socketClient ? false : true;
    }


    function uiPrepareGameData(game) {
        $('#game-name').text(game.title);
        $('#roundcounter').hide(game.showRounds);

        if (compactMode) {
            $('footer').hide();
        }
    }

    function uiCreatePlayerElements(numPlayers) {
        const root = $('.scorecontainer');

        for(let i=0;i<numPlayers;++i) {
            const playerContainer = $('<div>').addClass('btncontainer');
            root.append(playerContainer);
            // Name
            playerContainer.append($('<h2>').addClass('team-name').attr('data-team', i));
            // Image
            const playerImageContainer = $('<h2>').addClass('team-image-container').attr('data-team', i);
            playerContainer.append(playerImageContainer);
                
            playerImageContainer.append($('<img>').addClass('team-image').attr('data-team', i));
            // Scores
            playerContainer.append($('<div>').addClass('btn').addClass('team-score').attr('data-team', i).html('0'));
            const playerScoreContainer = $('<div>').addClass('control-container').attr('data-team', i);
            playerContainer.append(playerScoreContainer);
            [-1,1,2,3,4].forEach((score) => {
                playerScoreContainer.append($('<button>').addClass('scorebtn').attr('data-team', i).attr('data-score', score).html(`${score>0?'+':''}${score}`));
            });
        }
    }


    function uiPreparePlayerData(players) {

        players.forEach((player, idx) => {
            $(`.team-name[data-team=${idx}]`).html(player.name);
            if (compactMode || !showPlayerImages) {
                // Hide the images until we have a way of getting them
                $(`.team-image-container[data-team=${idx}]`).hide();
            } else {
                $(`.team-image[data-team=${idx}]`).attr("src", player.url);
            }

            $(`.team-name[data-team=${idx}]`).css("background-color", player.color);
            $(`.team-image[data-team=${idx}]`).css("background-color", player.color);
            $(`.team-score[data-team=${idx}]`).css("background-color", player.color);

            // Hide the score increment buttons, when on the main screen
            if (presentationMode) {
                $(".scorebtn").hide();
            }
        });
    }


    function uiPrepareControls(game) {

        $(".scorebtn").toArray().forEach(scorebtn => {

            scorebtn.addEventListener("click", (e) => {
                const teamIndex = scorebtn.dataset.team;
                const delta = scorebtn.dataset.score;
    
                if (isStandalone()) {
                    const uiElements = $(`.team-score[data-team=${teamIndex}]`);
                    const score = parseInt(uiElements[0].textContent, 10) + parseInt(delta, 10);
                    uiElements[0].textContent = score;
                } else {
                    socketClient.sendData({
                        msg: "e_delta",
                        game_id: gameID,
                        team: teamIndex,
                        delta: delta
                    });
                }
            });
        });
    }

    function onOpenSocket(game) {
        socketClient.sendData({
            msg: "e_state",
            game_id: gameID
        });
    }

    function onMessage(data) {
        switch (data.msg) {
            case 'scores':
                data.scores.forEach((score, idx) => {
                    $(`.team-score[data-team=${idx}]`).html(score);
                });
                break;
        }
    }

    return {
        onOpenSocket,
        onMessage
    }
}
