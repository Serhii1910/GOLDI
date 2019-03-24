<?php
Functions::Ajax_TestRequestLocation();

if(Functions::Ajax_isAdminOfLocation($_REQUEST['Location'])){
    $Queue = array();
    foreach(Database::Devices_GetExistingDevices($_REQUEST['Location']) as $Category => $DeviceTypes)
        foreach ($DeviceTypes as $DeviceType => $Devices)
            foreach ($Devices as $Virtual => $IDs)
                if($Virtual == 0) {
                    $Queue[$Category][] = array(
                        "Type" => $DeviceType,
                        "Users" => Database::BookingQueue_GetQueueForDeviceType($DeviceType,$_REQUEST['Location'])
                    );
                }

    header('Content-type: application/json; charset=utf-8');
    echo json_encode($Queue, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}