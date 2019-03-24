<div class="center-block" style="max-width: 500px">
    <form method="POST" action="index.php?Site=13">

        [[++AddingInfo++]]

        <br>

        [[++FirstNameError++]]
        <p>
            <div class="input-group">
                <span style="min-width: 215px" class="input-group-addon tag" data-i18n="FirstName"></span>
                <input type="text" class="form-control tag" data-i18n="[placeholder]FirstName" name="FirstName" value="[[++FirstNameValue++]]">
            </div>
        </p>

        [[++LastNameError++]]
        <p>
            <div class="input-group">
                <span style="min-width: 215px" class="input-group-addon tag" data-i18n="LastName"></span>
                <input type="text" class="form-control tag" data-i18n="[placeholder]LastName" name="LastName" value="[[++LastNameValue++]]">
            </div>
        </p>

        <!--p>
            [[++UsernameError++]]
            <div class="input-group">
                <span style="min-width: 215px" class="input-group-addon">[[**Username**]]</span>
                <input type="text" class="form-control" name="Username" placeholder="[[**Username**]]" value="[[++UsernameValue++]]">
            </div>
        </p-->

        [[++PasswordError++]]
        <p>
            <div class="input-group">
                <span style="min-width: 215px" class="input-group-addon tag" data-i18n="Password"></span>
                <input type="password" class="form-control tag" data-i18n="[placeholder]Password" name="Password" value="[[++PasswordValue++]]">
            </div>
        </p>

        <p>
            <div class="input-group">
                <span style="min-width: 215px" class="input-group-addon tag" data-i18n="PasswordRepeat"></span>
                <input type="password" class="form-control tag" data-i18n="[placeholder]PasswordRepeat" name="PasswordRepeat" value="[[++PasswordRepeatValue++]]">
            </div>
        </p>

        [[++EMailError++]]
        <p>
            <div class="input-group">
                <span style="min-width: 215px" class="input-group-addon tag" data-i18n="EMail"></span>
                <input type="text" class="form-control tag" data-i18n="[placeholder]EMail" name="EMail" value="[[++EMailValue++]]">
            </div>
        </p>

        [[++PrivacyAcceptError++]]
        <p class="pull-left">
            <input type="checkbox" id="PrivacyCheckbox" name="PrivacyCheckbox">
            <label class="" for="PrivacyCheckbox">
                <span class="tag" data-i18n="AgreePrivacy"></span>
                <a href="index.php?Site=133" target="_blank" class="tag" data-i18n="Privacy"></a>
            </label>
        </p>

        <p class="pull-right">
            <button type="submit" class="btn btn-default tag" data-i18n="Register" value=""></button>
        </p>
    </form>
</div>