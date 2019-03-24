<?php
header('Content-type: application/json; charset=utf-8');
$TMP = array();
foreach (Database::Language_GetAvailableLocales() as $Locale)
    $TMP[$Locale] = $LanguageManager->GetLanguageCode($Locale);
echo json_encode($TMP, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);