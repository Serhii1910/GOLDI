//***************************************
//*
//* This file defines the classes used for the GOLDi control panel (see documentation for details)
//*
//***************************************
/**
 * @param {GlobalEventHandling} EventHandler
 * @param {JSON} SettingsParameter
 * @param {Function} LoadCallback
 * @param {Function} GetLabel
 * @return none
 */
function ControlPanel(EventHandler, SettingsParameter, LoadCallback, GetLabel)
{
    // variable declarations
    var State = "InitialState";
    var ErrorID = 0;
    var ErrorIDElementMatch = [];
    var ExampleElementMatch = [];
    var InitElementMatch = [];
    var ClickedErrors = [];
    var Sensors = new Array(128);
    var Actuators = new Array(128);
    var FirstErrorOccured = false;
    var RemainingExperimentTimeTimer = undefined;
    var KeepMainSiteAliveTimer = undefined;
    var BlinkingVisitorModeLogoTimer = undefined;
    var RemainingTime = undefined;
    var ExperimentControlStateMachine = undefined;
    var LightOn = true;
    var BreakpointsActive = false;
    var ProgrammingProgressWorker;

    /**
     * Public function
     * Called when command arrives
     * @param {CommandMessage} Command
     * @return none
     */
    ControlPanel.prototype.onCommand = function (Command)
    {
        if (Command.getType() == EnumCommand.PSPUErrorCode)
        {
            HandleError(Command, GetLabel("ERROR_" + Command.getParameterStringArray()[0]));
        }
        else if (Command.getType() == EnumCommand.GotoVisitorMode)
        {
            ActivateVisitorMode();
        }
        else if (Command.getType() == EnumCommand.LoadDesignProgress)
        {
            $('#UploadingProgressBar').css('width', Command.getParameterStringArray()[0]);
        }
        else if (Command.getType() == EnumCommand.Nacknowledge)
        {
            //alert("NACK received! Your browser window will be closed!");
            //window.close();
        }
        else if (Command.getType() == EnumCommand.PSPUReachedBreakpoint)
        {
            var x = $('#BreakPointReachedSnackbar');

            // Add the "show" class to DIV
            x.addClass("show");

            // After 3 seconds, remove the show class from DIV
            setTimeout(function(){ x.removeClass("show") }, 3000);

            var Message_PSPUStop = new CommandMessage();
            Message_PSPUStop.setType(EnumCommand.PSPUStop);
            EventHandler.fireCommandEvent(Message_PSPUStop);

            $("#StartButton").blur();
        }

        ControlPanelStateMachine(Command.getType());
    };

    // Function called when an internal error arives
    /*ControlPanel.prototype.onInternalError = function (Error) 
    {
        var Message = new CommandMessage();
        Message.setParameterStringArray([Error.getErrorCode()]);
        HandleError(Message, Error.getData());
    };*/

    /**
     * Public function
     * Called when server interface info arrives
     * @param {ServerInterfaceInfoMessage} Info
     * @return none
     */
    ControlPanel.prototype.onServerInterfaceInfo = function (Info)
    {
        if (Info.getInfoType() == EnumServerInterfaceInfo.Disconnect)
        {
            ControlPanelStateMachine("Disconnect");
            clearInterval(RemainingExperimentTimeTimer);
        }
        else if (Info.getInfoType() == EnumServerInterfaceInfo.Connect)
        {
            ControlPanelStateMachine("Connect");
        }
    };

    /**
     * Public function
     * Called when data arrives
     * @param {DataMessage} Data
     * @return none
     */
    ControlPanel.prototype.onData = function (Data)
    {
        //Ignore all Simulation Data, only PSPU Data is relevant for the ECP
        if(Data.getParameterStringArray()[0] == "PSPU"){
            Sensors = Data.getSensors();
        }
        if(Data.getParameterStringArray()[0] == "BPU"){
            Actuators = Data.getActuators()
        }
        SetIndicators(Sensors, Actuators);
    };

    /**
     * Private function
     * Called when visitor mode needs to be activated
     * @param none
     * @return none
     */
    function ActivateVisitorMode()
    {
        DisableAllButtons();
        $('.vmrem').remove();
        $('#ExampleButton').prop('disabled', true);
        $('#UploadButton').prop('disabled', true);
        //SetBlinkingVisitorModeLogo();

        $("#" + SettingsParameter.RightPanelDIVName).remove();

        $("#" + SettingsParameter.WebCamDIVName).removeClass('col-md-4');
        $("#" + SettingsParameter.WebCamDIVName).addClass('col-md-6');

        $("#" + SettingsParameter.AnimationDIVName).removeClass('col-md-4');
        $("#" + SettingsParameter.AnimationDIVName).addClass('col-md-6');

        clearInterval(RemainingExperimentTimeTimer);

        $('#RemainingTimeText').html("Visitor mode");
        $('#RemainingTimeProgressBar').removeAttr('class');
        $('#RemainingTimeProgressBar').addClass('progress-bar progress-bar-danger');
        $('#RemainingTimeProgressBar').css('width', "100%");
    }

    /**
     * Private function
     * Sets the blinking logo for visitor mode
     * @param none
     * @return none
     */
    function SetBlinkingVisitorModeLogo()
    {
        $("#VisitorModeIconWrapper").load("Images/cancel_icon.svg", function ()
        {
            var SVG = $('#Logo');
            SVG.attr('height',$('#TopNavigationBar').height()/4);
            $(this).attr('height',$('#TopNavigationBar').height()/4);
            var LogoHidden = false;
            BlinkingVisitorModeLogoTimer = setInterval(function () {
                if(!LogoHidden)
                {
                    SVG.hide();
                    LogoHidden = true;
                }
                else
                {
                    SVG.show();
                    LogoHidden = false;
                }
            }, 1000);
        });
    }

    /**
     * Private function
     * Refresh all labels and set the according translation
     * @param none
     * @return none
     */
    function RefreshLabels()
    {
        FillActorAndSensorDropDownList();
        BuildInitializations();
        TranslateLabelsSVG();
        var LabelArray = $('.ECP_Label');
        for(var i = 0; i < LabelArray.length; i++)
        {
            LabelArray[i].textContent = GetLabel(LabelArray[i].getAttribute("LabelId"));
        }
        SetIndicators(Sensors,Actuators);
    }

    /**
     * Private function
     * Refresh labels and set the accordinf translation for SVG pictures
     * @param none
     * @return none
     */

    var TranslateLabelsSVG =  function (){

        var LabelArray = $(".ECP_SVG_TEXT");
        for(var i = 0; i < LabelArray.length; i++)
        {
            LabelArray[i].textContent = GetLabel(LabelArray[i].getAttribute("labelid").toLocaleUpperCase());
        }
    };

    this.TranslateLabelsSVG = TranslateLabelsSVG;

    /**
     * Private function
     * Set indicators (actuator and sensor list) to the according colour (HIGH - Green | LOW - Red)
     * @param {Array} Sensors
     * @param {Array} Actuators
     * @return none
     */
    function SetIndicators(Sensors, Actuators)
    {
        if (Sensors != undefined)
        {
            for (var i = 0; i < SettingsParameter.NumberOfSensors; i++)
            {
                if (Sensors[i])
                {
                    $('#indicator_x' + i + ' font').css("color", "green");
                }
                else
                {
                    $('#indicator_x' + i + ' font').css("color", "red");
                }
            }
        }

        if (Actuators != undefined)
        {
            for (var i = 0; i < SettingsParameter.NumberOfActuators; i++)
            {
                if (Actuators[i])
                {
                    $('#indicator_y' + i + ' font').css("color", "green");
                }
                else
                {
                    $('#indicator_y' + i + ' font').css("color", "red");
                }
            }
        }
    }

    /**
     * Private function
     * Handles incoming errors | Fills the error list and shows current errors in a pop up
     * @param {ErrorMessage} Error
     * @param {string} Text
     * @return none
     */
    function HandleError(Error, Text)
    {
        var now = new Date(),
            h = now.getHours().toString().padLeft(2,'0') ,
            m = now.getMinutes().toString().padLeft(2,'0') ,
            s = now.getSeconds().toString().padLeft(2,'0') ;

        $('#CompleteErrorText').prepend("<dt id=\"ErrorTextElement" + ErrorID + "\"><dt>&nbsp&nbsp(" + h + ":" + m + ":" + s + ") Error code " + Error.getParameterStringArray()[0] + ":</dt><dd><div align=\"center\">" + Text + " ("+ Error.getParameterStringArray()[1] +")</div></dd>");
        $('#TemporaryErrorText').prepend("<dt id=\"ErrorTextElement" + ErrorID + "\"><dt>&nbsp&nbsp(" + h + ":" + m + ":" + s + ") Error code " + Error.getParameterStringArray()[0] + ":</dt><dd><div align=\"center\">" + Text + " ("+ Error.getParameterStringArray()[1] +")</div></dd>");
        if (!FirstErrorOccured) {
            $('#ErrorLogList').html("<li id=\"ErrorListElement" + ErrorID + "\"><a href=\"#\"> Error " + Error.getParameterStringArray()[0] + " (" + h + ":" + m + ":" + s + ") </a></li>");
            FirstErrorOccured = true;
        }
        else {
            $('#ErrorLogList').prepend("<li id=\"ErrorListElement" + ErrorID + "\"><a href=\"#\"> Error " + Error.getParameterStringArray()[0] + " (" + h + ":" + m + ":" + s + ") </a></li>");
        }
        ErrorIDElementMatch["ErrorListElement" + ErrorID] = "#ErrorTextElement" + ErrorID;
        $('#ErrorListElement' + ErrorID).on("click", function () {
            var CompleteErrorDialog = $('#CompleteErrorDialog');
            CompleteErrorDialog.modal('show');

            var ListElementID = this.id;
            ClickedErrors.push(ErrorIDElementMatch[ListElementID]);

            CompleteErrorDialog.on('shown.bs.modal', function () {
                scrollToElement(ErrorIDElementMatch[ListElementID]);
                $(ErrorIDElementMatch[ListElementID]).css('background-color', '#898989');
                $('#CompleteErrorDialog').off('shown.bs.modal');
            });

            /*ErrorDialog.on('hidden.bs.modal', function () {

            });*/
        });

        ErrorID++;

        $('#TemporaryErrorDialog').modal('show');
    }

    function scrollToElement(selector, time, verticalOffset)
    {
        time = typeof(time) != 'undefined' ? time : 1000;
        verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
        element = $(selector);
        offset = element.offset();
        offsetTop = offset.top + verticalOffset;
        $('#ErrorDialog').animate({
            scrollTop: offsetTop
        }, time);
    }

    $("#" + SettingsParameter.ControlPanelDIVName).load("ECP/ControlPanel/ControlPanel.html?t=1", function ()
    {

        LoadCallback();
        InitializeControlPanelFunctions(SettingsParameter.Examples);
        RefreshLabels();
        FillLanguageDropDownList();
        SetBPULabel();
    });

    function BuildInitializations() {
        $('#InitializeList').html("");
        for (var i = 0; i < SettingsParameter.NumberOfInitializations; i++) {

            $('#InitializeList').prepend('<li id="Initialization_' + i + '"><a>' + GetLabel("INITIALIZATION_" + i) + '</a></li>');
            InitElementMatch["Initialization_" + i] = [i.toString(), "Initialization_" + i];

            $('#' + InitElementMatch["Initialization_" + i][1]).on('click', function () {
                var Message_PSPUStop = new CommandMessage();

                Message_PSPUStop.setType(EnumCommand.PSPUStop);

                EventHandler.fireCommandEvent(Message_PSPUStop);

                var Message_Initialize = new CommandMessage();

                Message_Initialize.setType(EnumCommand.Initialize);

                Message_Initialize.setParameterStringArray([InitElementMatch[this.id][0]]);

                EventHandler.fireCommandEvent(Message_Initialize);

            });
        }
        ActivateInitializeButtons();
    }

    function SendHoverEvent(Object)
    {
        var Message = new InternalHoverMessage();

        if($(Object).parent().attr('id') == "SensorList")
        {
            var Unit = $(Object).attr('id').replace("indicator_x","");
            Message.setType("Sensor");
        }
        else
        {
            var Unit = $(Object).attr('id').replace("indicator_y","");
            Message.setType("Actuator");
        }

        Message.setUnit(Unit);
        EventHandler.fireInternalHoverEvent(Message);
    }

    function FillLanguageDropDownList(){
        var LanguageArray = new Language();
        for (var Lang in LanguageArray.localesEN){
            $('#LanguageList').append('<li id="Language_' + Lang + '" LanguageId ="' + Lang + '"><a>'+ LanguageArray.locales[Lang] + ' (' + LanguageArray.localesEN[Lang] + ')</a></li>');
            $('#Language_' + Lang).on('click', function()
            {
                Settings.CurrentLanguage = this.getAttribute("LanguageId");
                RefreshLabels();
            });
        }
    }


    function FillActorAndSensorDropDownList()
    {
        $('#SensorList').html('<br><div style="text-align:center"><span style="color: green; font-weight:bold">"1"</span><span>&nbsp&nbsp&nbsp|&nbsp&nbsp&nbsp</span><span style="color: red; font-weight:bold">"0"</span><hr></div>');
        $('#ActuatorsList').html('<br><div style="text-align:center"><span style="color: green; font-weight:bold">"1"</span><span>&nbsp&nbsp&nbsp|&nbsp&nbsp&nbsp</span><span style="color: red; font-weight:bold">"0"</span><hr></div>');

        for (var i = 0; i < SettingsParameter.NumberOfSensors; i++) {
            $('#SensorList').append('<li id="indicator_x' + i + '"><a><font><b>x' + i.toString().padLeft(2,'0') + ' :    </b></font>' + GetLabel("SENSOR_X" + i) + '</a></li>');
            $('#indicator_x' + i).on('mouseover', function()
            {
                SendHoverEvent(this);
            });
        }

        for (var i = 0; i < SettingsParameter.NumberOfActuators; i++) {
            $('#ActuatorsList').append('<li id="indicator_y' + i + '"><a><font><b>y' + i.toString().padLeft(2,'0') + ' :    </b></font>' + GetLabel("ACTUATOR_Y" + i) + '</a></li>');
            $('#indicator_y' + i).on('mouseover', function()
            {
                SendHoverEvent(this);
            });
        }

        $('#SensorList').mouseleave(function()
        {
            var Message = new InternalHoverMessage();
            Message.setType("Clear");
            EventHandler.fireInternalHoverEvent(Message);
        });

        $('#ActuatorsList').mouseleave(function()
        {
            var Message = new InternalHoverMessage();
            Message.setType("Clear");
            EventHandler.fireInternalHoverEvent(Message);
        });
    }

    function BuildActorAndSensorsList()
    {
        FillActorAndSensorDropDownList();

        var NumberOfExamples = 0;
        var SelectedExample = undefined;

        $.each(SettingsParameter.Examples, function (i, Value) {
            $('#ExampleSelector').append('<li id="Example_' + NumberOfExamples + '"><a>' + GetLabel("EXAMPLE_" + SettingsParameter.DeviceType.toUpperCase() + "_" + NumberOfExamples) + '</a></li>');
            ExampleElementMatch["Example_" + NumberOfExamples] = [i.toString(), Value, GetLabel("EXAMPLE_" + SettingsParameter.DeviceType.toUpperCase() + "_" + NumberOfExamples), "Example_" + NumberOfExamples];
            NumberOfExamples++;
        });

        $('#LoadExampleOKButton').click(function (e) {
            if (SettingsParameter.Mode == "c" || SettingsParameter.Mode == "d") ShowWaitingDialog();
            var Message_LoadBPUExample = new CommandMessage();

            Message_LoadBPUExample.setType(EnumCommand.LoadBPUExample);

            Message_LoadBPUExample.setParameterStringArray([parseInt(SelectedExample[0]),SettingsParameter.Examples[[SelectedExample[0]]]]);

            EventHandler.fireCommandEvent(Message_LoadBPUExample);

            $(this).modal('hide');

        });

        for (var i = 0; i < NumberOfExamples; i++) {
            $('#' + ExampleElementMatch["Example_" + i][3]).on('click', function () {
                $('#ExampleDialogCaption').html('Load Example "' + ExampleElementMatch[this.id][2] + '" ?');
                SelectedExample = ExampleElementMatch[this.id];

                $('#ExampleDialog').modal({backdrop: 'static', keyboard: false});
            });
        }
    }

    function ConnectionTimeUpdate(ExperimentEndTime, ExperimentTime, StartTime)
    {
        var CurrentTime = new Date();
        var RelativeEndTime = ExperimentEndTime.getTime() - CurrentTime.getTime();

        if (ExperimentEndTime.getTime() < CurrentTime.getTime()) RelativeEndTime = 0;

        var AbsoluteEndTime = new Date(-1000 * 60 * 60 + RelativeEndTime);

        TimePassed = ExperimentTime + 1000 - RelativeEndTime;

        var ProgressBarValue = (TimePassed / ExperimentTime) * 100;

        if (ProgressBarValue >= 100) {
            $('#RemainingTimeText').html("The experiment time has expired");
            $('#RemainingTimeProgressBar').removeAttr('class');
            $('#RemainingTimeProgressBar').addClass('progress-bar progress-bar-danger');
            $('#RemainingTimeProgressBar').css('width', "100%");
        }
        else {
            $('#RemainingTimeText').html("" + GetLabel("ECP_CONNECTIONREMAININGTIME") +  " : " + ('0' + AbsoluteEndTime.getHours()).slice(-2) + ":" + ('0' + AbsoluteEndTime.getMinutes()).slice(-2) + ":" + ('0' + AbsoluteEndTime.getSeconds()).slice(-2));
            $('#RemainingTimeProgressBar').css('width', 100 - ProgressBarValue + "%");
        }
    }

    function SetRemainingTime()
    {
        var Counter = 0;
        var StartTime = new Date();
        var ExperimentEndTime = new Date(StartTime.getTime() + SettingsParameter.ValidTime);
        RemainingExperimentTimeTimer = setInterval(function () {
            ConnectionTimeUpdate(ExperimentEndTime, SettingsParameter.ValidTime, StartTime);
        }, 1000);

        KeepMainSiteAliveTimer = setInterval(function () {
            SetTimestampLastAction();
        }, 1000);
    }

    function LoadBreakpointsDialogContent()
    {
        $('#BreakpointsDialog').on('hidden.bs.modal', function ()
        {
            for (var i = 0; i < SettingsParameter.NumberOfSensors; i++)
            {
                var Content = $('#SensorButton' + i).html();
                if(Content != "✱")
                {
                    var Message = new CommandMessage();

                    Message.setType(EnumCommand.AddBreakpoint);

                    Message.setParameterStringArray(["Sensor",Content,i.toString(),Content]);

                    EventHandler.fireCommandEvent(Message);
                }
            }

            for (var i = 0; i < SettingsParameter.NumberOfActuators; i++)
            {
                var Content = $('#ActuatorButton' + i).html();
                if(Content != "✱")
                {
                    var Message = new CommandMessage();

                    Message.setType(EnumCommand.AddBreakpoint);

                    Message.setParameterStringArray(["Actuator",Content,i.toString(),Content]);

                    EventHandler.fireCommandEvent(Message);
                }
            }
        });

        function SetAllSensorButtonsToZero()
        {
            for (var i = 0; i < SettingsParameter.NumberOfSensors; i++)
            {
                $('#SensorButton' + i).html('0');
            }
        }

        function SetAllSensorButtonsToOne()
        {
            for (var i = 0; i < SettingsParameter.NumberOfSensors; i++)
            {
                $('#SensorButton' + i).html('1');
            }
        }

        function SetAllSensorButtonsToAsterisk()
        {
            for (var i = 0; i < SettingsParameter.NumberOfSensors; i++)
            {
                $('#SensorButton' + i).html("&#x2731");
            }
        }

        function SetAllActuatorButtonsToZero()
        {
            for (var i = 0; i < SettingsParameter.NumberOfActuators; i++)
            {
                $('#ActuatorButton' + i).html('0');
            }
        }

        function SetAllActuatorButtonsToOne()
        {
            for (var i = 0; i < SettingsParameter.NumberOfActuators; i++)
            {
                $('#ActuatorButton' + i).html('1');
            }
        }

        function SetAllActuatorButtonsToAsterisk()
        {
            for (var i = 0; i < SettingsParameter.NumberOfActuators; i++)
            {
                $('#ActuatorButton' + i).html("&#x2731")
            }
        }

        $('#BreakpointsDialogContent').load("ECP/ControlPanel/BreakpointsDialog.html", function ()
        {
            var content = "";

            content += '<p>';
            content += '<div class="row">';
            content += '<div class="col-md-8"><b> All Sensors </b></div>';
            content += '<div class="col-md-4">';
            content += '<button id="AllSensorsButton" type="button" class="btn btn-default btn-block">&#x2731</button>';
            content += '</p>';
            content += '</div>';
            content += '</div>';
            content += '<p>';

            for (var i = 0; i < SettingsParameter.NumberOfSensors; i++)
            {
                content += '<div class="row">';
                content += '<div id="SensorText_' + i + '" class="col-md-8 ellipsis">x' + i + ' :' + GetLabel("SENSOR_X" + i) + '</div>';
                content += '<div class="col-md-4">';
                content += '<button id="SensorButton' + i + '" type="button" class="btn btn-default btn-block">&#x2731</button>';
                content += '<p>';
                content += '</div>';
                content += '</div>';
            }
            $(this).find('#SensorList').html(content);

            for (var i = 0; i < SettingsParameter.NumberOfSensors; i++) {
                $('#SensorButton' + i).on('click', function () {
                    if ($(this).html() == '1')
                        $(this).html('0');
                    else if ($(this).html() == '0')
                        $(this).html("&#x2731");
                    else
                        $(this).html('1');
                });
            }

            content = "";

            content += '<p>';
            content += '<div class="row">';
            content += '<div class="col-md-8"><b> All Actuators </b></div>';
            content += '<div class="col-md-4">';
            content += '<button id="AllActuatorsButton" type="button" class="btn btn-default btn-block">&#x2731</button>';
            content += '</p>';
            content += '</div>';
            content += '</div>';
            content += '<p>';

            for (var i = 0; i < SettingsParameter.NumberOfActuators; i++)
            {
                content += '<div class="row">';
                content += '<div id="ActuatorText_' + i + '" class="col-md-8 ellipsis">y' + i + ' :' + GetLabel("ACTUATOR_Y" + i) + '</div>';
                content += '<div class="col-md-4">';
                content += '<button id="ActuatorButton' + i + '" type="button" class="btn btn-default btn-block">&#x2731</button>';
                content += '<p>';
                content += '</div>';
                content += '</div>';
            }
            $(this).find('#ActuatorsList').html(content);

            for (var i = 0; i < SettingsParameter.NumberOfActuators; i++)
            {
                $('#ActuatorButton' + i).on('click', function () {
                    if ($(this).html() == '1')
                        $(this).html('0');
                    else if ($(this).html() == '0')
                        $(this).html("&#x2731");
                    else
                        $(this).html('1');
                });
            }

            $(this).find('#AllSensorsButton').on('click', function ()
            {
                if ($(this).html() == '1') {
                    $(this).html('0');
                    SetAllSensorButtonsToZero();
                }
                else if ($(this).html() == '0') {
                    $(this).html("&#x2731");
                    SetAllSensorButtonsToAsterisk();
                }
                else {
                    $(this).html('1');
                    SetAllSensorButtonsToOne();
                }
            });

            $(this).find('#AllActuatorsButton').on('click', function ()
            {
                if ($(this).html() == '1') {
                    $(this).html('0');
                    SetAllActuatorButtonsToZero();
                }
                else if ($(this).html() == '0') {
                    $(this).html("&#x2731");
                    SetAllActuatorButtonsToAsterisk();
                }
                else {
                    $(this).html('1');
                    SetAllActuatorButtonsToOne();
                }
            });

            for (var i = 0; i < SettingsParameter.NumberOfSensors; i++)
            {
                $('#SensorText_' + i).attr('title', GetLabel("SENSOR_X" + i));

            }

            for (var i = 0; i < SettingsParameter.NumberOfActuators; i++)
            {
                $('#ActuatorText_' + i).attr('title', GetLabel("ACTUATOR_Y" + i));

            }
        });
    }

    function LightSwitch()
    {
        var CommandMessage_ = new CommandMessage();

        if(LightOn)
        {
            CommandMessage_.setType(EnumCommand.LightOff);
            LightOn = false;
            $('#LightButton').html('<img src="ECP/Animation/Images/lightbulb_off.png">');
        }
        else
        {
            CommandMessage_.setType(EnumCommand.LightOn);
            LightOn = true;
            $('#LightButton').html('<img src="ECP/Animation/Images/lightbulb_on.png">');
        }

        EventHandler.fireCommandEvent(CommandMessage_);
    }

    function InitializeControlPanelFunctions(Examples)
    {
        // Experiment control buttons

        if(SettingsParameter.Mode == "b")DisableUploadButton();

        //No uploads or lights in mode a
        if(SettingsParameter.Mode == "a" )
        {
            DisableLightButton();
            DisableUploadButton();
            State = "PSPUStopped";
        }

        if(SettingsParameter.DeviceType == "ManualControl")
        {
            DisableExampleButton();
        }

        $('#LightButton').on("click", function ()
        {
            LightSwitch();
        });

        $('#StartButton').on("click", function ()
        {
            PressStartButton();
            ToggleStartButton();
        });

        $('#SetBreakpointsButton').on('click', function ()
        {
            $('#BreakpointsDialog').modal('show');
            var CommandMessage_ = new CommandMessage();
            CommandMessage_.setType(EnumCommand.RemoveAllBreakpoints);
            EventHandler.fireCommandEvent(CommandMessage_);
        });

        $('#RestartButton').on("click", function ()
        {
            var CommandMessage_ = new CommandMessage();
            CommandMessage_.setType(EnumCommand.BPUReset);
            EventHandler.fireCommandEvent(CommandMessage_);
        });

        $('#SingleStepSensorsButton').on("click", function ()
        {
            var CommandMessage_ = new CommandMessage();
            CommandMessage_.setType(EnumCommand.PSPUSingleStepSensor);
            EventHandler.fireCommandEvent(CommandMessage_);
        });

        $('#SingleStepActuatorsButton').on("click", function ()
        {
            var CommandMessage_ = new CommandMessage();
            CommandMessage_.setType(EnumCommand.PSPUSingleStepActuator);
            EventHandler.fireCommandEvent(CommandMessage_);
        });

        $('#ToggleBreakpointsButton').on("click", function ()
        {
            ToggleBreakpoints();
        });

        // Upload button and dialog



        $("#FileUpload").attr('accept', Settings.BPUAllowedFileType);


        $('#UploadFileButton').on("click", function () {

            var formData = new FormData($('#UploadForm')[0]);
            $.ajax({
                url: 'index.php?Function=UploadFile',  //Server script to process data
                type: 'POST',
                //Ajax events
                //beforeSend: BeforeSendHandler,
                success: CompleteHandler,
                error: ErrorHandlerAjax,
                // Form data
                data: formData,
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
                contentType: false,
                processData: false
            });

            HideUploadDialog();
            ShowWaitingDialog();
            //SendFile(File);
            //$('#myForm').submit();
        });

        function CompleteHandler(data)
        {
            if(data == "0")
            {
                debug('File upload failed!');
            }
            else if(data == "1")
            {
                debug('File upload worked!');
            }
            var File = document.getElementById('FileUpload').files[0];
            ReadAndSendFile(File);

            //Show Waiting dialog

        }

        function ErrorHandlerAjax(error)
        {

        }

        $('#UploadButton').attr('title', "Upload your file");
        $('#HelpButton').attr('title', "Help");
        $('#ExampleButton').attr('title', "Choose experiment example");
        $('#SensorButton').attr('title', "Model sensors");

        $('#SensorDropDown').on('show.bs.dropdown', function () {
            $("#ActuatorDropDown").removeClass("open");
            this.closeable = false;
        });
        $('#SensorDropDown').on('click', function () {
            this.closeable = true;
        });
        $('#SensorDropDown').on('hide.bs.dropdown', function () {
            return this.closeable
        });

        $('#ActuatorButton').attr('title', "Model actuators");


        $('#ActuatorDropDown').on('show.bs.dropdown', function () {
            $("#SensorDropDown").removeClass("open");
            this.closeable = false;
        });
        $('#ActuatorDropDown').on('click', function () {
            this.closeable = true;
        });
        $('#ActuatorDropDown').on('hide.bs.dropdown', function () {
            return this.closeable;
        });

        $('#LanguageButton').attr('title', "Choose language");

        $('#SetBreakpointsButton').attr('title', "Set breakpoints");
        $('#ToggleBreakpointsButton').attr('title', "Activate breakpoints");
        $('#StartButton').attr('title', "Start");
        $('#RestartButton').attr('title', "Restart");
        $('#SingleStepActuatorsButton').attr('title', "Single step actuators");
        $('#SingleStepSensorsButton').attr('title', "Single step sensors");


        $('#myForm').submit(function () {
            // sendContactForm();
            return false;
        });

        $("#FileUpload").change(function () {
            if ($(this).val() != '') {
                var Extension = "";
                var File = document.getElementById('FileUpload').files[0];



                if (Settings.BPUAllowedFileType != "") {
                    if(File.name.split(".")[1] != undefined)
                    {
                        Extension = "." + File.name.split(".")[1];
                    }
                    if ( Extension  != Settings.BPUAllowedFileType) {
                        $('#UploadFileButton').prop('disabled', true);
                        $('#UploadDialogFooterInfo').html('<span style="color: red">'+ GetLabel("ECP_WRONGFILETYPE") + Settings.BPUAllowedFileType + '</span>');
                    }
                    else {
                        $('#UploadFileButton').prop('disabled', false);
                        $('#UploadDialogFooterInfo').html('');
                    }
                }
                else {
                    $('#UploadFileButton').prop('disabled', false);
                }
            }
            else {
                $('#UploadFileButton').prop('disabled', true);
                $('#UploadDialogFooterInfo').html('');
            }
        });

        $('#UploadButton').on("click", function () {
            if(SettingsParameter.DeviceType == "SPSLogo8"){
                let SPSWindow = window.open(`${SettingsParameter.GuacamoleURL}?ExperimentID=${SettingsParameter.ExperimentID}&Session=${GetCookie("PHPSESSID")}`,"_blank");

                window.addEventListener("beforeunload", function (e) {
                    SPSWindow.close();
                    return;
                });
            }else{
                ShowUploadDialog();
                SetProgrammingFileProgressBarToEmpty();
                SetUploadingFileProgressBarToWorking();
            }
        });

        //set all clicked errors to white
        $('#ErrorDialog').on('hide.bs.modal', function () {
            for (var i = 0; i < ClickedErrors.length; i++) {
                $(ClickedErrors[i]).css('background-color', '#FFF');
            }
        });

        BuildActorAndSensorsList();

        if (SettingsParameter.Mode == "b") {
            $("#" + SettingsParameter.WebCamDIVName).removeClass('col-md-6');
            $("#" + SettingsParameter.WebCamDIVName).addClass('col-md-4');

            $("#" + SettingsParameter.AnimationDIVName).removeClass('col-md-6');
            $("#" + SettingsParameter.AnimationDIVName).addClass('col-md-4');

            $("#" + SettingsParameter.RightPanelDIVName).removeClass('col-md-6');
            $("#" + SettingsParameter.RightPanelDIVName).addClass('col-md-4');
        }
        else if (SettingsParameter.Mode == "a") {
            $("#" + SettingsParameter.WebCamDIVName).remove();

            $("#" + SettingsParameter.RightPanelDIVName).removeClass('col-md-4');
            $("#" + SettingsParameter.RightPanelDIVName).addClass('col-md-6');
        }
        else {
            $("#" + SettingsParameter.RightPanelDIVName).remove();
        }

        $('#TemporaryErrorDialog').on('hidden.bs.modal', function () {
            $('#TemporaryErrorText').html('');
        });

        LoadBreakpointsDialogContent();
        SetRemainingTime();

        $('#CloseECPButton').on("click", function () {
            $('#ExitDialog')
                .modal({backdrop: 'static', keyboard: false})
                .one('click', '#exit', function (e) {
                    window.close();
                });
        });

        $('#CloseECPButton').attr('title', "Close ECP");


        $('#ECPLogoutButton').on("click", function () {
            $('#LogoutDialog')
                .modal({backdrop: 'static', keyboard: false})
                .one('click', '#logout', function (e) {

                    $.get("?Function=EndSession", function(){
                        window.close();
                    });
                });
        });

        $('#ECPLogoutButton').attr('title', "Log out");

        $(document).ready(function(){
            $('[title]').tooltip();
            $('[title]').click(function(){
                $(".tooltip").hide();
            });
        });
    }

    function ToggleStartButton()
    {
        if (State == "PSPUStopped")
        {
            $('#StartButton').html("<span class=\"glyphicon glyphicon-play\"></span>");
            $('#StartButton').attr('title', "Start");

        }
        else if (State == "PSPURunning" || State == "RunningExtra")
        {
            $('#StartButton').html("<span class=\"glyphicon glyphicon-stop\"></span>");
            $('#StartButton').attr('title', "Stop");
        }
    }

    function PressStartButton() {
        if (State == "PSPURunning" || State == "RunningExtra") {
            CommandMessage_ = new CommandMessage();
            CommandMessage_.setType(EnumCommand.PSPUStop);
            EventHandler.fireCommandEvent(CommandMessage_);

        }
        else if (State == "PSPUStopped") {
            CommandMessage_ = new CommandMessage();
            CommandMessage_.setType(EnumCommand.PSPURun);
            EventHandler.fireCommandEvent(CommandMessage_);
        }
    }

    function ToggleBreakpoints()
    {
        var CommandMessage_ = new CommandMessage();
        if (BreakpointsActive == false)
        {
            CommandMessage_.setType(EnumCommand.BreakpointEnable);
            EventHandler.fireCommandEvent(CommandMessage_);
            BreakpointsActive = true;
            $('#ToggleBreakpointsButton').html("<span class=\"glyphicon glyphicon-remove-circle\"></span>");
            $('#ToggleBreakpointsButton').attr('title', "Deactivate breakpoints");
        }
        else
        {
            CommandMessage_.setType(EnumCommand.BreakpointDisable);
            EventHandler.fireCommandEvent(CommandMessage_);
            BreakpointsActive = false;
            $('#ToggleBreakpointsButton').html("<span class=\"glyphicon glyphicon-ok-circle\"></span>");
            $('#ToggleBreakpointsButton').attr('title', "Activate breakpoints");
        }
    }

    function ActivateStartButtons()
    {
        $('#StartButton').removeAttr('disabled');
        $('#SingleStepActuatorsButton').removeAttr('disabled');
        $('#SingleStepSensorsButton').removeAttr('disabled');
        $('#RestartButton').removeAttr('disabled');
        $('#ExampleButton').removeAttr('disabled');
    }

    function ActivateBreakpointsButtons()
    {
        $('#ToggleBreakpointsButton').removeAttr('disabled');
        $('#SetBreakpointsButton').removeAttr('disabled');
    }

    function DisableBreakpointButtons()
    {
        $('#SetBreakpointsButton').attr('disabled', 'disabled');
        $('#ToggleBreakpointsButton').attr('disabled', 'disabled');
    }

    function DisableSingleStepButtons()
    {
        $('#SingleStepSensorsButton').attr('disabled', 'disabled');
        $('#SingleStepActuatorsButton').attr('disabled', 'disabled');
    }

    function DisableRestartButton()
    {
        $('#RestartButton').attr('disabled', 'disabled');
    }

    function DisableUploadButton()
    {
        $('#UploadButton').attr('disabled', 'disabled');
    }

    function ActivateUploadButton()
    {
        $('#UploadButton').removeAttr('disabled');
    }

    function DisableLightButton()
    {
        $('#LightButton').attr('disabled', 'disabled');
    }

    function ActivateLightButton()
    {
        $('#LightButton').removeAttr('disabled');
    }

    function DisableExampleButton()
    {
        $('#ExampleButton').attr('disabled', 'disabled');
    }

    function ActivateExampleButton()
    {
        $('#ExampleButton').removeAttr('disabled');
    }

    function ActivateRestartButton()
    {
        $('#RestartButton').removeAttr('disabled');
    }

    function ActivateSingleStepButtons()
    {
        $('#SingleStepSensorsButton').removeAttr('disabled');
        $('#SingleStepActuatorsButton').removeAttr('disabled');
    }

    function DisableAllButtons()
    {
        $('#StartButton').attr('disabled', 'disabled');
        $('#SingleStepSensorsButton').attr('disabled', 'disabled');
        $('#SingleStepActuatorsButton').attr('disabled', 'disabled');
        $('#RestartButton').attr('disabled', 'disabled');
        $('#InitializeButton').attr('disabled', 'disabled');
        $('#UploadButton').attr('disabled', 'disabled');
        $('#SetBreakpointsButton').attr('disabled', 'disabled');
        $('#ToggleBreakpointsButton').attr('disabled', 'disabled');
        $('#LightButton').attr('disabled', 'disabled');
        $('#ExampleButton').attr('disabled', 'disabled');
    }

    function ActivateInitializeButtons() {
        //only activate when there are available initializations
        if(SettingsParameter.NumberOfInitializations > 0)
        {
            $('#InitializeButton').removeAttr('disabled');
        }else{
            $('#InitializeButton').attr('disabled', 'disabled');
        }
    }

    function DisableInitializeButton()
    {
        $('#InitializeButton').attr('disabled', 'disabled');
    }

    function ActivateUploadButton() {
        $('#UploadButton').removeAttr('disabled');
    }

    function ShowUploadDialog() {
        $('#UploadDialog').modal('show');
    }

    function HideUploadDialog() {
        $('#UploadDialog').modal('hide');
    }

    function ShowWaitingDialog() {
        $('#WaitingDialog').modal('show');
        $('#ProgrammingProgressBar').css('width', '0%');
        $('#UploadingProgressBar').css('width', '0%');
    }

    function HideWaitingDialog() {
        $('#WaitingDialog').modal('hide');
        $('#UploadingProgressBar').removeClass('progress-bar-success');
        $('#UploadingProgressBar').addClass('progress-bar-striped active');
        $('#UploadingProgressBar').attr('width', '0%');
        $('#UploadingProgressBar').css('width', '0%');
        $('#ProgrammingProgressBar').removeClass('progress-bar-success');
        $('#ProgrammingProgressBar').addClass('progress-bar-striped active');
        $('#ProgrammingProgressBar').css('width', '0%');
    }

    function ShowLoadExampleDialog() {
        $('#LoadingExampleDialog').modal('show');
    }

    function HideLoadExampleDialog() {
        $('#LoadingExampleDialog').modal('hide');
    }

    function SetUploadingFileProgressBarToSuccess() {
        $('#UploadingProgressBar').removeClass('progress-bar-striped active');
        $('#UploadingProgressBar').addClass('progress-bar-success');
    }

    function SetProgrammingFileProgressBarToSuccess() {
        $('#ProgrammingProgressBar').removeClass('progress-bar-striped active');
        $('#ProgrammingProgressBar').addClass('progress-bar-success');
    }

    let programmingProgress;
    function SetProgrammingFileProgressBarToWorking() {
        $('#ProgrammingProgressBar').removeClass('progress-bar-success');
        $('#ProgrammingProgressBar').addClass('progress-bar-striped active');
        $('#ProgrammingProgressBar').css('width', '0%');
        programmingProgress = 0;
        ProgrammingProgressWorker = setInterval(ProgrammingProgressWorkerFunction,1000);
    }

    function SetUploadingFileProgressBarToWorking() {
        $('#UploadingProgressBar').removeClass('progress-bar-success');
        $('#UploadingProgressBar').addClass('progress-bar-striped active');
        $('#UploadingProgressBar').attr('aria-valuenow', 100);
    }

    function SetProgrammingFileProgressBarToEmpty() {
        $('#UploadingProgressBar').removeClass('progress-bar-success');
        $('#UploadingProgressBar').addClass('progress-bar-striped active');
        $('#ProgrammingProgressBar').css('width', '0%');
    }

    function ReadAndSendFile(File) {
        var Reader = new FileReader();
        var rawData = new ArrayBuffer();

        Reader.onload = function (e) {
            rawData = e.target.result;
            var ASCIIData = window.btoa(rawData);
            SendFile(ASCIIData, File);
        };

        Reader.readAsBinaryString(File);
    }

    function SendFile()
    {
        var Message = new CommandMessage();
        Message.setType(EnumCommand.LoadDesign);

        EventHandler.fireCommandEvent(Message);
    }

    function SendVisitorModeCommand()
    {
        var Message = new ServerInterfaceInfoMessage();

        Message.setInfoType(EnumServerInterfaceInfo.VisitorMode);

        EventHandler.fireServerInterfaceInfoEvent(Message);
    }

    function SetBPULabel()
    {
        $('#BPU_Type').html(Settings.DeviceType);
    }

    function ProgrammingProgressWorkerFunction(){
        if(programmingProgress >= 100){
            clearInterval(ProgrammingProgressWorker);
        }else{
            programmingProgress += 10;
            $('#ProgrammingProgressBar').css('width', programmingProgress + "%");
        }
    }

    function ControlPanelStateMachine(event)
    {
        if (event == "Disconnect")
        {
            State = "InitialState";
            DisableAllButtons();
        }
        else if (event == "Connect")
        {
            State = "WaitForConnectAck";
        }
        else if (event == EnumCommand.Acknowledge)
        {
            if (State == "WaitForConnectAck")
            {
                State = "PSPUStopped";
            }
        }
        else if (event == EnumCommand.FileTransferComplete)
        {
            SetUploadingFileProgressBarToSuccess();
            SetProgrammingFileProgressBarToWorking();
        }
        else if (event == EnumCommand.FileFlashComplete)
        {
            SetProgrammingFileProgressBarToSuccess();
            HideWaitingDialog();
            ActivateInitializeButtons();
        }
        else if (event == EnumCommand.Initialize)
        {
            DisableSingleStepButtons();
            DisableBreakpointButtons();
            DisableRestartButton();
            DisableUploadButton();
            DisableInitializeButton();
            State = "RunningExtra";
            ToggleStartButton();
            DisableExampleButton();
        }
        else if (event == EnumCommand.PSPUFinishedInit)
        {
            ActivateSingleStepButtons();
            ActivateBreakpointsButtons();
            ActivateRestartButton();
            if(SettingsParameter.Mode == "c" || SettingsParameter.Mode == "d")ActivateUploadButton();
            ActivateExampleButton();
            ActivateInitializeButtons();
            State = "PSPUStopped";
            ToggleStartButton();
        }
        else if(event == EnumCommand.PSPUErrorCode)
        {
            State = "PSPUStopped";
            ToggleStartButton();
        }
        else if (event == EnumCommand.PSPURun)
        {
            State = "PSPURunning";
            ToggleStartButton();
        }
        else if (event == EnumCommand.PSPUStop)
        {
            //if(State == "RunningExtra")
            //{
            ActivateSingleStepButtons();
            ActivateBreakpointsButtons();
            ActivateRestartButton();
            if(SettingsParameter.Mode == "c" || SettingsParameter.Mode == "d")ActivateUploadButton();
            ActivateExampleButton();
            ActivateInitializeButtons();
            ToggleStartButton();
            //}

            State = "PSPUStopped";
            ToggleStartButton();
        }
        else if(event == EnumCommand.LoadBPUExample || event == EnumCommand.LoadDesign){
            if (State == "PSPURunning" || State == "RunningExtra")
            {
                State = "PSPUStopped";
                ToggleStartButton();
            }
        }

        else if (event == EnumCommand.Nacknowledge)
        {
            DisableAllButtons();
            State = "InitialState";
        }
        else if (event == EnumCommand.PSPUSingleStepActuator)
        {
            DisableSingleStepButtons();
            DisableBreakpointButtons();
            DisableRestartButton();
            DisableUploadButton();
            DisableInitializeButton();
            State = "RunningExtra";
            ToggleStartButton();
            DisableExampleButton();
        }
        else if (event == EnumCommand.PSPUSingleStepSensor)
        {
            DisableSingleStepButtons();
            DisableBreakpointButtons();
            DisableRestartButton();
            DisableUploadButton();
            DisableInitializeButton();
            State = "RunningExtra";
            ToggleStartButton();
            DisableExampleButton();
        }
        else if(event == EnumCommand.PSPUReachedSingleStepActuator)
        {
            ActivateSingleStepButtons();
            ActivateBreakpointsButtons();
            ActivateRestartButton();
            if(SettingsParameter.Mode == "c" || SettingsParameter.Mode == "d")ActivateUploadButton();
            ActivateExampleButton();
            ActivateInitializeButtons();
            State = "PSPUStopped";
            ToggleStartButton();
        }
        else if(event == EnumCommand.PSPUReachedSingleStepSensor)
        {
            ActivateSingleStepButtons();
            ActivateBreakpointsButtons();
            ActivateRestartButton();
            if(SettingsParameter.Mode == "c" || SettingsParameter.Mode == "d")ActivateUploadButton();
            ActivateExampleButton();
            ActivateInitializeButtons();
            State = "PSPUStopped";
            ToggleStartButton();
        }
        else if(event == EnumCommand.ProgrammingError)
        {
            if(SettingsParameter.Mode == "c" || SettingsParameter.Mode == "d")
            {
                HideUploadDialog();
                HideWaitingDialog();
                alert("Programming failed");
            }
        }
    }
}
