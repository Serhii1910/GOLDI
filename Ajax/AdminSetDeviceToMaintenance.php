<?php
$Location = Functions::Ajax_GetLocationFromServer();

if(
    isset($_REQUEST['Location']) and
    (
        Functions::Ajax_isAdminOfLocation($_REQUEST['Location']) or
        $_REQUEST['Location'] == $Location
    )
){
    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Devices_SetDeviceToMaintenance(
        $_REQUEST['DeviceType'],
        $_REQUEST['Location'],
        $_REQUEST['ServiceDestID'],
        $_REQUEST['Virtual'],
        $_REQUEST['InMaintenance']
    ));
}