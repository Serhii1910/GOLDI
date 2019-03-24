<h1>In Process</h1>
<br>
This site is still in progress. Sorry for that!

 <!--Pinouts, Kurz das Modell selbst (evt. Staudinger-est.de), Beispiele, Code als Download, Automatengraph,PDF als Handout-->

<h3>3-Achs-Portal</h3>
<p>
	<img src="Images/Examples/device_3_axis_portal.png" alt="" width="30%" style="float:right;">
	Mit dem Model 3-Achs-Portal wird ein Roboter zur Weitergabe von Werkstücken im dreidimensionalen Raum simuliert.
	Der Portalroboter kann mit den drei translatorischen Bewegungsachsen und dem elektromagnetischen Greifer 
	metallische Werkstücke aufnehmen und in dem quaderförmigen Arbeitsbereich umsetzen.
	So können zum Beispiel Werkstücke von dem Werkstückmagazin zum Ablageplatz bewegt werden.
	Mithilfe der Software-Endschalter kann die Bewegung in die drei Richtungen begrenzt werden.
	Außerdem besitzt das Model auch Hardware-Endschalter um eine Beschädigung durch Programmierfehler zu verhindern.
	Wird einer von diesen betätigt, wird die Bewegung entlang der betreffenden Achse gestoppt und nur die 
	Aktivierung in die Gegenrichtung ermöglicht.
	Der Greifer kann in +Z-Richtung bewegt werden und besitzt einen Elektromagneten mit dem die metallischen Werkstücke
	durch Aktivierung aufgenommen werden. 
	Wenn nach den Bewegungen in X- und Y-Richtung der Greifer sich über der Zielposition befindet, kann er in 
	-Z-Richtung abgesengt werden.
	Das Werkstück wird durch Deaktivierung des Elektromagneten abgelegt.
	<br>
	<a href="Images/Examples/Handout_3_Achs_Portal.pdf">PDF mit Pinout</a>
</p>
 

<h3>Pinout</h3>

 <table border="1">
  <colgroup>
    <col width="80" >
    <col width="200">
    <col width="100">
  </colgroup>

 <thead>
 <th colspan="3"> Inputs / Sensors</th>
 <tr>
 <th>Variable</th>
 <th>Name</th>
 <th>Direction</th>
 </tr>
 </thead>
 
 <tbody>
 <tr>
	<td>x0</td>
	<td>x_axis_at_position_x_minus</td>
	<td>Input</td>
 </tr>
 <tr>
	<td>x1</td>
	<td>x_axis_at_position_x_plus</td>
	<td>Input</td>
 </tr>
 <tr>
	<td>x2</td>
	<td>x_axis_reference_position</td>
	<td>Input</td>
 </tr>
 <tr>
	<td>x3</td>
	<td>y_axis_at_position_y_minus</td>
	<td>Input</td>
 </tr>
 <tr>
	<td>x4</td>
	<td>y_axis_at_position_y_plus</td>
	<td>Input</td>
</tr>
<tr>
	<td>x5</td>
	<td>y_axis_reference_position</td>
	<td>Input</td>
</tr>
<tr>
	<td>x6</td>
	<td>z_axis_at_position_z_plus</td>
	<td>Input</td>
</tr>
<tr>
	<td>x7</td>
	<td>z_axis_at_position_z_minus</td>
	<td>Input</td>
</tr>
<tr>
	<td>x8</td>
	<td>proximity_switch</td>
	<td>Input</td>
</tr>
<tr>
	<td>x9</td>
	<td>start_button</td>
	<td>UserInput</td>
</tr>
<tr>
	<td>x10</td>
	<td>abs_position_x_15</td>
	<td>Input</td>
</tr>
<tr>
	<td>x11</td>
	<td>abs_position_x_14</td>
	<td>Input</td>
</tr>
<tr>
	<td>x12</td>
	<td>abs_position_x_13</td>
	<td>Input</td>
</tr>
<tr>
	<td>x13</td>
	<td>abs_position_x_12</td>
	<td>Input</td>
</tr>
<tr>
	<td>x14</td>
	<td>abs_position_x_11</td>
	<td>Input</td>
</tr>
<tr>
	<td>x15</td>
	<td>abs_position_x_10</td>
	<td>Input</td>
</tr>
<tr>
	<td>x16</td>
	<td>abs_position_x_09</td>
	<td>Input</td>
</tr>
<tr>
	<td>x17</td>
	<td>abs_position_x_08</td>
	<td>Input</td>
</tr>
<tr>
	<td>x18</td>
	<td>abs_position_x_07</td>
	<td>Input</td>
</tr>
<tr>
	<td>x19</td>
	<td>abs_position_x_06</td>
	<td>Input</td>
</tr>
<tr>
	<td>x20</td>
	<td>abs_position_x_05</td>
	<td>Input</td>
