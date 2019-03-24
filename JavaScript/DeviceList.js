$(document).ready(()=>{
    let Location = getParam("Admin");

    $('.maintenance_toggle').bootstrapToggle();

    on = $('.toggle-on');
    on.addClass('tag');
    on.attr("data-i18n","Available");

    off = $('.toggle-off');
    off.addClass('tag');
    off.attr("data-i18n","Maintenance");

    i18nValidate();

    $('.maintenance_toggle').change(function() {
        let Obj = $(this);
        let Post = {
            Location : Location,
            DeviceType : Obj.attr("DeviceType"),
            ServiceDestID : Obj.attr("ServiceDestID"),
            Virtual : Obj.attr("Virtual"),
            InMaintenance : Obj.prop("checked")?"0":"1",
        };

        $.ajax({
            url: "index.php?Function=AdminSetDeviceToMaintenance&Location="+Location,
            type: "POST",
            data: Post,
            dataType: "json",
            cache: false
        });
    });
});
