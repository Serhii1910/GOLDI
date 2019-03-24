<?php
if(Functions::Ajax_GetLocationFromServer()) {
    header('Content-type: application/json; charset=utf-8');
    $Result = Database::Server_GetAllDeviceTypes();
    $Return = array();
    $TMP = array();
    foreach ($Result as $DeviceType) {
        $TMP["DeviceType"] = $DeviceType;
        $Return [] = $TMP;
    }

    echo json_encode($Return, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
