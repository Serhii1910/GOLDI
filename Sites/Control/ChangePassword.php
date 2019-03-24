<?php

$SiteContent = "";

if(Database::User_GetLoginType($_SESSION['UserID']) == 'LDAP_TUI')
    $SiteContent = Functions::LoadTemplate("Templates/Control/ChangePassword_LDAP_TUI.tpl");

if(Database::User_GetLoginType($_SESSION['UserID']) == 'LDB')
{
    $ReplaceRegisterTags = array(
        '[[++OldPasswordError++]]' => '',
        '[[++NewPasswordError++]]' => '',
        '[[++NewPasswordConfirmError++]]' => '',
        '[[++ChangingInfo++]]' => ''
    );

    $error = false;

    if (isset($_REQUEST['OldPassword']))
    {
        // ######################################################
        // ## Fehlermeldungen zusammenbauen                    ##
        // ######################################################
        $ReplaceErrorTags = array(
            '[[++ErrorMessage++]]' => ''
        );

        // Altes Passwort == NULL
        if (empty($_REQUEST['OldPassword']))
        {
            $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorNoPassword";
            $ReplaceRegisterTags['[[++OldPasswordError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);

            $error = true;
        }
        elseif(!Database::User_CheckPasswordForID($_SESSION['UserID'],$_REQUEST['OldPassword']))
        {
            $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorWrongPassword";
            $ReplaceRegisterTags['[[++OldPasswordError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
            $error = true;
        }

        // Altes Passwort == NULL
        if (empty($_REQUEST['NewPassword']))
        {
            $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorNoPassword";
            $ReplaceRegisterTags['[[++NewPasswordError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
            $error = true;
        }elseif($_REQUEST['NewPassword'] != $_REQUEST['NewPasswordConfirm']){
            $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorPasswordsNotEqual";
            $ReplaceRegisterTags['[[++NewPasswordConfirmError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
            $error = true;
        }

        if (!$error)
        {
            if (Database::User_SetNewPassword($_SESSION['UserID'], $_REQUEST['NewPassword']))
            {
                $ReplaceErrorTags = array();
                $ReplaceErrorTags['[[++OkayMessage++]]'] = "PasswordChangedOkay";
                $ReplaceRegisterValues['[[++ChangingInfo++]]'] = Functions::LoadTemplate("Templates/Control/FormInputOkay.tpl",$ReplaceErrorTags);
            }
            else
            {
                $ReplaceErrorTags = array();
                $ReplaceErrorTags['[[++ErrorMessage++]]'] = "PasswordChangedError";
                $ReplaceRegisterValues['[[++ChangingInfo++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
            }
        }
    }

    $SiteContent = Functions::LoadTemplate("Templates/Control/ChangePassword_LDB.tpl",$ReplaceRegisterTags);
}