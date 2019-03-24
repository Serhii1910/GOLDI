<?php
if(!empty($_REQUEST['User']) && !empty($_REQUEST['Token']))
{
    $Token = Database::User_GetForgotPasswordToken($_REQUEST['User']);
    if($Token and $Token != null and $_REQUEST['Token'] == $Token)
    {

        $ReplaceTags = array(
            "[[++User++]]" => $_REQUEST['User'],
            "[[++Token++]]" => $Token,
            "[[++NewPasswordError++]]" => "",
            "[[++NewPasswordConfirmError++]]" => ""
        );

        if(isset($_REQUEST['Info'])){
            if(empty($_REQUEST["NewPassword"])){
                $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorNoPassword";
                $ReplaceTags['[[++NewPasswordError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
                $SiteContent = Functions::LoadTemplate("Templates/Control/ResetPassword.tpl",$ReplaceTags);
            }else if($_REQUEST["NewPassword"] != $_REQUEST["NewPasswordConfirm"]){
                $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorPasswordsNotEqual";
                $ReplaceTags['[[++NewPasswordConfirmError++]]'] = Functions::LoadTemplate("Templates/Control/FormInputError.tpl",$ReplaceErrorTags);
                $SiteContent = Functions::LoadTemplate("Templates/Control/ResetPassword.tpl",$ReplaceTags);
            }else{
                $UserID = Database::User_GetUserIDByUsername($_REQUEST['User']);
                if(Database::User_SetNewPassword($UserID,$_REQUEST["NewPassword"]) && Database::User_RemoveForgotPasswordToken($_REQUEST['User'])){
                    $ReplaceErrorTags['[[++SuccessMessage++]]'] = "PasswordChangedOkay";
                    $SiteContent = Functions::LoadTemplate("Templates/ShowSuccess.tpl",$ReplaceErrorTags);
                }else{
                    $ReplaceErrorTags['[[++ErrorMessage++]]'] = "PasswordChangedError";
                    $SiteContent = Functions::LoadTemplate("Templates/ShowError.tpl",$ReplaceErrorTags);
                }
            }
        }else{
            $SiteContent = Functions::LoadTemplate("Templates/Control/ResetPassword.tpl",$ReplaceTags);
        }

        return;
    }else{
        $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorWrongToken";
        $SiteContent = Functions::LoadTemplate("Templates/ShowError.tpl",$ReplaceErrorTags);
    }
}else{
    $ReplaceErrorTags['[[++ErrorMessage++]]'] = "ErrorWrongToken";
    $SiteContent = Functions::LoadTemplate("Templates/ShowError.tpl",$ReplaceErrorTags);
}