</tr>
<tr>
	<td>x21</td>
	<td>abs_position_x_04</td>
	<td>Input</td>
</tr>
<tr>
	<td>x22</td>
	<td>abs_position_x_03</td>
	<td>Input</td>
</tr>
<tr>
	<td>x23</td>
	<td>abs_position_x_02</td>
	<td>Input</td>
</tr>
<tr>
	<td>x24</td>
	<td>abs_position_x_01</td>
	<td>Input</td>
</tr>
<tr>
	<td>x25</td>
	<td>abs_position_x_00</td>
	<td>Input</td>
</tr>
<tr>
	<td>x26</td>
	<td>abs_position_y_15</td>
	<td>Input</td>
</tr>
<tr>
	<td>x27</td>
	<td>abs_position_y_14</td>
	<td>Input</td>
</tr>
<tr>
	<td>x28</td>
	<td>abs_position_y_13</td>
	<td>Input</td>
</tr>
<tr>
	<td>x29</td>
	<td>abs_position_y_12</td>
	<td>Input</td>
</tr>
<tr>
	<td>x30</td>
	<td>abs_position_y_11</td>
	<td>Input</td>
</tr>
<tr>
	<td>x31</td>
	<td>abs_position_y_10</td>
	<td>Input</td>
</tr>
<tr>
	<td>x32</td>
	<td>abs_position_y_09</td>
	<td>Input</td>
</tr>
<tr>
	<td>x33</td>
	<td>abs_position_y_08</td>
	<td>Input</td>
</tr>
<tr>
	<td>x34</td>
	<td>abs_position_y_07</td>
	<td>Input</td>
</tr>
<tr>
	<td>x35</td>
	<td>abs_position_y_06</td>
	<td>Input</td>
</tr>
<tr>
	<td>x36</td>
	<td>abs_position_y_05</td>
	<td>Input</td>
</tr>
<tr>
	<td>x37</td>
	<td>abs_position_y_04</td>
	<td>Input</td>
</tr>
<tr>
	<td>x38</td>
	<td>abs_position_y_03</td>
	<td>Input</td>
</tr>
<tr>
	<td>x39</td>
	<td>abs_position_y_02</td>
	<td>Input</td>
</tr>
<tr>
	<td>x40</td>
	<td>abs_position_y_01</td>
	<td>Input</td>
</tr>
<tr>
	<td>x41</td>
	<td>abs_position_y_00</td>
	<td>Input</td>
</tr>
 </tbody>
</table>

<br>

 <table border="1">
  <colgroup>
    <col width="80" >
    <col width="200">
    <col width="100">
  </colgroup>

 <thead>
 
 <th colspan="3">Outputs / Actuators</th>
 <tr>
 <th>Variable</th>
 <th>Name</th>
 <th>Direction</th>
 </tr>
 </thead>
 
 <tbody>
 <tr>
	<td>y0</td>
	<td>x_axis_to_x_minus</td>
	<td>Output</td>
 </tr>
 <tr>
	<td>y1</td>
	<td>x_axis_to_x_plus</td>
	<td>Output</td>
 </tr>
 <tr>
	<td>y2</td>
	<td>y_axis_to_y_minus</td>
	<td>Output</td>
 </tr>
 <tr>
	<td>y3</td>
	<td>y_axis_to_y_plus</td>
	<td>Output</td>
 </tr>
 <tr>
	<td>y4</td>
	<td>z_axis_to_z_plus</td>
	<td>Output</td>
 </tr>
 <tr>
	<td>y5</td>
	<td>z_axis_to_z_minus</td>
	<td>Output</td>
 </tr>
 <tr>
	<td>y6</td>
	<td>magnet</td>
	<td>Output</td>
 </tr>
 </tbody>
</table>




<h3>Beispiel</h3>
<p>
	In diesem Beispiel wird die folgende Bewegung des Portalroboters realisiert, 
	die auch in dem Automatengraphen dargestellt ist.<br>
	Zuerst fährt er zum linken Rand des Arbeitsbereichs und von dort nach rechts (+X),
	nach unten/hinten (+Y), nach links (-X), dann nach oben/vorne (-Y) und beginnt anschließend wieder 
	mit der Bewegung nach rechts.<br>
	<a href="Images/Examples/3_Axis_Portal_Example(FPGA).zip">Beispiel Code FPGA</a>, 
	<a href="Images/Examples/3_Axis_Portal_Example(uC).zip">Beispiel Code uC</a>
	<br>
	In jedem der Zustände des Automaten ist die Belegung der Ausgänge in der 
	Reihenfolge (y5y4  y3y2  y1y0) angegeben.
</p>
<img src="Images/Examples/automat_3_Axis_Portal.png" alt="Automatengraph" width="40%" >
<img src="Images/Examples/drawing_3_axis_portal.png" alt="" width="55%">
<!---->