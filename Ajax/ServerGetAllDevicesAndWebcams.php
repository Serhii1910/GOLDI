<?php
$Location = Functions::Ajax_GetLocationFromServer();

if(!empty($Location)) {
    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Devices_GetAllDevicesAndWebcams($Location), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}