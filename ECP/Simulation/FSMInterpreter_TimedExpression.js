function TimedExpression(Time, Expression) {
    this.Time = Time;
    this.Expression = Expression;
    this.Timer = null;
    this.States = {
        Start : 0,
        Wait : 1,
        Finished : 2
    };
    this.WaitingFinished = false;
    this.State = this.States.Start;

    this.resetTimer = function(){
        clearTimeout(this.Timer);
        this.Timer = null;
        this.State = this.States.Start;
    };

    this.calculate = function(Variables) {
        let ExpressionValue = false;
        let Result = this.Expression.solve(Variables);

        if (Result == undefined) return undefined;
        if (Result.type = 'Boolean') {
            ExpressionValue = Result.value;
        } else {
            ExpressionValue = false;
        }

        //    console.log(this.State+" : "+Variables["x16"].value+" : "+Result.value);

        switch(this.State){
            case this.States.Start:
                if(ExpressionValue){
                    this.State = this.States.Wait;
                    if(this.Timer == null){
                        this.WaitingFinished = false;
                        this.Timer = setTimeout(()=>{
                            this.WaitingFinished = true;
                        },this.Time);
                    }
                }
                break;
            case this.States.Wait:
                if(ExpressionValue == false){
                    clearTimeout(this.Timer);
                    this.Timer = null;
                    this.State = this.States.Start;
                }

                if(ExpressionValue && this.WaitingFinished){
                    this.State = this.States.Finished;
                    //clearTimeout(this.Timer);
                    this.Timer = null;
                }
                break;
            case this.States.Finished:
                if(ExpressionValue == false){
                    this.State = this.States.Start;
                }
                break;
        }
        return this.State == this.States.Finished;
    }
}
/*
function TestTimedExpressions(){
    a = new TimedExpression(10000, new LogicExpression("x1","!","&","#","y0",()=>{}));
    b = [];
    b["x1"] = new token("Boolean",true);

    setInterval(()=>{
        console.log(a.calculate(b));
    },1000);
}
*/