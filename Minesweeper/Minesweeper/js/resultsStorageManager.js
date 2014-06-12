// div#scoreboard

var ResultsManager = (function () {
    localStorage.clear();

    function saveUserToLocalStorage() {
        var userName = prompt('Enter your name: ');
        var userPlaytimeInSeconds = $('#timerValue').html();

        localStorage[userName] = userPlaytimeInSeconds;
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

        console.log(userData);

        return userData;
    }

    function updateUserScoreboard() {
        var $scoreboard = $('#scoreboard'),
            playersResults = getSortedResults(),
            playersToDisplayCount = Math.min(5, playersResults.length);

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
        saveUser: saveUserToLocalStorage,
        updateScoreboard: updateUserScoreboard
    }
}());