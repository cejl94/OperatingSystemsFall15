/**
 * Created by cejl94 on 10/18/15.
 */
var TSOS;
(function (TSOS) {
    var pcb = (function () {
        function pcb(pid, PC, Acc, Xreg, Yreg, Zflag, base, limit, isExecuting) {
            if (pid === void 0) { pid = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.pid = pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
            this.isExecuting = isExecuting;
        }
        pcb.prototype.init = function (pid, base, limit) {
            this.pid = pid;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.base = base;
            this.limit = limit;
            this.isExecuting = false;
        };
        return pcb;
    })();
    TSOS.pcb = pcb;
})(TSOS || (TSOS = {}));
