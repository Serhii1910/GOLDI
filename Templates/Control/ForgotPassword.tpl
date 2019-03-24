<div id="LogInDialog" class="center-block" style="max-width: 500px">
    <p><h2 class="tag" data-i18n="ForgotPassword"></h2></p>

    <br>
    <p><span class="tag" data-i18n="ForgotPasswordText"></span></p>

    [[++ForgotPasswordError++]]
    <form method="POST" action="index.php?Site=116">
        <p>
            <div class="input-group">
                <span style="min-width: 215px" class="input-group-addon tag" data-i18n="Username"></span>
                <input type="text" class="form-control tag" data-i18n="[placeholder]Username" name="Username">
            </div>

        </p>
        <p class="pull-right">
            <button id="Reset" type="submit" class="btn btn-default tag" data-i18n="Reset"></button>
        </p>
    </form>
</div>
