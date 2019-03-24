function FSMInterpreter(EventHandler, SettingsParameter, CallBack, GetLabel)
{
    var Sensors = new Array(128);
    var Actuators = new Array(128);
    var ExperimentRunning = false;
    var FSMClockTimer = undefined;
    var FSMClockPeriodinMs = 25;
    var SensorQueue = [];
    var CurrentSensors = undefined;
    var AndSymbol = "&";
    var OrSymbol = "#";
    var NotSymbol = "!";

    //Variables needed for the GIFT Import
    var yEquationsImported;
    var zEquationsImported;
    var yEquationsImportedUnknownNames;
    var EquationsImportedUnknownXNames;

    FSMClockTimer = setInterval(function () {

        //if(SensorQueue.length != 0)
        //{
        //	CurrentSensors = SensorQueue.shift();
        //}
        if(Sensors != undefined)
        {
            SetAllOutPutEquations();
            Actuators = CalculateNewActuators(Sensors);
            if((ExperimentRunning) && ActuatorsOrSensorsHaveChanged(Sensors, Actuators))
                SendData(Actuators, Sensors);

        }


        // if(Actuators != undefined && ActuatorsOrSensorsHaveChanged(Sensors, Actuators))
        // {
        // if(ExperimentRunning)
        // SendData(Actuators, Sensors);
        // }
    }, FSMClockPeriodinMs);

    for (var i = 0; i < 128; i++)
    {
        Sensors[i] = false;
    }

    var SensorsHaveChangedOldSensors = new Array(128);

    for (var i = 0; i < 128; i++)
    {
        SensorsHaveChangedOldSensors[i] = false;
    }

    var ActuatorsHaveChangedOldSensors = new Array(128);

    for (var i = 0; i < 128; i++)
    {
        ActuatorsHaveChangedOldSensors[i] = false;
    }

    var FSM_ = new mode_FSM(SettingsParameter.NumberOfSensors, SettingsParameter.NumberOfActuators, SettingsParameter.NOTSign, SettingsParameter.ANDSign, SettingsParameter.ORSign, ErrorCallBack);

    var selectedMachine;
    var Machines = [];


    FSMInterpreter.prototype.onCommand = function (Command)
    {
        if (Command.getType() == EnumCommand.Initialize)
        {
            ExperimentRunning = false;
        }
        else if (Command.getType() == EnumCommand.PSPUFinishedInit)
        {
            //ExperimentRunning = true;
            //Set the Statevars back to their initial value after the Experiment has been initialized
            FSM_.reset();
            RefreshFsmGui();
        }
        else if (Command.getType() == EnumCommand.LoadBPUExample)
        {
            LoadExample(Command.getParameterStringArray()[1].replace(/\\n/g, "\n").replace(/\r/g, ""));
            KeyUpHandler();
            SensorsHaveChangedOldSensors[0] = undefined;
            ActuatorsHaveChangedOldSensors[0] = undefined;
            NewActorsOnBlur();
        }
        else if(Command.getType() == EnumCommand.PSPURun)
        {
            FSM_.resetTimedExpressionTimers();
            SendData(Actuators, Sensors);
            ActuatorsHaveChangedOldSensors[0] = undefined;
            ExperimentRunning = true;
        }
        else if(Command.getType() == EnumCommand.PSPUStop)
        {
            ExperimentRunning = false;
        }
        else if(Command.getType() == EnumCommand.PSPUSingleStepActuator)
        {
            //SensorsHaveChangedOldSensors[0] = undefined;
            //ActuatorsHaveChangedOldSensors[0] = undefined;
            ExperimentRunning = true;
        }
        else if(Command.getType() == EnumCommand.PSPUSingleStepSensor)
        {
            //SensorsHaveChangedOldSensors[0] = undefined;
            //ActuatorsHaveChangedOldSensors[0] = undefined;
            ExperimentRunning = true;
        }
    };

    FSMInterpreter.prototype.onServerInterfaceInfo = function (Info)
    {
        /*if (Info.getInfoType() == EnumServerInterfaceInfo.Disconnect)
         {
         ExperimentControlStateMachine("Disconnect");
         }
         else if (Info.getInfoType() == EnumServerInterfaceInfo.Connect)
         {
         ExperimentControlStateMachine("Connect");
         }*/
    };

    FSMInterpreter.prototype.onData = function (Data)
    {
        if(Data.getParameterStringArray()[0] != "BPU")
        {
            Sensors = Data.getSensors();


            //SensorQueue.push(Sensors);
            //Actuators = CalculateNewActuators(Sensors);
            //if(Actuators != undefined && ActuatorsOrSensorsHaveChanged(Sensors, Actuators))
            //{
            //    if(ExperimentRunning)
            //        SendData(Actuators, Sensors);
            //}
        }

    };

    function RemoveAllErrorIndicators()
    {
        for(var i = 0; i < SettingsParameter.NumberOfActuators; i++)
        {
            var EquationsGroup = $('#EquationInputGroup_' + i);
            EquationsGroup.removeClass('has-error');

            EquationsGroup.tooltip('destroy');
        }

        if(!isNaN(selectedMachine))
        {
            for (var i = 0; i < FSM_.getNumStateVariables(selectedMachine); i++)
            {
                var zEquation = $('#Machine_' + selectedMachine + '_ZEquation_' + i);
                zEquation.removeClass('has-error');

                zEquation.tooltip('destroy');
            }
        }

        for(var i = 0; i < FSM_.getTimedExpression().length; i++)
        {
            var TimedExpressionGroup = $('#TimedExpressionInputGroup_' + i);
            TimedExpressionGroup.removeClass('has-error');
            TimedExpressionGroup.tooltip('destroy');
        }
    }

    function ActuatorsOrSensorsHaveChanged(Sensors, Actuators)
    {
        if(Sensors != undefined)
        {
            if (SensorsHaveChangedOldSensors[0] == undefined)
            {
                SensorsHaveChangedOldSensors = Sensors.slice();
                return true;
            }

            for (var i = 0; i < Sensors.length; i++)
            {
                if (SensorsHaveChangedOldSensors[i] != Sensors[i])
                {
                    SensorsHaveChangedOldSensors = Sensors.slice();
                    return true;
                }
            }
        }

        if(Actuators != undefined)
        {
            if (ActuatorsHaveChangedOldSensors[0] == undefined)
            {
                ActuatorsHaveChangedOldSensors = Actuators.slice();
                return true;
            }

            for (var i = 0; i < Actuators.length; i++)
            {
                if (ActuatorsHaveChangedOldSensors[i] != Actuators[i])
                {
                    ActuatorsHaveChangedOldSensors = Actuators.slice();
                    return true;
                }
            }
        }
        return false;
    }

    function ErrorCallBack(Error)
    {
        var Message = new ErrorMessage();

        Message.setErrorCode(Error[0]);
        Message.setData(Error[1]);
        if(Error[1] != undefined && typeof(Error[1]) == "string")
        {
            if(Error[1].charAt(0) == "y")
            {
                var EquationsGroup = $('#EquationInputGroup_' + Error[1].replace('y',''));
                if(!EquationsGroup.hasClass('has-error'))
                {
                    EquationsGroup.addClass('has-error');
                    EquationsGroup.attr('data-original-title', GetLabel("ERROR_PARSE_" + Error[0]));
                    EquationsGroup.tooltip('show');
                }

            }
            else if(Error[1].charAt(0) == "a")
            {

                var zEquation = $('#Machine_' + selectedMachine + '_ZEquation_' + Error[1].replace(new RegExp('a[0-9]+z'), ''));
                if(!zEquation.hasClass('has-error'))
                {
                    zEquation.addClass('has-error');
                    zEquation.attr('data-original-title', GetLabel("ERROR_PARSE_" + Error[0]));
                    zEquation.tooltip('show');
                }

            }
            else if(Error[1].charAt(0) == "t")
            {
                var TimedExpressionGroup = $('#TimedExpressionInputGroup_' + Error[1].replace("te",""));
                if(!TimedExpressionGroup.hasClass('has-error'))
                {
                    TimedExpressionGroup.addClass('has-error');
                    TimedExpressionGroup.attr('data-original-title', GetLabel("ERROR_PARSE_" + Error[0]));
                    TimedExpressionGroup.tooltip('show');
                }
            }
        }
        //EventHandler.fireInternalErrorEvent(Message);
        if(ExperimentRunning == true)
        {
            var CommandMessage_ = new CommandMessage();
            CommandMessage_.setType(EnumCommand.PSPUStop);
            EventHandler.fireCommandEvent(CommandMessage_);
        }

    }

    function CalculateNewActuators(Sensors_)
    {
        var SensorsInternal = Sensors_.slice();
        var PrunedModelSensorArray = new Array(SettingsParameter.NumberOfSensors);
        var PrunedModelActuatorsArray = new Array(SettingsParameter.NumberOfActuators);
        var FullModelActuatorsArray = new Array(128);

        for (var i = 0; i < SettingsParameter.NumberOfSensors; i++)
        {
            if (SensorsInternal[i])
            {
                PrunedModelSensorArray[i] = new token('Boolean', true);
            }
            else
            {
                PrunedModelSensorArray[i] = new token('Boolean', false);
            }
        }
        FSM_.setInput(PrunedModelSensorArray);
        PrunedModelActuatorsArray = FSM_.calculate();

        if (!isNaN(selectedMachine)) { //is a valid machine selected?
            $('#CurrentStateInput').val(FSM_.getCurrentState(selectedMachine));
        }

        for (var i = 0; i < SettingsParameter.NumberOfActuators; i++)
        {
            if(PrunedModelActuatorsArray[i] == undefined) return undefined;
            FullModelActuatorsArray[i] = !!PrunedModelActuatorsArray[i].value;

        }

        for (var i = SettingsParameter.NumberOfActuators; i < 128; i++)
        {
            FullModelActuatorsArray[i] = false;
        }

        return FullModelActuatorsArray.slice();
    }

    function RefreshLabels() {

        var LabelArray = $('.ECP_Label');
        for(var i = 0; i < LabelArray.length; i++){
            LabelArray[i].textContent = GetLabel(LabelArray[i].getAttribute("LabelId"));
        }
    }

    $("#" + SettingsParameter.RightPanelDIVName).load("ECP/Simulation/FSMInterpreter.html", function () {
        BuildFSMExecuterContent();
        CallBack();
        RefreshLabels();
    });

    function EnableCalculation()
    {
        for (var i = 0; i < SettingsParameter.NumberOfActuators; i++) {
            SetOutputEquation(i, $('#output_y' + i).val());
        }

        Actuators = CalculateNewActuators(Sensors);
        SendData(Actuators, Sensors);
    }

    function SetAllOutPutEquations()
    {
        for (var i = 0; i < SettingsParameter.NumberOfActuators; i++)
        {
            SetOutputEquation(i, $('#output_y' + i).val());
        }
    }

    function LoadState(theFile)
    {

        var Reader = new FileReader();

        Reader.onload = (function (e) {
            LoadExample(e.target.result);
        });

        Reader.readAsText(theFile);
    }

    function FSM_ShowUploadDialog()
    {
        $('#FSM_UploadDialog').modal('show');
    }

    function FSM_HideUploadDialog()
    {
        $('#FSM_UploadDialog').modal('hide');
    }

    function FSM_ShowImportGiftDialog()
    {
        $('#FSM_ImportGIFTDialog').modal('show');
    }

    function FSM_HideImportGiftDialog()
    {
        $('#FSM_ImportGIFTDialog').modal('hide');
    }


    function BuildFSMExecuterContent()
    {
        RefreshFsmGui();

        $('#PlusTimedExpression').on("click", function () {
            AddTimedExpression();
        });

        $('#MinusTimedExpression').on("click", function () {
            RemoveTimedExpression();
        });


        $('#RemoveMachineButton').attr('data-original-title', GetLabel("ECP_DELETEMACHINE"));
        $('#RemoveMachineButton').on('mouseover', function () {
            $(this).tooltip('show');
        });

        $('#AddMachineButton').on('click', function () {
            $('#AddMachineName').val("");
            $(this).tooltip('destroy');
        });

        $("#AddMachineDialog").on("shown.bs.modal",function() {
            $('#AddMachineName').focus();
        });

        $('#AddMachineName').on("keypress", function(event){
            var Keycode = event.keyCode ? event.keyCode : event.which;
            if(Keycode == "13")
                $("#AddMachineSaveButton").click();
        });

        $('#AddMachineButton').attr('data-original-title', GetLabel("ECP_ADDMACHINE"));
        $('#AddMachineButton').on('mouseover', function () {
            $(this).tooltip('show');
        });

        $('#SaveFileButton').on('click', function () {
            SaveCurrentState();
        });

        $('#SaveFileButton').attr('data-original-title', "Save file");
        $('#SaveFileButton').on('mouseover', function () {
            $(this).tooltip('show');
        });

        $('#OpenFileButton').on("click", function () {
            FSM_ShowUploadDialog();
        });

        $('#ImportGIFTButton').on("click", function () {
            ImportGIFT();
        });


        $('#OpenFileButton').attr('data-original-title', "Open file");
        $('#OpenFileButton').on('mouseover', function () {
            $(this).tooltip('show');
        });

        $('#FSM_UploadFileButton').on("click", function () {
            var File = document.getElementById('FSM_FileUpload').files[0];
            LoadState(File);
            FSM_HideUploadDialog();
        });

        $("#FSM_FileUpload").change(function () {
            if ($(this).val() != '') {
                var Extension = ".ecp";
                var File = document.getElementById('FSM_FileUpload').files[0];

                if (File.name.substring(File.name.length - 4) != Extension) {
                    $('#FSM_UploadFileButton').prop('disabled', true);
                    $('#FSM_UploadDialogFooterInfo').html('<span style="color: red">Wrong file type selected! Please choose again</span>');
                }
                else {
                    $('#FSM_UploadFileButton').prop('disabled', false);
                    $('#FSM_UploadDialogFooterInfo').html('');
                }
            }
            else {
                $('#FSM_UploadFileButton').prop('disabled', true);
                $('#FSM_UploadDialogFooterInfo').html('');
            }
        });

        $('#AddMachineSaveButton').on("click", function () {
            $('#AddMachineDialog').modal('hide');
            CreateMachine($('#AddMachineName').val());
            $('#RemoveMachineButton').removeAttr('disabled');
        });

        $('#DeleteDialog').on('show.bs.modal', function () {
            $('#DeleteDialogCaption').html(GetLabel("ECP_DELETEMACHINE") + ' ' + $('#MachineSelector option:selected').text() + '"?');

        });

        $('#RemoveMachineButton').on("click", function () {
            $('#DeleteDialog')
                .modal({backdrop: 'static', keyboard: false})
                .one('click', '#delete', function (e) {
                    debug("Destroying Machine: " + parseInt($('#MachineSelector option:selected').attr('machineid')));
                    DestroyMachine(parseInt($('#MachineSelector option:selected').attr('machineid')));

                    RebuildMachineSelector();
                    RefreshFsmGui();

                    if ($('#MachineSelector option').size() == 0) {
                        $('#RemoveMachineButton').prop('disabled', true);
                    }
                    else {
                        $('#MachineSelector option[machineid="' + 0 + '"]').attr('selected', 'selected');
                    }
                    $(this).modal('hide');
                });
        });

        $('#MachineSelector').change(function () {
            RefreshFsmGui();
        });

        $('#InitialStateInput').change(function () {
            SetCurrentInitialState($(this).val());
        });

        $("#FSM_DeleteAllEquationsModalButtonOk").click("click", function () {
            $("#FSM_DeleteAllEquationsDialog").modal("hide");
            ClearAllEquations();
            $('#RemoveMachineButton').prop('disabled', true);
        });

        $('#FSM_ImportGIFTButton').on("click", function () {
            confirmGIFTImport();
            $('#ImportGIFTMachineName').val("");
            $('#RemoveMachineButton').prop('disabled', true);
        });


        $('#DeleteAllEquationsButton').attr('data-original-title', "Delete all equations");
        $('#DeleteAllEquationsButton').on('mouseover', function () {
            $(this).tooltip('show');
        });
    }

    function SaveCurrentState() {
        var StateString = '';
        for (var idx in Machines) {
            StateString += 'a' + idx + 'd=' + Machines[idx] + '\n';
            StateString += 'a' + idx + 'v=' + FSM_.getNumStateVariables(idx) + '\n';
            StateString += 'a' + idx + 'i=' + FSM_.getInitialState(idx) + '\n';
            for (var i = 0; i < FSM_.getNumStateVariables(idx); i++) {
                StateString += 'a' + idx + 'z' + i + '=' + FSM_.getStateEquation(idx, i) + '\n';
            }
        }
        for (var i = 0; i < SettingsParameter.NumberOfActuators; i++) {
            StateString += 'y' + i + '=' + $('#output_y' + i).val() + '\n';
        }
        let TimedExpressions = FSM_.getTimedExpression();
        for (var i = 0; i < TimedExpressions.length; i++) {
            StateString += 'te' + i + '=' + TimedExpressions[i].Expression.getExpressionString().trim() + ";" + TimedExpressions[i].Time + '\n';
        }
        var blob = new Blob([StateString], {type: "text/plain;charset=utf-8"});
        saveAs(blob, SettingsParameter.FileName);
    }

    function ImportGIFT()
    {
        //check if local storage is supportet
        if(localStorage == undefined){
            console.log("Local Storage not supported!");
        }

        var numZEquations =  localStorage.getItem("numZEquations");
        var numYEquations =  localStorage.getItem("numYEquations");

        //is there anything useful in the local storage?
        if(numZEquations == null || numYEquations == null)
        {
            console.log("No GIFT export found in local storage");
        }

        var yEquations = [];
        var zEquations = [];

        //get all the statevariables from the local storage
        for(var i = 0; i<numZEquations;i++){
            var equation = localStorage.getItem("A0Z" + i);
            if(equation == '0') {
                zEquations[i] = '0'
            }
            else
            {
                zEquations[i] = equation.split("=")[1];
                zEquations[i] = zEquations[i].replace(/z/g,'a0z');
                zEquations[i] = zEquations[i].replace(/\//g,NotSymbol);
                zEquations[i] = zEquations[i].replace(/\*/g,AndSymbol);
                zEquations[i] = zEquations[i].replace(/\+/g,OrSymbol);

            }

        }

        var yEquationsExtracted = [];
        for(var i = 0; i<numYEquations;i++){
            var equation = localStorage.getItem("Y" + i);
            if(equation == '0') {
                yEquations[i] = {name: "Y" + i, equation: "0"};
            }
            else {
                equation = equation.replace(/z/g,'a0z');
                equation = equation.replace(/\//g,NotSymbol);
                equation = equation.replace(/\*/g,AndSymbol);
                equation = equation.replace(/\+/g,OrSymbol);
                yEquations[i] = {name: equation.split("=")[0], equation:equation.split("=")[1]};
                yEquationsExtracted[i] = equation.split("=")[1];
            }
        }


        //now it's time to find the undefined variables for the zEquations
        var UnknownVars = identifyUnknownVariables(zEquations.concat(yEquationsExtracted));
        //and also for the yEquations
        var UnknownYNames = identifyUnknownYNames(yEquations);
        //now it is time to pop up the dialog for assigning unknown variables
        assignGiftVariablesPopup(UnknownVars,UnknownYNames);
        yEquationsImported = yEquations;
        yEquationsImportedUnknownNames = UnknownYNames;
        EquationsImportedUnknownXNames = UnknownVars;
        zEquationsImported = zEquations;
        FSM_ShowImportGiftDialog();


    }

    function confirmGIFTImport()
    {
        //get the values from the selection boxes
        var replaceXVars = [];
        for (var i = 0; i < EquationsImportedUnknownXNames.length; i++)
        {
            replaceXVars[i] = 'x' + $('#x' + i +'_ImportVarSelector').val();
        }

        var assignYVars = [];
        for (var i = 0; i < yEquationsImportedUnknownNames.length; i++)
        {
            assignYVars[i] ='y' + $('#y' + i +'_ImportVarSelector').val();
        }

        //check for duplicate Y assignment
        for(var i = 0; i < assignYVars.length; i++){
            for(var j = 0; j < assignYVars.length; j++)
            {
                if(i!=j && assignYVars[i] == assignYVars[j])
                {
                    //duplicate detected!
                    alert("Failed Importing GIFT machine due to duplicate Y-Equation assignment!");
                    return;
                }
            }
        }

        let yEquationsAssigned = [];
        //replace the names of the y-Equations and the occurence of any unknown x in the y equations
        for(var i = 0; i < assignYVars.length; i++){
            yEquationsAssigned[i] = {};
            yEquationsAssigned[i].name = assignYVars[i];

            for(var j = 0; j <  yEquationsImported.length; j++)
                if(yEquationsImported[i].name == yEquationsImportedUnknownNames[j])
                    yEquationsAssigned[i].equation = yEquationsImported[j].equation;

            for(var j = 0; j <  EquationsImportedUnknownXNames.length; j++){
                var regEx = new RegExp( EquationsImportedUnknownXNames[j], 'g');
                yEquationsAssigned[i].equation = yEquationsAssigned[i].equation.replace(regEx,replaceXVars[j]);
            }
        }
        yEquationsImported = yEquationsAssigned;

        //now replace the x variables in the z equations!
        for(var i = 0; i < zEquationsImported.length; i++)
        {
            for(var j = 0; j <  EquationsImportedUnknownXNames.length; j++){
                var regEx = new RegExp(EquationsImportedUnknownXNames[j] ,'g');
                zEquationsImported[i] = zEquationsImported[i].replace(regEx,replaceXVars[j]);
            }
        }

        ClearAllEquations();


        if(zEquationsImported.length > 0)
        {
            //time to create the machine
            var machineId = CreateMachine( $('#ImportGIFTMachineName').val());
            for(var i = 1; i < zEquationsImported.length; i++){
                IncreaseStatevar(machineId);
            }
            for (var i = 0; i < zEquationsImported.length; i++) {
                SetStateEquation(machineId, i, zEquationsImported[i]);
            }
            FSM_.setInitialState(machineId, 0);
        }
        if(yEquationsImported.length > 0)
        {
            for(var i = 0; i < yEquationsImported.length;i++)
            {
                //do the renaming of the y equations;
                for(var j = 0; j <SettingsParameter.NumberOfActuators; j++)
                {
                    if(yEquationsImported[i].name == "y" + j)
                    {
                        FSM_.setOutputEquation(j, yEquationsImported[i].equation);
                    }
                }
            }
        }
        RebuildMachineSelector();
        RefreshFsmGui();
        FSM_HideImportGiftDialog();

    }

    function identifyUnknownYNames(yEquations)
    {
        var result = [];
        for(var i = 0; i < yEquations.length; i++)
        {
            var equationName = yEquations[i].name;
            if (equationName.length < 3)
            {
                result.push(equationName);
            }
            else if (equationName.charAt(0) != "y")
            {
                result.push(equationName);
            }
            else
            {
                var isYNumber = true;
                var yNumber = "";
                for(i = 1; i < equationName.length;i++){
                    if(!isNumber(equationName.charAt(i)))
                    {
                        result.push(equationName);
                        isYNumber = false;
                    }
                    else
                    {
                        yNumber += variable.charAt(i);
                    }
                }
                if(isYNumber)
                {
                    yNumber = parseInt("xNumber");
                    if(yNumber > SettingsParameter.NumberOfActuators){
                        result.push(equationName);
                    }
                }
            }

        }
        return result;
    }

    function assignGiftVariablesPopup(UnknownX,UnknownY) {
        //first build the dialog
        content = '<table id="x_variables_table"><tbody>';
        content += '<tr><td colspan="2"><span>Please assign valid Sensors to the following X Variables of the imported Machine:</span></tr></td>';
        content += '<tr class="blank_row"><td colspan="2"></td></tr>';
        //build the content for the x-Var assignment
        var xVarSelectionContent = '';
        for (var j = 0; j < SettingsParameter.NumberOfSensors; j++) {
            xVarSelectionContent += '<option value="'+ j +'">X' + j + ': ' + GetLabel("SENSOR_X" + j) + '</option>"'
        }
        for (var i = 0; i < UnknownX.length; i++) {
            content += '<tr><td><span id="XName' + i + 'Label">' + UnknownX[i] + ': </span></td>';
            content += '<td><select id="x' + i + '_ImportVarSelector">' + xVarSelectionContent + '</td></tr>'
        }
        content += '<tr class="blank_row"><td colspan="2"></td></tr>';
        //build the content for the y-Var assignment;
        content += '<tr><td colspan="2"><span>Please assign valid Actuators to the following Y Variables of the imported Machine:</span></tr></td>';
        content += '<tr class="blank_row"><td colspan="2"></td></tr>';
        var yVarSelectionContent = '';
        for (var j = 0; j < SettingsParameter.NumberOfActuators; j++) {
            yVarSelectionContent += '<option value="'+ j +'">Y' + j + ': ' + GetLabel("ACTUATOR_Y" + j) + '</option>"'
        }
        for (var i = 0; i < UnknownY.length; i++) {
            content += '<tr><td><span id="YName' + i + 'Label">' + UnknownY[i] + ': </span></td>';
            content += '<td><select id="y' + i + '_ImportVarSelector">' + yVarSelectionContent + '</select></td></tr>'
        }
        content += '</tbody></table>';
        $('#VariableAssignmentDiv').html(content);
    }

    function identifyUnknownVariables(equations)
    {
        var Variables = [];
        for(var i = 0; i < equations.length;i++)
        {
            var expressionString = equations[i];
            var currentPostition = 0;
            while(currentPostition < expressionString.length)
            {
                //Is this the begin of a variable?
                if (isLetter(expressionString.charAt(currentPostition))) {
                    //skip all machine variables!
                    if(expressionString.charAt(currentPostition) == "a" && expressionString.charAt(currentPostition + 1) == "0" && expressionString.charAt(currentPostition + 2) == "z")
                    {
                        while (isLetter(expressionString.charAt(currentPostition)) || isNumber(expressionString.charAt(currentPostition))) {
                            currentPostition++;
                        }
                    }
                    else
                    //this is a non machine variable
                    {
                        var Ident = "";
                        while (isLetter(expressionString.charAt(currentPostition)) || isNumber(expressionString.charAt(currentPostition))) {
                            Ident += expressionString.charAt(currentPostition);
                            currentPostition++;
                        }
                        if(!isKnownVariable(Ident))
                        {
                            var alreadyfound = false;
                            for(var j = 0; j < Variables.length; j++)
                            {
                                if(Variables[j] == Ident){
                                    alreadyfound = true;
                                }
                            }
                            if(!alreadyfound){
                                Variables.push(Ident);
                            }
                        }
                    }
                }else{
                    //no variable beginning detected, proceed to the next char
                    currentPostition++;
                }
            }
        }
        return Variables;
    }

    function isLetter(str) {
        return /^[a-zA-Z]$/.test(str);
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    //this function will return true if the variable is a valid x-variable
    function isKnownVariable(variable)
    {
        if(variable.length < 2){
            return false;
        }
        if(variable.charAt(0) != "x"){
            return false;
        }
        var xNumber = "";
        for(i = 1; i < variable.length;i++){
            if(!isNumber(variable.charAt(i)))
            {
                return false;
            }
            else
            {
                xNumber += variable.charAt(i);
            }
        }
        xNumber = parseInt("xNumber");
        return xNumber < SettingsParameter.NumberOfSensors;

    }

    function ClearAllEquations() {
        for (var idx in Machines) {
            if (Machines[idx] != undefined) {
                FSM_.destroyMachine(idx);
                Machines[idx] = undefined;
            }
        }
        Machines = [];
        for (var i = 0; i < SettingsParameter.NumberOfActuators; i++) {
            FSM_.setOutputEquation(i, '0');
        }
        FSM_.unsetTimedExpressions();
        RebuildMachineSelector();
        RefreshFsmGui();
    }

    function LoadExample(exampleString) {
        exampleString = exampleString.replace(/\\n/g, "\n").replace(/\r/g, "");
        ClearAllEquations();

        var position = 0;
        var currentMachineNumber = 0;
        var currentLine = 0;
        var timedExpressionCounter = 0;
        while (position < exampleString.length) {
            //Is this  a machine definition?
            if (exampleString.charAt(position) == 'a') {
                position++;
                var machineDescription = '';
                var variableCount = 1;
                var initialState = 0;
                //get the MachineNumber
                if (isNaN(exampleString.charAt(position))) {
                    //Invalid Machine Number given!
                    ErrorCallBack([26]);
                    return;
                }
                currentMachineNumber = exampleString.charAt(position++);
                while (!isNaN(exampleString.charAt(position))) {
                    if (position >= exampleString.length) {
                        //Invalid Syntax, missing linebreak
                        ErrorCallBack([26]);
                        return;
                    }
                    currentMachineNumber = parseInt(currentMachineNumber) * 10 + parseInt(exampleString.charAt(position++));
                }
                //get the description
                if (exampleString.charAt(position++) != 'd') {
                    //No description given for Machine
                    ErrorCallBack([26]);
                    return;
                }
                if (exampleString.charAt(position++) != '=') {
                    //Syntax error
                    ErrorCallBack([26]);
                    return;
                }
                while (exampleString.charCodeAt(position) != 10) {
                    if (position >= exampleString.length) {
                        //Missing linebreak
                        ErrorCallBack([26]);
                        return;
                    }
                    machineDescription = machineDescription + exampleString.charAt(position++);
                }
                currentLine++;
                position++;
                //get the number of statevars of this  machine
                if (exampleString.charAt(position++) != 'a') {
                    //Incomplete Machine definition, missing variable count
                    ErrorCallBack([26]);
                    return;
                }
                //compare the machinenumber of this  line with the current machine
                var testMachineNumber = 0;
                testMachineNumber = exampleString.charAt(position++);
                while (!isNaN(exampleString.charAt(position))) {
                    if (position >= exampleString.length) {
                        //Missing linebreak
                        ErrorCallBack([26]);
                        return;
                    }
                    testMachineNumber = parseInt(testMachineNumber) * 10 + parseInt(exampleString.charAt(position++));
                }
                if (testMachineNumber != currentMachineNumber) {
                    //wrong machine number!
                    ErrorCallBack([26]);
                    return;
                }
                if (exampleString.charAt(position++) != 'v') {
                    //Incomplete Machine definition, missing variable count
                    ErrorCallBack([26]);
                    return;
                }
                if (exampleString.charAt(position++) != '=') {
                    //invalid syntax
                    ErrorCallBack([26]);
                    return;
                }
                //get number of statevars;
                variableCount = exampleString.charAt(position++);
                while (!isNaN(exampleString.charAt(position)) && exampleString.charCodeAt(position) != 10) {
                    if (position >= exampleString.length) {
                        //missing linebreak
                        ErrorCallBack([26]);
                        return;
                    }
                    variableCount = parseInt(variableCount) * 10 + parseInt(exampleString.charAt(position++));
                }
                //now there must be a line break!
                if (exampleString.charCodeAt(position) != 10) {
                    //invalid syntax
                    ErrorCallBack([26]);
                    return;
                }
                currentLine++;
                position++;

                //get the initial State of the machine
                if (exampleString.charAt(position++) != 'a') {
                    //Incomplete Machine definition, missing initial state
                    ErrorCallBack([26]);
                    return;
                }
                var testMachineNumber = exampleString.charAt(position++);
                while (!isNaN(exampleString.charAt(position))) {
                    if (position >= exampleString.length) {
                        //missing linebreak
                        ErrorCallBack([26]);
                        return;
                    }
                    testMachineNumber = parseInt(testMachineNumber) * 10 + parseInt(exampleString.charAt(position++));
                }
                if (testMachineNumber != currentMachineNumber) {
                    //wrong machine number!
                    ErrorCallBack([26]);
                    return;
                }
                if (exampleString.charAt(position++) != 'i') {
                    //initial state missing
                    ErrorCallBack([26]);
                    return;
                }
                if (exampleString.charAt(position++) != '=') {
                    //syntax error
                    ErrorCallBack([26]);
                    return;
                }
                //get number of statevars;
                initialState = exampleString.charAt(position++);
                while (!isNaN(exampleString.charAt(position)) && exampleString.charCodeAt(position) != 10) {
                    initialState = parseInt(initialState) * 10 + parseInt(exampleString.charAt(position++));
                }
                //now there must be a line break!
                if (exampleString.charCodeAt(position) != 10) {
                    //missing line break
                    ErrorCallBack([26]);
                    return;
                }
                currentLine++;
                position++;

                //get all the state equations!
                var stateEquations = [];
                for (var i = 0; i < variableCount; i++) {
                    if (exampleString.charAt(position++) != 'a') {
                        //incomplete state equation definition
                        ErrorCallBack([26]);
                        return;
                    }
                    var testMachineNumber = exampleString.charAt(position++);
                    while (!isNaN(exampleString.charAt(position))) {
                        if (position >= exampleString.length) {
                            //missing linebreak
                            ErrorCallBack([26]);
                            return;
                        }
                        testMachineNumber = parseInt(testMachineNumber) * 10 + parseInt(exampleString.charAt(position++));
                    }
                    if (testMachineNumber != currentMachineNumber) {
                        //wrong machine number!
                        ErrorCallBack([26]);
                        return;
                    }
                    if (exampleString.charAt(position++) != 'z') {
                        //incomplete state equation definition
                        ErrorCallBack([26]);
                        return;
                    }
                    //Test if this  is the correct statevar!

                    var testStatevarNumber = exampleString.charAt(position++);
                    while (!isNaN(exampleString.charAt(position))) {
                        if (position >= exampleString.length) {
                            //missing linebreak
                            ErrorCallBack([26]);
                            return;
                        }
                        testStatevarNumber = parseInt(testStatevarNumber) * 10 + parseInt(exampleString.charAt(position++));
                    }
                    if (testStatevarNumber != i) {
                        //wrong statevar!
                        ErrorCallBack([26]);
                        return;
                    }
                    if (exampleString.charAt(position++) != '=') {
                        //incomplete state equation definition
                        ErrorCallBack([26]);
                        return;
                    }
                    //now the equation!
                    var currentEquationString = '';
                    while (exampleString.charCodeAt(position) != 10) {
                        if (position >= exampleString.length) {
                            //missing linebreak
                            ErrorCallBack([26]);
                            return;
                        }
                        currentEquationString = currentEquationString + exampleString.charAt(position++);
                    }
                    stateEquations[i] = currentEquationString;
                    position++;
                    currentLine++;
                }
                //time to create the machine
                var machineId = CreateMachine(machineDescription);
                for (var i = 1; i < variableCount; i++) {
                    IncreaseStatevar(machineId);
                }
                for (var i = 0; i < variableCount; i++) {
                    SetStateEquation(machineId, i, stateEquations[i]);
                }
                FSM_.setInitialState(machineId, initialState);
            }
            //Is this  the beginning of the output equations?
            if (exampleString.charAt(position) == 'y') {
                var outputEquations = [];
                for (var i = 0; i < SettingsParameter.NumberOfActuators; i++) {
                    if (exampleString.charAt(position++) != 'y') {
                        //invalid syntax
                        ErrorCallBack([26]);
                        return;
                    }
                    var testVarNumber = exampleString.charAt(position++);
                    while (!isNaN(exampleString.charAt(position))) {
                        if (position >= exampleString.length) {
                            //missing linebreak
                            ErrorCallBack([26]);
                            return;
                        }
                        testVarNumber = parseInt(testVarNumber) * 10 + parseInt(exampleString.charAt(position++));
                    }
                    if (testVarNumber != i) {
                        //wrong Variable number!
                        ErrorCallBack([26]);
                        return;
                    }
                    if (exampleString.charAt(position++) != '=') {
                        //incomplete state equation definition
                        ErrorCallBack([26]);
                        return;
                    }
                    var currentEquationString = '';
                    while (exampleString.charCodeAt(position) != 10) {
                        if (position >= exampleString.length) {
                            //missing linebreak
                            ErrorCallBack([26]);
                            return;
                        }
                        currentEquationString = currentEquationString + exampleString.charAt(position++);
                    }
                    outputEquations[i] = currentEquationString;
                    position++;
                    currentLine++;
                }
                for (var i = 0; i < SettingsParameter.NumberOfActuators; i++) {
                    SetOutputEquation(i, outputEquations[i]);
                }
            }

            if (exampleString.charAt(position) == 't') {
                let currentTimedExpression = "";
                while (exampleString.charCodeAt(position) != 10){
                    if (position >= exampleString.length) {
                        //missing linebreak
                        ErrorCallBack([26]);
                        return;
                    }
                    currentTimedExpression += exampleString.charAt(position++);
                }
                let TMP = currentTimedExpression.split("=");
                let id = parseInt(TMP[0].replace("te",""));
                if(id != timedExpressionCounter++){
                    ErrorCallBack([26]);
                    return;
                }
                TMP = TMP[1].split(";");
                FSM_.increaseTimedExpressions(new LogicExpression(TMP[0],NotSymbol, AndSymbol, OrSymbol, "te"+id, ErrorCallBack),parseInt(TMP[1]));

                position++;
                currentLine++;
            }
        }
        RebuildMachineSelector();
        RefreshFsmGui();
    }

    function IncreaseStatevar(machineId) {
        FSM_.increaseStateVariables(machineId);
        RefreshFsmGui();
    }

    function SetStateEquation(machineId, varNum, equationString)
    {
        FSM_.setStateEquation(machineId, varNum, equationString);
    }

    function CreateMachine(machineName)
    {
        var id = FSM_.createMachine().value;
        selectedMachine = id;
        Machines[id] = machineName;
        RebuildMachineSelector();
        $('#MachineSelector option[machineid="' + id + '"]').attr('selected', 'selected');
        $('#RemoveMachineButton').removeAttr('disabled');
        RefreshFsmGui();
        return id;
    }

    function DestroyMachine(id)
    {
        FSM_.destroyMachine(id);
        Machines[selectedMachine] = undefined;
        RebuildMachineSelector();
        RefreshFsmGui();
    }

    function RebuildMachineSelector()
    {
        var content = '';
        for (var idx in Machines)
        {
            if (Machines[idx] != undefined)
            {
                content += '<option machineid="' + idx + '">';
                content += 'a' + idx + ': ' + Machines[idx];
                content += '</option>';
            }
        }
        $('#MachineSelector').html(content);
    }

    function KeyUpHandler()
    {
        if(ExperimentRunning == true)
        {
            var CommandMessage_ = new CommandMessage();
            CommandMessage_.setType(EnumCommand.PSPUStop);
            EventHandler.fireCommandEvent(CommandMessage_);
        }
    }

    function ChangeHandler()
    {
        if(Sensors!= undefined && Actuators!= undefined)
        {
           SetAllOutPutEquations();
           Actuators = CalculateNewActuators(Sensors);
        }
        debug("change");
    }

    function NewActorsOnBlur()
    {
        SetAllOutPutEquations();
        RemoveAllErrorIndicators();
        Actuators = CalculateNewActuators(Sensors);

        if (ExperimentRunning)
        {
            if(Actuators!= undefined && ActuatorsOrSensorsHaveChanged(Sensors, Actuators)) SendData(Actuators, Sensors);
        }
    }

    var SetStateFunctions = [];

    function RefreshFsmGui()
    {
        FSM_.resetTimedExpressionTimers();
        let TimedExpressions = FSM_.getTimedExpression();
        content = '';
        for (var i = 0; i < TimedExpressions.length; i++) {
            content += '<div class="input-group" id="TimedExpressionInputGroup_' + i + '" data-placement="bottom" data-toggle="tooltip" data-animation="false">';
            content += '<span class="input-group-addon">te' + i + ' =&nbsp</span>';
            content += '<input rows="1" value="'+TimedExpressions[i].Time+'" placeholder="Time" style="display:inline-block; width:15%" type="number" class="form-control timedexpressiontime" id="TimedExpressionTime_' + i + '" tetimeid="' + i + '"></input>';
            content += '<input rows="1" value="'+TimedExpressions[i].Expression.getExpressionString()+'" placeholder="Condition" style="display:inline-block; width:85%" type="text" class="form-control timedexpressioncondition" id="TimedExpressionCondition_' + i + '" teconditionid="' + i + '"></input>';
            content += '</div><br>'
        }
        $('#TimedExpressionsWrapper').html(content);

        $(".timedexpressiontime").keyup(function (){
            let id = parseInt($(this).attr("tetimeid"));
            TimedExpressions[id].Time = $(this).val();
            KeyUpHandler();
            NewActorsOnBlur();
        });

        $(".timedexpressioncondition").keyup(function (){
            KeyUpHandler();
            let id = parseInt($(this).attr("teconditionid"));
            TimedExpressions[id].Expression = new LogicExpression($(this).val(), NotSymbol, AndSymbol, OrSymbol, "te"+id, ErrorCallBack);
            NewActorsOnBlur();
        });

        content = '';
        for (var i = 0; i < SettingsParameter.NumberOfActuators; i++) {
            content += '<div class="input-group" id="EquationInputGroup_' + i + '" data-placement="bottom" data-toggle="tooltip" data-animation="false">';
            content += '<span class="input-group-addon">y' + i.toString().padLeft(2,'0') + ' =&nbsp</span>';
            content += '<input rows="1" type="text" class="form-control" id="output_y' + i + '" equationid="' + i + '"></input>';
            content += '</div><br>'
        }
        $('#InputFieldsWrapper').html(content);
        for (var i = 0; i < SettingsParameter.NumberOfActuators; i++) {
            $('#output_y' + i).val(GetOutputEquation(i));
            $('#output_y' + i).on('keydown', function () {
                KeyUpHandler();
            });
            $('#output_y' + i).on('change', function () {
                ChangeHandler();
            });

            $('#output_y' + i).blur(function () {
                NewActorsOnBlur();
            });
        }
        selectedMachine = parseInt($('#MachineSelector option:selected').attr('machineid'));
        $('#MachineSelector option[machineid="' + selectedMachine + '"]').attr('selected', 'selected');
        if (!(selectedMachine == undefined || isNaN(selectedMachine))) {
            content = '<table id="z_equations_table"><tbody>';
            for (var i = 0; i < FSM_.getNumStateVariables(selectedMachine); i++) {
                content += '<div class="input-group" id="Machine_' + selectedMachine + '_ZEquation_' + i + '">';
                content += '<span id="z_textarea_equation_label_' + i + '" class="input-group-addon z_textarea_equation_label">a' + selectedMachine + 'z' + i + ' :=</span>';
                content += '<input id="z_equation_textarea_' + i + '" zequationid="' + i + '" type="text" class="form-control" rows="1" spellcheck="false">';
                content += '</input>';
                content += '</div><br>'
            }
            content += '<td><button type="button" class="btn btn-default" id="PlusButtonStateVariable" data-placement="bottom" data-animation="false"><span class="glyphicon glyphicon-plus"></span></div></td>';
            content += '<td><button type="button" class="btn btn-default" id="MinusButtonStateVariable" data-placement="bottom" data-animation="false"><span class="glyphicon glyphicon-remove"></span></div></td>';
            content += '</tr></tbody></table>';
            $('#StateEquationsWrapper').html(content);

            for (var i = 0; i < FSM_.getNumStateVariables(selectedMachine); i++) {
                $('#z_equation_textarea_' + i).val(FSM_.getStateEquation(selectedMachine, i));
                $('#z_equation_textarea_' + i).on('keydown', function () {
                    KeyUpHandler();
                });

                /*$('#z_equation_textarea_' + i).blur(function () {
                 NewActorsOnBlur();
                 });*/

                SetStateFunctions[i] = CheckAndSetStateEquation(i);

                $('#z_equation_textarea_' + i).blur({value: i}, function (event) {
                    CheckAndSetStateEquation(event.data.value);
                    NewActorsOnBlur();
                });
            }

            $('#PlusButtonStateVariable').on("click", function () {
                IncreaseCurrentStateVariable();
            });

            $('#MinusButtonStateVariable').on("click", function () {
                DecreaseCurrentStateVariable();
            });

            $('#PlusButtonStateVariable').attr('data-original-title', "Add z-variable");
            $('#PlusButtonStateVariable').on('mouseover', function () {
                $(this).tooltip('show');
            });

            $('#MinusButtonStateVariable').attr('data-original-title', "Remove z-variable");
            $('#MinusButtonStateVariable').on('mouseover', function () {
                $(this).tooltip('show');
            });

            for (var i = 0; i < FSM_.getNumStateVariables(selectedMachine); i++) {
                $('#z_equation_textarea_' + i).val(FSM_.getStateEquation(selectedMachine, i));
                $('#InitialStateInput').val(FSM_.getInitialState(selectedMachine));
                $('#InitialStateInput').attr('max', Math.pow(2, FSM_.getNumStateVariables(selectedMachine)) - 1);
            }

            $('#CurrentStateInput').val(FSM_.getCurrentState(selectedMachine));
        }
        else {
            $('#StateEquationsWrapper').html('');
        }

        // mouse hover event handler
        $('.plus_icon_wrapper, .minus_icon_wrapper, .check_icon_wrapper').hover(function () {
            $(this).addClass('ui-state-hover', 100);
        }, function () {
            $(this).removeClass('ui-state-hover', 100);
        });

        $('.plus_icon_wrapper, .minus_icon_wrapper, .check_icon_wrapper').mousedown(function () {
            if (!$(this).hasClass('ui-state-disabled'));
            $(this).addClass('ui-state-active', 100);
        });

        $('.plus_icon_wrapper, .minus_icon_wrapper, .check_icon_wrapper').mouseup(function () {
            $(this).removeClass('ui-state-active', 100);
            $(this).addClass('ui-state-disabled', 100);
        });

    }

    function CheckAndSetStateEquation(equationNum)
    {
        SetStateEquation(selectedMachine, equationNum, $('#z_equation_textarea_' + equationNum).val());
    }

    function SetStateEquation(machineId, varNum, equationString)
    {
        FSM_.setStateEquation(machineId, varNum, equationString);
    }

    function GetOutputEquation(outputVarNum)
    {
        return FSM_.getOutputEquation(outputVarNum);
    }

    function AddTimedExpression()
    {
        FSM_.increaseTimedExpressions(new LogicExpression("",NotSymbol, AndSymbol, OrSymbol, "te"+FSM_.getTimedExpression().length,()=>{}));
        RefreshFsmGui();
    }

    function RemoveTimedExpression()
    {
        FSM_.decreaseTimedExpressions();
        RefreshFsmGui();
    }

    function IncreaseCurrentStateVariable()
    {
        FSM_.increaseStateVariables(selectedMachine);
        RefreshFsmGui();
        $("#DIVRightPanel").scrollTop($("#StateEquationsWrapper").height());
    }

    function DecreaseCurrentStateVariable()
    {
        FSM_.decreaseStateVariables(selectedMachine);
        RefreshFsmGui();
    }

    function SetCurrentInitialState(InitialState)
    {
        //stopSimulation();
        FSM_.setInitialState(selectedMachine, InitialState);
        RefreshFsmGui();
    }

    function SetOutputEquation(outputVarNum, equationString)
    {
        FSM_.setOutputEquation(outputVarNum, equationString);
    }

    function SendData(Actuators_, Sensors_)
    {
        var Message = new DataMessage();

        Message.setActuators(Actuators_);

        Message.setSensors(Sensors_);

        var Type = [];
        Type = ["BPU"];

        Message.setParameterStringArray(Type);

        //debug("Sensors:");
        //debug(Sensors_);

        EventHandler.fireDataSendEvent(Message);
    }


    function token(pType, pValue)
    {
        this.type = pType;
        this.value = pValue;
    }
    ClearAllEquations();
    RefreshFsmGui();
}