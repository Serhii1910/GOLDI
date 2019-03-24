<h1 class="tag" data-i18n="DigitalDemoBoard">Digital Demo Board</h1>

    <p>
        <span class="tag" data-i18n="ControlUnitDDBSection1">The </span>
        <strong class="tag" data-i18n="ControlUnitDDBSection1_2">digital demo board</strong>
        <span class="tag" data-i18n="ControlUnitDDBSection1_3">is a special rapid prototyping board, which was developed for educational purposes. Our rapid prototyping board is based on the MAX V - 5M1270Z CPLD from ALTERA. Furthermore it consists of input buttons, LED outputs and several other compoments. You can use the rapid prototyping board as a stand-alone or a web-based version.</span>
    </p>

<h2 class="tag" data-i18n="ControlUnitDDBHead1">Description of the Digital Demo Board</h2>

    <p>
        <span class="tag" data-i18n="ControlUnitDDBSection2">The Digital Demo Board consists of the following components: </span>
        <ul>
            <li><span class="tag" data-i18n="ControlUnitDDBList1_1">MAX V - 5M1270Z (CPLD from Altera)</span></li>

            <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-10 col-lg-11">
                    <p>
                        <img src="Images/ControlUnits/DDB1.jpg" style="width:50%; max-width:1000px" alt="DDB1" />
                        <br><i class="tag" data-i18n="DescriptionDDBList1_1">Figure 1 : CPLD</i></br>
                    </p>
                </div>
            </div>

            <li><span class="tag" data-i18n="ControlUnitDDBList1_2">Input buttons: 8 slide switches, 8 push buttons, 2 rotary hex encoder</span></li>

            <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-10 col-lg-11">
                    <p>
                        <img src="Images/ControlUnits/DDB2.jpg" style="width:50%; max-width:1000px" alt="DDB2" />
                        <br><i class="tag" data-i18n="DescriptionDDBList1_2">Figure 2 : Input Buttons</i></br>
                    </p>
                </div>
            </div>

            <li><span class="tag" data-i18n="ControlUnitDDBList1_3">LED Outputs: 4 7-segment displays, 1 LED bar display</span></li>

            <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-10 col-lg-11">
                    <p>
                        <img src="Images/ControlUnits/DDB3.jpg" style="width:50%; max-width:1000px" alt="DDB3" />
                        <br><i class="tag" data-i18n="DescriptionDDBList1_3">Figure 3 : LED Outputs</i></br>
                    </p>
                </div>
            </div>

            <li><span class="tag" data-i18n="ControlUnitDDBList1_4">Other components: 10 MHz crystal oscillator, Frequenzy synthesizer, Piezoelectric oscillator, Incremental encoder, UART (via USB)</span></li>

           <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-10 col-lg-11">
                    <p>
                        <img src="Images/ControlUnits/DDB4.jpg" style="width:50%; max-width:1000px" alt="DDB4" />
                        <br><i class="tag" data-i18n="DescriptionDDBList1_4">Figure 4 : Other components</i></br>
                    </p>
                </div>
            </div>

        </ul>
    </p>

<h2 class="tag" data-i18n="ControlUnitDDBHead1_2">Pin assignments of the different Digital Demo Boards</h2>
<p>
    <ul>
        <li><span class="tag" data-i18n="ControlUnitDDBList2_1">Pinout-file for Version v1_00: </span><a href="Downloads/Pinout_DDB_v100.png" target="_blank">Pinout DDB v100</a></li>
        <li><span class="tag" data-i18n="ControlUnitDDBList2_2">Pinout-file for Version v1_10: </span><a href="Downloads/Pinout_DDB_v110.png" target="_blank">Pinout DDB v110</a></li>
        <li><span class="tag" data-i18n="ControlUnitDDBList2_3">Pinout-file for Version v1_11: </span><a href="Downloads/Pinout_DDB_v111.png" target="_blank">Pinout DDB v111</a></li>
        <li><span class="tag" data-i18n="ControlUnitDDBList2_4">Pinout-file for Version v1_20: </span><a href="Downloads/Pinout_DDB_v120.png" target="_blank">Pinout DDB v120</a></li>
        <li><span class="tag" data-i18n="ControlUnitDDBList2_5">Pinout-file for Version v1_21: </span><a href="Downloads/Pinout_DDB_v121.png" target="_blank">Pinout DDB v121</a></li>
    </ul>
