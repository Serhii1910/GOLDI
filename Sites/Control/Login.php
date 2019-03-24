<?php

include "Modules/AuthentificationModule/UserAuthentification.php";

$UserAuth = new UserAuthentification();
//$Modules = $UserAuth->getAvailableModules();

$ReplaceLoginTags = array(
    '[[++UsernameValue++]]' => '',
    '[[++AddingInfo++]]' => ''
);

if (isset($_REQUEST['Username']))
{
    // ######################################################
    // ## Fehlermeldungen zusammenbauen                    ##
    // ######################################################
    $ReplaceErrorTags = array(
        '[[++ErrorMessage++]]' => ''
    );

    // Username == NULL
    if (empty($_REQUEST['Username']))
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorNoUsername";
        $ReplaceLoginTags['[[++AddingInfo++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
    }
    // Passwort == NULL
    elseif (empty($_REQUEST['Password']))
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorNoPassword";
        $ReplaceLoginTags['[[++AddingInfo++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
    }
    // Passwort stimmt nicht
    else
    {
        $AuthentificationID = $UserAuth->tryAnyAuth($_REQUEST['Username'], $_REQUEST['Password']);
        $UserID = 0;

        if ($AuthentificationID)
        {
            if ($UserAuth->getAuthName() == 'LDB'){
                $UserID = $AuthentificationID;
            }else { //($UserAuth->getAuthName() == 'LDAP_TUI')
                $UserID = Database::User_GetUserIDandUpdateOrInsertLDAPLogin($_REQUEST['Username'], $_REQUEST['Password'], $UserAuth->getEmail(), $UserAuth->getStudentNumber(), $UserAuth->getFirstName(), $UserAuth->getLastName(), $UserAuth->getAuthName());
            }

            if (Database::User_IsBlocked($UserID))
            {
                $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorUserIsBloked";
                $ReplaceLoginTags['[[++AddingInfo++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
            }
            else
            {
                session_regenerate_id(true);
                $_SESSION['UserID'] = $UserID;
                Database::User_SetLastLoginToNow($UserID);

                PANDA::GOLDi_SaveCoinLogin($UserID);

                $ReplaceErrorTags = array();
                $ReplaceErrorTags["[[++OkayMessage++]]"] = "LoggedInSuccessfully";
                $ReplaceLoginTags['[[++AddingInfo++]]'] = Functions::LoadTemplate("Templates/Control/FormInputOkay.tpl",$ReplaceErrorTags);
            }
        }
        else
        {
            $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorPasswordsNotCorrect";
            $ReplaceLoginTags['[[++AddingInfo++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        }
    }

    if (!empty($_REQUEST['Username']))
        $ReplaceLoginTags['[[++UsernameValue++]]'] = $_REQUEST['Username'];

}

$SiteContent = Functions::LoadTemplate("Templates/Control/Login.tpl",$ReplaceLoginTags);
