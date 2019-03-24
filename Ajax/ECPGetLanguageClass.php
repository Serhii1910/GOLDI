<?php
Functions::Ajax_TestRequestBPUType();
Functions::Ajax_TestRequestPSPUType();

header('Content-type: application/json; charset=utf-8');

$output  = "function Language() {\n";
$output .= "    this.locales = ";

    $tmp = array();
    foreach (Database::Language_GetAvailableLocales() as $locale)
        $tmp[$locale] = $LanguageManager->GetLanguageCode($locale);
    $output.= json_encode($tmp, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

$output .= "\n\n    this.localesEN = ";

    $tmp = array();
    foreach (Database::Language_GetAvailableLocales() as $locale)
        $tmp[$locale] = $LanguageManager->GetLanguageCodeEN($locale);
    $output.= json_encode($tmp, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);


$output .= "\n\n    this.languages = {";

    foreach(Database::Language_GetAvailableLocales() as $Locale)
    {
        $output .= '"' . $Locale . '" : ';

        $_REQUEST['Locale'] = $Locale;


        $output .= json_encode(
            array_merge(
                $LanguageManager->GetTranslations("ECP_Devices", $_REQUEST['Locale']),
                $LanguageManager->GetTranslations("ECP_General", $_REQUEST['Locale']),
                $LanguageManager->GetTranslations("PSPU_" . $_REQUEST['PSPUType'], $_REQUEST['Locale']),
                $LanguageManager->GetTranslations("BPU_" . $_REQUEST['BPUType'], $_REQUEST['Locale'])
            ),
            JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
        );

        $output .= ",\n\n";

    }

$output .= "}}";

echo $output;
