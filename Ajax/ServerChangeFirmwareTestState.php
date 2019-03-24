<?php
// http://141.24.211.131/GOLDiExperimental/index.php?Function=ServerChangeFirmwareTestState&JSON={"FirmwareID":1,"TestState":"Pending"}
$Location = Functions::Ajax_GetLocationFromServer();

if(isset($_REQUEST['JSON']) and !empty($Location)){
    $Data = json_decode($_REQUEST['JSON'],true);

    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Firmware_ChangeFirmwareTestState($Data['FirmwareID'], $Data['TestState']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}