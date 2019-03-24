<?php
Functions::Ajax_TestRequestLocation();
$Location = Functions::Ajax_GetLocationFromServer();
if(Functions::Ajax_isAdminOfLocation($_REQUEST['Location']) or ($_REQUEST['Location'] == $Location)) {
    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Devices_GetAllDevicesAndWebcams($_REQUEST['Location']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}