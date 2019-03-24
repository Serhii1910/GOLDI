<?php

if(isset($_REQUEST['request']))
{
    include "PANDA.php";
    header('Content-type: application/json; charset=utf-8');

    $Return = null;
    switch ($_REQUEST['request'])
    {
        // ..../PANDA/PANDAEndpoint.php?request=getNumberOfStoredCoins&type=chapter
        case 'getNumberOfStoredCoins':
            $Return = PANDA::Api_GetNumberOfStoredCoins();
            break;
        case 'sendStoredCoins':
            if(isset($_REQUEST['table']) and in_array($_REQUEST['table'],PANDA::API_GetTables()))
                $Return = PANDA::TinCan_SendCoins($_REQUEST['table']);
            break;
    }

    echo json_encode($Return, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}