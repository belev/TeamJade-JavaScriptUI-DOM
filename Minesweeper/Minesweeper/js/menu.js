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
        stopWatch = 0;

    $("#startBtn").on('click', function () {
        $menu.fadeOut("slow", function () {
            $game.fadeIn("slow");
        });
    });

    $("#settingsBtn").on('click', function () {
        $menu.fadeOut("slow", function () {
            $settings.fadeIn("slow");
        });
    });

    $('#helpBtn').on('click', function () {
        $menu.fadeOut('slow', function () {
            $help.fadeIn('slow');
        });
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

    $("#backBtn").on('click', function () {
        $settings.fadeOut("slow", function () {
            $menu.fadeIn();
        });
    });

    $("#helpBackBtn").on('click', function () {
        $help.fadeOut("slow", function () {
            $menu.fadeIn();
        });
    });

    $("#backToMenu").on('click', function () {
        $game.fadeOut("slow", function () {
            $menu.fadeIn();
        });
    });

    // Timer handling

    $timerValue.on('start', function () {
       refreshIntervalId = setInterval(function () {
           $timerValue.text(stopWatch);
           stopWatch += 1;
       },1);
    });

    $timerValue.on('stop', function () {
        clearInterval(refreshIntervalId);
    });

    // Help functions

    function customBtnToggle() {
        $customSettings.fadeToggle();
        $saveBtn.toggle();

        $eightBtn.toggle();
        $sixteenBtn.toggle();
        $customBtn.toggle();
        $("#backBtn").toggle();
    }

    function resetAllOptionsButtons() {
        $eightBtn.removeAttr("style");
        $sixteenBtn.removeAttr("style");
        $customBtn.removeAttr("style");
    }
}($));