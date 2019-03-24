<?php
Functions::Ajax_TestRequestEperimentID();

$Location = Database::Experiment_GetExperiment($_REQUEST['ExperimentID'])['Location'];
if(Functions::Ajax_isAdminOfLocation($Location))
    Database::Experiment_EndExperiment($_REQUEST['ExperimentID']);