<?php
if(Functions::Ajax_GetLocationFromServer()){
    $Data = json_decode($_REQUEST['JSON'],true);

    $Experiment = Database::Experiment_GetExperiment($Data['ExperimentID']);
    $Response = Database::Server_GetExamplePacket($Data["ExampleNumber"],$Experiment["BPUType"],$Experiment["PSPUType"]);
    $Response["Example"] = base64_encode($Response["Example"]);

    header('Content-type: application/json; charset=utf-8');
    echo json_encode($Response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
