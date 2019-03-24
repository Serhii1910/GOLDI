<?php
header('Content-type: application/json; charset=utf-8');
$Data = Database::Locations_GetLocationInformation();


foreach ($Data as $Element)
    echo $Element['ControlSocket'] . '|' . $Element['LocationID'] . '|' . $Element['WebcamSocket'] . '|' . "\r\n";