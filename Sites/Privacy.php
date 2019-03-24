<?php
if(isset($_POST['IAgreePrivacy']) and $_POST['IAgreePrivacy'] = "Yes")
    Database::User_SetPrivacyAgreement($_SESSION['UserID']);

$ReplaceTags = [
    "[[++PrivacyAgreement++]]" => ''
];

if(!Functions::CheckPrivacyAccepted())
    $ReplaceTags["[[++PrivacyAgreement++]]"] = Functions::LoadTemplate("Templates/StaticSites/PrivacyAgreement.tpl");

$SiteContent = Functions::LoadTemplate("Templates/StaticSites/Privacy.tpl", $ReplaceTags);