</p>
<p>
    <span class="tag" data-i18n="ControlUnitDDBSection2_1">Here you can download a summery of all Pin assignments: </span><a href="Downloads/Pinout_DDB_Complete.pdf" target="_blank">PDF-file</a>
</p>


<h2 class="tag" data-i18n="ControlUnitDDBHead2">Quartus II</h2>

    <p>
        <span class="tag" data-i18n="ControlUnitDDBSection3">To create the files for programming the CPLD on the digital demo board you need the software </span>
        <strong class ="tag" data-i18n="ControlUnitDDBSection3_1">Quartus II Web-Edition</strong>
        <span class="tag" data-i18n="ControlUnitDDBSection3_2">from ALTERA. After creating your own user account at ALTERA's website, it is possible to download the free licence version of Quartus II here: </span>
    </p>

    <p>
    <a href="http://dl.altera.com/?edition=web" target="_blank">http://dl.altera.com/?edition=web</a>
    </p>

    <p>
        <span class="tag" data-i18n="ControlUnitDDBSection4">Download the latest version of Quartus II (version 15.0) or at least version 12.0 or later. You can decide whether you want to download the Combined Files or the Individual Files. With the Individual Files you only have to download in Device the MAX II, MAX V device support, store all in the same directory. After the download is finished, all will be installed by starting the Quartus Setup.</span>
    </p>

    <p>
        <span class="tag" data-i18n="ControlUnitDDBSection5">If you want to get a detailed introduction how to install Quartus II and how to handle the software, you can follow these links:</span>
    </p>

    <a href="https://www.altera.com/content/dam/altera-www/global/en_US/pdfs/literature/manual/intro_to_quartus2.pdf" target="_blank">Quartus II - An Introduction</a>
    <br />
    <a href="https://www.altera.com/en_US/pdfs/literature/hb/qts/quartusii_handbook.pdf" target="_blank">Quartus II handbook</a>
    <br />
    <a href="https://www.altera.com/en_US/pdfs/literature/manual/quartus_install.pdf" target="_blank">Altera Software Installation and Licensing</a>
    <br />

<h2 class="tag" data-i18n="ControlUnitDDBHead3">Stand-alone version of the Digital Demo Board</h2>

    <p>
        <span class="tag" data-i18n="ControlUnitDDBSection6">The simplest way to use the designed hardware platform is as a stand-alone solution for the rapid prototyping of digital systems (without Internet connectivity). To program the MAX V CPLD on this stand-alone version of the rapid prototyping board, an additional FTDI chip was placed on the board. You have to connect the prototyping board via USB to your PC or laptop to upload the synthesized CPLD design to the FTDI chip at the prototyping board. This chip will program the CPLD automatically via JTAG interface. </span>
    </p>

<h2 class="tag" data-i18n="ControlUnitDDBHead4">Web-based version of the Digital Demo Board</h2>

    <p>
        <span class="tag" data-i18n="ControlUnitDDBSection7">With the web-based version of the digital demo board it is possible to upload the synthesized CPLD code of the design to program the CPLD on the rapid prototyping board automatically in the remote lab. Therefore select the Digital Demo Board as Control Unit and as Physical System to start an experiment, so that you can see the web-interface of the board in the ECP. This web-interface allows you to manipulate all the inputs of the rapid prototyping board virtually (slide switches, hex coding switches, pushbuttons and incremental encoder)
        in the visual model of the prototyping board (on the upper left side). All the inputs are realized as HTML5 control elements and can be activated via a mouse interactively. Changes are immediately sent to the rapid prototyping board in the remote lab and the corresponding results are displayed again inside the visual model. Furthermore a webcam will be used to observe the rapid prototyping board (on the upper right side) to watch the results of the user's actions directly as reaction in the remote lab.
        </span>
    </p>

    <p>
        <span class="tag" data-i18n="ControlUnitDDBSection8">
        For a web-based usage of the rapid prototyping board, an additional "interconnection" FPGA is placed on the bottom side of the PCB to realize the communication with the remote lab infrastructure. All inputs of
        the board (buttons, synthesizer, incremental encoder and oscillator) have to be removed from the PCB and are replaced by a direct connection to the outputs of the "interconnection" FPGA, which will set all input signals according to the user's input via the user interface at the client PC. The generated outputs of the prototyping board can be directly read by the "interconnection" FPGA without removing any LED. The FPGA is interconnected to the BPU within the remote lab infrastructure.
        </span>
    </p>