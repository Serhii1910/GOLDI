function LogicExpression(pExpressionString, pNot, pAnd, pOr, pName, ErrorCallBack) {
    if(pExpressionString == undefined)
        debug("pExpr undef");
    this.ExpressionString = pExpressionString.replace(/ /gi, "") + " "; //removes all whitespaces;
    this.ScannerIdx = 0;
    if (pNot.length != 1 || pAnd.length != 1 || pOr.length != 1) {
        //'As of now, operators can only be one character long!'
        ErrorCallBack([1, 25]);
        return;
    }
    this.Not = pNot;
    this.And = pAnd;
    this.Or = pOr;
    this.expression = '';
    this.name = pName;

    //Variables is a assiociative array for the boolean values of variables: Example: Variables["a0z0"].value
    this.solve = function (Variables)
    {
        var currentToken = this.scanNextToken();
        var evalExpressionString = "";

        //this loop will build the expression string for the evaluation
        while (currentToken.type != 'EOS' && currentToken.type != 'Exception') {
            //Current token is a variable so substitute it with the correct boolean value
            if(currentToken.type == "Variable"){
                //check if the variable is defined
                if (Variables[currentToken.value] == undefined) {
                    //Undefined Variable
                    ErrorCallBack([0, this.name, currentToken.value]);
                    return;
                }
                //add the variable value to the expression string
                if (Variables[currentToken.value].value == true)
                {
                    evalExpressionString += " true "
                }
                else if(Variables[currentToken.value].value == false)
                {
                    evalExpressionString += " false "
                }
                else
                {
                    //Undefined Variable
                    ErrorCallBack([0, this.name, currentToken.value]);
                    return;
                }
            }
            //Current token is a boolean value so insert it into the expressionstring
            if(currentToken.type == "Boolean")
            {
                if(currentToken.value){
                    evalExpressionString += " true "
                }
                else
                {
                    evalExpressionString += " false "
                }
            }
            //Parenthesises will just be parsed through
            if(currentToken.type == "(" || currentToken.type == ")"){
                evalExpressionString += " " + currentToken.type + " ";
            }
            //replace not with ! for eval()
            if(currentToken.type == "Not")
            {
                evalExpressionString += " ! "
            }

            //replace or with || for eval()
            if(currentToken.type == "Or")
            {
                evalExpressionString += " || "
            }

            //replace and with && for eval()
            if(currentToken.type == "And")
            {
                evalExpressionString += " && "
            }

            currentToken = this.scanNextToken();
        }
        if(currentToken.type != 'Exception'){
            //try to evaluate the expression
            try {
                return new token('Boolean', eval(evalExpressionString));
            }
            catch (e) {
                ErrorCallBack([1, this.name]);
            }
        }
    };

    //function scans the ExpressionString for tokens
    this.scanNextToken = function () {
        //Are we done here?
        if (this.ScannerIdx + 1 >= this.ExpressionString.length) {
            this.ScannerIdx = 0;
            return new token('EOS');
        }

        //Is it a Variable?
        if (this.isLetter(this.ExpressionString.charAt(this.ScannerIdx))) {
            var Ident = "";
            while (this.isLetter(this.ExpressionString.charAt(this.ScannerIdx)) || this.isNumber(this.ExpressionString.charAt(this.ScannerIdx))) {
                Ident += this.ExpressionString.charAt(this.ScannerIdx);
                this.ScannerIdx++;
            }
            return new token('Variable', Ident);
        }

        //Is it a Negation?
        if (this.ExpressionString.charAt(this.ScannerIdx) == this.Not) {
            this.ScannerIdx++;
            return new token('Not');
        }

        //Is it an Or?
        if (this.ExpressionString.charAt(this.ScannerIdx) == this.Or) {
            this.ScannerIdx++;
            return new token('Or');
        }

        //Is it an And?
        if (this.ExpressionString.charAt(this.ScannerIdx) == this.And) {
            this.ScannerIdx++;
            return new token('And');
        }

        //Is it an opening Bracket
        if (this.ExpressionString.charAt(this.ScannerIdx) == '(') {
            this.ScannerIdx++;
            return new token('(');
        }

        //Is is a closing Bracket?
        if (this.ExpressionString.charAt(this.ScannerIdx) == ')') {
            this.ScannerIdx++;
            return new token(')');
        }

        //Is it a boolean Value?
        if (this.ExpressionString.charAt(this.ScannerIdx) == '1') {
            this.ScannerIdx++;
            return new token('Boolean', true);
        }
        if (this.ExpressionString.charAt(this.ScannerIdx) == '0') {
            this.ScannerIdx++;
            return new token('Boolean', false);
        }

        this.ScannerIdx++;
        ErrorCallBack([4, this.name]);
        return new token('Exception', false);

    };

    this.setVariableMap = setVariableMap;
    function setVariableMap(pVariableMap) {
        this.VariableMap = pVariableMap;
    }

    this.isLetter = isLetter;
    function isLetter(str) {
        return /^[a-zA-Z]$/.test(str);
    }

    this.isNumber = isNumber;
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    this.printExpressionToConsole = printExpressionToConsole;
    function printExpressionToConsole() {
        console.log(this.ExpressionString);
        return 1;
    }

    /**
     @return the expressionstring
     */
    this.getExpressionString = getExpressionString;
    function getExpressionString() {
        return this.ExpressionString;
    }
}

function token(pType, pValue) {
    this.type = pType;
    this.value = pValue;
}
