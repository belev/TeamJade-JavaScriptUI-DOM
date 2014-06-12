(function ($) {
    var $menu = $("#menu"),
        $game = $("#game").hide(),
        $help = $('#game-help').hide(),
        $settings = $("#settings").hide(),
        $customSettings = $("#customSettings").hide(),
        $saveBtn = $("#saveBtn").hide(),
        selectedColor = 'yellowgreen',
        $eightBtn = $("#eightBtn").css('background', selectedColor),
        $sixteenBtn = $("#sixteenBtn"),
        $customBtn = $("#customBtn"),
        $cols = $("#cols"),
        $rows = $("#rows"),
        $mines = $("#mines"),
        $timerValue = $("#timerValue"),
        refreshIntervalId,
        stopWatch = 0,
        $scoreboard = $("#scoreboard").hide(),
        $audio = $("#audio"),
        $audioBtn = $("#audioBtn"),
        audioPaused = false,
        $submitScore = $("#submitScore").hide();

    $("#startBtn").on('click', function () {
        fadeOutFadeIn($menu, $game);
    });

    $("#settingsBtn").on('click', function () {
        fadeOutFadeIn($menu, $settings);
    });

    $('#helpBtn').on('click', function () {
        fadeOutFadeIn($menu, $help);
    });

    // Settings:

    $eightBtn.on('click', function () {
        resetAllOptionsButtons();

        $(this).css('background', selectedColor);

        $cols.val("8");
        $rows.val("8");
        $mines.val("10");
    });

    $sixteenBtn.on('click', function () {
        resetAllOptionsButtons();

        $(this).css('background', selectedColor);

        $cols.val("16");
        $rows.val("16");
        $mines.val("20");
    });

    $customBtn.on('click', function () {
        customBtnToggle();
    });

    $saveBtn.on('click', function () {
        customBtnToggle();
        resetAllOptionsButtons();

        $customBtn.css('background', selectedColor);
    });

    $("#exitBtn").on('click', function () {
        $(".wrapper").fadeOut("slow", function () {
            window.close();
        });
    });

    $("#settingsBackBtn").on('click', function () {
        fadeOutFadeIn($settings, $menu);
    });

    $("#scoreboardBtn").on('click', function () {
        ResultsManager.updateScoreboard();
        fadeOutFadeIn($menu, $scoreboard);
    });

    $("#scoreboardBackBtn").on('click', function () {
        fadeOutFadeIn($scoreboard, $menu);
    });

    $("#helpBackBtn").on('click', function () {
        fadeOutFadeIn($help, $menu);
    });

    $("#backToMenu").on('click', function () {
        fadeOutFadeIn($game, $menu);
        resetTimer();
    });

    // Timer handling

    $timerValue.on('start', startTimer);
    $timerValue.on('stop', resetTimer);

    // Audio control

    $audioBtn.on('click', function () {
        if (audioPaused) {
            playAudio ();
        } else {
            pauseAudio();
        }
    });

    $("#submitBtn").on('click', function () {
        ResultsManager.saveUser();
        ResultsManager.updateScoreboard();
        fadeOutFadeIn($submitScore, $scoreboard);
    });

    $("#cancelSubmitBtn").on('click', function () {
       fadeOutFadeIn($submitScore, $menu);
    });

    // Help functions
    function pauseAudio () {
        $audio.trigger("pause");
        $audioBtn.attr("src", "img/audio_off.png");
        audioPaused = true;
    }

    function playAudio () {
        $audio.trigger("play");
        $audioBtn.attr("src", "img/audio_on.png");
        audioPaused = false;
    }

    function fadeOutFadeIn(fadeOutElement, fadeInElement) {
        fadeOutElement.fadeOut("slow", function () {
            fadeInElement.fadeIn();
        });
    }

    function startTimer() {
        refreshIntervalId = setInterval(function () {
            $timerValue.text(stopWatch.toFixed(2));
            stopWatch += parseFloat(1 / 100);
        },10);
    }

    function resetTimer() {
        clearInterval(refreshIntervalId);
        stopWatch = 0;
    }

    function customBtnToggle() {
        $customSettings.fadeToggle();
        $saveBtn.toggle();

        $eightBtn.toggle();
        $sixteenBtn.toggle();
        $customBtn.toggle();
        $("#settingsBackBtn").toggle();
    }

    function resetAllOptionsButtons() {
        $eightBtn.removeAttr("style");
        $sixteenBtn.removeAttr("style");
        $customBtn.removeAttr("style");
    }
}($));