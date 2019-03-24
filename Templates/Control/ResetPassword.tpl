<div class="center-block" style="max-width: 500px">
    <form method="POST" action="index.php?Site=117">

        <p><h2 class="tag" data-i18n="ChangePasswordText"></h2></p>

        <p class="tag" data-i18n="ResetPasswordInfo"></p>
         <br>

        <input type="hidden" Name="Token" value="[[++Token++]]">
        <input type="hidden" Name="User" value="[[++User++]]">
        <input type="hidden" Name="Info">

        [[++NewPasswordError++]]
        <p>
        <div class="input-group">
            <span style="min-width: 215px" class="input-group-addon tag" data-i18n="NewPassword"></span>
            <input type="password" class="form-control tag" data-i18n="[placeholder]NewPassword" name="NewPassword">
        </div>
        </p>

        [[++NewPasswordConfirmError++]]
        <p>
        <div class="input-group">
            <span style="min-width: 215px" class="input-group-addon tag" data-i18n="NewPasswordConfirm"></span>
            <input type="password" class="form-control tag" data-i18n="[placeholder]NewPasswordConfirm" name="NewPasswordConfirm">
        </div>
        </p>

        <p class="pull-right">
            <input type="submit" class="btn btn-default tag" data-i18n="[value]ChangePassword">
        </p>
    </form>
</div>