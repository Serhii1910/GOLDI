<?php
// http://141.24.211.131/GOLDiExperimental/index.php?Function=ServerGetNextPendingFirmwareForTest
$Location = Functions::Ajax_GetLocationFromServer();
if(!empty($Location)){
    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Firmware_GetNextPendingFirmwareForTest(), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}