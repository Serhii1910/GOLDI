function mode_FSM(pNumInputs, pNumOutputs, NOTSign, ANDSign, ORSign, ErrorCallBack) {
    var numInputs = pNumInputs;
    var numOutputs = pNumOutputs;
    var outputValues = [];
    var variables = [];
    var outputEquations = [];
    var hstarEquation = new LogicExpression('0', NOTSign, ANDSign, ORSign, 'Hstar', ErrorCallBackLogicExpression);
    var machines = [];
    this.variables = variables;

    function ErrorCallBackLogicExpression(Error) {
        ErrorCallBack(Error);
    }

    /**
     @return id of the created machine
     @throws undefined_machine_id, id_allready_used
     Creates a new FSM
     */
    this.createMachine = createMachine;
    function createMachine() {
        for (var i = 0; true; i++) {
            if (machines[i] == undefined) {
                machines[i] = new fsm(i, NOTSign, ANDSign, ORSign, ErrorCallBackLogicExpression);
                variables['a' + i + 'z0'] = new token('Boolean', false);
                return new token('id', i);
            }
        }
    }

    /**
     @arguments id Id of the machine to be destroyed
     @return id of the destroyed machine
     @throws undefined_machine_id, unknown_machine_id
     Destroys the Machine with the given id
     */
    this.destroyMachine = destroyMachine;
    function destroyMachine(id) {
        if (id == undefined) {
            ErrorCallBack([23]);
            return;
        }
        if (machines[id] == undefined) {
            ErrorCallBack([24, id]);
            return;
        }
        for (var i = 0; i < machines[id].getNumStateVariables(); i++) {
            variables['a' + id + 'z' + i] = undefined;
        }
        machines[id] = undefined;
        return new token('Value', id);
    }


    /**
     resets all machines to their initial state
     */
    this.reset = reset;
    function reset() {
        for (var i = 0; i < machines.length; i++) {
            if (machines[i] != undefined) {
                machines[i].initialize();
                var stateVars = machines[i].getStateVar();
                for (var j = 0; j < machines[i].getNumStateVariables(); j++) {
                    variables['a' + i + 'z' + j] = stateVars[j];
                }
            }
        }
        resetTimedExpressionsTimer();
    }

    /**
     @arguments machineId
     @arguments stateVarId
     @arguments equationString
     @throws undefined_machine_id, unknown_machine_id
     Sets the equation of the statevariable of the given Machine
     **/
    this.setStateEquation = setStateEquation;
    function setStateEquation(machineId, stateVarId, equationString) {
        if (machineId == undefined) {
            ErrorCallBack([23]);
            return;
        }
        if (machines[machineId] == undefined) {
            ErrorCallBack([24, machineId]);
            return;
        }
        var result = machines[machineId].setEquation(stateVarId, equationString);
        if (result.type == 'Exception') {
            return result
        }
    }

    /**
     @arguments outputVar
     @arguments equationString
     @throws unknown_output
     Sets the equation for the given output Variable
     */
    this.setOutputEquation = setOutputEquation;
    function setOutputEquation(outputVar, equationString) {
        if (outputVar >= numOutputs || outputVar == undefined || isNaN(outputVar)) {
            ErrorCallBack([12, "y" + outputVar]);
            return;
        }
        outputEquations[outputVar] = new LogicExpression(equationString, NOTSign, ANDSign, ORSign, 'y' + outputVar, ErrorCallBackLogicExpression);
    }

    this.getOutputEquation = getOutputEquation;
    function getOutputEquation(outputVar) {
        if (outputEquations[outputVar] == undefined) {
            return ""
        } else {
            return outputEquations[outputVar].getExpressionString();
        }
    }

    /**
     @arguments equationString
     Sets the Equation for the hstar calculation
     */
    this.setHstarEquation = setHstarEquation;
    function setHstarEquation(equationString) {
        hstarEquation = new LogicExpression(equationString, NOTSign, ANDSign, ORSign, 'Hstar', ErrorCallBackLogicExpression);
    }

    /**
     @return current Equationstring of hstar
     Returns the current Equationstring of hstar
     */
    this.getHstarEquation = getHstarEquation;
    function getHstarEquation() {
        return hstarEquation.getExpressionString();
    }

    /**
     */
    var TimedExpressions = [];
    this.getTimedExpression = getTimedExpression;
    function getTimedExpression(){
        return TimedExpressions;
    }

    this.increaseTimedExpressions = increaseTimedExpressions;
    function increaseTimedExpressions(Expression, Time = 0) {
        TimedExpressions.push(new TimedExpression(Time,Expression));
    }

    this.decreaseTimedExpressions = decreaseTimedExpressions;
    function decreaseTimedExpressions() {
        TimedExpressions.pop();
    }

    this.unsetTimedExpressions = unsetTimedExpressions;
    function unsetTimedExpressions() {
        TimedExpressions = [];
    }

    this.resetTimedExpressionTimers = resetTimedExpressionsTimer;
    function resetTimedExpressionsTimer() {
        for(let i = 0; i < TimedExpressions.length; i++)
            TimedExpressions[i].resetTimer();
    }

    /**
     @arguments machineId
     @throws undefined_machine_id, unknown_machine_id
     @return current number of Statevariables
     Increases the number of Statevariables of the given Machine
     */
    this.increaseStateVariables = increaseStateVariables;
    function increaseStateVariables(machineId) {
        if (machineId == undefined) {
            ErrorCallBack([23]);
            return;
        }
        if (machines[machineId] == undefined) {
            ErrorCallBack([24, machineId]);
            return;
        }
        var result = machines[machineId].increaseStateVariables();
        reset();
        return result;
    }

    /**
     @arguments machineId
     @throws undefined_machine_id, unknown_machine_id, cannot_decrease_below_1
     @return current number of Statevariables
     Decreases the number of Statevariables of the given Machine
     */
    this.decreaseStateVariables = decreaseStateVariables;
    function decreaseStateVariables(machineID) {
        if (machineID == undefined) {
            ErrorCallBack([23]);
            return;
        }
        if (machines[machineID] == undefined) {
            ErrorCallBack([24, machineID]);
            return;
        }
        var result = machines[machineID].decreaseStateVariables();
        reset();
        return result;
    }

    /**
     @arguments  machineId
     @throws undefined_machine_id, unknown_machine_id
     @return number of statevariables of the given Machine
     **/
    this.getNumStateVariables = getNumStateVariables;
    function getNumStateVariables(machineId) {
        if (machineId == undefined) {
            ErrorCallBack([23]);
            return;
        }
        if (machines[machineId] == undefined) {
            ErrorCallBack([24, machineId]);
            return;
        }
        return machines[machineId].getNumStateVariables();
    }

    /**
     @arguments machineId
     @arguments stateNum
     @throws undefined_machine_id, unknown_machine_id, illegal_state_selected
     Defines the initial state of the given machine
     */
    this.setInitialState = setInitialState;
    function setInitialState(machineId, stateNum) {
        if (machineId == undefined) {
            ErrorCallBack([23]);
            return;
        }
        if (machines[machineId] == undefined) {
            ErrorCallBack([24, machineId]);
            return;
        }
        return machines[machineId].setInitialState(stateNum);
    }

    /**
     @arguments machineId
     @throws undefined_machine_id, unknown_machine_id,
     Defines the initial state of the given machine
     */
    this.getInitialState = getInitialState;
    function getInitialState(machineId) {
        if (machineId == undefined) {
            ErrorCallBack([23]);
            return;
        }
        if (machines[machineId] == undefined) {
            ErrorCallBack([24, machineId]);
            return;
        }
        return machines[machineId].getInitialState();
    }


    /**
     @arguments machineId
     @throws undefined_machine_id, unknown_machine_id
     Returns the current state of the given machine
     */
    this.getCurrentState = getCurrentState;
    function getCurrentState(machineId) {
        if (machineId == undefined) {
            ErrorCallBack([23]);
            return;
        }
        if (machines[machineId] == undefined) {
            ErrorCallBack([24, machineId]);
            return;
        }
        return machines[machineId].getState();
    }

    /**
     @arguments machineId
     @arguments stateVarId
     @throws undefined_machine_id, unknown_machine_id, non_existent_variable
     @result the Equationstring of the given Statevariable of the given Machine
     */
    this.getStateEquation = getStateEquation;
    function getStateEquation(machineId, stateVarId) {
        if (machineId == undefined) {
            ErrorCallBack([23]);
            return;
        }
        if (machines[machineId] == undefined) {
            ErrorCallBack([24, machineId]);
            return;
        }
        return machines[machineId].getEquation(stateVarId);
    }

    /**
     @throws insufficient_variables_given
     @argument Array containing the boolean values of all input variables
     */
    this.setInput = setInput;
    function setInput(inputVal) {
        if (inputVal.length > numInputs) {
            ErrorCallBack([5]);
            return;
        }
        for (var i = 0; i < numInputs; i++) {
            if (inputVal[i] == undefined || (inputVal[i].value != true && inputVal[i].value != false)) {
                ErrorCallBack([6]);
                return;
            }
            variables['x' + i] = inputVal[i]
        }
    }

    /**
     @argument machineId
     @throws undefined_machine_id, unknown_machine_id
     Sets the current state of the given machine to the initial State
     */
    this.initializeMachine = initializeMachine;
    function initializeMachine(machineId) {
        if (machineId == undefined) {
            ErrorCallBack([23]);
            return;
        }
        if (machines[machineId] == undefined) {
            ErrorCallBack([24, machineId]);
            return;
        }
        machines[machineId].initialize();
        var calcCurrentState = machines[machineId].getInitialState();
        for (var i = machines[machineId].getNumStateVariables() - 1; i >= 0; i--) {
            if (Math.pow(2, i) <= calcCurrentState) {
                variables['a' + machineId + 'z' + i] = new token('Boolean', true);
                calcCurrentState -= Math.pow(2, i);
            } else {
                variables['a' + machineId + 'z' + i] = new token('Boolean', false);
            }
        }
    }

    /**
     @return calculated output values
     Calculates outputvalues according to the set inputvalues
     */
    this.calculate = calculate;
    function calculate () {
        //give undefined inputs a default value
        for (var i = 0; i < numInputs; i++) {
            if (variables['x' + i] == undefined) {
                variables['x' + i] = new token('Boolean', false);
            }
        }

        for (var i = 0; i < machines.length; i++) {
            if (machines[i] != undefined) {
                var stateVars = machines[i].getStateVar();
                for (var j = 0; j < stateVars.length; j++) {
                    if (variables['a' + i + 'z' + j].value == undefined) {
                        variables['a' + i + 'z' + j] = new token('Boolean', false);
                    }
                }
            }
        }
        for(var i = 0; i < TimedExpressions.length; i++){
            if(variables["te" + i] == undefined){
                variables["te" + i] = new token('Boolean', false);
            }
        }
        if (hstarEquation.solve(variables).value) {
            ErrorCallBack([7]);
            return;
        }
        for (var i = 0; i < machines.length; i++) {
            if (machines[i] != undefined) {
                machines[i].calculate(variables);
            }
        }
        for (var i = 0; i < TimedExpressions.length; i++) {
            if (TimedExpressions[i] != undefined) {
                variables["te"+i] = new token("Boolean",TimedExpressions[i].calculate(variables));
            }
        }
        for (var i = 0; i < machines.length; i++) {
            if (machines[i] != undefined) {
                var stateVars = machines[i].getStateVar();
                for (var j = 0; j < stateVars.length; j++) {
                    variables['a' + i + 'z' + j] = stateVars[j];
                }
            }
        }
        for (var i = 0; i < numOutputs; i++) {
            if (outputEquations[i] == undefined) {
                ErrorCallBack([8, i]);
                return;
            }
            outputValues[i] = outputEquations[i].solve(variables);
        }
        return outputValues;
    }
}
/**
 @author tfaeth
 @requires LogicExpression
 @requires settings for the operator definitions
 Each Instance of this Class contains a FSM
 */
