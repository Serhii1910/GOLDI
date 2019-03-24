<?php
if(Functions::Ajax_GetLocationFromServer()){
    $Data = json_decode($_REQUEST['JSON'],true);


    $Response = Database::Server_GetProgramFile($Data['ExperimentID']);
    $Response["File"] = base64_encode($Response["File"]);

    header('Content-type: application/json; charset=utf-8');
    echo json_encode($Response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}