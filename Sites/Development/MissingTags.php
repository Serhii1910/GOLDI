<?php
/*
    Database::Langauge_InsertTags("Homepage",Functions::GetArrayFromFile("missingtags.txt"));
    if(isset($_REQUEST['InsertTagsIntoDB']))
    {
        Functions::PutArrayToFile(tmp(), "missingtags.txt");
        header("Location:index.php?Site=18");
    }
*/

/*


    $MissingTags = Functions::GetArrayFromFile("missingtags.txt");

    $Result = tmp();
    foreach($MissingTags as $Tag)
        $Result[] .= $Tag.":".$LanguageManager->GetHomepageTranslation($Tag);

*/

    $Tags = Database::Language_LoadAllTags();
    $NewTags = array();
    foreach($Tags as $Tag)
    {
        $Tag = str_replace("[[**","",$Tag);
        $Tag = str_replace("**]]","",$Tag);
        $NewTags[$Tag] = $Tag;
    }

    $NewArray = array();
    foreach(Functions::GetArrayFromFile("missingtags.txt") as $Tag)
        if(!in_array($Tag,$NewTags))
            $NewArray[] = $Tag;

    ob_start();
//    var_dump(Database::Language_LoadAllTags());
    var_dump($NewArray);
    $ReplaceTemplateTags['[[++MissingTags++]]'] = ob_get_clean();


    $SiteContent = Functions::LoadTemplate("Templates/Development/MissingTags.tpl", $ReplaceTemplateTags);
