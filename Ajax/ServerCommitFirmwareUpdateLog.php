<?php
//ServerCommitFirmwareUpdateLog
$Location = Functions::Ajax_GetLocationFromServer();

/*/ TMP Setup
$Location = "IUT";
$Ret = [];
$Ret["DeviceID"] = "1237891273";
$Ret["DeviceType"] = "3AxisPortal";
$Ret["ServiceDestID"] = "1860";
$Ret["FirmwareNew"] = 120;
$Ret["HardwareVersion"] = 111;
$Ret["Result"] = 1;
$_REQUEST['JSON'] = json_encode($Ret);
//print_r(json_encode($Ret));
// END TMP*/

if(isset($_REQUEST['JSON']) and !empty($Location)) {
    $Data = json_decode($_REQUEST['JSON'], true);

    $BuildType = Database::Locations_GetLocationInformation()[$Location]["BuildType"];

    $FirmwareIDOld = Database::Firmware_GetPreviousFirmwareIDForDeviceUpdate($Data['DeviceType'], $Location, $Data['ServiceDestID']);
    $FirmwareIDNew = Database::Firmware_GetFirmwareID($Data['DeviceType'],$Data['FirmwareNew'],$Data['HardwareVersion'],$BuildType);

    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Firmware_WriteLog($Data['DeviceID'],$Data['DeviceType'],$Location,$Data['ServiceDestID'],$FirmwareIDOld,$FirmwareIDNew,$Data['Result']));
}