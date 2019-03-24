Animation.prototype.InitializeVariablesAndSnapObjects = function(){

    $("#Row1Text").css({"user-select":"none", "pointer-events":"none"});
    $("#Row2Text").css({"user-select":"none", "pointer-events":"none"});
    $("#Row3Text").css({"user-select":"none", "pointer-events":"none"});
    $("#Row4Text").css({"user-select":"none", "pointer-events":"none"});
    $("#Row5Text").css({"user-select":"none", "pointer-events":"none"});
    $("#Row6Text").css({"user-select":"none", "pointer-events":"none"});
    $("#ControlButtonRestartText").css({"user-select":"none", "pointer-events":"none"});
    $("#ControlButton1P2PText2P").css({"user-select":"none", "pointer-events":"none"});
    $("#ControlButton1P2PText1P").css({"user-select":"none", "pointer-events":"none"});
    $("#ControlButton1P2PSlider").css({"user-select":"none", "pointer-events":"none"});
    $("#ControlButtonTestText").css({"user-select":"none", "pointer-events":"none"});
    $("#OKText").css({"user-select":"none", "pointer-events":"none"});

//====================================================================

    this.SolutionColors = [
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#00FFFF",
        "#FFFF00",
        "#FF00FF",
    ];

    this.ResultColors = [
        "#FFFFFF",
        "#FFBB00",
        "#000000",
    ];

    this.ColorActive = "#FFBB00";
    this.ColorInactive = "#FFFFFF";
    this.ColorButtonReady = "#00FF00";

    this.AllSolutionPinColorsChoosen = false;
    this.AllChallengePinColorChoosen = false;

//====================================================================

    this.OKGroup = $("#OKGroup");

//====================================================================

    this.OnePlayer = true;

    let Snap_Button1P2PSlider = Snap("#ControlButton1P2PSlider");
    Snap_Button1P2PSlider.attr({"class":"str0","fill":this.ColorInactive});

    let ButtonP1P2 = $("#ControlButton1P2PBackground");
    ButtonP1P2.attr({"class":"str0","fill":this.ColorActive});
    ButtonP1P2.click(()=>{
        if(this.OnePlayer){
            this.OnePlayer = false;
            Snap_Button1P2PSlider.transform("translate(-41,0)");
        }else{
            this.OnePlayer = true;
            Snap_Button1P2PSlider.transform("translate(0,0)");
        }
    });

//====================================================================

    this.WaitingForInput2Player = false;
    this.Snap_ButtonRestart = Snap("#ControlButtonRestart");
    this.Snap_ButtonRestart.attr({"class":"str0","fill":this.ColorActive});
    this.Snap_ButtonRestart.click(this.ClickButtonRestart.bind(this));

//====================================================================

    this.Snap_ButtonTest = Snap("#ControlButtonTest");
    this.Snap_ButtonTest.attr({"class":"str0","fill":this.ColorInactive});
    this.Snap_ButtonTest.click(this.ClickButtonTest.bind(this));

//====================================================================

    this.Snap_ChallengeBackground = Snap("#OKBackground");
    this.Snap_ChallengeBackground.attr({"class":"str0","fill":this.ColorInactive});

//====================================================================

    this.Snap_ButtonOK = Snap("#OKButton");
    this.Snap_ButtonOK.attr({"class":"str0","fill":this.ColorInactive});
    this.Snap_ButtonOK.click(this.ClickButtonOK.bind(this));

//====================================================================

    this.Snap_SolutionPin = [];
    this.Snap_ResultPin = [];
    this.SolutionPinColor = [];
    this.Snap_SolutionBackground = [];
    for(let Row = 1; Row <= 6; Row++){
        this.Snap_SolutionBackground[Row] = Snap("#Row"+Row+"Background");
        this.Snap_SolutionBackground[Row].attr("class","str0");
        this.Snap_SolutionPin[Row] = [];
        this.Snap_ResultPin[Row] = [];
        this.SolutionPinColor[Row] = [];
        for(let Column = 1; Column <= 4; Column++) {
            this.SolutionPinColor[Row][Column] = undefined;

            this.Snap_SolutionPin[Row][Column] = Snap("#SolutionPin" + Row + "_" + Column);
            this.Snap_SolutionPin[Row][Column].attr("class","str0");
            this.Snap_SolutionPin[Row][Column].click(()=>{
                this.ClickSolutionPin(Row,Column);
            });
            $("#SolutionPin" + Row + "_" + Column).contextmenu(()=>{
                this.RightClickSolutionPin(Row,Column);
                return false;
            });

            this.Snap_ResultPin[Row][Column] = Snap("#ResultPin" + Row + "_" + Column);
            this.Snap_ResultPin[Row][Column].attr("class","str0");
        }
    }

//====================================================================

    this.Snap_ChallengePin = [];
    this.ChallengePinColor = [];
    for(let Column = 1; Column <= 4; Column++) {
        this.ChallengePinColor[Column] = undefined;
        this.Snap_ChallengePin[Column] = Snap("#ChallengePin" + Column);
        this.Snap_ChallengePin[Column].attr({"class":"str0","fill":this.ColorInactive});
        this.Snap_ChallengePin[Column].click(()=>{
            this.ClickChallengePin(Column);
        });
        $("#ChallengePin" + Column).contextmenu(()=>{
            this.RightClickChallengePin(Column);
            return false;
        });
    }

//====================================================================

    this.CurrentPhase = 0;
    this.MasterMindControl = new MMControl(6,this.MasterMindCallback.bind(this));

//====================================================================

    this.InitAllColors();
};

