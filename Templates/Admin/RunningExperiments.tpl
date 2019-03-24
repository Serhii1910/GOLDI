<script type="text/javascript" src="JavaScript/RunningExperiments.js"></script>
<h1>
    <span class="tag" data-i18n="ActiveExperiments"></span> - [[++Location++]]
</h1>
<br>

<br>
<button class="btn btn-primary tag" id="EndAllExperiments" data-i18n="EndAllExperiments"></button>
<br><br>

<table class="table table-striped">
    <thead class="text-nowrap">
        <tr>
            <th class="tag" data-i18n="ExperimentID"></th>
            <th class="tag" data-i18n="Username"></th>
            <th class="tag" data-i18n="PSPU"></th>
            <th class="tag" data-i18n="Mode"></th>
            <th class="tag" data-i18n="BPU"></th>
            <th class="tag" data-i18n="Mode"></th>
            <th class="tag" data-i18n="StartTime"></th>
            <th class="tag" data-i18n="EndTime"></th>
            <th></th>
        </tr>
    </thead>
    <tr class="hide vcenter" id="ExperimentTemplate">
        <td></td>
        <td></td>
        <td class="tag" data-i18n=""></td>
        <td class="tag" data-i18n=""></td>
        <td class="tag" data-i18n=""></td>
        <td class="tag" data-i18n=""></td>
        <td></td>
        <td></td>
        <td><button class="btn btn-primary EndExperiment tag" data-i18n="EndExperiment"></button></td>
    </tr>
    <tbody id="ExperimentContainer">
    </tbody>
</table>