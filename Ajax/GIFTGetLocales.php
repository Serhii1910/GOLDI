<?php
Functions::Ajax_TestRequestLocale();

if(isset($_REQUEST['Locale']) and in_array($_REQUEST['Locale'],Database::Language_GetAvailableLocales()))
{
    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Langauge_GetGIFTTags($_REQUEST['Locale']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
