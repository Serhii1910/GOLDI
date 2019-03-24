<?php
$Location = Functions::Ajax_GetLocationFromServer();
if(isset($_REQUEST['JSON']) and !empty($Location)){
    $Data = json_decode($_REQUEST['JSON'],true);
    $Experiment = Database::Server_GetExperimentDataPacket($Data["ExperimentID"]);
    if($Experiment['Location'] == $Location and $Experiment['EndTime'] > time() and $Experiment['SessionID'] == $Data['Session'])
        Database::Experiment_EndExperiment($Data["ExperimentID"]);

}
