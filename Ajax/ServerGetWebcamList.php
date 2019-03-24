<?php
$Location = Functions::Ajax_GetLocationFromServer();
if($Location){
    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Server_GetWebcamList($Location), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
