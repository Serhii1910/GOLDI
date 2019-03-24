<?php
if(isset($_REQUEST['Locale']))
{
    if($_REQUEST['Locale'] == 'dev')
        $_REQUEST['Locale'] = Definitions::DefaultLocale;

    if(in_array($_REQUEST['Locale'],Database::Language_GetAvailableLocales()))
    {
        setcookie("i18next",$_REQUEST['Locale']);
        header('Content-type: application/json; charset=utf-8');
        $Modules = ['Homepage','ECP_Devices'];
        if(isset($_REQUEST['Modules']))
            $Modules = array_merge($Modules,explode(",",$_REQUEST['Modules']));
        echo json_encode(Database::Language_GetTranslations($Modules,$_REQUEST['Locale']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
    else
    {
        echo json_encode(array(), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}
else
{
    echo json_encode(array(), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}