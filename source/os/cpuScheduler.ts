/**
 * Created by cejl94 on 11/10/15.
 */


module TSOS{




    export class cpuScheduler{

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
        // switch PCBS, which means


        static contextSwitch():void{

            if(quantumCounter == quantum){

                if(readyQueue.length > 0) {


                    currentlyExecuting.state = 0;
                    _CPU.updatePCB(_CPU);
                    readyQueue.enqueue(currentlyExecuting);
                    currentlyExecuting = readyQueue.dequeue();
                    currentlyExecuting.state = 1;
                    quantumCounter = 0;

                }

            }

            //this occurs when a 00 is encountered, and therefore a process is finished
            if(readyQueue.length > 0){
                _CPU.updatePCB(_CPU);
                currentlyExecuting.state = 2;
                finishedProcesses[finishedProcesses.length] = currentlyExecuting;
                currentlyExecuting = readyQueue.dequeue();


            }




        }



    }





}