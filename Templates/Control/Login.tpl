<script type="text/javascript" src="JavaScript/Login.js"></script>
<div id="LogInDialog" class="center-block" style="max-width: 500px">
    <form method="POST" action="index.php?Site=11">

        <p class="tag" data-i18n="SiteLoginInfoText"></p>

        [[++AddingInfo++]]

        <p>
            <div class="input-group">
                <span style="min-width: 215px" class="input-group-addon tag" data-i18n="Username"></span>
                <input type="text" class="form-control tag" data-i18n="[placeholder]Username" name="Username" value="[[++UsernameValue++]]">
            </div>
        </p>

        <p>
            <div class="input-group">
                <span style="min-width: 215px" class="input-group-addon tag" data-i18n="Password"></span>
                <input type="password" class="form-control tag" data-i18n="[placeholder]Password" name="Password" value="">
            </div>
        </p>

        <p class="pull-right">
            <button id="LoginButton" type="submit" class="btn btn-default tag" data-i18n="Login"></button>
        </p>
    </form>

    <p class="pull-left">
        <form method="post" action="index.php?Site=13" style="display:inline">
            <button id="RegisterButton" class="btn btn-default tag" data-i18n="Register"></button>
        </form>
        <form method="post" action="index.php?Site=116" style="display:inline">
            <button id="ForgotPasswordButton" class="btn btn-default tag" data-i18n="ForgotPassword"></button>
        </form>
    </p>
</div>