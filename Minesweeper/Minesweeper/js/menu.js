(function ($) {
    var game = $("#game").hide();
    var menu = $("#menu");

    $("#startBtn").on('click', function () {

        menu.fadeOut("slow", function() {
            game.fadeIn("slow");
        });

    });

    $("#backToMenu").on('click', function () {
        game.fadeOut("slow", function() {
            menu.fadeIn("slow");
        });
    })
}($));