let DefaultBlinkingColor = "#00FF00";

//Class for creating SVG objects for sensors und actuators
function SVGObject (Objects){
    if(Objects === undefined){
        this.Objects = [];
    }else{
        this.Objects = Array.isArray(Objects) ? Objects : [Objects];
    }

    this.SetActive = function(){
        for(let i=0; i<this.Objects.length; i++)
            this.AbstractSetActive(this.Objects[i]);
    };

    this.AbstractSetActive = function(Object){
        Object.attr("fill", "#FFFF00"); // Default: Switching between yellow and dark yellow
    };

    this.SetInactive = function(){
        for(let i=0; i<this.Objects.length; i++)
            this.AbstractSetInactive(this.Objects[i]);
    };

    this.AbstractSetInactive = function(Object){
        Object.attr("fill", "#7F7F00");
    };
}

function SVGBlinkingObject (Objects){
    this.DefaultBlinkingColor = DefaultBlinkingColor;
    if(Objects === undefined){
        this.Objects = [];
    }else{
        this.Objects = Array.isArray(Objects) ? Objects : [Objects];
    }
    this.SetBlinking = function(){
        for(let i=0; i<this.Objects.length; i++)
            this.AbstractSetBlinking(this.Objects[i]);
    };

    this.AbstractSetBlinking = function(Object){
        Object.attr({"visibility":"visible"}); // Default
    };

    this.SetUnblinking = function(){
        for(let i=0; i<this.Objects.length; i++)
            this.AbstractSetUnblinking(this.Objects[i]);
    };

    this.AbstractSetUnblinking = function(Object){
        Object.attr({"visibility":"hidden"});
    };
}

