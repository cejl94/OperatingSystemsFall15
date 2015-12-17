/**
 * Created by cejl94 on 10/18/15.
 */
var TSOS;
(function (TSOS) {
    var pcb = (function () {
        //if state is 0, the process is waiting(back in the ready queue)
        //if state is 1 that means the program is executing
        //if state is 2 that means the program is finished
        function pcb(state, pid, PC, Acc, Xreg, Yreg, Zflag, base, limit, limitCounter, priority, location, isExecuting) {
            if (state === void 0) { state = 0; }
            if (pid === void 0) { pid = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            if (limitCounter === void 0) { limitCounter = 0; }
            if (priority === void 0) { priority = 0; }
            if (location === void 0) { location = ""; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.state = state;
            this.pid = pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
            this.limitCounter = limitCounter;
            this.priority = priority;
            this.location = location;
            this.isExecuting = isExecuting;
        }
        pcb.prototype.init = function (pid, base, limit, PC, priority, location) {
            this.state = 0;
            this.pid = pid;
            this.PC = PC;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.base = base;
            this.limit = limit;
            this.limitCounter = 0;
            this.priority = priority;
            this.location = location;
            this.isExecuting = false;
        };
        return pcb;
    })();
    TSOS.pcb = pcb;
})(TSOS || (TSOS = {}));
