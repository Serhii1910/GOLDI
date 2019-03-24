<?php
    $BPUs = Database::Devices_GetBPUTypesForLocation($Location);
    $BPUColumns = "";
    foreach($BPUs as $BPU => $TMP)
        foreach($TMP as $Virtual => $TMP2)
        {
            $ReplaceTagsBPUColumn = array(
                '[[++BPUType++]]' => $BPU,
                '[[++BPUVirtual++]]' => $Virtual
            );
            $BPUColumns .= Functions::LoadTemplate("Templates/Admin/DeviceCombinationBPUColumn.tpl",$ReplaceTagsBPUColumn);
        }


    $PSPUs = Database::Devices_GetPSPUTypesForLocation($Location);
    $PSPURows = "";
    foreach($PSPUs as $PSPU=> $TMP)
        foreach($TMP as $Virtual => $TMP2)
        {
            $ReplaceTagsPSPURow = array(
                '[[++PSPUID++]]' => $PSPU."_".$Virtual,
                '[[++PSPUType++]]' => $PSPU,
                '[[++PSPUVirtual++]]' => $Virtual
            );

            $PSPURows .= Functions::LoadTemplate("Templates/Admin/DeviceCombinationPSPURow.tpl",$ReplaceTagsPSPURow);
        }


    $ReplaceTagHeader = array(
        "[[++Location++]]" => $Location,
        "[[++DeviceCombinationHeader++]]" => $BPUColumns,
        "[[++DeviceCombinationBody++]]" => $PSPURows
    );

    $SiteContent = Functions::LoadTemplate("Templates/Admin/DeviceCombinations.tpl",$ReplaceTagHeader);