<?php
Functions::Ajax_TestRequestPSPUType();

$Language = array("JS","VHDL");
if(!isset($_REQUEST['Language']) or !(in_array($_REQUEST['Language'],$Language)))
    die("wrong Language, use: [".implode(" | ",$Language)."]");

if(isset($_REQUEST['Locale']) and $_REQUEST['Locale'] != ""){
    if(!in_array($_REQUEST['Locale'],Database::Language_GetAvailableLocales()))
        die("wrong Locale, use: [".implode(" | ",Database::Language_GetAvailableLocales())."]");
}else {
    $_REQUEST['Locale']="";
}

echo Database::Protection_GetCode($_REQUEST['PSPUType'],$_REQUEST['Language'],$_REQUEST['Locale']);