<?php
$Location = Functions::Ajax_GetLocationFromServer();
$Data = json_decode($_REQUEST['JSON'],true);
$Experiment = Database::Server_GetExperimentDataPacket($Data["ExperimentID"]);
if($Experiment['Location'] == $Location)
{
    PANDA::GOLDi_SaveCoinError($Data['ExperimentID'],$Data['ErrorCode'],$Data['ErrorCodeSource'],$Data['MessageCounter']);
}