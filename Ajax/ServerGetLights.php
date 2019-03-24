<?php
$Location = Functions::Ajax_GetLocationFromServer();
if(isset($_REQUEST['JSON']) and !empty($Location)){
    $Data = json_decode($_REQUEST['JSON'],true);
    $Authorized = false;
    foreach(Database::Server_GetDeviceList($Location) as $Device)
        if($Device["DeviceID"] == $Data['DeviceID'])
            $Authorized = true;

    if($Authorized)
    {
        $Lights = Database::Server_GetLights($Data['DeviceID']);
        if($Lights){
            header('Content-type: application/json; charset=utf-8');
            echo json_encode($Lights, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
    }
}
