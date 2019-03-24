<?php
// http://141.24.211.131/GOLDiExperimental/index.php?Function=ServerGetBuildType
$Location = Functions::Ajax_GetLocationFromServer();

if(!empty($Location)){
    $BuildType= Database::Locations_GetLocationInformation()[$Location]['BuildType'];
    echo json_encode($BuildType, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}