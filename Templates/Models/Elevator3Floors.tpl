<input hidden class="i18next_modules" value="PSPU_Elevator3Floors">

<h1 class="tag" data-i18n="Elevator3Floors"></h1>

<div class="text-justify">

    <div class="row">

        <div class="col-md-9">

            <p>
                <span class="tag" data-i18n="ModelElevator3Floors1"></span>
                <br><br>
                <a href="Downloads/Handout_Elevator3floor.pdf"><strong class="tag" data-i18n="PDFWithPinout"></strong><span
                        class="glyphicon glyphicon-cloud-download" aria-hidden="true"></span></a>
            
			
			</p>

        </div>

        <div class="col-md-3">

            <img src="Images/Examples/Elevator_3_Floors.png" alt="" width="80%">

        </div>

    </div>

    <h3 class="tag" data-i18n="Pinout"></h3>

    <div class="row">

        <div class="col-md-6">

            <table class="table table-condensed table-bordered table-hover table-striped">
                <colgroup>
                    <col width="80">
                    <col width="200">
                    <col width="100">
                </colgroup>

                <thead>
                    <th colspan="3" class="tag" data-i18n="InputsSensors"></th>
                    <tr>
                        <th class="tag" data-i18n="Variable"></th>
                        <th class="tag" data-i18n="Name"></th>
                        <th class="tag" data-i18n="Direction"></th>
                    </tr>
                </thead>

                <tbody>
					 [[++SensorLines++]]
				
                </tbody>
            </table>

        </div>

        <div class="col-md-6">

            <table class="table table-condensed table-bordered table-hover table-striped">
                <colgroup>
                    <col width="80">
                    <col width="200">
                    <col width="100">
                </colgroup>

                <thead>
                    <th colspan="3" class="tag" data-i18n="OutputsActuators"></th>
                    <tr>
                        <th class="tag" data-i18n="Variable"></th>
                        <th class="tag" data-i18n="Name"></th>
                        <th class="tag" data-i18n="Direction"></th>
                    </tr>
                </thead>

                <tbody>
					[[++ActuatorLines++]]
				
                </tbody>
            </table>

        </div>

        <br><br>

        <div class="col-md-12">
			<!--
            <img src="Images/Examples/Schematic3Axis.svg" class="center-block" alt="Schematic 3 Axis" width="70%">
            <!--img src="Images/Examples/drawing_3_axis_portal.png" alt="" width="55%"-->

        </div>

    </div>


	<br><br>

    <h3 class="tag" data-i18n="Example"></h3>

    <div class="row">

        <div class="col-md-12">

            <p>
                <!-- Beispiel Beschreibung
                <br><br>
				-->
				
                <a href="Images/Examples/Elevator_A_3floors_Example(FPGA).zip"><strong class="tag" data-i18n="ExampleCodeFPGA"></strong><span
                        class="glyphicon glyphicon-cloud-download" aria-hidden="true"></span></a>
                <br><br>
				<!--
                <a href="Images/Examples/3_Axis_Portal_Example(uC).zip"><strong>[[**ExampleCodeMicrocontroller**]]</strong><span
                        class="glyphicon glyphicon-cloud-download" aria-hidden="true"></span></a>
                <br><br>
				-->
                <!-- In jedem der Zustände des Automaten ist die Belegung der Ausgänge in der
                Reihenfolge (y<sub>5</sub> y<sub>4</sub> y<sub>3</sub> y<sub>2</sub> y<sub>1</sub> y<sub>0</sub>)
                angegeben.-->
                <br><br>
            </p>

        </div>

        <div class="col-md-12">
			<!--
            <img src="Images/Examples/FSM3Axis.svg" class="img-responsive center-block" alt="Finite State Machine 3 Axis" width="50%">
            <!--img src="Images/Examples/automat_3_Axis_Portal.png" alt="Automatengraph" width="40%"-->
	   </div>

        <br><br>

    </div>

</div>