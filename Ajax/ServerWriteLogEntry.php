<?php
// http://141.24.211.131/GOLDiExperimental/index.php?Function=ServerWriteLogEntry&JSON={"DeviceType":"3AxisPortal","ServiceDestID":"1860","FirmwareID":"1","Result":"Success"}
$Location = Functions::Ajax_GetLocationFromServer();

if(isset($_REQUEST['JSON']) and !empty($Location)){
    $Data = json_decode($_REQUEST['JSON'],true);

    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Firmware_WriteLogEntry($Data['DeviceType'], $Location, $Data['ServiceDestID'],$Data['FirmwareID'],$Data['Result']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}