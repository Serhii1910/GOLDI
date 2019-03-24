<?php

//index.php?Site=31&User=rene.hutschi@gmail.com&Token=t0k3n

if(!empty($_REQUEST['User']) && !empty($_REQUEST['Token']))
{
    $Token = Database::User_GetVerificationToken($_REQUEST['User']);
    if($Token and $Token != null and $_REQUEST['Token'] == $Token and Database::User_VerificateUser($_REQUEST['User']))
    {
        $ReplaceTags = array(
            "[[++SuccessMessage++]]" => "EmailValidationSuccess"
        );

        $SiteContent = Functions::LoadTemplate("Templates/ShowSuccess.tpl",$ReplaceTags);
        return;
    }
}

$ReplaceTags = array(
    "[[++ErrorMessage++]]" => "EmailValidationError"
);

$SiteContent = Functions::LoadTemplate("Templates/ShowError.tpl",$ReplaceTags);