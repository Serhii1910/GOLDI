<?php
Functions::Ajax_TestRequestLocation();

if(Functions::Ajax_isAdminOfLocation($_REQUEST['Location'])) {
    header('Content-type: application/json; charset=utf-8');

    echo json_encode
    (
        Database::Devices_SetNewWebCamSettings
        (
            $_REQUEST['WebcamType'],
            $_REQUEST['URL'],
            $_REQUEST['Parameter'],
            $_REQUEST['ServiceDestID'],
            $_REQUEST['Rotation'],
            $_REQUEST['Location']
        )
    );
}