<?php
$Location = Functions::Ajax_GetLocationFromServer();
$Data = json_decode($_REQUEST['JSON'],true);

if($Location)
    Database::Devices_SetDeviceList($Location, $Data['DeviceList']);