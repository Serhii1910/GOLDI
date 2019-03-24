<?php
Functions::Ajax_TestRequestLocation();

if(Functions::Ajax_isAdminOfLocation($_REQUEST['Location']))
    Database::Experiment_EndAllExperiments($_REQUEST['Location']);