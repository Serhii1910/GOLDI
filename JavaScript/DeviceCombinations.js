$(document).ready(function()
{
    var Location = getParam("Admin");

    var BPUs = $.parseJSON(
        $.ajax({
            url: "index.php?Function=AdminGetExistingBPUs&Location="+Location,
            async: false,
            dataType: 'json',
            cache: false
        }).responseText
    );

    var PSPUs = $.parseJSON(
        $.ajax({
            url: "index.php?Function=AdminGetExistingPSPUs&Location="+Location,
            async: false,
            dataType: 'json',
            cache: false
        }).responseText
    );

    var PermittedDeviceCombinations = $.parseJSON(
        $.ajax({
            url: "index.php?Function=GetPermittedDeviceCombinations&Location="+Location,
            async: false,
            dataType: 'json',
            cache: false
        }).responseText
    );

    for(var PSPU in PSPUs)
        for (var PSPUVirtual in PSPUs[PSPU])
            for(var BPU in BPUs)
                for (var BPUVirtual in BPUs[BPU])
                {
                    var Template = $("#DeviceCombinationCheckboxTemplate").clone().removeClass("hide");

                    Template.find("input").attr("PSPUType",PSPU);
                    Template.find("input").attr("PSPUVirtual",PSPUVirtual);
                    Template.find("input").attr("BPUType",BPU);
                    Template.find("input").attr("BPUVirtual",BPUVirtual);

                    Template.find("input").prop("checked",false);

                    if(PermittedDeviceCombinations.hasOwnProperty(BPU))
                        if(PermittedDeviceCombinations[BPU].hasOwnProperty(BPUVirtual))
                            if(PermittedDeviceCombinations[BPU][BPUVirtual].hasOwnProperty(PSPU))
                                if(PermittedDeviceCombinations[BPU][BPUVirtual][PSPU].hasOwnProperty(PSPUVirtual))
                                    if(PermittedDeviceCombinations[BPU][BPUVirtual][PSPU][PSPUVirtual] == 1)
                                        Template.find("input").prop("checked",true);

                    var Row = $("#"+PSPU+"_"+PSPUVirtual).parent();
                    Row.append(Template);
                }

     $('.goldi-toggle').bootstrapToggle();

    on = $('.toggle-on');
    on.addClass('tag');
    on.attr("data-i18n","Permitted");

    off = $('.toggle-off');
    off.addClass('tag');
    off.attr("data-i18n","Forbidden");

    i18nValidate();

    $(".toggle").css("min-width","150px");

/*    $('.goldi-toggle').bootstrapToggle({
        on: $('#GoldiTranslations').attr('Permitted'),
        off: $('#GoldiTranslations').attr('Forbidden')
    });*/

    $('input').change(function(){
        var Checkbox = $(this);

        var Post = new Object();
        Post.PSPUType = Checkbox.attr("PSPUType");
        Post.PSPUVirtual = Checkbox.attr("PSPUVirtual");
        Post.BPUType = Checkbox.attr("BPUType");
        Post.BPUVirtual = Checkbox.attr("BPUVirtual");
        Post.Permitted = Checkbox.prop("checked")?1:0;

        $.ajax({
            url: "index.php?Function=AdminSetPermittedDeviceCombinations&Location="+Location,
            type: "POST",
            data: Post,
            dataType: "json",
            cache: false
        });
    });
});