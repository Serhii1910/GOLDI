<?php
$Location = Functions::Ajax_GetLocationFromServer();

/*/ TMP Setup
$Location = "IUT";
$Ret = [];
$Ret["DeviceType"] = "3AxisPortal";
$Ret["HardwareVersion"] = 111;
$_REQUEST['JSON'] = json_encode($Ret);
//print_r(json_encode($Ret));
// END TMP*/

if(isset($_REQUEST['JSON']) and !empty($Location)) {
    $Data = json_decode($_REQUEST['JSON'], true);
    $BuildType = Database::Locations_GetLocationInformation()[$Location]["BuildType"];
    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Firmware_GetCurrentFirmware($Data["DeviceType"],$Data["HardwareVersion"],$BuildType));
}