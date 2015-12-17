/**
 * Created by cejl94 on 10/18/15.
 */
module TSOS {

    export class pcb {


        //if state is 0, the process is waiting(back in the ready queue)
        //if state is 1 that means the program is executing
        //if state is 2 that means the program is finished
        constructor(public state = 0,
                    public pid: number = 0,
                    public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public base: number = 0,
                    public limit: number = 0,
                    public limitCounter: number = 0,
                    public priority: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(pid, base, limit, PC, priority): void {
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
            this.isExecuting = false;

        }

    }
}