<?php
header('Content-type: application/json; charset=utf-8');

$Return = array();

if(isset($_REQUEST['Location']) and in_array($_REQUEST['Location'],array_values(Database::Locations_GetAllAllowedAddressesForLocations()))) {
    $Experiments = Database::Experiment_GetActiveExperiments($_REQUEST['Location']);
}else{
    $Experiments = Database::Experiment_GetActiveExperiments();
}

foreach ($Experiments as $Experiment)
{
    $Duration = ($Experiment['EndTime'] - time());
    $Experiment['Duration'] = Functions::SecondsToH_Min_Sec($Duration);
    $Experiment['StartTime'] = strftime($LanguageManager->ReplaceTags("[[**FormatDateTime**]]"),$Experiment['StartTime']);
    $Experiment['EndTime'] = strftime($LanguageManager->ReplaceTags("[[**FormatDateTime**]]"),$Experiment['EndTime']);
    $Experiment['Location'] = $Experiment['Location'];

    $Return[] = $Experiment;
}

echo json_encode($Return, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);