Animation.prototype.ClickButtonRestart = function(){
    this.Snap_ButtonTest.attr("fill",this.ColorInactive);
    for(let Column = 1; Column <= 4; Column++)
        this.ChallengePinColor[Column] = undefined;
    this.CurrentPhase = 0;
    this.InitAllColors();
    if(this.OnePlayer){
        this.OKGroup.hide();
        let Solution = [];
        for(let Column = 1; Column <= 4; Column++){
            Solution[Column-1] = Math.floor(Math.random()*6);
            this.Snap_ChallengePin[Column].attr("fill",this.SolutionColors[Solution[Column-1]])
        }
        this.MasterMindControl.restart(Solution);
    }else{
        this.OKGroup.show();
        this.WaitingForInput2Player = true;
        this.Snap_ChallengeBackground.attr("fill",this.ColorActive);
    }
};

Animation.prototype.ClickButtonTest = function(){
    if(this.AllSolutionPinColorsChoosen){
        let TMP = [];
        for(let i = 0; i < 4; i++)
            TMP[i] = this.SolutionPinColor[this.CurrentPhase][i+1];
        this.MasterMindControl.test(TMP);
    }
};

Animation.prototype.ClickButtonOK = function(){
    this.WaitingForInput2Player = false;
    this.Snap_ChallengeBackground.attr("fill",this.ColorInactive);
    this.Snap_ButtonOK.attr("fill",this.ColorInactive);
    this.OKGroup.hide();

    let Solution = [];
    for(let Column = 1; Column <= 4; Column++)
        Solution[Column-1] = this.ChallengePinColor[Column];

    this.MasterMindControl.restart(Solution);
};

Animation.prototype.ClickSolutionPin = function(Row, Column){
    if(this.CurrentPhase != Row)
        return;
    if(this.SolutionPinColor[Row][Column] == undefined){
        this.SolutionPinColor[Row][Column] = 0;
    }else{
        this.SolutionPinColor[Row][Column]++;
        this.SolutionPinColor[Row][Column] = this.SolutionPinColor[Row][Column] % 6;
    }

    this.Snap_SolutionPin[Row][Column].attr("fill",this.SolutionColors[this.SolutionPinColor[Row][Column]]);

    this.TestAllColorsChoosen();
};

Animation.prototype.RightClickSolutionPin = function(Row, Column){
    if(this.CurrentPhase != Row)
        return;
    if(this.SolutionPinColor[Row][Column] == undefined){
        this.SolutionPinColor[Row][Column] = 5;
    }else{
        this.SolutionPinColor[Row][Column] = this.SolutionPinColor[Row][Column] + 6 - 1;
        this.SolutionPinColor[Row][Column] = this.SolutionPinColor[Row][Column] % 6;
    }

    this.Snap_SolutionPin[Row][Column].attr("fill",this.SolutionColors[this.SolutionPinColor[Row][Column]]);

    this.TestAllColorsChoosen();
};

Animation.prototype.ClickChallengePin = function(Column){
    if(this.OnePlayer || !this.WaitingForInput2Player) return;

    if(this.ChallengePinColor[Column] == undefined){
        this.ChallengePinColor[Column] = 0;
    }else{
        this.ChallengePinColor[Column]++;
        this.ChallengePinColor[Column] = this.ChallengePinColor[Column] % 6;
    }

    this.AllChallengePinColorChoosen = true;
    for(let Column = 1; Column <= 4; Column++)
        if(this.ChallengePinColor[Column] == undefined)
            this.AllChallengePinColorChoosen = false;

    if(this.AllChallengePinColorChoosen)
        this.Snap_ButtonOK.attr("fill",this.ColorButtonReady);

    this.InitAllColors();
};

