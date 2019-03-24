<?php
if (isset($_REQUEST['Username'])){
    $UserID = Database::User_GetUserIDByUsername($_REQUEST['Username']);
    if($UserID != null){
        $User = Database::User_GetUserByID($UserID);
        if($User['LoginType'] == "LDB"){

            $Token = Database::User_GenerateAndInsertForgotPasswordToken($User);
            $ReplaceTags = array(
                "[[++URL++]]" => $_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'],
                "[[++User++]]" => $User['Username'],
                "[[++Token++]]" => $Token
            );

            Functions::SendSMTPMail(
                $User['Email'],
                $LanguageManager->ReplaceTags("[[**EMailForgotPasswordHeader**]]"),
                $LanguageManager->ReplaceTags(Functions::LoadTemplate("Templates/Control/EMailForgotPassword_EMailText.tpl",$ReplaceTags))
            );

            $ReplaceTags = array(
                "[[++ErrorHint++]]" => "PasswordResetEmailSent"
            );
            $SiteContent = Functions::LoadTemplate("Templates/ShowHint.tpl",$ReplaceTags);
        }else /*if($User['LoginType']=="LDAP_TUI")*/{
            $SiteContent = Functions::LoadTemplate("Templates/Control/ChangePassword_LDAP_TUI.tpl");
        }
    }else{
        $ReplaceTags = array(
            "[[++ErrorMessage++]]" => "UsernameNotExisting"
        );
        $ReplaceTags = array(
            "[[++ForgotPasswordError++]]" => Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceTags)
        );
        $SiteContent = Functions::LoadTemplate("Templates/Control/ForgotPassword.tpl",$ReplaceTags);

    }
}else {
    $ReplaceTags = array(
        "[[++ForgotPasswordError++]]" => ""
    );
    $SiteContent = Functions::LoadTemplate("Templates/Control/ForgotPassword.tpl",$ReplaceTags);
}