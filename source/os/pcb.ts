/**
 * Created by cejl94 on 10/18/15.
 */
module TSOS {

    export class pcb {



        constructor(public pid: number = 0,
                    public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public base: number = 0,
                    public limit: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(pid, base, limit): void {
            this.pid = pid;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.base = base;
            this.limit = limit;
            this.isExecuting = false;

        }

    }
}