Animation.prototype.RightClickChallengePin = function(Column){
    if(this.OnePlayer || !this.WaitingForInput2Player) return;

    if(this.ChallengePinColor[Column] == undefined){
        this.ChallengePinColor[Column] = 5;
    }else{
        this.ChallengePinColor[Column] = this.ChallengePinColor[Column] + 6 - 1;
        this.ChallengePinColor[Column] = this.ChallengePinColor[Column] % 6;
    }

    this.AllChallengePinColorChoosen = true;
    for(let Column = 1; Column <= 4; Column++)
        if(this.ChallengePinColor[Column] == undefined)
            this.AllChallengePinColorChoosen = false;

    if(this.AllChallengePinColorChoosen)
        this.Snap_ButtonOK.attr("fill",this.ColorButtonReady);

    this.InitAllColors();
};

Animation.prototype.MasterMindCallback = function(Result) {
    if(Result.ok != 1)
        console.log(JSON.stringify(Result));

    let GameFinished = true;
    if(Result.nextStep >= 1 && this.CurrentPhase >= 1){
        for(let Column = 1; Column <= 4; Column++){
            this.Snap_ResultPin[this.CurrentPhase][Column].attr("fill",this.ResultColors[Result.feedback[Column-1]]);
            if(Result.feedback[Column-1] != 2)
                GameFinished = false;
        }
    }else{
        GameFinished = false;
    }

    for(let Row = 1; Row <= 6; Row++)
        this.Snap_SolutionBackground[Row].attr("fill",this.ColorInactive);

    if(GameFinished || Result.nextStep == 7){
        this.OKGroup.show();
        this.CurrentPhase = 0;
    }else{
        this.CurrentPhase = Result.nextStep;
        for(let Row = 1; Row <= 6; Row++)
            this.Snap_SolutionBackground[Row].attr("fill",this.ColorInactive);
        this.Snap_SolutionBackground[this.CurrentPhase].attr("fill",this.ColorActive);
    }

    this.TestAllColorsChoosen();

//    console.log(JSON.stringify(Result));
};

Animation.prototype.TestAllColorsChoosen = function() {
    this.Snap_ButtonTest.attr("fill",this.ColorInactive);

    if(this.CurrentPhase == 0 || this.CurrentPhase > 6) return;

    this.AllSolutionPinColorsChoosen = true;
    for(let Column = 1; Column <= 4; Column++)
        if(this.SolutionPinColor[this.CurrentPhase][Column] == undefined)
            this.AllSolutionPinColorsChoosen = false;

    if(this.AllSolutionPinColorsChoosen)
        this.Snap_ButtonTest.attr("fill",this.ColorButtonReady);
};

Animation.prototype.InitAllColors = function(){
    for(let Row = 1; Row <= 6; Row++){
        this.Snap_SolutionBackground[Row].attr("fill",this.ColorInactive);
        for(let Column = 1; Column <= 4; Column++) {
            this.SolutionPinColor[Row][Column] = undefined;
            this.Snap_SolutionPin[Row][Column].attr("fill",this.ColorInactive);
            this.Snap_ResultPin[Row][Column].attr("fill",this.ColorInactive);
        }
    }
    for(let Column = 1; Column <= 4; Column++)
        if(this.ChallengePinColor[Column] == undefined){
            this.Snap_ChallengePin[Column].attr("fill",this.ColorInactive);
        }else{
            this.Snap_ChallengePin[Column].attr("fill",this.SolutionColors[this.ChallengePinColor[Column]]);
        }
};

// Initializes SVG objects that glow when actuator is active
Animation.prototype.InitializeActuatorSVGObjects = function() {
};

// Initializes SVG objects that blink when user hovers over actuator in ECP
Animation.prototype.InitializeBlinkingActuatorSVGObjects = function() {
};

// Initializes SVG objects that glow when sensor is active
Animation.prototype.InitializeSensorSVGObjects = function() {
};

// Initializes SVG objects that blink when user hovers over sensors in ECP
Animation.prototype.InitializeBlinkingSensorSVGObjects = function() {
};

Animation.prototype.Refresh = function() {
};