<?php
Functions::Ajax_TestRequestMode();
Functions::Ajax_TestRequestBPUType();
Functions::Ajax_TestRequestPSPUType();
Functions::Ajax_TestRequestLocation();

header('Content-type: application/json; charset=utf-8');

$DeviceIDs = Database::Experiment_GetAvailableServiceDestIDsForExperiment($_REQUEST['Mode'],$_REQUEST['BPUType'],$_REQUEST['PSPUType'],$_REQUEST['Location']);

if(empty($DeviceIDs['BPUServiceDestinationID']) or empty($DeviceIDs['PSPUServiceDestinationID'])){
    echo json_encode(false);
}else{
    echo json_encode(Database::Experiment_GetAvailableServiceDestIDsForExperiment($_REQUEST['Mode'],$_REQUEST['BPUType'],$_REQUEST['PSPUType'],$_REQUEST['Location']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
