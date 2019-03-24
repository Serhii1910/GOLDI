<script type="text/javascript" src="JavaScript/WebCams.js"></script>

<h1>
    <span class="tag" data-i18n="Webcams"></span> - [[++Location++]]
</h1>

<br>

<input type="hidden" id="Translations">

<div style="overflow:auto">
    <table class="table table-striped">
        <thead>
            <tr>
                <th class="tag" data-i18n="PSPU"></th>
                <th class="tag" data-i18n="ServiceDestID"></th>
                <th class="tag" data-i18n="WebCamType"></th>
                <th class="tag" data-i18n="WebCamURL"></th>
                <th class="tag" data-i18n="WebCamParameter"></th>
                <th class="tag" data-i18n="WebCamRotation"></th>
            </tr>
        </thead>

        <tr class="hide" id="WebCamsTemplate">
            <td></td>
            <td></td>
            <td>
                <!--form class="form-inline">
                    <div class="form-group">
                    </div>
                </form-->
                <input type="text" class="form-control" data="WebcamType">
            </td>
            <td>
                <input type="text" class="form-control" data="WebcamURL">
            </td>
            <td>
                <input type="text" class="form-control" data="WebcamParameter">
            </td>
            <td>
                <input type="text" class="form-control" data="WebcamRotation">
            </td>
        </tr>

        <tbody id="WebCamsContainer">

        </tbody>
    </table>
</div>

<style>
    input {height:22px!important}
</style>