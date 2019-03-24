<?php
Functions::Ajax_TestRequestBPUType();
Functions::Ajax_TestRequestPSPUType();
Functions::Ajax_TestRequestLocale();

header('Content-type: application/json; charset=utf-8');

echo json_encode(
    array_merge(
        $LanguageManager->GetTranslations("ECP_Devices", $_REQUEST['Locale']),
        $LanguageManager->GetTranslations("ECP_General", $_REQUEST['Locale']),
        $LanguageManager->GetTranslations("PSPU_" . $_REQUEST['PSPUType'], $_REQUEST['Locale']),
        $LanguageManager->GetTranslations("BPU_" . $_REQUEST['BPUType'], $_REQUEST['Locale'])
    ),
    JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
);