function Animation(EventHandler, SettingsParameter, CallBack) {
    this.EventHandler = EventHandler;
    this.CallBack = CallBack;
    this.UserButtonsEnabled = false;

    this.Actuators = new Array(128);
    this.Sensors = new Array(128);

    //Compare of old values with actual values using JSON.stringify()
    this.OldActuatorsJSONString = "";
    this.OldSensorsJSONString = "";

    //Pointer to Sensors and Actuators for setting them active or inactive
    this.SensorSVGObjects = new Array(128);
    this.ActuatorSVGObjects = new Array(128);

    //Pointer to blinking Sensor and Actuator Objects
    this.SensorSVGBlinkingObjects = new Array(128);
    this.ActuatorSVGBlinkingObjects = new Array(128);
    this.DefaultBlinkingColor = DefaultBlinkingColor;

    //Container für SVG-Objekt und SVG-Canvas-Objekt
    this.SVGCanvas = undefined;

    //Blinking Variables
    let HoverSelectedParts = [];
    let BlinkingInterval = 600;
    let BlinkingActive = false;
    let RefreshInterval = 100;

    //Interface nach außen
    this.onCommand = function (Command) {
        this.AnimationStateMachine(Command.getType());
        if(this.EnvironmentSimulationCommandInterface != undefined)
            this.EnvironmentSimulationCommandInterface(Command);
    };

    this.onServerInterfaceInfo = function (Info) {
        if (Info.getInfoType() === EnumServerInterfaceInfo.Connect)
        {
            this.AbstractSendInitialUserVariables();
        }
    };

    this.onData = function (Data) {
        // console.log("Sensors  : "+Data.getSensors().map(e => e?"1":"0"));
        // console.log("Actuators: "+Data.getActuators().map(e => e?"1":"0"));

        // if(!Data.getSensors().concat(Data.getActuators()).reduce((acc,val) => acc | val,false))
        //     console.log("alles nullen");

        //Ignore all Simulation Data, only PSPU Data is relevant for the ECP
        if(Data.getParameterStringArray()[0] === "SIM")
             return;
        if(Data.getParameterStringArray()[0] === "PSPU") {
            // if (JSON.stringify(this.Sensors) === JSON.stringify(Data.getSensors()))
            //     console.log((new Date()).getTime() + ": Visitor hat gleiche Daten nochmal empfangen");

            if (Data.getSensors()[0] !== undefined) this.Sensors = Data.getSensors();
        }
        if(Data.getParameterStringArray()[0] === "BPU") {
            if (Data.getActuators()[0] !== undefined) this.Actuators = Data.getActuators();
        }

        if(this.EnvironmentSimulationDataInterface != undefined)
            this.EnvironmentSimulationDataInterface(Data);
    };

    this.onHoverEvent = function (HoverData) {
        this.SetUnitBlinking(HoverData.getType(), HoverData.getUnit());
    };

    this.SendEnvironmentVariableCommand = function(Variable, Value){
        let Message = new CommandMessage();
        Message.setType(EnumCommand.SetUserVariable);

        let ParameterStringArray = [Variable.toString(), Value];
        Message.setParameterStringArray(ParameterStringArray);

        EventHandler.fireCommandEvent(Message);
    };

    //Klassen-Methoden für alle Animationen definieren
    this.Initialize = function() {
        for (let i = 0; i < 128; i++) {
            this.Actuators[i] = false;
            this.Sensors[i] = false;

            this.ActuatorSVGObjects[i] = new SVGObject();
            this.SensorSVGObjects[i] = new SVGObject();

            this.ActuatorSVGBlinkingObjects[i] = new SVGBlinkingObject();
            this.SensorSVGBlinkingObjects[i] = new SVGBlinkingObject();
        }

        let Animation = this;
        $("#" + SettingsParameter.AnimationDIVName).load('ECP/Animation/Images/Image_'+SettingsParameter.ECPPhysicalSystemName+'.svg', function () {
            let SVG = $('#SVGAnimation');
            SVG.attr("width", "100%");
            SVG.attr("height", "100%");

            Animation.SVGCanvas = Snap('#SVGAnimation');

            setInterval(function () {
                Animation.AbstractRefresh()
            }, RefreshInterval);

            setInterval(function () {
                Animation.LetItBlink();
            }, BlinkingInterval);

            Animation.InitializeVariablesAndSnapObjects();
            Animation.InitializeActuatorSVGObjects();
            Animation.InitializeBlinkingActuatorSVGObjects();
            Animation.InitializeSensorSVGObjects();
            Animation.InitializeBlinkingSensorSVGObjects();

            Animation.CallBack();
        });
    };

    this.AbstractSendInitialUserVariables = function () {
        if(this.SendInitialUserVariables !== undefined){
            this.SendInitialUserVariables();
        }
    };


    this.AbstractOnStopSendUserVariables = function () {
        if(this.OnStopSendUserVariables !== undefined){
            this.OnStopSendUserVariables();
        }
    };


    this.AbstractRefresh = function(){
        let Refresh = false;

        let ActuatorJSONString = JSON.stringify(this.Actuators);
        if(this.OldActuatorsJSONString !== ActuatorJSONString){
            // Colorize Actuators active oder inactive
            for(let i=0; i<this.ActuatorSVGObjects.length; i++)
                if(this.Actuators[i]){
                    this.ActuatorSVGObjects[i].SetActive();
                }else{
                    this.ActuatorSVGObjects[i].SetInactive();
                }

            this.OldActuatorsJSONString = ActuatorJSONString;
            Refresh = true;
        }

        let SensorJSONString = JSON.stringify(this.Sensors);
        if(this.OldSensorsJSONString !== SensorJSONString){
            // Colorize Sensors when active oder inactive
            for(i = 0; i<this.SensorSVGObjects.length; i++)
                if(this.Sensors[i]){
                    this.SensorSVGObjects[i].SetActive();
                }else{
                    this.SensorSVGObjects[i].SetInactive();
                }

            this.OldSensorsJSONString = SensorJSONString;
            Refresh = true;
        }

        // Individual Refresh of all virtual Models
        if(Refresh)
            this.Refresh();
    };

    this.LetItBlink = function() {
        if (HoverSelectedParts.length !== 0)
            for (let i = 0; i < HoverSelectedParts.length; i++)
                if (BlinkingActive) {
                    HoverSelectedParts[i].SetBlinking();
                } else {
                    HoverSelectedParts[i].SetUnblinking();
                }

        BlinkingActive = !BlinkingActive;
    };

    this.SetUnitBlinking = function(BlinkingType, BlinkingUnit) {
        for (let i = 0; i < HoverSelectedParts.length; i++)
            HoverSelectedParts[i].SetUnblinking();
        HoverSelectedParts = [];

        if (BlinkingType === "Sensor") {
            HoverSelectedParts.push(this.SensorSVGBlinkingObjects[parseInt(BlinkingUnit)]);
        } else if (BlinkingType === "Actuator") {
            HoverSelectedParts.push(this.ActuatorSVGBlinkingObjects[parseInt(BlinkingUnit)]);
        } else if (BlinkingType === "Clear") {
            // aktuell keine Aktion
        }
    };

    this.AnimationStateMachine = function(event)
    {
        if (-1 !== jQuery.inArray(event, [
                EnumCommand.PSPURun,
                EnumCommand.PSPUSingleStepActuator,
                EnumCommand.PSPUSingleStepSensor
            ])) {
            this.UserButtonsEnabled = true;
        }

        if (-1 !== jQuery.inArray(event, [
            EnumCommand.Initialize,
            EnumCommand.PSPUErrorCode,
            EnumCommand.PSPUStop,
            EnumCommand.LoadBPUExample,
            EnumCommand.LoadDesign,
            EnumCommand.Nacknowledge,
            EnumCommand.PSPUReachedSingleStepActuator,
            EnumCommand.PSPUReachedSingleStepSensor
        ])) {
            this.UserButtonsEnabled = false;
            this.AbstractOnStopSendUserVariables();
        }
    };

    //Help functions
    //Creates a snap objekt with visibility hidden
    this.SnapHidden = function(ID){
        let TMPSnap = Snap(ID);
        TMPSnap.attr("visibility", "hidden");
        return TMPSnap;
    };

    //Creates a rect with width, height and position of a copyobject, moved to x or y with offset dx and dy.
    //Object is rotated and pinned at a parent object. In most cases this will be this.SVGObject
    this.CreateNewSVGRect = function(ParentObject, CopyObject, DX, DY, Rotation){
        DX = DX || 0;
        DY = DY || 0;
        Rotation = Rotation || 0;

        let width = Math.max(1,CopyObject.getBBox().w);
        let height = Math.max(1,CopyObject.getBBox().h);

        let Rect = ParentObject.rect(CopyObject.getBBox().x+DX, CopyObject.getBBox().y+DY, width, height);
        if(Rotation != 0) Rect.transform("r-"+Rotation);
        Rect.attr({
            stroke:this.DefaultBlinkingColor,
            visibility:"hidden",
            "stroke-width":7,
            "fill-opacity":"0"
        });

        return Rect;
    };

    this.Initialize();
}    