function fsm(pId, NOTSign, ANDSign, ORSign, ErrorCallBackLogicExpression) {
    var id = pId;
    var initialState = 0;
    var numVariables = 1;
    var equations = [];
    var stateVariables = [];
    this.equations = equations;
    equations[0] = new LogicExpression('', NOTSign, ANDSign, ORSign, 'a' + id + 'z0', ErrorCallBackLogicExpression);
    stateVariables[0] = false;

    /**
     @arguments varNum Number of the Statevariable
     @arguments equationString
     Sets the equationstring of the given Statevariable
     */
    this.setEquation = setEquation;
    function setEquation(varNum, equationString) {
        if (varNum > numVariables) {
            ErrorCallBackLogicExpression([9, "a" + id + "z" + varNum]);
            return;
        }
        equations[varNum] = new LogicExpression(equationString, NOTSign, ANDSign, ORSign, 'a' + id + 'z' + varNum, ErrorCallBackLogicExpression);
        return new token('Boolean', true);
    }

    /**
     @arguments varNum Number of the Statevariable
     @result equationstring of the given Statevariable
     */
    this.getEquation = getEquation;
    function getEquation(varNum) {
        if (varNum > numVariables) {
            ErrorCallBackLogicExpression([9, "a" + id + "z" + varNum]);
            return;
        }
        return equations[varNum].getExpressionString();
    }


    /**
     @result Number of Statevariables
     **/
    this.getNumStateVariables = getNumStateVariables;
    function getNumStateVariables() {
        return numVariables;
    }

    /**
     @arguments Variables Array of Values for all known Variables
     Calculates the next set of Statevariables
     */
    this.calculate = calculate;
    function calculate (variables) {
        for (var i = 0; i < numVariables; i++) {
            var result = equations[i].solve(variables);
            if (result == undefined) return undefined;
            if (result.type = 'Boolean') {
                stateVariables[i] = result.value;
            } else {
                return result;
            }
        }
    }
    /**
     @arguments initState Initial state in decimal system
     Sets the initial state of the machine
     */
    this.setInitialState = setInitialState;
    function setInitialState(initState) {
        if (isNaN(initState)) {
            ErrorCallBackLogicExpression([10, id]);
            return;
        }
        if (initState >= Math.pow(2, numVariables)) {
            ErrorCallBackLogicExpression([10, id]);
            return;
        }
        initialState = initState;
        this.initialize();
    }

    /**
     Returns the current initial state of the Machine
     */
    this.getInitialState = getInitialState;
    function getInitialState() {
        return initialState;
    }

    /**
     Returns the current state of the Machine
     */
    this.getState = getState;
    function getState() {
        var state = 0;
        for (var i = 0; i < numVariables; i++) {
            if (stateVariables[i]) {
                state += Math.pow(2, i);
            }
        }
        return state;
    }

    /**
     Returns the current statevariables
     **/
    this.getStateVar = getStateVar;
    function getStateVar() {
        var result = [];
        for (var i = 0; i < numVariables; i++) {
            result[i] = new token('Boolean', stateVariables[i]);
        }
        return result;
    }

    /**
     Sets the current State to the initial State
     */
    this.initialize = initialize;
    function initialize () {
        var calcCurrentState = initialState;
        for (var i = numVariables; i >= 0; i--) {
            if (Math.pow(2, i) <= calcCurrentState) {
                stateVariables[i] = true;
                calcCurrentState -= Math.pow(2, i);
            } else {
                stateVariables[i] = false;
            }
        }
    }

    /**
     @return current number of state Variables
     Increases the number of Statevariables
     */
    this.increaseStateVariables = increaseStateVariables;
    function increaseStateVariables() {
        numVariables++;
        equations[numVariables - 1] = new LogicExpression('', NOTSign, ANDSign, ORSign, 'a' + id + 'z' + numVariables - 1, ErrorCallBackLogicExpression);
        initialize();
        return numVariables;
    }

    /**
     Decreases the number of State variables and changes the initial State if needed
     */
    this.decreaseStateVariables = decreaseStateVariables;
    function decreaseStateVariables() {
        if (numVariables == 1) {
            ErrorCallBackLogicExpression([11, "z" + id]);
            return;
        }
        numVariables--;
        equations[numVariables] = undefined;
        if (initialState >= Math.pow(2, numVariables)) {
            initialState = Math.pow(2, numVariables) - 1;
        }
        initialize();
        return numVariables;
    }

    /**
     @return the number of State variables
     */
    this.getNumStateVariables = getNumStateVariables;
    function getNumStateVariables() {
        return numVariables;
    }
}


