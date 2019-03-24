<?php
Functions::Ajax_TestRequestLocation();

echo json_encode(Database::Devices_GetPSPUTypesForLocation($_REQUEST['Location']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);