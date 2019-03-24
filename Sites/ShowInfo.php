<?php

$SiteContent = "";

if(!empty($_REQUEST['Error']))
{
    $ReplaceTags = array(
        '[[++ErrorMessage++]]' => ''
    );

    if(!empty($_REQUEST['Error']))
        $ReplaceTags['[[++ErrorMessage++]]'] = $_REQUEST['Error'];

    $SiteContent .= Functions::LoadTemplate("Templates/ShowError.tpl",$ReplaceTags);
}



if(!empty($_REQUEST['Hint']))
{
    $ReplaceTags = array(
        '[[++ErrorHint++]]' => ''
    );

    if(!empty($_REQUEST['Hint']))
        $ReplaceTags['[[++ErrorHint++]]'] = $_REQUEST['Hint'];

    $SiteContent .= Functions::LoadTemplate("Templates/ShowHint.tpl",$ReplaceTags);
}
