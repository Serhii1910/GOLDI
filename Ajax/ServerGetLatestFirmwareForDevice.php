<?php
// http://141.24.211.131/GOLDiExperimental/index.php?Function=ServerGetLatestFirmwareForDevice&JSON={"DeviceType":"3AxisPortal","LatestFirmwareVersion":"99","HardwareVersion":"111"}
$Location = Functions::Ajax_GetLocationFromServer();

if(isset($_REQUEST['JSON']) and !empty($Location)){
    $Data = json_decode($_REQUEST['JSON'],true);
    $BuildType= Database::Locations_GetLocationInformation()[$Location]['BuildType'];
    $LatestFirmware = Database::Firmware_GetLatestFirmwareForDevice($Data['DeviceType'],$Data['HardwareVersion'],$BuildType);

    header('Content-type: application/json; charset=utf-8');
    if(intval($Data['LatestFirmwareVersion']) < $LatestFirmware['FirmwareVersion']){
        echo json_encode($LatestFirmware, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }else{
        echo json_encode(null, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}