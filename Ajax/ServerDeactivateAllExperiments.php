<?php
$Location = Functions::Ajax_GetLocationFromServer();
if($Location)
    Database::Experiment_EndAllExperiments($Location);