(function () {
    var game = $("#game").hide();

    $("#startBtn").on('click', function () {

        $( "#ui-control" ).fadeOut( "slow", function() {
            game.fadeIn('slow');
        });

    })
}());