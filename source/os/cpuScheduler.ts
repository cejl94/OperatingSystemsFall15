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

        public static swap(fileNameRollIn:string,  pids: number):void{

            // first, you need to clear the segment in memory for the currently executing PCB
            //then, you want to take the hex string in the disk and read it, then, in the currently executing

            var nextProcess = readyQueue.index(currentlyExecuting.pid+1);



            if(nextProcess != undefined) {


                nextProcess.location == "memory";
                nextProcess.base = currentlyExecuting.base;
                nextProcess.limit = currentlyExecuting.limit;
                nextProcess.PC = currentlyExecuting.base;
                _Kernel.krnTrace("BASE = " + nextProcess.base + " LIMIT = " + nextProcess.limit + " PC =" + nextProcess.PC);

               // _Kernel.krnTrace()
                //fileSystemDeviceDriver.createFile("process"+currentlyExecuting.pid.toString());
                // fileSystemDeviceDriver.writeFile("process"+currentlyExecuting.pid.toString(), memManager.getOpCodeStringFromMemory(currentlyExecuting.base, currentlyExecuting.limit));


                var opCodes = fileSystemDeviceDriver.readChain("process" + nextProcess.pid.toString());
                var opCodeStart = 0;
                var opCodeEnd = 1;
                var counter = nextProcess.base;
                memManager.clearSegment(counter, nextProcess.limit);
                for (var i = counter; i < nextProcess.limit; i++) {

                    var codes = opCodes.charAt(opCodeStart) + opCodes.charAt(opCodeEnd);
                    if (codes == "") {
                        mem.opcodeMemory[i] = "00";
                        opCodeStart += 2;
                        opCodeEnd += 2;
                    }
                    else {


                        mem.opcodeMemory[i] = codes;
                        opCodeStart += 2;
                        opCodeEnd += 2;
                    }

                }
                currentlyExecuting = readyQueue.dequeue();
                fileSystemDeviceDriver.deleteFile("process" + nextProcess.pid.toString());
                Control.updateFileSystemTable();
                _CPU.updateCPU(currentlyExecuting);
                _CPU.isExecuting = true;




            }
        }

        public static runSingleFromDisk(fileName:string, pid:number){

            if(currentlyExecuting == undefined){

                residentList[0].location = "disk";
                fileSystemDeviceDriver.createFile("process"+residentList[0].pid.toString());
                fileSystemDeviceDriver.writeFile("process"+residentList[0].pid.toString(), memManager.getOpCodeStringFromMemory(residentList[0].base, residentList[0].limit));
                Control.updateFileSystemTable();
                residentList[pid].base = 0;
                residentList[pid].limit = 255;
                residentList[pid].PC = 0;
                residentList[pid].location = "memory";




            }
            else{
                currentlyExecuting.base = 0;
                currentlyExecuting.limit = 255;
                currentlyExecuting.PC = 0;
                currentlyExecuting.location = "memory";

                residentList[pid].base = currentlyExecuting.base;
                residentList[pid].limit = currentlyExecuting.limit;
                residentList[pid].PC = currentlyExecuting.PC;
                residentList[pid].location = "memory";
                _CPU.updateCPU(currentlyExecuting);


            }


            var opCodes = fileSystemDeviceDriver.readChain(fileName);
            var opCodeStart = 0;
            var opCodeEnd = 1;
            var counter = residentList[pid].base;
            memManager.clearSegment(counter, residentList[pid].limit);
            for(var i = counter; i < residentList[pid].limit; i++){

                var codes = opCodes.charAt(opCodeStart) + opCodes.charAt(opCodeEnd);
                if(codes ==""){
                    mem.opcodeMemory[i] = "00";
                    opCodeStart += 2;
                    opCodeEnd += 2;
                }
                else {


                    mem.opcodeMemory[i] = codes;
                    opCodeStart += 2;
                    opCodeEnd += 2;
                }

            }
            currentlyExecuting = residentList[pid];
            fileSystemDeviceDriver.deleteFile(fileName);
            Control.updateFileSystemTable();
            _CPU.isExecuting = true;
        }


        //sorting for the PCBS with priority.
        public static merge(left, right){
        var result = [];

        while (left.length > 0 && right.length > 0){
            if (left[0].priority < right[0].priority){
                result.push(left.shift());
            }
            //if the prioritys are the same, FCFS them.
            else if(left[0].priority == right[0].priority){
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
    }

        /**
         * Sorts an array in ascending natural order using
         * merge sort.
         * @param {Array} items The array to sort.
         * @return {Array} The sorted array.
         */
        static  orderResidentList(items){

        // Terminal condition - don't need to do anything for arrays with 0 or 1 items
        if (items.length < 2) {
            return items;
        }

        var work = [];
          var  i;
          var  len;


        for (i=0, len=items.length; i < len; i++){
            work.push([items[i]]);
        }
        work.push([]);  //in case of odd number of items

        for (var lim=len; lim > 1; lim = Math.floor((lim+1)/2)){
            for (var j=0,k=0; k < lim; j++, k+=2){
                work[j] = this.merge(work[k], work[k+1]);
            }
            work[j] = [];  //in case of odd number of items
        }

        return work[0];
    }


        //method to switch process control blocks
        // if the counter in CPU reaches the quantum,
        // switch PCBS. also, if a 00 is reached, switch PCBs


        static contextSwitch():void{


            if(quantumCounter == quantum){

                //if theres only one process just reset the quantum
                quantumCounter = 0;


                //otherwise, set the state of the process to 0 (waiting) and then update the process control block
                //to the CPUs contents. put it back in the queue, and set the currently executing PCB to the next thing in the queue.
                // set its state to 1 for executing
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
            var nextProcess = readyQueue.index(currentlyExecuting.pid +1);
           // _Kernel.krnTrace("next pid " + nextProcess.pid);
            _Kernel.krnTrace("BREAK SWTICH ---- READY Q SIZE IS" + readyQueue.getSize());
           //  set the quantu back to 0, and then check if the ready queue has items in it. If there is, set executing
            // back to true, and then switch the PCBS, make sure to set the state to 2 for terminated before switching PCBs
                if (readyQueue.getSize() > 0) {


                   // _Kernel.krnTrace("current location = " + currentlyExecuting.location.toString() + " next = " + nextProcess.location.toString());


                        if (nextProcess != undefined || nextProcess.location == "disk") {

                            _Kernel.krnTrace("THIS IS RUNNING");
                            this.swap("", 0);

                        }

                    else {

                            _CPU.isExecuting = true;
                            _Kernel.krnTrace("LENGTH IS" + readyQueue.getSize());
                            _CPU.updatePCB(_CPU);
                            currentlyExecuting.state = 2;
                            currentlyExecuting = readyQueue.dequeue();
                            _CPU.updateCPU(currentlyExecuting);
                        }

                    // this means that there is no more processes and currently executing is the last process, just set executing to false
                    } else {
                    //_CPU.updatePCB(_CPU);
                    _CPU.isExecuting = false;
                    //currentlyExecuting == undefined;
                    _StdOut.advanceLine();
                    _StdOut.putText("Execution complete");
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                    memManager.clearSegment(currentlyExecuting.base, currentlyExecuting.limit);


                    }

                }



        }









}