/**
 * Created by cejl94 on 11/10/15.
 */
var TSOS;
(function (TSOS) {
    var cpuScheduler = (function () {
        function cpuScheduler() {
        }
        // variable which contains the PCB that is currently executing
        // this class will contain the methods that do all of the switching of the process
        // control blocks during execution
        // dequeue the first element of the readyque into currentlyExecuting, and then use the properties of
        // the temp to update the CPU, then set this.isexecuting to true
        cpuScheduler.startExecution = function () {
            currentlyExecuting = readyQueue.dequeue();
            _CPU.updateCPU(currentlyExecuting);
            currentlyExecuting.state = 1;
            _CPU.isExecuting = true;
        };
        //method to switch process control blocks
        // if the counter in CPU reaches the quantum,
        // switch PCBS. also, if a 00 is reached, switch PCBs
        cpuScheduler.contextSwitch = function () {
            if (quantumCounter == quantum) {
                if (readyQueue != null) {
                    _Kernel.krnTrace("ACTUALLY INSIDE THE METHOD NOW");
                    currentlyExecuting.state = 0;
                    _CPU.updatePCB(_CPU);
                    readyQueue.enqueue(currentlyExecuting);
                    currentlyExecuting = readyQueue.dequeue();
                    currentlyExecuting.state = 1;
                    _CPU.updateCPU(currentlyExecuting);
                    quantumCounter = 0;
                    _Kernel.krnTrace("Q EQUALS" + readyQueue.toString());
                }
            }
            //this occurs when a 00 is encountered, and therefore a process is finished
            if (processTerminated && readyQueue != null) {
                _CPU.updatePCB(_CPU);
                currentlyExecuting.state = 2;
                finishedProcesses[finishedProcesses.length] = currentlyExecuting;
                currentlyExecuting = readyQueue.dequeue();
                _CPU.updateCPU(currentlyExecuting);
                processTerminated = false;
                _Kernel.krnTrace("Q EQUALS (00 occured)" + readyQueue.toString());
            }
        };
        return cpuScheduler;
    })();
    TSOS.cpuScheduler = cpuScheduler;
})(TSOS || (TSOS = {}));
