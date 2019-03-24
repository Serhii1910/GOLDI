<?php

//setcookie("Locale", "bla");
//echo $_COOKIE["Locale"];
//exit;
//exit;

ini_set('display_errors', 'On');

require_once('Definitions.php');

require_once('Functions.php');
Functions::StartSession();

require_once('Database.php');
Database::Connect();

require_once('LanguageManager.php');
$LanguageManager = new LanguageManager();

require_once('PANDA/PANDA.php');

/*
$ReplaceTags = tmp(
    "[[++User++]]" => "TEST",
    "[[++Token++]]" => "TOKEN"
);

echo $LanguageManager->ReplaceTags(Functions::LoadTemplate("Templates/Control/EMailVerification_EMailText.tpl",$ReplaceTags));

exit;
*/


if(Functions::CheckIPHasChanged()){
    Functions::EndSession();
    header("location: index.php?Site=20&Hint=IPHasChanged");
    exit;
}

if(Functions::CheckSessionIDHasChanged()){
    Functions::EndSession();
    header("location: index.php?Site=20&Hint=LoggedInSomewhereElse");
    exit;
}

if(!Functions::CheckPrivacyAccepted() and isset($_REQUEST['Site']) and !in_array($_REQUEST['Site'], ['133','12','20'])){
    header("location: index.php?Site=133");
    exit;
}

if(isset($_REQUEST['Function'])){
    $Function = Database::Functions_GetFunction($_REQUEST['Function']);


    if(!empty($Function))
    {
        include_once $Function['Path'];
        die();
    }
    else
    {
        Functions::RedirectToErrorSite("FunctionNotAvailable");
        die();
    }
}

$AvailableSites = Database::Navigation_GetAllSitesForUser(Database::User_GetGroupsForUser($_SESSION['UserID']));

// Standard immer auf die Startseite
if (!isset($_REQUEST['Site']))
    $_REQUEST['Site'] = 1;

if (isset($_REQUEST['Site']) and in_array($_REQUEST['Site'], $AvailableSites)) {
    if (!is_file(Database::Navigation_GetIncludePath($_REQUEST['Site'])))
        // Datei existiert nicht
        require(Database::Navigation_GetIncludePath(10));
    else {
        if(Database::Navigation_GetMenuTagFromSiteID($_REQUEST['Site']) == "MenuAdmin"){
            // Öffnen des AdminMenus
            if(isset($_REQUEST['Admin']) and in_array($_REQUEST['Admin'],Database::Navigation_GetAdminLocationsOfUser($_SESSION['UserID']))){
                $Location = $_REQUEST['Admin'];
                require(Database::Navigation_GetIncludePath($_REQUEST['Site']));
            }else{
                require(Database::Navigation_GetIncludePath(10));
            }
        }else{
            require(Database::Navigation_GetIncludePath($_REQUEST['Site']));
            PANDA::GOLDi_SaveCoinURL($_SESSION['UserID'],$_SERVER['REQUEST_URI'],$_REQUEST['Site']);
        }
    }
} else{
    // Keine Berechtigung oder unbekannte Seite geoeffnet!
    require(Database::Navigation_GetIncludePath(10));
}

require_once('Sites/Structure/Header.php');
require_once('Sites/Structure/Sidebar.php');
require_once('Sites/Structure/Footer.php');

$Content = $HeaderContent . $SidebarContent . $SiteContent . $FooterContent;

$LanguageReplacedContent = $LanguageManager->ReplaceTags(Functions::ExtendJSCSSFilePathsWithTimeStamp($Content));
echo $LanguageReplacedContent;

//echo $LanguageManager->ReplaceTags($Content).print_r($_COOKIE,true);
//echo $Content;

// Missing Tag Engine!!!!
//Functions::PutArrayToFile(tmp(), "missingtags.txt");

//Functions::PutArrayToFile(tmp(), "missingtags.txt");

/*$MissingTags = Array();
$OldMissingTags = Functions::GetArrayFromFile("missingtags.txt");

if(!is_array($OldMissingTags))
    $OldMissingTags = array();

$Finds = explode('[[**', $Content);
foreach ($Finds as $Find)
{
    $Finds_Tmp = explode('**]]', $Find);
    if (count($Finds_Tmp) > 1)
        $MissingTags[] = $Finds_Tmp[0];
}

$Temp = array_merge($MissingTags, $OldMissingTags);
$Temp = array_unique($Temp);

Functions::PutArrayToFile($Temp, "missingtags.txt");
*/