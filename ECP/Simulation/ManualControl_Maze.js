function ManualControl(EventHandler, SettingsParameter, CallBack)
{
    //var KeyIsPressed = false;

    var SVG = undefined;
    var ArrowDown = undefined;
    var ArrowUp = undefined;
    var ArrowLeft = undefined;
    var ArrowRight = undefined;
    var ArrowLeftUp = undefined;
    var ArrowLeftDown = undefined;
    var ArrowRightUp = undefined;
    var ArrowRightDown = undefined;
    var ArrowRestart = undefined;
    var Sensors = [];
    var Actuators = [];
    var PressedKey = undefined;

    for (var i = 0; i < 128; i++)
    {
        Actuators[i] = false;
    }

    this.onData = function (Data)
    {
        Sensors = Data.getSensors();
    };

    this.onCommand = function(Command){

    };

    $("#" + SettingsParameter.RightPanelDIVName).load("ECP/Simulation/Manual_Control_Maze.html", function ()
    {
        BuildUserControlPanelContent();
        CallBack();
    });

    var ColorPressed = 'rgb(234, 112, 13)';
    var ColorNormal = 'rgb(251, 215, 187)';

    function colorizeArrowUp()
    {
        $(ArrowUp).css('fill', ColorPressed);
    }

    function colorizeArrowDown()
    {
        $(ArrowDown).css('fill', ColorPressed);
    }

    function colorizeArrowLeft()
    {
        $(ArrowLeft).css('fill', ColorPressed);
    }

    function colorizeArrowRight()
    {
        $(ArrowRight).css('fill', ColorPressed);
    }

    function colorizeArrowRightUp()
    {
        $(ArrowRightUp).css('fill', ColorPressed);
    }

    function colorizeArrowLeftUp()
    {
        $(ArrowLeftUp).css('fill', ColorPressed);
    }

    function colorizeArrowRightDown()
    {
        $(ArrowRightDown).css('fill', ColorPressed);
    }

    function colorizeArrowLeftDown()
    {
        $(ArrowLeftDown).css('fill', ColorPressed);
    }

    function colorizeArrowRestart()
    {
        $(ArrowRestart).css('fill', ColorPressed);
    }


    function decolorizeArrowUp()
    {
        $(ArrowUp).css('fill', ColorNormal);
    }

    function decolorizeArrowDown()
    {
        $(ArrowDown).css('fill', ColorNormal);
    }

    function decolorizeArrowLeft()
    {
        $(ArrowLeft).css('fill', ColorNormal);
    }

    function decolorizeArrowRight()
    {
        $(ArrowRight).css('fill', ColorNormal);
    }

    function decolorizeArrowRightUp()
    {
        $(ArrowRightUp).css('fill', ColorNormal);
    }

    function decolorizeArrowLeftUp()
    {
        $(ArrowLeftUp).css('fill', ColorNormal);
    }

    function decolorizeArrowRightDown()
    {
        $(ArrowRightDown).css('fill', ColorNormal);
    }

    function decolorizeArrowLeftDown()
    {
        $(ArrowLeftDown).css('fill', ColorNormal);
    }

    function decolorizeArrowRestart()
    {
        $(ArrowRestart).css('fill', ColorNormal);
    }

    function SendActor(Actor, Value)
    {
        var FullModelActuatorsArray = new Array(128);

        if(Actor instanceof Array)
        {
            for (var i = 0; i < 128; i++)
            {
                FullModelActuatorsArray[i] = Actuators[i];
            }

            for(var i = 0; i < Actor.length; i++)
            {
                FullModelActuatorsArray[Actor[i][0]] = Actor[i][1];
                Actuators[Actor[i][0]] = Actor[i][1];
            }
        }
        else
        {
            for (var i = 0; i < 128; i++)
            {
                if (i == Actor)
                {
                    FullModelActuatorsArray[i] = Value;
                    Actuators[i] = Value;
                }
                else
                    FullModelActuatorsArray[i] = Actuators[i];
            }
        }

        var Message = new DataMessage();

        Message.setSensors(Sensors);

        var Type = [];
        Type = ["BPU"];

        Message.setParameterStringArray(Type);

        Message.setActuators(FullModelActuatorsArray);

        EventHandler.fireDataSendEvent(Message);
    }

    function BuildUserControlPanelContent()
    {
        SVG = $('#SVGManualControl');
        SVG.attr("height", "100%");
        SVG.attr("width", "100%");

        ArrowDown = SVG.find('#ArrowDown');
        ArrowUp = SVG.find('#ArrowUp');
        ArrowLeft = SVG.find('#ArrowLeft');
        ArrowRight = SVG.find('#ArrowRight');
        ArrowLeftUp = SVG.find('#ArrowUpLeft');
        ArrowLeftDown = SVG.find('#ArrowDownLeft');
        ArrowRightUp = SVG.find('#ArrowUpRight');
        ArrowRightDown = SVG.find('#ArrowDownRight');
        // ArrowRestart = SVG.find('#ArrowRestart');

        ArrowDown.on('mousedown', function ()
        {
            colorizeArrowDown();
            SendActor(3, true);
        });

        ArrowUp.on('mousedown', function ()
        {
            colorizeArrowUp();
            SendActor(2, true);
        });

        ArrowLeft.on('mousedown', function ()
        {
            colorizeArrowLeft();
            SendActor(0, true);
        });

        ArrowRight.on('mousedown', function ()
        {
            colorizeArrowRight();
            SendActor(1, true);
        });

        ArrowRightDown.on('mousedown', function ()
        {
            colorizeArrowRightDown();
            SendActor(7, true);
        });

        ArrowLeftDown.on('mousedown', function ()
        {
            colorizeArrowLeftDown();
            SendActor(5, true);
        });

        ArrowRightUp.on('mousedown', function ()
        {
            colorizeArrowRightUp();
            SendActor(6, true);
        });

        ArrowLeftUp.on('mousedown', function ()
        {
            colorizeArrowLeftUp();
            SendActor(4, true);
        });

        // ArrowRestart.on('mousedown', function ()
        // {
        //     colorizeArrowRestart();
        //     SendActor(13, true);
        // });

        $('body').on('mouseup mouseleave', function ()
        {
            decolorizeArrowRight();
            decolorizeArrowLeft();
            decolorizeArrowDown();
            decolorizeArrowUp();
            decolorizeArrowRightUp();
            decolorizeArrowLeftUp();
            decolorizeArrowRightDown();
            decolorizeArrowLeftDown();
            // decolorizeArrowRestart();

            SendActor([
                [0, false],
                [1, false],
                [2, false],
                [3, false],
                [4, false],
                [5, false],
                [6, false],
                [7, false],
                [8, false],
                [9, false],
                [10, true],
                [11, false],
                [12, false],
                // [13, false],
            ]);

            SendActor(10, false);
        });


        $("body").keydown(function (event)
        {
            //if (!KeyIsPressed)
            if(PressedKey == undefined)
            {
                var key = event.which;
                switch (key)
                {
                    case 104: // 8
                        colorizeArrowUp();
                        SendActor(2, true);
                        break;
                    case 98: // 2
                        colorizeArrowDown();
                        SendActor(3, true);
                        break;
                    case 100: // 4
                        colorizeArrowLeft();
                        SendActor(0, true);
                        break;
                    case 102: // 6
                        colorizeArrowRight();
                        SendActor(1, true);
                        break;
                    case 105: // 9
                        colorizeArrowRightUp();
                        SendActor(6, true);
                        break;
                    case 103: // 7
                        colorizeArrowLeftUp();
                        SendActor(4, true);
                        break;
                    case 99: // 3
                        colorizeArrowRightDown();
                        SendActor(7, true);
                        break;
                    case 97: // 1
                        colorizeArrowLeftDown();
                        SendActor(5, true);
                        break;
                    // case 101: // 5
                    //     colorizeArrowRestart();
                    //     SendActor(13, true);
                    //     break;
                    default:
                        break;
                }
                PressedKey = key;
                //KeyIsPressed = true;
            }
        });

        $("body").keyup(function (event)
        {
            var key = event.which;
            if(PressedKey != undefined)
            {
                if(key == PressedKey)
                {
                    switch (key)
                    {
                        case 104: // 8
                            decolorizeArrowUp();
                            SendActor(2, false);
                            break;
                        case 98: // 2
                            decolorizeArrowDown();
                            SendActor(3, false);
                            break;
                        case 100: // 4
                            decolorizeArrowLeft();
                            SendActor(0, false);
                            break;
                        case 102: // 6
                            decolorizeArrowRight();
                            SendActor(1, false);
                            break;
                        case 105: // 9
                            decolorizeArrowRightUp();
                            SendActor(6, false);
                            break;
                        case 103: // 7
                            decolorizeArrowLeftUp();
                            SendActor(4, false);
                            break;
                        case 99: // 3
                            decolorizeArrowRightDown();
                            SendActor(7, false);
                            break;
                        case 97: // 1
                            decolorizeArrowLeftDown();
                            SendActor(5, false);
                            break;
                        // case 101: // 5
                        //     decolorizeArrowRestart();
                        //     SendActor(13, false);
                        //     break;
                        default:
                            break;
                    }

                    SendActor(10, true);
                    SendActor(10, false);

                    PressedKey = undefined;
                }
            }
        });
    }
}