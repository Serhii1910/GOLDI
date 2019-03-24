<?php
// http://141.24.211.131/GOLDiExperimental/index.php?Function=ServerInsertFirmwareInfo&JSON={"FirmwareID":1,"FirmwareVersion":"123","DeviceType":"3AxisPortal"}
$Location = Functions::Ajax_GetLocationFromServer();

if(isset($_REQUEST['JSON']) and !empty($Location)){
    $Data = json_decode($_REQUEST['JSON'],true);

    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Firmware_InsertFirmwareInfo($Data['FirmwareID'], $Data['FirmwareVersion'], $Data['DeviceType']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}