/**
 * Created by cejl94 on 11/10/15.
 */


module TSOS{




    export class cpuScheduler{

        constructor(){


        }
        // variable which contains the PCB that is currently executing


        // this class will contain the methods that do all of the switching of the process
        // control blocks during execution
        // dequeue the first element of the readyque into currentlyExecuting, and then use the properties of
        // the temp to update the CPU, then set this.isexecuting to true

        static startExecution():void{
            currentlyExecuting = readyQueue.dequeue();
            _CPU.updateCPU(currentlyExecuting);
            currentlyExecuting.state = 1;
            _CPU.isExecuting = true;






    }


        //method to switch process control blocks
        // if the counter in CPU reaches the quantum,
        // switch PCBS. also, if a 00 is reached, switch PCBs


        static contextSwitch():void{


            if(quantumCounter == quantum){

                quantumCounter = 0;



                if(readyQueue.getSize() > 0) {
                    currentlyExecuting.state = 0;
                    _CPU.updatePCB(_CPU);
                    readyQueue.enqueue(currentlyExecuting);
                    currentlyExecuting = readyQueue.dequeue();
                    currentlyExecuting.state = 1;
                    _CPU.updateCPU(currentlyExecuting);


                }

            }


        }

        static contextSwitchBreak():void{
            quantumCounter = 0;
            _Kernel.krnTrace("BREAK SWTICH ---- READY Q SIZE IS" + readyQueue.getSize());
           // if(mem.opcodeMemory[_CPU.PC + 1] != "00" ) {
                if (readyQueue.getSize() > 0) {
                    _CPU.isExecuting = true;
                    _Kernel.krnTrace("LENGTH IS" + readyQueue.getSize());
                    _CPU.updatePCB(_CPU);
                    currentlyExecuting.state = 2;
                    currentlyExecuting = readyQueue.dequeue();
                    _CPU.updateCPU(currentlyExecuting);

                    } else {
                    //_CPU.updatePCB(_CPU);
                    _CPU.isExecuting = false;
                    _StdOut.advanceLine();
                    _StdOut.putText("Execution complete");
                    _StdOut.advanceLine();
                    _StdOut.putText(">");


                    }

                }
            //}


        }









}