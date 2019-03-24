<?php
    // Keyword [[++StaffLinesIUT++]] = Staff List
    $Members = Array();
    $Members[] = Array("Dr.-Ing. Karsten Henke", "HenkeK", "HenkeK.jpg", "karsten.henke@tu-ilmenau.de");
    $Members[] = Array("Dr.-Ing. Heinz-Dietrich Wuttke", "WuttkeD", "WuttkeD.jpg", "dieter.wuttke@tu-ilmenau.de");
    $Members[] = Array("Dipl.-Inf. René Hutschenreuter", "HutschenreuterR", "HutschenreuterR.jpg", "rene.hutschenreuter@tu-ilmenau.de");
    $Members[] = Array("M. Sc. Tobias Fäth", "FaethT", "FaethT.jpg", "tobias.faeth@tu-ilmenau.de");
    $Members[] = Array("Dipl.-Ing. Jürgen Schmidt", "SchmidtJ", "SchmidtJ.jpg", "juergen.schmidt@tu-ilmenau.de");
    $Members[] = Array("Felix Seidel", "SeidelF", "SeidelF.jpg", "felix.seidel@tu-ilmenau.de");
    $Members[] = Array("Stephan Mechold", "MecholdS", "Unknown.png", "stephan.mechold@tu-ilmenau.de");
    $Members[] = Array("Maximilian Engelhardt", "EngelhardtM", "Unknown.png", "maximilan.engelhardt@tu-ilmenau.de");
    $Members[] = Array("Daio Götze", "GoetzeD", "Unknown.png", "dario.goetze@tu-ilmenau.de");
    $Members[] = Array("Stephen Ahmad", "AhmadS", "Unknown.png", "stephen.ahmad@tu-ilmenau.de");
    $Members[] = Array("B. Sc. David Sukiennik", "SukiennikD", "Unknown.png", "david.sukiennik@tu-ilmenau.de");
    $Members[] = Array("Johannes Nau", "NauJ", "Unknown.png", "johannes.nau@tu-ilmenau.de");
    $Members[] = Array("Andrey Yelmanov", "YelmanovA", "YelmanovA.png", "andrey.yelmanov@tu-ilmenau.de");

    $StaffLinesStringIUT = "";
    foreach ($Members as $Member)
    {
        $ReplaceMemberTags['[[++ImageName++]]'] = $Member[2];
        $ReplaceMemberTags['[[++Name++]]'] = $Member[0];
        $ReplaceMemberTags['[[++Position++]]'] = "SiteAboutPosition" . $Member[1];
        $ReplaceMemberTags['[[++Line1++]]'] = "SiteAboutLine1" . $Member[1];
        $ReplaceMemberTags['[[++Line2++]]'] = "SiteAboutLine2" . $Member[1];
        $ReplaceMemberTags['[[++EMail++]]'] = $Member[3];

        $StaffLinesStringIUT .= Functions::LoadTemplate("Templates/StaticSites/AboutUsEntry.tpl",$ReplaceMemberTags);
    }

    //Ehemalige Mitarbeiter
    $Members = Array();
    $Members[] = Array("Nicole Ponischil", "PonischilN", "PonischilN.png", "nicole.ponischil@tu-ilmenau.de");
    $Members[] = Array("B. Sc. Matei-Adrian Vidican", "VidicanM", "VidicanM.png", "matei-adrian.vidican@tu-ilmenau.de");
    $Members[] = Array("Lisa-Marie Schilling", "SchllingL", "SchillingL.jpg", "lisa-marie.schilling@tu-ilmenau.de");
    $Members[] = Array("B. Sc. Alexander H&auml;rtel", "HaertelA", "HaertelA.jpg", "a.haertel@tu-ilmenau.de");
    $Members[] = Array("Lennart Planz", "PlanzL", "PlanzL.jpg", "lennart.planz@tu-ilmenau.de");
    $Members[] = Array("Robin Münch", "MuenchR", "Unknown.png", "robin.muench@tu-ilmenau.de");
    $Members[] = Array("Bastian Hellweg", "HellwegB", "HellwegB.png", "bastian.hellweg@tu-ilmenau.de");

    $FormerStaffLinesStringIUT = "";
    foreach ($Members as $Member)
    {
        $ReplaceMemberTags['[[++ImageName++]]'] = $Member[2];
        $ReplaceMemberTags['[[++Name++]]'] = $Member[0];
        $ReplaceMemberTags['[[++Position++]]'] = "SiteAboutPosition" . $Member[1];
        $ReplaceMemberTags['[[++Line1++]]'] = "SiteAboutLine1" . $Member[1];
        $ReplaceMemberTags['[[++Line2++]]'] = "SiteAboutLine2" . $Member[1];
        $ReplaceMemberTags['[[++EMail++]]'] = $Member[3];

        $FormerStaffLinesStringIUT .= Functions::LoadTemplate("Templates/StaticSites/AboutUsEntry.tpl",$ReplaceMemberTags);
    }

    // ######################################################
    // ## AboutUs generieren                               ##
    // ######################################################
    $ReplaceAboutUsTags = array(
        '[[++StaffLinesIUT++]]' => $StaffLinesStringIUT,
        '[[++FormerStaffLinesIUT++]]' => $FormerStaffLinesStringIUT
    );

    $SiteContent = Functions::LoadTemplate("Templates/StaticSites/AboutUs.tpl",$ReplaceAboutUsTags);