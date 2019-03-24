<h1 class="tag" data-i18n="DigitalDemoBoard"></h1>
<br>

<style>
    body.modal-open {
        overflow: hidden;
    }
</style>


<script>

    function getModal(id, alt, Modalwidth, picWidth) {

        ModalContent = '';
        ModalContent += "<a class=\"thumbnail\" onclick=\"$('#pic" + id + "').modal('show')\">";
        ModalContent += "    <img src=\"Templates/Models/Images/RPB_" + id + ".png\" alt=\"Figure "+id+"." + alt + "\"style=\"width:" + picWidth + "%\">";
        ModalContent += "<div class=\"caption\">";
        ModalContent += "<h4>" + "Fig " + id + ".: " + alt + "</h4>";
        ModalContent += "</div>";
        ModalContent += "</a>";
        ModalContent += "<div id=\"pic" + id + "\" class=\"modal fade\">";
        ModalContent += "    <div class=\"modal-dialog\" style=\"width: 80%\">";
        ModalContent += "        <div class=\"modal-content\">";
        ModalContent += "            <div class=\"modal-header\">";
        ModalContent += "            <button type=\"button\" class=\"close\" data-dismiss=\"modal\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
        ModalContent += "                <h4 class=\"modal-title\">Fig." + id  + ": " + alt + "</h4>";
        ModalContent += "            </div>";
        ModalContent += "            <div class=\"modal-body\">";
        ModalContent += "                <img src=\"Templates/Models/Images/RPB_" + id + ".png\" alt=\"Figure "+id+"." + alt + "\" style=\"width: " + Modalwidth + "%\">";
        ModalContent += "            </div>";
        ModalContent += "            <div class=\"modal-footer\">";
        ModalContent += "            </div>";
        ModalContent += "        </div>";
        ModalContent += "    </div>";
        ModalContent += "</div>";

        $('#modal' + id).html(ModalContent);
    };

</script>

