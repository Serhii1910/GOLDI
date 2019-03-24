<?php
    // ######################################################
    // ## Navbar zusammenbauen                             ##
    // ######################################################

    // Keyword [[**MenuLines**]] = Menubar
    $AvailableMenus = Database::Navigation_GetAllMenusForUser(Database::User_GetGroupsForUser($_SESSION['UserID']));
    $ActiveMenu = Database::Navigation_GetMenuTagFromSiteID($_REQUEST['Site']);

    $MenuLinesString = "";
    foreach ($AvailableMenus as $AvailableMenu)
    {
        $ReplaceMenuTags = array(
            '[[++url++]]' => 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME'],
            '[[++MenuTitle++]]' => $AvailableMenu,
            '[[++SiteID++]]' => Database::Navigation_GetFirstSiteIDByMenuTag($AvailableMenu, Database::User_GetGroupsForUser($_SESSION['UserID'])),
            '[[++Parameter++]]' => ""
        );

        if ($AvailableMenu == $ActiveMenu)
            $MenuLine = Functions::LoadTemplate("Templates/Structure/HeaderActiveButton.tpl",$ReplaceMenuTags);
        else
            $MenuLine = Functions::LoadTemplate("Templates/Structure/HeaderDeactiveButton.tpl",$ReplaceMenuTags);

        $MenuLinesString .= $MenuLine;
    }

    // ######################################################
    // ## Controlbutton zusammenbauen                      ##
    // ######################################################


