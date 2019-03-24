function MMControl(numStep, resultCallBack) {

    var result;
    var targetsolution;
    var nextStep;
    var maxNumStep = numStep;

    this.restart = function (solution) {

        var result = {
            ok: 0,
            nextStep: 0,
            feedback: [0, 0, 0, 0]
        };

        if (!checksolution(solution)) {
            result.ok = 0;
            resultCallBack(result);
            return;
        }

        targetsolution = solution;
        nextStep = 1;

        result.ok = 1;
        result.nextStep = nextStep;
        resultCallBack(result);
    };

    this.test = function (solution) {
        var result = {
            ok: 0,
            nextStep: 0,
            feedback: [0, 0, 0, 0]
        };

        var numCorrectColourAndPos = 0;
        var numCorrectColour = 0;
        var isConsideredInSolution = new Array(4);
        var isConsideredInTarget = new Array(4);
        result.feedback = new Array(4);

        for (i = 0; i < 4; i++) {
            isConsideredInSolution[i] = false;
            isConsideredInTarget[i] = false;
            result.feedback[i] = 0;
        }

        if (!checksolution(solution) || targetsolution == undefined || maxNumStep < nextStep) {
            result.ok = 0;
            resultCallBack(result);
            return;
        }


        //Check for exact and colour matches
        for (i = 0; i < 4; i++) {
            if (targetsolution[i] == solution[i]) {
                numCorrectColourAndPos++;
                isConsideredInSolution[i] = true;
                isConsideredInTarget[i] = true;
            }
        }
        for (i = 0; i < 4; i++) {
            if (!isConsideredInSolution[i])
                for (j = 0; j < 4; j++)
                    if (targetsolution[j] == solution[i] && !isConsideredInTarget[j] && !isConsideredInSolution[i]) {
                        isConsideredInTarget[j] = true;
                        isConsideredInSolution[i] = true;
                        numCorrectColour++;
                    }
        }


        for (i = 0; i < 4; i++) {
            if (numCorrectColour > 0 && numCorrectColourAndPos > 0) {
                if (Math.random() > 0.5) {
                    result.feedback[i] = 2;
                    numCorrectColourAndPos--;
                } else {
                    result.feedback[i] = 1;
                    numCorrectColour--;
                }
            } else if (numCorrectColour > 0) {
                result.feedback[i] = 1;
                numCorrectColour--;
            } else if (numCorrectColourAndPos > 0) {
                result.feedback[i] = 2;
                numCorrectColourAndPos--;
            }
        }

        if (numCorrectColour > 0 || numCorrectColourAndPos > 0) {
            console.log("Ooops. :(");
        }

        nextStep++;


        result.ok = 1;
        result.nextStep = nextStep;
        resultCallBack(result);

    };

    var checksolution = function (solution) {
        if (solution == undefined)
            return false;
        for (i = 0; i < 4; i++) {
            if (solution[i] == undefined)
                return false;
            if (solution[i] < 0 || solution[i] > 5) {
                return false;
            }
        }
        return true;
    }

}

//Testbench
/*
 var myCallback = function callback(result){
 if(result.ok == 1){
 console.log('Feedback: ' + result.feedback[0] + result.feedback[1] + result.feedback[2] + result.feedback[3]);
 }else{
 console.log('Result error!');
 }

 }

 var myMMC = new MMControl(6,myCallback);
 myMMC.restart([0,1,3,1]);
 myMMC.test([1,1,0,0]);
 myMMC.test([3,3,2,2]);
 myMMC.test([1,2,3,4]);
 myMMC.test([5,4,3,2]);
 myMMC.test([0,1,1,3]);
 myMMC.test([0,1,3,1]);
 myMMC.test([5,5,5,5]);
 */
