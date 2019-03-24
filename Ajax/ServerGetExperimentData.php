<?php
$Location = Functions::Ajax_GetLocationFromServer();
if(isset($_REQUEST['JSON']) and !empty($Location)){
    $Data = json_decode($_REQUEST['JSON'],true);
    $Experiment = Database::Server_GetExperimentDataPacket($Data["ExperimentID"]);

    if($Experiment['Location'] != $Location)
        exit;

    $Experiment['State'] = "Controller";
    if($_SESSION['UserID'] = 0 or $Experiment['SessionID'] != $Data['Session'])
        $Experiment['State'] = "Visitor";
    if($Experiment['EndTime'] < time())
        $Experiment['State'] = "Timeout";

    header('Content-type: application/json; charset=utf-8');
    echo json_encode($Experiment, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}