// Keyword [[**ControlLines**]] = Login / LogOut
    $ControlLines = "";

    if (isset($_SESSION['UserID']) and $_SESSION['UserID'] > 0)
    {
        $ReplaceControlTags = array(
            '[[++MenuTitle++]]' =>'EndSession',
            '[[++SiteID++]]' => '12'
        );

        $ControlLines = Functions::LoadTemplate("Templates/Structure/HeaderDeactiveButton.tpl",$ReplaceControlTags);
    }
    else
    {
        $ReplaceControlTags = array(
            '[[++MenuTitle++]]' =>'Login',
            '[[++SiteID++]]' => '11'
        );

        $ControlLines = Functions::LoadTemplate("Templates/Structure/HeaderDeactiveButton.tpl",$ReplaceControlTags);

        $ReplaceControlTags = array(
            '[[++MenuTitle++]]' =>'Register',
            '[[++SiteID++]]' => '13'
        );

        $ControlLines .= Functions::LoadTemplate("Templates/Structure/HeaderDeactiveButton.tpl",$ReplaceControlTags);
    }

    // ######################################################
    // ## Localemenu zusammenbauen                         ##
    // ######################################################

    // Keyword [[**LocaleLines**]] = Sprachauswahl
    $AvailableLanguages = $LanguageManager->GetAvailableLocales();
    $ActiveLanguage = $LanguageManager->GetLocale();

    $LocaleLinesString = "";

    foreach ($AvailableLanguages as $AvailableLanguage)
    {
        $ReplaceLocaleTags = array
        (
            '[[++LocaleLink++]]' => $AvailableLanguage,
            '[[++Locale++]]' => $LanguageManager->GetLanguageCode($AvailableLanguage),
            '[[++LocaleEn++]]' => $LanguageManager->GetLanguageCodeEN($AvailableLanguage),
            '[[++URL++]]' => Functions::GetURLWithoutLocale()
        );

        $LocaleLine = Functions::LoadTemplate("Templates/Structure/HeaderLocaleButton.tpl",$ReplaceLocaleTags);

//        if ($AvailableLanguage == $ActiveLanguage)
//            $LocaleLine = Functions::LoadTemplate("Templates/Structure/HeaderPresentationButton.tpl",$ReplaceLocaleTags);
//        else
//            $LocaleLine = Functions::LoadTemplate("Templates/Structure/HeaderLocaleButton.tpl",$ReplaceLocaleTags);

        $LocaleLinesString .= $LocaleLine;
    }

    $LoginLineString = '';

    if(empty($_SESSION['UserID']))
    {
        if($_SERVER['REQUEST_SCHEME'] == "https"){
            $ReplaceLoginTags = array
            (
                '[[++LoginHasError++]]' => '',
                '[[++UsernameValue++]]' => '',
                '[[++PasswordValue++]]' => '',
            );
            $LoginLineString = Functions::LoadTemplate("Templates/Control/HeaderLoginHTTPS.tpl",$ReplaceLoginTags);
        }else{
            $ReplaceLoginTags = array
            (
                '[[++url++]]' => 'https://'.$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME'],
            );
            $LoginLineString = Functions::LoadTemplate("Templates/Control/HeaderLoginHTTP.tpl",$ReplaceLoginTags);
        }
    }
    else
    {
        $UserData = Database::User_GetUserByID($_SESSION['UserID']);
        $ReplaceLogoutTags = array
        (
            '[[++Username++]]' => $UserData['FirstName']."&nbsp;".$UserData['LastName']
        );
        $LoginLineString = Functions::LoadTemplate("Templates/Control/HeaderLogout.tpl",$ReplaceLogoutTags);
    }

    $NoJavaScript = "";
    if(isset($_REQUEST["Site"]) and $_REQUEST["Site"] != 20)
        $NoJavaScript = Functions::LoadTemplate("Templates/NoJavaScript.tpl");

    $AdminMenu = "";
    $AdminLocations = Database::Navigation_GetAdminLocationsOfUser($_SESSION['UserID']);
    if(sizeof($AdminLocations)==1){
        $ReplaceMenuTags = array(
            '[[++MenuTitle++]]' => "MenuAdmin".$AdminLocations[0],
            '[[++SiteID++]]' => 118,
            '[[++Parameter++]]' => "&Admin=".$AdminLocations[0]
        );
        if (isset($_REQUEST['Admin']))
            $AdminMenu = Functions::LoadTemplate("Templates/Structure/HeaderActiveButton.tpl",$ReplaceMenuTags);
        else
            $AdminMenu = Functions::LoadTemplate("Templates/Structure/HeaderDeactiveButton.tpl",$ReplaceMenuTags);
    }else if(sizeof($AdminLocations)>1) {
        $Locations = Database::Locations_GetLocationInformation();

        $ReplaceAdminLinesString = "";
        foreach($AdminLocations as $AdminLocation) {
            $ReplaceAdminLinesTag = array(
                "[[++Target++]]" => '',
                "[[++HREF++]]" => "?Site=118&Admin=$AdminLocation",
                "[[++Title++]]" => $Locations[$AdminLocation]["Name"],
                "[[++LinkText++]]" => "MenuAdmin".$AdminLocation
            );
            $ReplaceAdminLinesString .= Functions::LoadTemplate("Templates/Structure/HeaderDropdownLine.tpl",$ReplaceAdminLinesTag);
        }

        $ReplaceAdminMenuTag = array(
            "[[++HeaderDropdownLines++]]" => $ReplaceAdminLinesString,
            "[[++TranslationTag++]]" => isset($_REQUEST['Admin'])?"MenuAdmin".$_REQUEST['Admin']:"MenuAdmin",
            "[[++Active++]]" => isset($_REQUEST['Admin'])?"active":""
        );
        $AdminMenu = Functions::LoadTemplate("Templates/Structure/HeaderDropdownMenu.tpl",$ReplaceAdminMenuTag);
    }

    $ReplaceToolLinesString = "";
    $ReplaceToolLinesTag = array(
        "[[++Target++]]" => 'target="_blank"',
        "[[++HREF++]]" => "BEAST.html",
        "[[++Title++]]" => "BEASTDescription",
        "[[++LinkText++]]" => "BEAST"
    );
    $ReplaceToolLinesString .= Functions::LoadTemplate("Templates/Structure/HeaderDropdownLine.tpl",$ReplaceToolLinesTag);
    $ReplaceToolLinesTag = array(
        "[[++Target++]]" => 'target="_blank"',
        "[[++HREF++]]" => "GIFT/entwurf.html",
        "[[++Title++]]" => "GIFTDescription",
        "[[++LinkText++]]" => "GIFT"
    );
    $ReplaceToolLinesString .= Functions::LoadTemplate("Templates/Structure/HeaderDropdownLine.tpl",$ReplaceToolLinesTag);
    $ReplaceToolLinesTag = array(
        "[[++Target++]]" => 'target="_blank"',
        "[[++HREF++]]" => "SANE/",
        "[[++Title++]]" => "SANEDescription",
        "[[++LinkText++]]" => "SANE"
    );
    $ReplaceToolLinesString .= Functions::LoadTemplate("Templates/Structure/HeaderDropdownLine.tpl",$ReplaceToolLinesTag);

    $ReplaceToolMenuTag = array(
        "[[++HeaderDropdownLines++]]" => $ReplaceToolLinesString,
        "[[++TranslationTag++]]" => isset($_REQUEST['Tool'])?"MenuTool".$_REQUEST['Tool']:"MenuTool",
        "[[++Active++]]" => isset($_REQUEST['Tool'])?"active":""
    );
    $ToolMenu = Functions::LoadTemplate("Templates/Structure/HeaderDropdownMenu.tpl",$ReplaceToolMenuTag);

    
// ######################################################
    // ## Header generieren                                ##
    // ######################################################
    $ReplaceHeaderTags = array
    (
        '[[++SessionTimeoutSeconds++]]' => $_SESSION['UserID'] == 0 ? (1000 * 60 * 60 * 24) : Definitions::SessionTimeoutSeconds,

        '[[++MenuLines++]]' => $MenuLinesString,
        '[[++LoginLineString++]]' => $LoginLineString,
        '[[++ControlLines++]]' => $ControlLines,
        '[[++LocaleLines++]]' => $LocaleLinesString,
//        '[[++SiteTitle++]]' => "[[**".Database::Navigation_GetSiteTagFromSiteID($_REQUEST['Site'])."**]]",
        '[[++SiteTitle++]]' => Database::Navigation_GetSiteTagFromSiteID($_REQUEST['Site']),
        '[[++NoJavaScript++]]' => $NoJavaScript,
        '[[++ToolMenu++]]' =>  $ToolMenu,
        '[[++AdminMenu++]]' =>  $AdminMenu
    );

    $HeaderContent = Functions::LoadTemplate("Templates/Structure/Header.tpl",$ReplaceHeaderTags);