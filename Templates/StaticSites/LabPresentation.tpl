<h1 class="tag" data-i18n="LabPresentationHeader"></h1>
<br>

<style>
    body.modal-open {
        overflow: hidden;
    }
</style>


<script>

    function getModal(id, src, alt, Modalwidth, figNo, picWidth) {

        ModalContent = '';
        ModalContent += "<a class=\"thumbnail\" onclick=\"$('#pic" + id + "').modal('show')\">";
        ModalContent += "    <img src=\"Images/" + src + "\" alt=\"" + alt + "\"style=\"width:" + picWidth + "%\">";
        ModalContent += "<div class=\"caption\">";
        ModalContent += "<h4>" + "Fig " + figNo + ".: " + alt + "</h4>";
        ModalContent += "</div>";
        ModalContent += "</a>";
        ModalContent += "<div id=\"pic" + id + "\" class=\"modal fade\">";
        ModalContent += "    <div class=\"modal-dialog\" style=\"width: 80%\">";
        ModalContent += "        <div class=\"modal-content\">";
        ModalContent += "            <div class=\"modal-header\">";
        ModalContent += "            <button type=\"button\" class=\"close\" data-dismiss=\"modal\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
        ModalContent += "                <h4 class=\"modal-title\">Fig." + figNo + ": " + alt + "</h4>";
        ModalContent += "            </div>";
        ModalContent += "            <div class=\"modal-body\">";
        ModalContent += "                <img src=\"Images/" + src + "\" alt=\"" + alt + "\" style=\"width: " + Modalwidth + "%\">";
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

    <h2 class="tag" data-i18n="LabPresentationIntroductionHeader"></h2> <!-- Introduction -->

    <div class="row">

        <div class="col-lg-8 col-md-12">

            <p>
                <span class="tag" data-i18n="LabPresentationIntroductionDescription1"></span>
                <br>
                <span class="tag" data-i18n="LabPresentationIntroductionDescription2"></span>
            </p>
        </div>

        <div class="col-lg-4 col-md-12 col-sm-12">

            <div id="modal1"></div>

            <script>
                getModal('1', '1_classification.jpg', 'Classification of lab experiments', 80, '1', 100);
            </script>

        </div>

    </div>
    <!-- row end -->

    <div class="row">

        <div class="col-md-12">

            <p>
                <span class="tag" data-i18n="LabPresentationIntroductionDescription3"></span>
            <ul>
                <li class="tag" data-i18n="LabPresentationIntroductionDescription3Li1"></li>
                <li class="tag" data-i18n="LabPresentationIntroductionDescription3Li2"></li>
            </ul>
            <span class="tag" data-i18n="LabPresentationIntroductionDescription4"></span>
            </p>

        </div>

    </div>
    <!-- row end -->

    <h2 class="tag" data-i18n="LabPresentationArchitectureHeader"></h2>

    <div class="row">

        <div class="col-md-7">

            <p>
                <span class="tag" data-i18n=LabPresentationArchitecture1""></span>
                <br>
                <span class="tag" data-i18n="LabPresentationArchitecture2"></span>
                <ul>
                    <li class="tag" data-i18n="LabPresentationArchitecture2Li1"></li>
                    <li class="tag" data-i18n="LabPresentationArchitecture2Li2"></li>
                    <li class="tag" data-i18n="LabPresentationArchitecture2Li3"></li>
                </ul>
            </p>

        </div>

        <div class="col-md-5">

            <div id="modal2"></div>

            <script>
                getModal('2', '2_overview.jpg', 'Overview of the GOLDI system', 80, '2', 100);
            </script>

        </div>

    </div>
    <!-- row end -->

    <div class="row">

        <div class="col-md-12">

            <p>
                <span class="tag" data-i18n="LabPresentationArchitecture3"></span>
            <ul>
                <li class="tag" data-i18n="LabPresentationArchitecture3Li1"></li>
                <li class="tag" data-i18n="LabPresentationArchitecture3Li2"></li>
                <li class="tag" data-i18n="LabPresentationArchitecture3Li3"></li>
                <li class="tag" data-i18n="LabPresentationArchitecture3Li4"></li>
                <li class="tag" data-i18n="LabPresentationArchitecture3Li5"></li>
            </ul>
            <span class="tag" data-i18n="LabPresentationArchitecture4"></span>
            </p>

        </div>

        <div class="col-md-12">

            <div id="modal3"></div>

            <script>
                getModal('3', '3_iLab.jpg', 'iLab Shared Architecture of the MIT', 80, '3', 100);
            </script>

        </div>

    </div>
    <!-- row end -->

    <br><br><br>

    <div class="row">

        <div class="col-md-7">

            <p>
                <span class="tag" data-i18n="LabPresentationArchitecture5"></span>
                <br>
                <span class="tag" data-i18n="LabPresentationArchitecture6"></span>
            <ul>
                <li class="tag" data-i18n="LabPresentationArchitecture6Li1"></li>
                <li class="tag" data-i18n="LabPresentationArchitecture6Li2"></li>
                <li class="tag" data-i18n="LabPresentationArchitecture6Li3"></li>
            </ul>
            </p>

        </div>

        <div class="col-md-5">

            <div id="modal4"></div>

            <script>
                getModal('4', '4_observation.jpg', 'Observation of the student’s design by the physical system protection unit', 80, '4', 100);
            </script>

        </div>

    </div>
    <!-- row end -->

    <div class="row">

        <div class="col-md-12">

            <p class="tag" data-i18n="LabPresentationArchitecture7"></p>

        </div>

        <div class="col-md-12">

            <div id="modal5"></div>

            <script>
                getModal('5', '5_grid.png', 'Grid architecture of the GOLDI system (server side) with Web-client', 80, '5', 60);
            </script>

        </div>

    </div>
    <!-- row end -->

    <h2 class="tag" data-i18n="LabPresentationFieldsOfApplicationsHeader"></h2>


    <div class="row">

        <div class="col-md-7">

            <p>
                <span class="tag" data-i18n="LabPresentationFieldsOfApplications1"></span>
            <ul>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications1Li1"></li>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications1Li2"></li>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications1Li3"></li>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications1Li4"></li>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications1Li5"></li>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications1Li6"></li>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications1Li7"></li>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications1Li8"></li>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications1Li9"></li>
            </ul>
            <span class="tag" data-i18n="LabPresentationFieldsOfApplications2"></span>
           <ul>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications2Li1"></li>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications2Li2"></li>
                <li class="tag" data-i18n="LabPresentationFieldsOfApplications2Li3"></li>
            </ul>
            <span class="tag" data-i18n="LabPresentationFieldsOfApplications3"></span>
            </p>


        </div>

        <div class="col-md-5">

            <div id="modal61"></div>

            <script>
                getModal('61', '6_1_sim.jpg', 'Simulation model and physical system of a water level control [1]', 80, '6.1', 100);
            </script>

            <div id="modal62"></div>

            <script>
                getModal('62', '6_2_sim.jpg', 'Simulation model and physical system of a water level control [2]', 50, '6.2', 100);
            </script>

        </div>


        <div class="col-md-12">
            <br><br><br>

            <div id="modal7"></div>

            <script>
                getModal('7', '7_schematic.png', 'Schematic view of the remote lab components', 80, '7', 60);
            </script>

        </div>

    </div>
    <!-- row end -->

    <h3 class="tag" data-i18n="LabPresentationModeAHeader"></h3>

    <div class="row">

        <div class="col-md-7">

            <p class="tag" data-i18n="LabPresentationModeA1"></p>

        </div>

        <div class="col-md-5">

            <div id="modal8"></div>

            <script>
                getModal('8', '8_regulation.jpg', 'Offline regulation of the water level control (without Internet)', 80, '8', 100);
            </script>

        </div>


        <div class="col-md-12">
            <br><br><br>

            <div id="modal9"></div>

            <script>
                getModal('9', '9_stand-alone.png', 'Offline regulation of the water level control (without Internet)', 80, '9', 60);
            </script>

        </div>

    </div>
    <!-- row end -->

    <h3 class="tag" data-i18n="LabPresentationModeBHeader"></h3>

    <div class="row">

        <div class="col-md-7">

            <p>
                <span class="tag" data-i18n="LabPresentationModeB1"></span>
                <br><br>
            <div id="modal10"></div>

            <script>
                getModal('10', '10_remote.png', 'Remote control mode via a Web-client', 80, '10', 100);
            </script>

            </p>

        </div>

        <div class="col-md-5">

            <div id="modal11"></div>

            <script>
                getModal('11', '11_online_regulation.jpg', 'Online regulation of the water level control (with Internet)', 80, '11', 100);
            </script>

        </div>

    </div>
    <!-- row end -->

    <h3 class="tag" data-i18n="LabPresentationModeCHeader"></h3>

    <div class="row">

        <div class="col-md-12">

            <p class="tag" data-i18n="LabPresentationModeC1"></p>

        </div>

        <div class="col-md-12">

            <br><br>

            <div class="row">

                <div class="col-md-3">

                    <div id="modal12"></div>

                    <script>
                        getModal('12', '12_design.png', 'Software-oriented design of the control task', 60, '12', 100);
                    </script>

                </div>

                <div class="col-md-3">

                    <div id="modal131"></div>

                    <script>
                        getModal('131', '13_1_remote.png', 'Remote control mode via a control unit [1]', 80, '13.1', 100);
                    </script>

                </div>

                <div class="col-md-3">

                    <div id="modal132"></div>

                    <script>
                        getModal('132', '13_2_remote.png', 'Remote control mode via a control unit [2]', 80, '13.2', 100);
                    </script>

                </div>

                <div class="col-md-3">

                    <div id="modal14"></div>

                    <script>
                        getModal('14', '14_design.png', 'Hardware-oriented design of the control task', 60, '14', 100);
                    </script>

                </div>

            </div>

        </div>

    </div>
    <!-- row end -->

    <h3 class="tag" data-i18n="LabPresentationModeDHeader"></h3>

    <div class="row">

        <div class="col-md-12">

            <p class="tag" data-i18n="LabPresentationModeD"></p>

        </div>

        <div class="col-md-12">

            <div id="modal15"></div>

            <script>
                getModal('15', '15_virtual.png', 'Virtual control mode for visual prototyping', 80, '15', 60);
            </script>

        </div>

    </div>
    <!-- row end -->

    <h3 class="tag" data-i18n="LabPresentationModeEHeader"></h3>

    <div class="row">

        <div class="col-md-12">

            <p class="tag" data-i18n="LabPresentationModeE1"></p>

        </div>

        <div class="col-md-12">

            <div id="modal16"></div>

            <script>
                getModal('16', '16_virtual.png', 'Virtual control mode to test the protection unit', 80, '16', 60);
            </script>
        </div>

    </div>
    <!-- row end -->

    <h3 class="tag" data-i18n="LabPresentationModeFHeader"></h3>

    <div class="row">

        <div class="col-md-12">

            <p class="tag" data-i18n="LabPresentationModeF1"></p>

        </div>

        <div class="col-md-12">

            <div id="modal17"></div>

            <script>
                getModal('17', '17_local.png', 'Local control mode via a control unit', 80, '17', 60);
            </script>

        </div>

    </div>
    <!-- row end -->

    <h3 class="tag" data-i18n="LabPresentationModeGHeader"></h3>

    <div class="row">

        <div class="col-md-6">

            <p class="tag" data-i18n="LabPresentationModeG1"></p>

        </div>

        <div class="col-md-6">

            <div id="modal19"></div>

            <script>
                getModal('19', '19_labyrinth.jpg', 'Labyrinth model', 80, '19', 100);
            </script>

        </div>

        <div class="col-md-12">

            <div id="modal18"></div>

            <script>
                getModal('18', '18_manual.png', 'Manual local control', 80, '18', 60);
            </script>

        </div>

    </div>
    <!-- row end -->

    <h3 class="tag" data-i18n="LabPresentationModeHHeader"></h3>

    <div class="row">

        <div class="col-md-6">

            <p>
                <span class="tag" data-i18n="LabPresentationModeH1"></span>
            <ul>
                <li class="tag" data-i18n="LabPresentationModeH1Li1"></li>
                <li class="tag" data-i18n="LabPresentationModeH1Li2"></li>
                <li class="tag" data-i18n="LabPresentationModeH1Li3"></li>
            </ul>
            <span class="tag" data-i18n="LabPresentationModeH2"></span>

            <br><br>

            <span class="tag" data-i18n="LabPresentationModeH3"></span>

            <br><br>
            <ul>
                <li class="tag" data-i18n="LabPresentationModeH3Li1"></li>
                <span class="tag" data-i18n="LabPresentationModeH3Li2"></span>
                <li class="tag" data-i18n="LabPresentationModeH3Li3"></li>
                <span class="tag" data-i18n="LabPresentationModeH3Li4"></span>
            </ul>
            <span class="tag" data-i18n="LabPresentationModeH4"></span>
            </p>
        </div>

        <div class="col-md-6">

            <div id="modal21"></div>

            <script>
                getModal('21', '21_interface.jpg', 'Web-interface of the Rapid Prototyping board', 50, '21', 100);
            </script>

        </div>


        <div class="col-md-12">

            <div id="modal20"></div>

            <script>
                getModal('20', '20_rapid.png', 'Rapid prototyping mode', 80, '20', 60);
            </script>

        </div>



        <div class="col-md-6">

            <h4 class="tag" data-i18n="LabPresentationModeHPrototypingHeader"></h4>

            <p>
                <span class="tag" data-i18n="LabPresentationModeHPrototyping1"></span>
            <ul>
                <li class="tag" data-i18n="LabPresentationModeHPrototyping1Li1"></li>
                <span class="tag" data-i18n="LabPresentationModeHPrototyping1Li2"></span>
                <li class="tag" data-i18n="LabPresentationModeHPrototyping1L3"></li>
                <span class="tag" data-i18n="LabPresentationModeHPrototyping1Li4"></span>
                <li class="tag" data-i18n="LabPresentationModeHPrototyping1Li5"></li>
                <span class="tag" data-i18n="LabPresentationModeHPrototyping1Li6"></span>
                <li class="tag" data-i18n="LabPresentationModeHPrototyping1Li7"></li>
                <li class="tag" data-i18n="LabPresentationModeHPrototyping1Li8"></li>
                <li class="tag" data-i18n="LabPresentationModeHPrototyping1Li9"></li>
                <li class="tag" data-i18n="LabPresentationModeHPrototyping1Li10"></li>
            </ul>
            <span class="tag" data-i18n="LabPresentationModeHPrototyping2"></span>
            </p>

        </div>

        <div class="col-md-6">

            <h4 class="tag" data-i18n="LabPresentationModeHVerificationHeader"></h4>

            <p class="tag" data-i18n="LabPresentationModeHVerification1"></p>


        </div>


    </div>
    <!-- row end -->

    <h3 class="tag" data-i18n="LabPresentationModeIHeader"></h3>

    <div class="row">

        <div class="col-md-6">

            <p class="tag" data-i18n="LabPresentationModeI1"></p>

        </div>

        <div class="col-md-6">

            <div id="modal22"></div>

            <script>
                getModal('22', '22_visitor.png', 'Visitor mode', 80, '22', 100);
            </script>

        </div>

    </div>
    <!-- row end -->

</div>