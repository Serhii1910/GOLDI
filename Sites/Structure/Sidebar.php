<?php

    // ######################################################
    // ## Sidebar zusammenbauen                            ##
    // ######################################################


    // Keyword [[**SidebarLines**]] = Sidebar
    $AvailableSites = Database::Navigation_GetAllSitesForUserFromAMenu($_REQUEST['Site'], Database::User_GetGroupsForUser($_SESSION['UserID']));
    $ActiveSite = Database::Navigation_GetSiteTagFromSiteID($_REQUEST['Site']);

    $SidebarLinesString = "";

    $AdminParameter = "";
    if(isset($_REQUEST["Admin"]) and Database::Navigation_GetMenuTagFromSiteID($_REQUEST['Site']) == "MenuAdmin")
        $AdminParameter = "&Admin=".$_REQUEST["Admin"];

    foreach ($AvailableSites as $ID => $AvailableSite)
    {
        $ReplaceButtonTags = array(
            '[[++ButtonName++]]' => $AvailableSite,
            '[[++SiteID++]]' => $ID,
            '[[++AdminParameter++]]' => $AdminParameter
        );

        if ($AvailableSite == $ActiveSite)
            $SidebarLine = Functions::LoadTemplate("Templates/Structure/SidebarActiveButton.tpl",$ReplaceButtonTags);
        else
            $SidebarLine = Functions::LoadTemplate("Templates/Structure/SidebarDeactiveButton.tpl",$ReplaceButtonTags);

        $SidebarLinesString .= $SidebarLine;
    }

    // ######################################################
    // ## Sidebar generieren                               ##
    // ######################################################
    $ReplaceSidebarTags = array(
        '[[++SidebarLines++]]' => $SidebarLinesString
    );

    if(empty($SidebarLinesString)){
        $SidebarContent = Functions::LoadTemplate("Templates/Structure/MainContainerWithoutSidebar.tpl",$ReplaceSidebarTags);
    }else{
        $SidebarContent = Functions::LoadTemplate("Templates/Structure/Sidebar.tpl",$ReplaceSidebarTags);
    }

