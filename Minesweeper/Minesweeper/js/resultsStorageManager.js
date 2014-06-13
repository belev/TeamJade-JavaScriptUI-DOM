// div#scoreboard

var ResultsManager = (function () {
    localStorage.clear();

    function toSubmitScoreMenu() {
        $("#player-name").val('');

        $("#game").fadeOut("slow", function () {
            $("#submitScore").fadeIn();
            $("#player-name").focus();
        });
    }

    function saveUserToLocalStorage() {
        var userName = $('#player-name').val(),
            userPlaytimeInSeconds = $('#timerValue').text();

        if (userName === '') {
            userName = 'unknown';
        }

        localStorage[userName] = userPlaytimeInSeconds;

        ms.startGame();
    }

    function getSortedResults() {
        var userData = [];

        for (var i = 0, len = localStorage.length; i < len; i += 1) {
            var currentUserKey = localStorage.key(i);

            userData.push({
                name: currentUserKey,
                score: localStorage[currentUserKey]
            });
        }

        userData.sort(function (a, b) {
            return a.score - b.score;
        });

        return userData;
    }

    function updateUserScoreboard() {
        var $scoreboard = $('#scoreboard'),
            playersResults = getSortedResults(),
            playersToDisplayCount = Math.min(5, playersResults.length);

        if (playersToDisplayCount === 0) {
            return;
        }

        var resultsList = $('<ul />').attr('id', 'results-list');

        var currentPlayerData = $('<li />');

        for (var i = 0; i < playersToDisplayCount; i += 1) {

            currentPlayerData.html(playersResults[i].name + ': ' + playersResults[i].score + 's.');

            resultsList.append(currentPlayerData.clone(true));
        }

        $('#results-list').remove();
        $scoreboard.prepend(resultsList);
    }

    return {
        toSubmitScoreMenu: toSubmitScoreMenu,
        saveUser: saveUserToLocalStorage,
        updateScoreboard: updateUserScoreboard
    }
}());