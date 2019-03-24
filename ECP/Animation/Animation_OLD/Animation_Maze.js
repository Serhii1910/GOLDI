function Animation(EventHandler, SettingsParameter, CallBack)  {

    var Sensors = new Array(128);
    var Actuators = new Array(128);

    Animation.prototype.onCommand = function (Command) {

    };

    Animation.prototype.onServerInterfaceInfo = function (Info) {

    };

    Animation.prototype.onData = function (Data) {

    };

    Animation.prototype.onHoverEvent = function(HoverData)
    {

    };

    function initialize()
    {
        for (var i = 0; i < 128; i++)
        {
            Actuators[i] = false;
            Sensors[i] = false;
        }

        //$("#" + SettingsParameter.AnimationDIVName).load('ECP/Animation/Images/Image_Maze.png', function ()
        //{
        $("#" + SettingsParameter.AnimationDIVName).prepend('' +
            '<div class="responsive-container">' +
            '<div class="dummy"></div>' +
            '<div class="img-container">' +
            '<img id="theImg" src="ECP/Animation/Images/Image_Maze.png" style="width:100%"/>' +
            '</div>' +
            '</div>');



            CallBack();
        //});

    }

    initialize();
}