<div class="text-justify">

    <h2>RAPID PROTOTYPING OF DIGITAL SYSTEMS</h2>

    <div class="row">
        <div class="col-lg-12">
            <p>
                With the described enhancement of the functionality we want to provide exciting and challenging Web-based lab experiments in the field of digital system design. Course material starts with the basics of Boolean algebra, combinational logic and simple sequential circuits. This is followed by various minimization techniques for logical expressions, dynamic effects in combinational and sequential circuits and the design of digital control systems based on Finite State Machines (FSM). Finally we offer different methods and tool concepts to create, implement and validate digital systems to solve complex design tasks.
            </p>
            <p>
                The goal is to introduce methods and technologies for a rapid prototyping of digital (embedded) control systems, especially the hardware oriented part of these systems. In connection with the mentioned Tempus project design engineers working in industry may also want to consider the offered learning scenarios of the project to handle modern CAE tools, logic simulation and logic synthesis using hardware description languages (e.g. VHDL), design hierarchy, and current generation of field program¬mable gate array (FPGA) technology – if they have not had previous experience with these rapidly evolving technologies. With modern logic synthesis tools and large FPGAs, more advanced designs are needed to present challenging laboratory projects.
            </p>
        </div>
    </div>

    <h2>ARCHITECTURE</h2>

    <div class="row">
        <div class="col-lg-12">
            The concept and the architecture as well as different fields of application of the Ilmenau Interactive Hybrid Online Lab were presented in various publications during the last years in detail, e.g. in [3, 4, 5]. A special rapid prototyping board for digital systems was developed for the new operation mode of the Ilmenau Interactive Hybrid Online Lab, presented in this paper to fulfill the mentioned design tasks. All the components of the rapid prototyping board will be described in detail in the following sections.
        </div>
    </div>

    <div class="row">
        <div class="col-lg-6">
            <h3>A.	The Ilmenau Interactive Hybrid Online Lab</h3>
            <p>
                Figure 1 gives an overview about the Ilmenau Interactive Hybrid Online Lab. The infrastructure is based on a universal grid concept which guaranties a reliable, flexible as well as robust usage of this online lab. A more detailed description of this grid concept as well as the main components is presented in [5, 6].
            </p>
            <p>
                The server side infrastructure (remote lab) consists of three parts:
            </p>
            <p>
                <ul>
                    <li>
                        an internal serial <em><b>remote lab bus</b></em> to interconnect all parts of the remote lab, realized as CAN bus,
                    </li>
                    <li>
                        a <em><b>bus protection unit</b></em> (BPU) to interface the control units to the remote lab bus and to protect the bus from blockage, misuse and damage as well as
                    </li>
                    <li>
                        a <em><b>physical system protection unit</b></em> (PSPU), which protects the physical systems (the electro-mechanical models in the remote lab) against deliberate damage or accidentally wrong control commands and which offers different access and control mechanisms.
                    </li>
                </ul>
            </p>
            <p>
                The interconnection between the Web-control units and the selected physical systems during a remote lab work session (experiment) as well as the webcam handling is done by the lab server as part of the remote lab infrastructure.
            </p>

            <p>
                During a running experiment, the client application will interact directly with the online lab grid infrastructure. Based on this infrastructure we offer several operation modes, described in detail in [3, 5]. In the following we would like to present an enhancement of the existing operation modes to provide additional functionalities for a Web-based rapid prototyping of digital systems as well as the Web-based verification of such systems.
            </p>

            <div id="modal1"></div>
            <script>
                getModal('1', 'Overview of the Ilmenau Interactive Hybrid Online Lab infrastructure', 70, 100);
            </script>

            <div id="modal3"></div>
            <script>
                getModal('3', 'Figure 3. 	Programming of the stand-alone rapid prototyping board', 60, 100);
            </script>

        </div>
        <div class="col-lg-6">
            <h3>B.	The Rapid Prototyping Board</h3>
            <p>
                To fulfil all the mentioned design tasks for the design of digital systems, we have developed a special rapid prototyping board, shown in Figures 2 and 8. Over the last years, a number of interesting and challenging rapid prototyping boards were developed for educational purposes, e.g. the UP 3 from Altera [7] or development boards from Xilinx [8]. But most of them support very specific design tasks – not the whole spectrum, needed from the beginning (e.g. students in the first semester) to exciting and challenging design tasks in high-level courses.
            </p>
            <p>
                Our rapid prototyping board is based on the MAX® V - 5M1270Z CPLD from Altera [9]. With its mix of low price, low power, and new features, the MAX V CPLD family delivers the market's best value. Featuring a unique, non-volatile architecture and one of the industry's largest density CPLDs, MAX V devices provide robust new features at up to 50 percent lower total power compared to competitive CPLDs. The MAX V architecture integrates previously external functions, such as flash, RAM, oscillators, and phase-locked loops [9].
            </p>
            <p>
                MAX V CPLDs are supported by the free Quartus® II Web Edition development software. With Quartus II software, students will get productivity enhancements resulting in faster simulation, faster board bring-up, and faster timing closure [10].
            </p>
            <p>
                Finally, students can use the free Quartus II simulator tool QSim (with an integrated waveform editor). QSim is a graphical user interface (GUI) that is used to run simulations and launch the Waveform Editor. Also, QSim is used to set whether the simulation should be a functional or timing simulation. The Vector Waveform Editor is used to draw the test input signals for the simulation and select which signal should be shown in the simulation results [11]. In High-level courses students can use the more powerful simulation tool ModelSim® to validate the design. ModelSim supports behavioral and gate-level simulations, including VHDL testbenches [12].
            </p>

            <div id="modal2"></div>
            <script>
                getModal('2', 'Rapid prototyping board (schematic view)', 60, 100);
            </script>

            <p>
                Besides the MAX V CPLD the rapid prototyping board consists of the following components (see Figure 2):
                <ul>
                    <li>
                        Input buttons:
                    </li>
                    <ul>
                        <li>
                            8 pushbuttons:
                        </li>
                        <ul>
                            <li>
                                PB_7 .. PB_4 (active low)
                            </li>
                            <li>
                                PB_3 .. PB_0 (active high)
                            </li>
                        </ul>
                        <li>
                            2 rotary hexadecimal encoder
                        </li>
                        <li>
                            8 slide switches
                        </li>
                    </ul>
                    <li>
                        LED outputs:
                    </li>
                    <ul>
                        <li>
                            4 7-segment displays (active low)
                        </li>
                        <li>
                            1 LED bar display with 8 LED (active low)
                        </li>
                    </ul>
                    <li>
                        Other components:
                    </li>
                    <ul>
                        <li>
                            10.000 MHz crystal oscillator
                        </li>
                        <li>
                            Frequency synthesizer (200 Hz .. 10 kHz)
                        </li>
                        <li>
                            Piezoelectric oscillator (for “sounds”)
                        </li>
                        <li>
                            Incremental encoder
                        </li>
                        <li>
                            UART (over USB)
                        </li>
                        <li>
                            25-pin SUB-D connector (to connect additional hardware boards, e.g. for a VGA adapter)
                        </li>
                    </ul>
                </ul>
            </p>
            <p>
                To program the MAX V CPLD on this stand-alone version of the rapid prototyping board, an additional FTDI chip [13] was placed on the board. The student has to connect the prototyping board via USB to his PC or laptop to upload the synthesized CPLD design to the FTDI chip at the prototyping board. This chip will program the CPLD automatically via JTAG interface (see Figure 3).
            </p>
        </div>
        <div class="col-lg-6">
            <h3>C.	The Rapid Prototyping Board</h3>
            <p>
                For a Web-based usage of the rapid prototyping board, an additional “interconnection” FPGA is placed on the bottom side of the PCB to realize the communication with the remote lab infrastructure (see Figure 4). All inputs of the board (buttons, synthesizer, incremental encoder and oscillator) have to be removed from the PCB and are replaced by a direct connection to the outputs of the “interconnection” FPGA, which will set all input signals according to the user’s input via the user interface at the student’s client PC. The generated outputs of the prototyping board can be directly read by the “interconnection” FPGA without removing any LED. The FPGA is interconnected to the BPU within the remote lab infrastructure.
            </p>

            <div id="modal4"></div>
            <script>
                getModal('4', 'Interfacing the rapid prototyping board to the remote lab', 50, 100);
            </script>

            <p>
                To program the MAX V CPLD on the prototyping board in the remote lab via the Internet, the existing remote lab infrastructure can be used, as shown in Figure 5. The student has to upload his synthesized design (FPGA programming file) via the RIA (Rich Internet Application – a consistent enhancement of previous Java applets – see next section) on his client PC at home to the remote lab. Then the remote lab server will forward the data to the corresponding BPU (compare Figure 1). The BPU in turn will program the connected CPLD automatically via JTAG.
            </p>

            <div id="modal5"></div>
            <script>
                getModal('5', 'Web-based programming of the rapid prototyping board  via the remote lab', 60, 100);
            </script>
        </div>
        <div class="col-lg-6">
            <h3>D.	The Web-based User Interface</h3>
            <p>
                The increasing capacity of wireless communication and the growing number of mobile devices (e.g. smartphones and tablets) on the one hand as well as modern Internet technologies like JavaScript, HTML5 and Web Sockets on the other hand provides new possibilities and challenges in the area of mobile learning. Therefore a realization as HTML5 RIA was chosen for the Web-interface. Figure 6 gives an impression of this Web-interface.
            </p>
            <p>
                By using the client‘s Web-interface, the student is able to upload the synthesized CPLD code of the design to program the CPLD on the rapid prototyping board (automatically in the remote lab – see section III.C) and to handle the whole lab procedure. This Web-interface allows the student to manipulate all the inputs of the rapid prototyping board virtually (slide switches, hex coding switches, pushbuttons and incremental encoder).
            </p>
            <p>
                For the look-and-feel of the RIA, we use a visual model of the prototyping board (on the upper left side). All the inputs are realized as HTML5 control elements and can be activated via a mouse interactively. Changes are immediately sent to the rapid prototyping board in the remote lab and the corresponding results are displayed again inside the visual model. Furthermore a webcam will be used to observe the rapid prototyping board (on the upper right side) to watch the results of the user’s actions directly as reaction in the remote lab.
            </p>

            <div id="modal6"></div>
            <script>
                getModal('6', 'Web-interface of the rapid prototyping board (RIA)', 70, 100);
            </script>

        </div>
    </div>

    <h2>FIELDS OF APPLICATION</h2>

    <div class="row">
        <div class="col-lg-12">
            <p>
                In this section possible fields of application of the developed rapid prototyping platform will be discussed.
            </p>
            <p>
                Following the design flow for digital systems, students have to use common design tools to implement their control tasks. As mentioned in Section III.B they have to use Altera’s development system (Quartus II, simulation tools).
            </p>

            <div id="modal7"></div>
            <script>
                getModal('7', 'Using Altera’s IDE and the rapid prototyping board for the design of digital control tasks', 40, 100);
            </script>

            <p>
                After synthesizing the bit file as shown in Figure 7, students can use the prototyping board as
                <ul>
                    <li>
                        <b>stand-alone</b> system (see Section IV.A) or
                    </li>
                    <li>
                        <b>Web-based</b> rapid prototyping system (see Section IV.B and IV.C).
                    </li>
                </ul>
            </p>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-6">
            <h3>A.	Stand-alone Rapid Prototyping System</h3>
            <p>
                The simplest way to use the designed hardware platform is as a stand-alone solution for the rapid proto¬typing of digital systems (without Internet connectivity), shown in Figure 8. This application is not the focus of this article and therefore not discussed in detail.
            </p>

            <div id="modal8"></div>
            <script>
                getModal('8', 'Rapid prototyping board', 60, 100);
            </script>

            <div id="modal9"></div>
            <script>
                getModal('9', 'VHDL text-based specification', 80, 100);
            </script>

            <div id="modal10"></div>
            <script>
                getModal('10', 'Block diagram-based specification', 80, 100);
            </script>
        </div>
        <div class="col-lg-6">
            <h3>B.	Web-based Prototyping of Digital systems</h3>
            <p>
                By using the mentioned Altera’s development system, students are able to specify their design via:
            </p>
            <ul>
                <li>
                    <em>Text based</em> design methods,

                    <br>
                    Here the student can enter his design by means of logical equations, truth tables or hardware description languages (AHDL, VHDL or Verilog), as shown in Figure 9.
                    <br>
                </li>
                <li>
                    <em>Graphically</em> based design methods,
                    <br>
                    The student can use block or schematic diagrams to input his design, as shown in Figure 10.
                </li>
                <li>
                    Integrated <em>FSM editors</em>.
                    <br>
                    In case of sequential design tasks he can directly enter the derived automaton graph (or graphs of parallel automata) with the built-in FSM editor, as shown in Figure 11.

                    <div id="modal11"></div>
                    <script>
                        getModal('11', 'FSM-based specification', 70, 100);
                    </script>
                </li>
            </ul>
            <p>
                Furthermore, students can specify, describe, implement and verify different digital systems using “self-made” IP core libraries (e.g. digital control systems, serial communication modules, robot sensors control, models of RISC processors, etc.).
            </p>
            <p>
                After specification of the given task, students have to simulate their design. They can choose between different simulation tools within Altera’s development system, e.g. ModelSim for challenging designs in high-level courses.
            </p>
            <p>
                Once the design is completed and error free, the student can upload the synthesized design to the remote lab, program the CPLD on the prototyping board (as described in Section III.C) and can test his solution using the rapid prototyping platform.
            </p>

            <h3>C.	Web-based Validation of Digital Systems</h3>
            <p>
                use case of the rapid prototyping board is
            </p>
            <ul>
                <li>
                    to identify the function of a given design (black box) or
                </li>
                <li>
                    to find malfunctions of a given well-known design.
                </li>
            </ul>
            <p>
                The CPLD will be pre-programmed by the teacher and the student has no ability to reprogram the device.
            </p>
            <p>
                By manipulating the inputs of the unknown black box (e.g. to enter all the input sets of a truth table or special input sequences), the student attempts to analyze the response (the real output signals) of the board to find out the function of the given design. The student has to enter his test vectors based on truth tables or input sequences one by one using the provided controls and observe the results.
            </p>
            <p>
                It is planned to support the upload of a whole truth table or input sequence as a text file via the Web-interface of the prototyping board. In this case the student will be able to record the responses corresponding to the specified inputs creating a waveform file. This file can then be used for further investigation of the current design.
            </p>
        </div>
    </div>
</div>
