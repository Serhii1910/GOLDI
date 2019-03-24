<?php

$ReplaceRegisterTags = array(
    '[[++FirstNameError++]]' => '',
    '[[++FirstNameValue++]]' => '',

    '[[++LastNameError++]]' => '',
    '[[++LastNameValue++]]' => '',

    '[[++PasswordError++]]' => '',
    '[[++PasswordValue++]]' => '',

    '[[++PasswordRepeatValue++]]' => '',

    '[[++EMailError++]]' => '',
    '[[++EMailValue++]]' => '',

    '[[++AddingInfo++]]' => '',

    '[[++PrivacyAcceptError++]]' => ''
);

$error = false;

if (isset($_REQUEST['EMail']))
{
    // ######################################################
    // ## Fehlermeldungen zusammenbauen                    ##
    // ######################################################
    $ReplaceErrorTags = array(
        '[[++ErrorMessage++]]' => ''
    );

    // Vorname == NULL
    if (empty($_REQUEST['FirstName']) or Functions::StringIncludingSpecialCharacter($_REQUEST['FirstName']))
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorNoFirstname";
        $ReplaceRegisterTags['[[++FirstNameError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        $error = true;
    }

    // Nachname == NULL
    if (empty($_REQUEST['LastName']) or Functions::StringIncludingSpecialCharacter($_REQUEST['LastName']))
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorNoLastname";
        $ReplaceRegisterTags['[[++LastNameError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        $error = true;
    }

/*
    // Username == NULL
    if (empty($_REQUEST['Username']))
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorNoUsername";
        $ReplaceRegisterTags['[[++UsernameError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        $error = true;
    }
    // Username existiert
    elseif (Database::User_UsernameExists($_REQUEST['Username']))
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorUsernameExists";
        $ReplaceRegisterTags['[[++UsernameError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        $error = true;
    }
*/

    // Passwort == NULL
    if (empty($_REQUEST['Password']))
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorNoPassword";
        $ReplaceRegisterTags['[[++PasswordError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        $error = true;
    }
    // Passwort ungleich
    elseif ($_REQUEST['Password'] != $_REQUEST['PasswordRepeat'])
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorPasswordsNotEqual";
        $ReplaceRegisterTags['[[++PasswordError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        $error = true;
    }

    // EMail == NULL
    if (empty($_REQUEST['EMail']))
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorNoEMail";
        $ReplaceRegisterTags['[[++EMailError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        $error = true;
    }
    // EMail existiert
    elseif (Database::User_EmailExists($_REQUEST['EMail']))
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorEMailExists";
        $ReplaceRegisterTags['[[++EMailError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        $error = true;
    }
    elseif (!preg_match("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$^", $_REQUEST['EMail']))
    {
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorEMailNotValid";
        $ReplaceRegisterTags['[[++EMailError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        $error = true;
    }

    if (!empty($_REQUEST['FirstName']))
        $ReplaceRegisterTags['[[++FirstNameValue++]]'] = htmlspecialchars($_REQUEST['FirstName']);

    if (!empty($_REQUEST['LastName']))
        $ReplaceRegisterTags['[[++LastNameValue++]]'] = htmlspecialchars($_REQUEST['LastName']);

    if (!empty($_REQUEST['Password']))
        $ReplaceRegisterTags['[[++PasswordValue++]]'] = htmlspecialchars($_REQUEST['Password']);

    if (!empty($_REQUEST['PasswordRepeat']))
        $ReplaceRegisterTags['[[++PasswordRepeatValue++]]'] = htmlspecialchars($_REQUEST['PasswordRepeat']);

    if (!empty($_REQUEST['EMail']) and filter_var($_REQUEST['EMail'], FILTER_VALIDATE_EMAIL))
        $ReplaceRegisterTags['[[++EMailValue++]]'] = $_REQUEST['EMail'];

    if (!isset($_REQUEST['PrivacyCheckbox']) or $_REQUEST['PrivacyCheckbox'] != "on"){
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorPrivacyNotAccepted";
        $ReplaceRegisterTags['[[++PrivacyAcceptError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        $error = true;
    }

    if (!$error) {
        $Token = md5($_REQUEST['FirstName'].$_REQUEST['LastName'].$_REQUEST['EMail']."SecretMD5Hash".time());

        if (Database::User_InsertNewUser($_REQUEST['FirstName'], $_REQUEST['LastName'], $_REQUEST['EMail'], $_REQUEST['Password'], $_REQUEST['EMail'], $Token)) {
            $ReplaceErrorTags = array();
            $ReplaceErrorTags['[[++OkayMessage++]]'] = "NewUserAddedOkay";
            $ReplaceRegisterTags['[[++AddingInfo++]]'] = Functions::LoadTemplate("Templates/Control/FormInputOkay.tpl",$ReplaceErrorTags);

            $ReplaceTags = array(
                "[[++URL++]]" => $_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'],
                "[[++User++]]" => $_REQUEST['EMail'],
                "[[++Token++]]" => $Token
            );

            Functions::SendSMTPMail(
                $_REQUEST['EMail'],
                $LanguageManager->ReplaceTags("[[**EMailVerificationHeader**]]"),
                $LanguageManager->ReplaceTags(Functions::LoadTemplate("Templates/Control/EMailVerification_EMailText.tpl",$ReplaceTags))
            );
        } else {
            $ReplaceErrorTags['[[++ErrorMessage++]]'] = "NewUserAddedError";
            $ReplaceRegisterTags['[[++AddingInfo++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
        }
    }

}

$SiteContent = Functions::LoadTemplate("Templates/Control/Register.tpl",$ReplaceRegisterTags);
