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
        //sorting for the PCBS with priority.
        cpuScheduler.merge = function (left, right) {
            var result = [];
            while (left.length > 0 && right.length > 0) {
                if (left[0].priority < right[0].priority) {
                    result.push(left.shift());
                }
                else {
                    result.push(right.shift());
                }
            }
            result = result.concat(left).concat(right);
            //make sure remaining arrays are empty
            left.splice(0, left.length);
            right.splice(0, right.length);
            return result;
        };
        /**
         * Sorts an array in ascending natural order using
         * merge sort.
         * @param {Array} items The array to sort.
         * @return {Array} The sorted array.
         */
        cpuScheduler.mergeSort = function (items) {
            // Terminal condition - don't need to do anything for arrays with 0 or 1 items
            if (items.length < 2) {
                return items;
            }
            var work = [], i, len;
            for (i = 0, len = items.length; i < len; i++) {
                work.push([items[i]]);
            }
            work.push([]); //in case of odd number of items
            for (var lim = len; lim > 1; lim = Math.floor((lim + 1) / 2)) {
                for (var j = 0, k = 0; k < lim; j++, k += 2) {
                    work[j] = this.merge(work[k], work[k + 1]);
                }
                work[j] = []; //in case of odd number of items
            }
            return work[0];
        };
        //method to switch process control blocks
        // if the counter in CPU reaches the quantum,
        // switch PCBS. also, if a 00 is reached, switch PCBs
        cpuScheduler.contextSwitch = function () {
            if (quantumCounter == quantum) {
                //if theres only one process just reset the quantum
                quantumCounter = 0;
                //otherwise, set the state of the process to 0 (waiting) and then update the process control block
                //to the CPUs contents. put it back in the queue, and set the currently executing PCB to the next thing in the queue.
                // set its state to 1 for executing
                if (readyQueue.getSize() > 0) {
                    currentlyExecuting.state = 0;
                    _CPU.updatePCB(_CPU);
                    readyQueue.enqueue(currentlyExecuting);
                    currentlyExecuting = readyQueue.dequeue();
                    currentlyExecuting.state = 1;
                    _CPU.updateCPU(currentlyExecuting);
                }
            }
        };
        cpuScheduler.contextSwitchBreak = function () {
            quantumCounter = 0;
            _Kernel.krnTrace("BREAK SWTICH ---- READY Q SIZE IS" + readyQueue.getSize());
            //  set the quantu back to 0, and then check if the ready queue has items in it. If there is, set executing
            // back to true, and then switch the PCBS, make sure to set the state to 2 for terminated before switching PCBs
            if (readyQueue.getSize() > 0) {
                _CPU.isExecuting = true;
                _Kernel.krnTrace("LENGTH IS" + readyQueue.getSize());
                _CPU.updatePCB(_CPU);
                currentlyExecuting.state = 2;
                currentlyExecuting = readyQueue.dequeue();
                _CPU.updateCPU(currentlyExecuting);
            }
            else {
                //_CPU.updatePCB(_CPU);
                _CPU.isExecuting = false;
                _StdOut.advanceLine();
                _StdOut.putText("Execution complete");
                _StdOut.advanceLine();
                _StdOut.putText(">");
            }
        };
        return cpuScheduler;
    })();
    TSOS.cpuScheduler = cpuScheduler;
})(TSOS || (TSOS = {}));
