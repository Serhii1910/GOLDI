//***************************************
//*
//* This file defines the classes used for the event system
//*
//***************************************

// command type - contains type, sender, parameter string array
function CommandMessage() 
{
    var Type = undefined;
    var Sender = "";
    var ParameterStringArray = [];
    var File = undefined;
    var SendFileFlag = false;

    this.getType = function () {
        return Type;
    };

    this.getSender = function () {
        return Sender;
    };

    this.getFile = function () {
        return File;
    };

    this.getSendFileFlag = function () {
        return SendFileFlag;
    };

    this.getParameterStringArray = function () {
        return ParameterStringArray.slice();
    };

    this.setParameterStringArray = function (_Data) {
        ParameterStringArray = _Data.slice();
    };

    this.setSender = function (_Sender) {
        Sender = _Sender;
    };

    this.setType = function (_Type) {
        Type = _Type;
    };

    this.setFile = function (_File) {
        File = _File;
    };

    this.setSendFileFlag = function () {
        SendFileFlag = true;
    };

    this.clearSendFileFlag = function () {
        SendFileFlag = false;
    };

    this.toString = function() {
        let Output = "";
        Output += "Type: "+this.getType()+", ";
        Output += "Sender: "+this.getSender()+", ";
        Output += "Parameter: "+this.getParameterStringArray();
        return Output;
    };
}

// data type - contains sensors, actuators and parameter string array
function DataMessage() 
{
    var Sensors = new Array(128);
    var Actuators = new Array(128);
    var ParameterStringArray = [];

    this.getSensors = function () {
        return Sensors.slice();
    };

    this.getActuators = function () {
        return Actuators.slice();
    };

    this.setSensors = function (_Sensors) {
        Sensors = _Sensors.slice();
    };

    this.setActuators = function (_Actuators) {
        Actuators = _Actuators.slice();
    };

    this.getParameterStringArray = function () {
        return ParameterStringArray.slice();
    };

    this.setParameterStringArray = function (_Data) {
        ParameterStringArray = _Data.slice();
    };

    this.toString = function() {
        let Output = "";
        Output += "Sensors: [";
        $.each(this.getSensors(),(index,value) => {
            Output += value?1:0;
        });
        Output += "], ";
        Output += "Actuators: [";
        $.each(this.getActuators(),(index,value) => {
            Output += value?1:0;
        });
        Output += "], ";
        Output += "Parameter: "+this.getParameterStringArray();
        return Output;
    };
}

// internal hover message - contains the unit hovered over and type (sensor, actuator)
function InternalHoverMessage()
{
    var Unit = "";
    var Type = ""; // Sensor, Actuator, Clear
    var Data = "";

    InternalHoverMessage.prototype.setUnit = function (_Unit) {
        Unit = _Unit;
    };

    InternalHoverMessage.prototype.getUnit = function () {
        return Unit;
    };
    
    InternalHoverMessage.prototype.getType = function () {
        return Type;
    };
    
    InternalHoverMessage.prototype.setType = function (_Type) {
        Type = _Type;
    };
}

// TEST TODO
function ServerInterfaceInfoMessage() 
{
    var InfoType = "";
    //Data = undefined;

    ServerInterfaceInfoMessage.prototype.getInfoType = function () {
        return InfoType;
    };

    ServerInterfaceInfoMessage.prototype.setInfoType = function (_Info) {
        InfoType = _Info;
    };

    /*ServerInterfaceInfoMessage.prototype.getData = function()
     {
     return Data;
     }

     ServerInterfaceInfoMessage.prototype.setData = function(_Data)
     {
     Data = _Data;
     }*/
}

// Error message - contains error code and content
function ErrorMessage() 
{
    var ErrorCode = "";
    var Data = "";

    ErrorMessage.prototype.setErrorCode = function (_ErrorCode) {
        ErrorCode = _ErrorCode;
    };

    ErrorMessage.prototype.getErrorCode = function () {
        return ErrorCode;
    };

    ErrorMessage.prototype.setData = function (_Data) {
        Data = _Data;
    };

    ErrorMessage.prototype.getData = function (_Data) {
        return Data;
    };
}