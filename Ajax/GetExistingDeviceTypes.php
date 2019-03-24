<?php
Functions::Ajax_TestRequestLocation();

header('Content-type: application/json; charset=utf-8');
$Return = array();
foreach(Database::Devices_GetExistingDevices($_REQUEST['Location']) as $Category => $Devices)
    foreach($Devices as $Type => $Settings){
        $Tmp = array();
        $Tmp['Type'] = $Type;
        $Tmp['DisplayType'] = $Type;
        $Tmp['ExistingVirtual'] = !empty($Settings[1]);
        $Tmp['ExistingReal'] = !empty($Settings[0]);

        $Return[$Category][] = $Tmp;
    }
echo json_encode($Return, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

