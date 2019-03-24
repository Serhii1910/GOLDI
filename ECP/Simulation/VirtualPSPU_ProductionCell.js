VirtualPSPU.prototype.SetSensorFromUserVariable = function(UserVariable, Value){};

VirtualPSPU.prototype.InsertUserVariables = function(Sensors){
    return Sensors;
};

VirtualPSPU.prototype.ResetUserVariables = function(){};

VirtualPSPU.prototype.FSMInitialization1DoTrasitionSteps = function() {
    switch (this.sCurrentStateA0) {
        case this.tStateA0.z_Init:
            if ((this.Sensors[3] || this.Observer[5] || this.Observer[4]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA0 = this.tStateA0.z_2_WorkpieceAvailable;
            else if ((!this.Sensors[3] && !this.Observer[5] && !this.Observer[4]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA0 = this.tStateA0.z_0_WorkplaceAvailable;
            else this.sCurrentStateA0 = this.tStateA0.z_Init;
            break;
        case this.tStateA0.z_0_WorkplaceAvailable:
            if (this.sCurrentStateA9 === this.tStateA9.z_2_WorkpieceAvailable && this.sCurrentStateA10 === this.tStateA10.z_0_StayLeft && !this.Sensors[3] && this.Sensors[1] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA0 = this.tStateA0.z_1_PushUpWorkpiece;
            else if ((this.sCurrentStateA9 !== this.tStateA9.z_2_WorkpieceAvailable || this.sCurrentStateA10 !== this.tStateA10.z_0_StayLeft || this.Sensors[3] ||!this.Sensors[1]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA0 = this.tStateA0.z_0_WorkplaceAvailable;
            else this.sCurrentStateA0 = this.tStateA0.z_Init;
            break;
        case this.tStateA0.z_1_PushUpWorkpiece:
            if (this.Sensors[3] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA0 = this.tStateA0.z_2_WorkpieceAvailable;
            else if (!this.Sensors[3] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA0 = this.tStateA0.z_1_PushUpWorkpiece;
            else this.sCurrentStateA0 = this.tStateA0.z_Init;
            break;
        case this.tStateA0.z_2_WorkpieceAvailable:
            if (this.sCurrentStateA1 === this.tStateA1.z_1_PushUpWorkpiece && this.sCurrentStateA2 === this.tStateA2.z_0_StayLeft && !this.Sensors[6] && this.Sensors[4] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA0 = this.tStateA0.z_3_PushDownWorkpiece;
            else if ((this.sCurrentStateA1 !== this.tStateA1.z_1_PushUpWorkpiece || this.sCurrentStateA2 !== this.tStateA2.z_0_StayLeft || this.Sensors[6] ||!this.Sensors[4]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA0 = this.tStateA0.z_2_WorkpieceAvailable;
            else this.sCurrentStateA0 = this.tStateA0.z_Init;
            break;
        case this.tStateA0.z_3_PushDownWorkpiece:
            if (this.Sensors[6] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA0 = this.tStateA0.z_0_WorkplaceAvailable;
            else if (!this.Sensors[6] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA0 = this.tStateA0.z_3_PushDownWorkpiece;
            else this.sCurrentStateA0 = this.tStateA0.z_Init;
            break;
        default:
            this.sCurrentStateA0 = this.tStateA0.z_Init;
    }

    switch (this.sCurrentStateA1) {
        case this.tStateA1.z_Init:
            if ((this.Sensors[6] || this.Observer[4]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA1 = this.tStateA1.z_2_WorkpieceAvailable;
            else if (!this.Sensors[6] && this.Observer[4] !== true && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA1 = this.tStateA1.z_0_WorkplaceAvailable;
            else this.sCurrentStateA1 = this.tStateA1.z_Init;
            break;
        case this.tStateA1.z_0_WorkplaceAvailable:
            if (this.sCurrentStateA0 === this.tStateA0.z_2_WorkpieceAvailable && this.sCurrentStateA2 === this.tStateA2.z_0_StayLeft && !this.Sensors[6] && this.Sensors[4] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA1 = this.tStateA1.z_1_PushUpWorkpiece;
            else if ((this.sCurrentStateA0 !== this.tStateA0.z_2_WorkpieceAvailable || this.sCurrentStateA2 !== this.tStateA2.z_0_StayLeft || this.Sensors[6] ||!this.Sensors[4]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA1 = this.tStateA1.z_0_WorkplaceAvailable;
            else this.sCurrentStateA1 = this.tStateA1.z_Init;
            break;
        case this.tStateA1.z_1_PushUpWorkpiece:
            if (this.Sensors[6] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA1 = this.tStateA1.z_2_WorkpieceAvailable;
            else if (!this.Sensors[6] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA1 = this.tStateA1.z_1_PushUpWorkpiece;
            else this.sCurrentStateA1 = this.tStateA1.z_Init;
            break;
        case this.tStateA1.z_2_WorkpieceAvailable:
            if (this.sCurrentStateA3 === this.tStateA3.z_1_PushUpWorkpiece && this.sCurrentStateA2 === this.tStateA2.z_2_StayRight && !this.Sensors[7] && this.Sensors[5] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA1 = this.tStateA1.z_3_PushDownWorkpiece;
            else if ((this.sCurrentStateA3 !== this.tStateA3.z_1_PushUpWorkpiece || this.sCurrentStateA2 !== this.tStateA2.z_2_StayRight || this.Sensors[7] ||!this.Sensors[5]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA1 = this.tStateA1.z_2_WorkpieceAvailable;
            else this.sCurrentStateA1 = this.tStateA1.z_Init;
            break;
        case this.tStateA1.z_3_PushDownWorkpiece:
            if (this.Sensors[7] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA1 = this.tStateA1.z_0_WorkplaceAvailable;
            else if (!this.Sensors[7] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA1 = this.tStateA1.z_3_PushDownWorkpiece;
            else this.sCurrentStateA1 = this.tStateA1.z_Init;
            break;
        default:
            this.sCurrentStateA1 = this.tStateA1.z_Init;
    }

    switch (this.sCurrentStateA2) {
        case this.tStateA2.z_Init:
            if ((this.Sensors[5] || this.Observer[3]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_2_StayRight;
            else if ((this.Sensors[4] || this.Observer[4]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_0_StayLeft;
            else if ((!this.Sensors[5] || this.Observer[3] !== true) && (!this.Sensors[4] || this.Observer[4] !== true) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_3_TurnLeft;
            else this.sCurrentStateA2 = this.tStateA2.z_Init;
            break;
        case this.tStateA2.z_0_StayLeft:
            if (this.sCurrentStateA1 === this.tStateA1.z_2_WorkpieceAvailable && this.Sensors[6] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_1_TurnRight;
            else if ((this.sCurrentStateA1 !== this.tStateA1.z_2_WorkpieceAvailable ||!this.Sensors[6]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_0_StayLeft;
            else this.sCurrentStateA2 = this.tStateA2.z_Init;
            break;
        case this.tStateA2.z_1_TurnRight:
            if (this.Sensors[5] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_2_StayRight;
            else if (!this.Sensors[5] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_1_TurnRight;
            else this.sCurrentStateA2 = this.tStateA2.z_Init;
            break;
        case this.tStateA2.z_2_StayRight:
            if (this.sCurrentStateA1 === this.tStateA1.z_0_WorkplaceAvailable && !this.Sensors[6] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_3_TurnLeft;
            else if ((this.sCurrentStateA1 !== this.tStateA1.z_0_WorkplaceAvailable || this.Sensors[6]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_2_StayRight;
            else this.sCurrentStateA2 = this.tStateA2.z_Init;
            break;
        case this.tStateA2.z_3_TurnLeft:
            if (this.Sensors[4] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_0_StayLeft;
            else if (!this.Sensors[4] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA2 = this.tStateA2.z_3_TurnLeft;
            else this.sCurrentStateA2 = this.tStateA2.z_Init;
            break;
        default:
            this.sCurrentStateA2 = this.tStateA2.z_Init;
    }

    switch (this.sCurrentStateA3) {
        case this.tStateA3.z_Init:
            if ((this.Sensors[7] || this.Observer[3] || this.Observer[2]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA3 = this.tStateA3.z_2_WorkpieceAvailable;
            else if ((!this.Sensors[7] && this.Observer[3] !== true && this.Observer[2] !== true) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA3 = this.tStateA3.z_0_WorkplaceAvailable;
            else this.sCurrentStateA3 = this.tStateA3.z_Init;
            break;
        case this.tStateA3.z_0_WorkplaceAvailable:
            if (this.sCurrentStateA2 === this.tStateA2.z_2_StayRight && this.sCurrentStateA1 === this.tStateA1.z_2_WorkpieceAvailable && this.sCurrentStateA4 === this.tStateA4.z_0_StayUpside && !this.Sensors[7] && this.Sensors[14] && this.Sensors[5] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA3 = this.tStateA3.z_1_PushUpWorkpiece;
            else if ((this.sCurrentStateA2 !== this.tStateA2.z_2_StayRight || this.sCurrentStateA1 !== this.tStateA1.z_2_WorkpieceAvailable || this.sCurrentStateA4 !== this.tStateA4.z_0_StayUpside || this.Sensors[7] ||!this.Sensors[14] ||!this.Sensors[5]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA3 = this.tStateA3.z_0_WorkplaceAvailable;
            else this.sCurrentStateA3 = this.tStateA3.z_Init;
            break;
        case this.tStateA3.z_1_PushUpWorkpiece:
            if (this.Sensors[7] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA3 = this.tStateA3.z_2_WorkpieceAvailable;
            else if (!this.Sensors[7] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA3 = this.tStateA3.z_1_PushUpWorkpiece;
            else this.sCurrentStateA3 = this.tStateA3.z_Init;
            break;
        case this.tStateA3.z_2_WorkpieceAvailable:
            if (this.sCurrentStateA6 === this.tStateA6.z_1_PushUpWorkpiece && this.sCurrentStateA7 === this.tStateA7.z_0_StayLeft && this.sCurrentStateA4 === this.tStateA4.z_0_StayUpside && !this.Sensors[10] && this.Sensors[8] && this.Sensors[14] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA3 = this.tStateA3.z_3_PushDownWorkpiece;
            else if ((this.sCurrentStateA6 !== this.tStateA6.z_1_PushUpWorkpiece || this.sCurrentStateA7 !== this.tStateA7.z_0_StayLeft || this.sCurrentStateA4 !== this.tStateA4.z_0_StayUpside || this.Sensors[10] ||!this.Sensors[8] ||!this.Sensors[14]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA3 = this.tStateA3.z_2_WorkpieceAvailable;
            else this.sCurrentStateA3 = this.tStateA3.z_Init;
            break;
        case this.tStateA3.z_3_PushDownWorkpiece:
            if (this.Sensors[10] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA3 = this.tStateA3.z_0_WorkplaceAvailable;
            else if (!this.Sensors[10] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA3 = this.tStateA3.z_3_PushDownWorkpiece;
            else this.sCurrentStateA3 = this.tStateA3.z_Init;
            break;
        default:
            this.sCurrentStateA3 = this.tStateA3.z_Init;
    }

    switch (this.sCurrentStateA4) {
        case this.tStateA4.z_Init:
            if (this.Sensors[15] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA4 = this.tStateA4.z_2_GoUpside;
            else if (this.Sensors[14] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA4 = this.tStateA4.z_0_StayUpside;
            else if ((!this.Sensors[15] ||!this.Sensors[14]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA4 = this.tStateA4.z_1_GoDownsideAndBore;
            else this.sCurrentStateA4 = this.tStateA4.z_Init;
            break;
        case this.tStateA4.z_0_StayUpside:
            if (this.sCurrentStateA3 === this.tStateA3.z_2_WorkpieceAvailable && this.sCurrentStateA5 === this.tStateA5.z_2_StayFront && this.Sensors[13] && this.Sensors[7] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA4 = this.tStateA4.z_1_GoDownsideAndBore;
            else if ((this.sCurrentStateA3 !== this.tStateA3.z_2_WorkpieceAvailable || this.sCurrentStateA5 !== this.tStateA5.z_2_StayFront ||!this.Sensors[13] ||!this.Sensors[7]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA4 = this.tStateA4.z_0_StayUpside;
            else this.sCurrentStateA4 = this.tStateA4.z_Init;
            break;
        case this.tStateA4.z_1_GoDownsideAndBore:
            if (this.Sensors[15] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA4 = this.tStateA4.z_2_GoUpside;
            else if (!this.Sensors[15] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA4 = this.tStateA4.z_1_GoDownsideAndBore;
            else this.sCurrentStateA4 = this.tStateA4.z_Init;
            break;
        case this.tStateA4.z_2_GoUpside:
            if (this.Sensors[14] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA4 = this.tStateA4.z_0_StayUpside;
            else if (!this.Sensors[14] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA4 = this.tStateA4.z_2_GoUpside;
            else this.sCurrentStateA4 = this.tStateA4.z_Init;
            break;
        default:
            this.sCurrentStateA4 = this.tStateA4.z_Init;
    }

    switch (this.sCurrentStateA5) {
        case this.tStateA5.z_Init:
            if (this.Sensors[13] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_2_StayFront;
            else if (this.Sensors[12] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_0_StayBack;
            else if ((!this.Sensors[13] ||!this.Sensors[12]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_3_GoBack;
            else this.sCurrentStateA5 = this.tStateA5.z_Init;
            break;
        case this.tStateA5.z_0_StayBack:
            if (this.sCurrentStateA3 === this.tStateA3.z_2_WorkpieceAvailable && this.sCurrentStateA4 === this.tStateA4.z_0_StayUpside && this.Sensors[7] && this.Sensors[14] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_1_GoFront;
            else if ((this.sCurrentStateA3 !== this.tStateA3.z_2_WorkpieceAvailable || this.sCurrentStateA4 !== this.tStateA4.z_0_StayUpside ||!this.Sensors[7] ||!this.Sensors[14]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_0_StayBack;
            else this.sCurrentStateA5 = this.tStateA5.z_Init;
            break;
        case this.tStateA5.z_1_GoFront:
            if (this.Sensors[13] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_2_StayFront;
            else if (!this.Sensors[13] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_1_GoFront;
            else this.sCurrentStateA5 = this.tStateA5.z_Init;
            break;
        case this.tStateA5.z_2_StayFront:
            if (this.sCurrentStateA4 === this.tStateA4.z_0_StayUpside && this.Sensors[14] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_3_GoBack;
            else if ((this.sCurrentStateA4 !== this.tStateA4.z_0_StayUpside ||!this.Sensors[14]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_2_StayFront;
            else this.sCurrentStateA5 = this.tStateA5.z_Init;
            break;
        case this.tStateA5.z_3_GoBack:
            if (this.Sensors[12] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_0_StayBack;
            else if (!this.Sensors[12] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA5 = this.tStateA5.z_3_GoBack;
            else this.sCurrentStateA5 = this.tStateA5.z_Init;
            break;
        default:
            this.sCurrentStateA5 = this.tStateA5.z_Init;
    }

    switch (this.sCurrentStateA6) {
        case this.tStateA6.z_Init:
            if ((this.Sensors[10] || this.Observer[2]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA6 = this.tStateA6.z_2_WorkpieceAvailable;
            else if ((!this.Sensors[10] && this.Observer[2] !== true) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA6 = this.tStateA6.z_0_WorkplaceAvailable;
            else this.sCurrentStateA6 = this.tStateA6.z_Init;
            break;
        case this.tStateA6.z_0_WorkplaceAvailable:
            if (this.sCurrentStateA3 === this.tStateA3.z_2_WorkpieceAvailable && this.sCurrentStateA7 === this.tStateA7.z_0_StayLeft && !this.Sensors[10] && this.Sensors[8] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA6 = this.tStateA6.z_1_PushUpWorkpiece;
            else if ((this.sCurrentStateA3 !== this.tStateA3.z_2_WorkpieceAvailable || this.sCurrentStateA7 !== this.tStateA7.z_0_StayLeft || this.Sensors[10] ||!this.Sensors[8]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA6 = this.tStateA6.z_0_WorkplaceAvailable;
            else this.sCurrentStateA6 = this.tStateA6.z_Init;
            break;
        case this.tStateA6.z_1_PushUpWorkpiece:
            if (this.Sensors[10] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA6 = this.tStateA6.z_2_WorkpieceAvailable;
            else if (!this.Sensors[10] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA6 = this.tStateA6.z_1_PushUpWorkpiece;
            else this.sCurrentStateA6 = this.tStateA6.z_Init;
            break;
        case this.tStateA6.z_2_WorkpieceAvailable:
            if (this.sCurrentStateA8 === this.tStateA8.z_1_PushUpWorkpiece && this.sCurrentStateA7 === this.tStateA7.z_2_StayRight && !this.Sensors[11] && this.Sensors[9] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA6 = this.tStateA6.z_3_PushDownWorkpiece;
            else if ((this.sCurrentStateA8 !== this.tStateA8.z_1_PushUpWorkpiece || this.sCurrentStateA7 !== this.tStateA7.z_2_StayRight || this.Sensors[11] ||!this.Sensors[9]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA6 = this.tStateA6.z_2_WorkpieceAvailable;
            else this.sCurrentStateA6 = this.tStateA6.z_Init;
            break;
        case this.tStateA6.z_3_PushDownWorkpiece:
            if (this.Sensors[11] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA6 = this.tStateA6.z_0_WorkplaceAvailable;
            else if (!this.Sensors[11] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA6 = this.tStateA6.z_3_PushDownWorkpiece;
            else this.sCurrentStateA6 = this.tStateA6.z_Init;
            break;
        default:
            this.sCurrentStateA6 = this.tStateA6.z_Init;
    }

    switch (this.sCurrentStateA7) {
        case this.tStateA7.z_Init:
            if ((this.Sensors[9] || this.Observer[1]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_2_StayRight;
            else if ((this.Sensors[8] || this.Observer[2]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_0_StayLeft;
            else if (((!this.Sensors[9] && this.Observer[1] !== true) || (!this.Sensors[8] && this.Observer[2] !== true)) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_3_TurnLeft;
            else this.sCurrentStateA7 = this.tStateA7.z_Init;
            break;
        case this.tStateA7.z_0_StayLeft:
            if (this.sCurrentStateA6 === this.tStateA6.z_2_WorkpieceAvailable && this.Sensors[10] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_1_TurnRight;
            else if ((this.sCurrentStateA6 !== this.tStateA6.z_2_WorkpieceAvailable ||!this.Sensors[10]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_0_StayLeft;
            else this.sCurrentStateA7 = this.tStateA7.z_Init;
            break;
        case this.tStateA7.z_1_TurnRight:
            if (this.Sensors[9] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_2_StayRight;
            else if (!this.Sensors[9] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_1_TurnRight;
            else this.sCurrentStateA7 = this.tStateA7.z_Init;
            break;
        case this.tStateA7.z_2_StayRight:
            if (this.sCurrentStateA6 === this.tStateA6.z_0_WorkplaceAvailable && !this.Sensors[10] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_3_TurnLeft;
            else if ((this.sCurrentStateA6 !== this.tStateA6.z_0_WorkplaceAvailable || this.Sensors[10]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_2_StayRight;
            else this.sCurrentStateA7 = this.tStateA7.z_Init;
            break;
        case this.tStateA7.z_3_TurnLeft:
            if (this.Sensors[8] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_0_StayLeft;
            else if (!this.Sensors[8] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA7 = this.tStateA7.z_3_TurnLeft;
            else this.sCurrentStateA7 = this.tStateA7.z_Init;
            break;
        default:
            this.sCurrentStateA7 = this.tStateA7.z_Init;
    }

    switch (this.sCurrentStateA8) {
        case this.tStateA8.z_Init:
            if ((this.Sensors[11] || this.Observer[1] || this.Observer[0]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA8 = this.tStateA8.z_2_WorkpieceAvailable;
            else if ((!this.Sensors[11] && this.Observer[1] !== true && this.Observer[0] !== true) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA8 = this.tStateA8.z_0_WorkplaceAvailable;
            else this.sCurrentStateA8 = this.tStateA8.z_Init;
            break;
        case this.tStateA8.z_0_WorkplaceAvailable:
            if (this.sCurrentStateA7 === this.tStateA7.z_2_StayRight && this.sCurrentStateA6 === this.tStateA6.z_2_WorkpieceAvailable && !this.Sensors[11] && this.Sensors[9] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA8 = this.tStateA8.z_1_PushUpWorkpiece;
            else if ((this.sCurrentStateA7 !== this.tStateA7.z_2_StayRight || this.sCurrentStateA6 !== this.tStateA6.z_2_WorkpieceAvailable || this.Sensors[11] ||!this.Sensors[9]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA8 = this.tStateA8.z_0_WorkplaceAvailable;
            else this.sCurrentStateA8 = this.tStateA8.z_Init;
            break;
        case this.tStateA8.z_1_PushUpWorkpiece:
            if (this.Sensors[11] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA8 = this.tStateA8.z_2_WorkpieceAvailable;
            else if (!this.Sensors[11] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA8 = this.tStateA8.z_1_PushUpWorkpiece;
            else this.sCurrentStateA8 = this.tStateA8.z_Init;
            break;
        case this.tStateA8.z_2_WorkpieceAvailable:
            if (this.sCurrentStateA9 === this.tStateA9.z_1_PushUpWorkpiece && this.sCurrentStateA10 === this.tStateA10.z_2_StayRight && !this.Sensors[2] && this.Sensors[0] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA8 = this.tStateA8.z_3_PushDownWorkpiece;
            else if ((this.sCurrentStateA9 !== this.tStateA9.z_1_PushUpWorkpiece || this.sCurrentStateA10 !== this.tStateA10.z_2_StayRight || this.Sensors[2] ||!this.Sensors[0]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA8 = this.tStateA8.z_2_WorkpieceAvailable;
            else this.sCurrentStateA8 = this.tStateA8.z_Init;
            break;
        case this.tStateA8.z_3_PushDownWorkpiece:
            if (this.Sensors[2] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA8 = this.tStateA8.z_0_WorkplaceAvailable;
            else if (!this.Sensors[2] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA8 = this.tStateA8.z_3_PushDownWorkpiece;
            else this.sCurrentStateA8 = this.tStateA8.z_Init;
            break;
        default:
            this.sCurrentStateA8 = this.tStateA8.z_Init;
    }

    switch (this.sCurrentStateA9) {
        case this.tStateA9.z_Init:
            if ((this.Sensors[2]) && this.sCurrentStateA11 === this.tStateA11.z_Ready)
                this.sCurrentStateA9 = this.tStateA9.z_2_WorkpieceAvailable;
            else if (!this.Sensors[2] && this.sCurrentStateA11 === this.tStateA11.z_Ready)
                this.sCurrentStateA9 = this.tStateA9.z_0_WorkplaceAvailable; // Schwingkreis 1
            else
                this.sCurrentStateA9 = this.tStateA9.z_Init;
            break;
        case this.tStateA9.z_0_WorkplaceAvailable:
/*            if (this.sCurrentStateA8 === this.tStateA8.z_2_WorkpieceAvailable && this.sCurrentStateA10 === this.tStateA10.z_2_StayRight && !this.Sensors[2] && !this.Sensors[0] && this.sCurrentStateA11 === this.tStateA11.z_Ready)
                this.sCurrentStateA9 = this.tStateA9.z_Init; // Schwingkreis 2
            else if ((this.sCurrentStateA8 !== this.tStateA8.z_2_WorkpieceAvailable || this.sCurrentStateA10 !== this.tStateA10.z_2_StayRight || this.Sensors[2] ||!this.Sensors[0]) && this.sCurrentStateA11 === this.tStateA11.z_Ready)
                this.sCurrentStateA9 = this.tStateA9.z_0_WorkplaceAvailable;
            else
                this.sCurrentStateA9 = this.tStateA9.z_Init;*/
            break;
        case this.tStateA9.z_1_PushUpWorkpiece:
            if (this.Sensors[2] && this.sCurrentStateA11 === this.tStateA11.z_Ready)
                this.sCurrentStateA9 = this.tStateA9.z_2_WorkpieceAvailable;
            else if (!this.Sensors[2] && this.sCurrentStateA11 === this.tStateA11.z_Ready)
                this.sCurrentStateA9 = this.tStateA9.z_1_PushUpWorkpiece;
            else
                this.sCurrentStateA9 = this.tStateA9.z_Init;
            break;
        case this.tStateA9.z_2_WorkpieceAvailable:
            if (this.sCurrentStateA0 === this.tStateA0.z_1_PushUpWorkpiece && this.sCurrentStateA10 === this.tStateA10.z_0_StayLeft && !this.Sensors[3] && this.Sensors[1] && this.sCurrentStateA11 === this.tStateA11.z_Ready)
                this.sCurrentStateA9 = this.tStateA9.z_3_PushDownWorkpiece;
            else if ((this.sCurrentStateA0 !== this.tStateA0.z_1_PushUpWorkpiece || this.sCurrentStateA10 !== this.tStateA10.z_0_StayLeft || this.Sensors[3] ||!this.Sensors[1]) && this.sCurrentStateA11 === this.tStateA11.z_Ready)
                this.sCurrentStateA9 = this.tStateA9.z_2_WorkpieceAvailable;
            else
                this.sCurrentStateA9 = this.tStateA9.z_Init;
            break;
        case this.tStateA9.z_3_PushDownWorkpiece:
            if (this.Sensors[3] && this.sCurrentStateA11 === this.tStateA11.z_Ready)
                this.sCurrentStateA9 = this.tStateA9.z_0_WorkplaceAvailable;
            else if (!this.Sensors[3] && this.sCurrentStateA11 === this.tStateA11.z_Ready)
                this.sCurrentStateA9 = this.tStateA9.z_3_PushDownWorkpiece;
            else
                this.sCurrentStateA9 = this.tStateA9.z_Init;
            break;
        default:
            this.sCurrentStateA9 = this.tStateA9.z_Init;
    }

    switch (this.sCurrentStateA10) {
        case this.tStateA10.z_Init:
            if ((this.Sensors[0] || this.Observer[0]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_2_StayRight;
            else if ((this.Sensors[1] || this.Observer[5]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_0_StayLeft;
            else if (((!this.Sensors[0] && this.Observer[0] !== true) || (!this.Sensors[1] && this.Observer[5] !== true)) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_3_DriveLeft;
            else this.sCurrentStateA10 = this.tStateA10.z_Init;
            break;
        case this.tStateA10.z_0_StayLeft:
            if (this.sCurrentStateA9 === this.tStateA9.z_0_WorkplaceAvailable && !this.Sensors[2] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_1_DriveRight;
            else if ((this.sCurrentStateA9 !== this.tStateA9.z_0_WorkplaceAvailable || this.Sensors[2]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_0_StayLeft;
            else this.sCurrentStateA10 = this.tStateA10.z_Init;
            break;
        case this.tStateA10.z_1_DriveRight:
            if (this.Sensors[0] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_2_StayRight;
            else if (!this.Sensors[0] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_1_DriveRight;
            else this.sCurrentStateA10 = this.tStateA10.z_Init;
            break;
        case this.tStateA10.z_2_StayRight:
            if (this.sCurrentStateA9 === this.tStateA9.z_2_WorkpieceAvailable && this.Sensors[2] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_3_DriveLeft;
            else if ((this.sCurrentStateA9 !== this.tStateA9.z_2_WorkpieceAvailable ||!this.Sensors[2]) && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_2_StayRight;
            else this.sCurrentStateA10 = this.tStateA10.z_Init;
            break;
        case this.tStateA10.z_3_DriveLeft:
            if (this.Sensors[1] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_0_StayLeft;
            else if (!this.Sensors[1] && this.sCurrentStateA11 === this.tStateA11.z_Ready) this.sCurrentStateA10 = this.tStateA10.z_3_DriveLeft;
            else this.sCurrentStateA10 = this.tStateA10.z_Init;
            break;
        default:
            this.sCurrentStateA10 = this.tStateA10.z_Init;
    }

    switch (this.sCurrentStateA11) {
        case this.tStateA11.z_Standby:
            if (this.Start) this.sCurrentStateA11 = this.tStateA11.z_Ready;
            else this.sCurrentStateA11 = this.tStateA11.z_Standby;
            break;
        case this.tStateA11.z_Ready:
            if (this.Stop) {
                this.sCurrentStateA11 = this.tStateA11.z_Standby;
            }
            else if (this.sCurrentStateA8 === this.tStateA8.z_2_WorkpieceAvailable && this.sCurrentStateA7 === this.tStateA7.z_2_StayRight && this.sCurrentStateA6 === this.tStateA6.z_2_WorkpieceAvailable && this.sCurrentStateA3 === this.tStateA3.z_2_WorkpieceAvailable && this.sCurrentStateA2 === this.tStateA2.z_2_StayRight && this.sCurrentStateA1 === this.tStateA1.z_2_WorkpieceAvailable && this.sCurrentStateA0 === this.tStateA0.z_2_WorkpieceAvailable && this.sCurrentStateA10 === this.tStateA10.z_0_StayLeft && this.sCurrentStateA9 === this.tStateA9.z_2_WorkpieceAvailable)
                this.sCurrentStateA11 = this.tStateA11.z_Finished;
            else if (this.sCurrentStateA8 === this.tStateA8.z_2_WorkpieceAvailable && this.sCurrentStateA7 === this.tStateA7.z_2_StayRight && this.sCurrentStateA6 === this.tStateA6.z_2_WorkpieceAvailable && this.sCurrentStateA3 === this.tStateA3.z_2_WorkpieceAvailable && this.sCurrentStateA2 === this.tStateA2.z_2_StayRight && this.sCurrentStateA1 === this.tStateA1.z_2_WorkpieceAvailable && this.sCurrentStateA0 === this.tStateA0.z_2_WorkpieceAvailable && this.sCurrentStateA10 === this.tStateA10.z_2_StayRight && this.sCurrentStateA9 === this.tStateA9.z_0_WorkplaceAvailable)
                this.sCurrentStateA11 = this.tStateA11.z_Finished;
            else if (this.sCurrentStateA8 === this.tStateA8.z_2_WorkpieceAvailable && this.sCurrentStateA7 === this.tStateA7.z_2_StayRight && this.sCurrentStateA6 === this.tStateA6.z_2_WorkpieceAvailable && this.sCurrentStateA3 === this.tStateA3.z_2_WorkpieceAvailable && this.sCurrentStateA2 === this.tStateA2.z_2_StayRight && this.sCurrentStateA1 === this.tStateA1.z_2_WorkpieceAvailable && this.sCurrentStateA0 === this.tStateA0.z_0_WorkplaceAvailable && this.sCurrentStateA10 === this.tStateA10.z_2_StayRight && this.sCurrentStateA9 === this.tStateA9.z_0_WorkplaceAvailable)
                this.sCurrentStateA11 = this.tStateA11.z_Finished;
            else if (this.sCurrentStateA8 === this.tStateA8.z_2_WorkpieceAvailable && this.sCurrentStateA7 === this.tStateA7.z_2_StayRight && this.sCurrentStateA6 === this.tStateA6.z_2_WorkpieceAvailable && this.sCurrentStateA3 === this.tStateA3.z_2_WorkpieceAvailable && this.sCurrentStateA2 === this.tStateA2.z_0_StayLeft && this.sCurrentStateA1 === this.tStateA1.z_0_WorkplaceAvailable && this.sCurrentStateA0 === this.tStateA0.z_0_WorkplaceAvailable && this.sCurrentStateA10 === this.tStateA10.z_2_StayRight && this.sCurrentStateA9 === this.tStateA9.z_0_WorkplaceAvailable)
                this.sCurrentStateA11 = this.tStateA11.z_Finished;
            else if (this.sCurrentStateA8 === this.tStateA8.z_2_WorkpieceAvailable && this.sCurrentStateA7 === this.tStateA7.z_2_StayRight && this.sCurrentStateA6 === this.tStateA6.z_2_WorkpieceAvailable && this.sCurrentStateA3 === this.tStateA3.z_0_WorkplaceAvailable && this.sCurrentStateA2 === this.tStateA2.z_0_StayLeft && this.sCurrentStateA1 === this.tStateA1.z_0_WorkplaceAvailable && this.sCurrentStateA0 === this.tStateA0.z_0_WorkplaceAvailable && this.sCurrentStateA10 === this.tStateA10.z_2_StayRight && this.sCurrentStateA9 === this.tStateA9.z_0_WorkplaceAvailable)
                this.sCurrentStateA11 = this.tStateA11.z_Finished;
            else if (this.sCurrentStateA8 === this.tStateA8.z_2_WorkpieceAvailable && this.sCurrentStateA7 === this.tStateA7.z_0_StayLeft && this.sCurrentStateA6 === this.tStateA6.z_0_WorkplaceAvailable && this.sCurrentStateA3 === this.tStateA3.z_0_WorkplaceAvailable && this.sCurrentStateA2 === this.tStateA2.z_0_StayLeft && this.sCurrentStateA1 === this.tStateA1.z_0_WorkplaceAvailable && this.sCurrentStateA0 === this.tStateA0.z_0_WorkplaceAvailable && this.sCurrentStateA10 === this.tStateA10.z_2_StayRight && this.sCurrentStateA9 === this.tStateA9.z_0_WorkplaceAvailable)
                this.sCurrentStateA11 = this.tStateA11.z_Finished;
            else this.sCurrentStateA11 = this.tStateA11.z_Ready;
            break;
        case this.tStateA11.z_Finished:
            this.sCurrentStateA11 = this.tStateA11.z_Standby;
            this.FinishInitialization();
            break;
        default:
            this.sCurrentStateA11 = this.tStateA11.z_Standby;
    }
};

VirtualPSPU.prototype.FSMInitialization0 = function() {
    if(this.FSMInitialization_State === "Initial"){
        //Init all Machines für Initialisation
        this.tStateA0  = {z_Init:  0, z_0_WorkplaceAvailable:   1, z_1_PushUpWorkpiece:     2, z_2_WorkpieceAvailable:  3, z_3_PushDownWorkpiece:   4};
        this.tStateA1  = {z_Init:  0, z_0_WorkplaceAvailable:   1, z_1_PushUpWorkpiece:     2, z_2_WorkpieceAvailable:  3, z_3_PushDownWorkpiece:   4};
        this.tStateA2  = {z_Init:  0, z_0_StayLeft:             1, z_1_TurnRight:           2, z_2_StayRight:           3, z_3_TurnLeft:            4};
        this.tStateA3  = {z_Init:  0, z_0_WorkplaceAvailable:   1, z_1_PushUpWorkpiece:     2, z_2_WorkpieceAvailable:  3, z_3_PushDownWorkpiece:   4};
        this.tStateA4  = {z_Init:  0, z_0_StayUpside:           1, z_1_GoDownsideAndBore:   2, z_2_GoUpside:            3};
        this.tStateA5  = {z_Init:  0, z_0_StayBack:             1, z_1_GoFront:             2, z_2_StayFront:           3, z_3_GoBack:              4};
        this.tStateA6  = {z_Init:  0, z_0_WorkplaceAvailable:   1, z_1_PushUpWorkpiece:     2, z_2_WorkpieceAvailable:  3, z_3_PushDownWorkpiece:   4};
        this.tStateA7  = {z_Init:  0, z_0_StayLeft:             1, z_1_TurnRight:           2, z_2_StayRight:           3, z_3_TurnLeft:            4};
        this.tStateA8  = {z_Init:  0, z_0_WorkplaceAvailable:   1, z_1_PushUpWorkpiece:     2, z_2_WorkpieceAvailable:  3, z_3_PushDownWorkpiece:   4};
        this.tStateA9  = {z_Init:  0, z_0_WorkplaceAvailable:   1, z_1_PushUpWorkpiece:     2, z_2_WorkpieceAvailable:  3, z_3_PushDownWorkpiece:   4};
        this.tStateA10 = {z_Init:  0, z_0_StayLeft:             1, z_1_DriveRight:          2, z_2_StayRight:           3, z_3_DriveLeft:           4};
        this.tStateA11 = {z_Ready: 0, z_Standby:                1, z_Finished:              2};

        for(let i = 0;i<11; i++)
            this["sCurrentStateA"+i] = this["tStateA"+i].z_Init;
        this.sCurrentStateA11 = this.tStateA11.z_Ready;

        this.DebugStateMachineStates();

        this.FSMInitialization_State = "Working";
    }

    if(this.FSMInitialization_State === "Working"){
        // ==== Zustandsübergänge ====

        // this.DebugStateMachineStates();
        //
        let diffCurrentStates;
        while(diffCurrentStates === undefined || diffCurrentStates.length !== 0) {
            let oldCurrentStates = this.GetCurrentMachineStates();
            this.FSMInitialization1DoTrasitionSteps();
            this.DebugStateMachineStates();
            let newCurrentStates = this.GetCurrentMachineStates();
            diffCurrentStates = oldCurrentStates.filter((element, index) => {
                return element !== newCurrentStates[index]
            });
        }

            // this.FSMInitialization1DoTrasitionSteps();
            // this.DebugStateMachineStates();

        for (let i = 0; i < 128; i++)
            this.Actuators[i] = false

        //=== Ausgaben ====
        if (this.sCurrentStateA10 === this.tStateA10.z_1_DriveRight)
            this.Actuators[0] = !this.Sensors[16];

        if (this.sCurrentStateA10 === this.tStateA10.z_3_DriveLeft)
            this.Actuators[1] = !this.Sensors[16];

        if (this.sCurrentStateA9 === this.tStateA9.z_3_PushDownWorkpiece)
            this.Actuators[2] = !this.Sensors[16];

        if (this.sCurrentStateA9 === this.tStateA9.z_1_PushUpWorkpiece)
            this.Actuators[3] = !this.Sensors[16];

        if (this.sCurrentStateA0 === this.tStateA0.z_1_PushUpWorkpiece || this.sCurrentStateA0 === this.tStateA0.z_3_PushDownWorkpiece)
            this.Actuators[4] = !this.Sensors[16];

        if (this.sCurrentStateA2 === this.tStateA2.z_3_TurnLeft)
            this.Actuators[5] = !this.Sensors[16];

        if (this.sCurrentStateA2 === this.tStateA2.z_1_TurnRight)
            this.Actuators[6] = !this.Sensors[16];

        if (this.sCurrentStateA1 === this.tStateA1.z_1_PushUpWorkpiece || this.sCurrentStateA1 === this.tStateA1.z_3_PushDownWorkpiece)
            this.Actuators[7] = !this.Sensors[16];

        if (this.sCurrentStateA3 === this.tStateA3.z_1_PushUpWorkpiece || this.sCurrentStateA3 === this.tStateA3.z_3_PushDownWorkpiece)
            this.Actuators[8] = !this.Sensors[16];

        if (this.sCurrentStateA7 === this.tStateA7.z_3_TurnLeft)
            this.Actuators[9] = !this.Sensors[16];

        if (this.sCurrentStateA7 === this.tStateA7.z_1_TurnRight)
            this.Actuators[10] = !this.Sensors[16];

        if (this.sCurrentStateA6 === this.tStateA6.z_1_PushUpWorkpiece || this.sCurrentStateA6 === this.tStateA6.z_3_PushDownWorkpiece)
            this.Actuators[11] = !this.Sensors[16];

        if (this.sCurrentStateA8 === this.tStateA8.z_1_PushUpWorkpiece)
            this.Actuators[12] = !this.Sensors[16];

        if (this.sCurrentStateA5 === this.tStateA5.z_3_GoBack)
            this.Actuators[13] = !this.Sensors[16];

        if (this.sCurrentStateA5 === this.tStateA5.z_1_GoFront)
            this.Actuators[14] = !this.Sensors[16];

        if (this.sCurrentStateA4 === this.tStateA4.z_2_GoUpside)
            this.Actuators[15] = !this.Sensors[16];

        if (this.sCurrentStateA4 === this.tStateA4.z_1_GoDownsideAndBore)
            this.Actuators[16] = !this.Sensors[16];

        this.SendActuators();
    }
    // pSensor\(([0-9]*)\) =
    // this.Sensors\[$1\] ===
};

VirtualPSPU.prototype.InitializeObservers = function() {
    this.ObserverList[0] = new Observer(11, 2);
    this.ObserverList[1] = new Observer(10,11);
    this.ObserverList[2] = new Observer( 7,10);
    this.ObserverList[3] = new Observer( 6, 7);
    this.ObserverList[4] = new Observer( 3, 6);
    this.ObserverList[5] = new Observer( 2, 3);
};

VirtualPSPU.prototype.ObserverDoStep = function() {
    $.each(this.ObserverList,(Index, Observer) => {
        Observer.DoStep(this.Sensors);
        this.Observer[Index] = Observer.SensorObserver();
    })
};

VirtualPSPU.prototype.DebugStateMachineStates = function(){
    let StateMachines = [];
    for(let i = 0; i < 12; i++)
        // if(i === 0)
            StateMachines.push(["A"+i, this["sCurrentStateA"+i], this["tStateA"+i]]);

    let Output = [];
    $.each(StateMachines,(Index, Values) => {
        $.each(Values[2],(Name,State) => {
            if(Values[1] === State){
                Output.push(Values[0]+":"+Name);
            }
        });
    });

    let ShowStateLogs = false;
    if(ShowStateLogs){
        console.log(Output.join(", "));

        Output = [];
        for(let i = 0; i < 17; i++)
            if(this.Sensors[i])
                Output.push(i);
        console.log("Sensors on: "+Output.join(", "));

        Output = [];
        for(let i = 0; i < 18; i++)
            if(this.Actuators[i])
                Output.push(i);
        console.log("Actuators on: "+Output.join(", "));

        Output = [];
        for(let i = 0; i < 6; i++)
            if(this.Observer[i])
                Output.push(i);
        console.log("Observer on: "+Output.join(", "));

        console.log("");
    }
};

VirtualPSPU.prototype.GetCurrentMachineStates = function() {
    let Return = [];
    for(let i = 0;i<11; i++)
        Return.push(this["sCurrentStateA"+i]);
    return Return;
};