/*function testfsm(){
 var testfsm = new fsm('a0');
 var input = new Array();
 input['x0'] = false;
 input['x1'] = false;
 testfsm.increaseStateVariables();
 testfsm.setEquation(0,"!a0z0&x0|a0z0&!x1");
 testfsm.setEquation(1,"a0z0&!a0z1&x1|a0z1&!a0z0|a0z1&a0z0&!x1");
 input = testfsm.calculate(input);
 console.log("Momentaner Zustand ist: " + testfsm.getState());
 input['x0'] = true;
 input = testfsm.calculate(input);
 console.log("Momentaner Zustand ist: " + testfsm.getState());
 input['x0'] = false;
 input['x1'] = true;
 input = testfsm.calculate(input);
 console.log("Momentaner Zustand ist: " + testfsm.getState());
 input['x0'] = false;
 input['x1'] = true;
 input = testfsm.calculate(input);
 console.log("Momentaner Zustand ist: " + testfsm.getState());
 input['x0'] = true;
 input['x1'] = true;
 input = testfsm.calculate(input);
 console.log("Momentaner Zustand ist: " + testfsm.getState());
 input['x0'] = true;
 input['x1'] = false;
 input = testfsm.calculate(input);
 console.log("Momentaner Zustand ist: " + testfsm.getState());
 input['x0'] = true;
 input['x1'] = true;
 input = testfsm.calculate(input);
 console.log("Momentaner Zustand ist: " + testfsm.getState());
 }
 function test_mode_fsm(){
 test_mode = new mode_fsm(3,2,100);
 console.log('Machine ' + test_mode.createMachine().value + ' created');
 test_mode.setOutputEquation(0,'!a0z1&!a0z0');
 test_mode.setOutputEquation(1,'!a0z1&a0z0');
 console.log('Set output Equation');
 test_mode.increaseStateVariables(0);
 console.log('Statevariables increased!');
 test_mode.setStateEquation(0,0,'!a0z0&!a0z1&x1&!x2|a0z0&!a0z1&!x0|a0z0&!a0z1&x2|a0z0&a0z1');
 test_mode.setStateEquation(0,1,'a0z1&x2|!a0z1&x2');
 console.log('Set state Equation');
 console.log('Begin of Test!');
 console.log('1st');
 input = new Array(new token('Boolean',true),new token('Boolean',false),new token('Boolean',false));
 test_mode.setInput(input);
 console.log('Set input');
 console.log('INPUTS');
 console.log('Linkslauf ist ' + input[0]);
 console.log('Rechtslauf ist ' + input[1]);
 console.log('Pause ist ' + input[2]);
 result = test_mode.calculate();
 console.log('OUTPUTS');
 console.log('Linker Motor ist ' + result[0].value);
 console.log('Rechter Motor ist ' + result[1].value);
 console.log('2nd');
 input = new Array(new token('Boolean',true),new token('Boolean',false),new token('Boolean',true));
 test_mode.setInput(input);
 console.log('INPUTS');
 console.log('Linkslauf ist ' + input[0]);
 console.log('Rechtslauf ist ' + input[1]);
 console.log('Pause ist ' + input[2]);
 result = test_mode.calculate();
 console.log('OUTPUTS');
 console.log('Linker Motor ist ' + result[0].value);
 console.log('Rechter Motor ist ' + result[1].value);
 console.log('3rd');
 input = new Array(new token('Boolean',true),new token('Boolean',false),new token('Boolean',false));
 test_mode.setInput(input);
 console.log('INPUTS');
 console.log('Linkslauf ist ' + input[0]);
 console.log('Rechtslauf ist ' + input[1]);
 console.log('Pause ist ' + input[2]);
 result = test_mode.calculate();
 console.log('OUTPUTS');
 console.log('Linker Motor ist ' + result[0].value);
 console.log('Rechter Motor ist ' + result[1].value);
 console.log('4th');
 input = new Array(new token('Boolean',false),new token('Boolean',true),new token('Boolean',false));
 test_mode.setInput(input);
 console.log('INPUTS');
 console.log('Linkslauf ist ' + input[0]);
 console.log('Rechtslauf ist ' + input[1]);
 console.log('Pause ist ' + input[2]);
 result = test_mode.calculate();
 console.log('OUTPUTS');
 console.log('Linker Motor ist ' + result[0].value);
 console.log('Rechter Motor ist ' + result[1].value);
 console.log('5th');
 input = new Array(new token('Boolean',false),new token('Boolean',true),new token('Boolean',true));
 test_mode.setInput(input);
 console.log('INPUTS');
 console.log('Linkslauf ist ' + input[0]);
 console.log('Rechtslauf ist ' + input[1]);
 console.log('Pause ist ' + input[2]);
 result = test_mode.calculate();
 console.log('OUTPUTS');
 console.log('Linker Motor ist ' + result[0].value);
 console.log('Rechter Motor ist ' + result[1].value);
 console.log('6th');
 input = new Array(new token('Boolean',false),new token('Boolean',true),new token('Boolean',false));
 test_mode.setInput(input);;
 console.log('INPUTS');
 console.log('Linkslauf ist ' + input[0]);
 console.log('Rechtslauf ist ' + input[1]);
 console.log('Pause ist ' + input[2]);
 result = test_mode.calculate();
 console.log('OUTPUTS');
 console.log('Linker Motor ist ' + result[0].value);
 console.log('Rechter Motor ist ' + result[1].value);
 console.log('7th');
 input = new Array(new token('Boolean',true),new token('Boolean',false),new token('Boolean',false));
 test_mode.setInput(input);
 console.log('INPUTS');
 console.log('Linkslauf ist ' + input[0]);
 console.log('Rechtslauf ist ' + input[1]);
 console.log('Pause ist ' + input[2]);
 result = test_mode.calculate();
 console.log('OUTPUTS');
 console.log('Linker Motor ist ' + result[0].value);
 console.log('Rechter Motor ist ' + result[1].value);
 }
 var test_mode;
 */