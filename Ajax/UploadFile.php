<?php
$ExperimentID = Database::Experiment_GetActiveExperimentIDForUserID($_SESSION['UserID'],session_id());

if($ExperimentID)
{
    $Result = Database::Experiment_UploadFileToDatabase($_FILES, $ExperimentID);
    if ($Result)
    {
        echo 1;
        exit;
    }
}

echo 0;