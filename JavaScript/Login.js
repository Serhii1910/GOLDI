$(document).ready(function()
{
    var MessageSuccess = $('#MessageSuccess');
    if (MessageSuccess.length > 0 && MessageSuccess.hasClass('alert-success'))
        $('.form-control').prop('disabled', true);


    var RefreshTimer = undefined;
    // time in milliseconds the visitor's view is being refreshed
    var RefreshTime = 1000;

    RefreshTimer = setInterval(function () {
        if (MessageSuccess.length > 0)
            window.location.href="?Site=1";
    }, RefreshTime);
})
