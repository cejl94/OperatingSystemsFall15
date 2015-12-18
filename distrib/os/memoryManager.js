var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager() {
            this.counter = 0;
            this.baseReg = 0;
            this.limitReg = 255;
            this.memoryPlace = this.baseReg;
        }
        // this method will actually load the user input into memory
        memoryManager.prototype.loadInputToMemory = function (instructions, priority) {
            //_StdOut.putText("memoryplace LOoaded, pid = " + this.memoryPlace);
            // has the program that was loaded into memory breached its respective bounds?
            // for now check after its been added in, if it did breach into the next block of memory, clear the memory
            //
            if (instructions.length / 2 > 256) {
                _StdOut.putText("Memory out of bounds error: program too long. Reload program");
            }
            else {
                // first check if you're trying to add into memory that doesnt exist
                if (this.limitReg > 767) {
                    // load a program to the disk in this space.
                    prosBlock = new TSOS.pcb();
                    prosBlock.init(pid, 0, 0, 0, priority, "disk");
                    residentList.push(prosBlock);
                    TSOS.fileSystemDeviceDriver.createFile("process" + prosBlock.pid.toString());
                    _StdOut.advanceLine();
                    TSOS.fileSystemDeviceDriver.writeFile("process" + prosBlock.pid.toString(), instructions);
                    TSOS.Control.updateFileSystemTable();
                    pid++;
                    _StdOut.putText("Program loaded to disk");
                }
                else {
                    // Loop through each two character "byte" of user input
                    for (var i = 0; i < instructions.length; i += 2) {
                        // concat two characters to make a byte, and then store in it memory
                        var buildOpCode = instructions.charAt(i) + instructions.charAt(i + 1);
                        //start loading the program into memory at the base register and go from there.
                        mem.opcodeMemory[this.memoryPlace] = buildOpCode;
                        this.memoryPlace++;
                    }
                    prosBlock = new TSOS.pcb();
                    //given that load increases the base and the limit after the load is complete, we must get the previous base and limit
                    prosBlock.init(pid, this.baseReg, this.limitReg, this.counter, priority, "memory");
                    _StdOut.putText("Program successfully loaded, pid = " + prosBlock.pid);
                    _Kernel.krnTrace("Program successfully loaded, PRIORITY = " + prosBlock.priority.toString());
                    _StdOut.advanceLine();
                    _StdOut.putText("Base = " + prosBlock.base + " Limit = " + prosBlock.limit);
                    //_StdOut.putText("Memory base = " + prosBlock.base + " Memory Limit = " + prosBlock.limit );
                    _Kernel.krnTrace("resident list length" + residentList.length);
                    residentList.push(prosBlock);
                    _Kernel.krnTrace("resident list pid = " + residentList[residentList.length - 1].pid);
                    _Kernel.krnTrace("resident list PC = " + residentList[residentList.length - 1].PC);
                    pid++;
                    TSOS.Control.updateMemoryTable();
                    // after each load, set the new base equal to what it should be for the next block (limit + 1)
                    // same for limit - increase the limitReg by 256.
                    // upon next call to load, program will be loaded in the correct spots
                    this.counter = this.limitReg + 1;
                    this.baseReg = this.limitReg + 1;
                    this.limitReg = this.limitReg + 256;
                    this.memoryPlace = this.baseReg;
                }
            }
        };
        memoryManager.prototype.readCodeInMemory = function (address) {
            return mem.opcodeMemory[address];
        };
        memoryManager.prototype.clearMemory = function () {
            for (var i = 0; i < mem.opcodeMemory.length; i++) {
                mem.opcodeMemory[i] = "00";
            }
            //reset all tables that were updated, the ready queue and resident lsit, and set the PC, base, limit and index
            //counters back to their originals. For now pid also sets back to 0
            _CPU.resetCPU();
            TSOS.Control.updateMemoryTable();
            TSOS.Control.updateCPUtable();
            residentList = [];
            readyQueue = new TSOS.Queue();
            this.counter = 0;
            this.baseReg = 0;
            this.limitReg = 255;
            this.memoryPlace = this.baseReg;
        };
        memoryManager.prototype.clearSegment = function (base, limit) {
            for (var i = base; i < limit; i++) {
                mem.opcodeMemory[i] = "00";
            }
            TSOS.Control.updateMemoryTable();
        };
        memoryManager.prototype.findFreeSegment = function () {
            for (var i = 0; i < mem.opcodeMemory.length; i++) {
            }
        };
        memoryManager.prototype.getOpCodeStringFromMemory = function (base, limit) {
            var opCodeString = "";
            for (var i = base; i < limit; i++) {
                _Kernel.krnTrace("CODES FOR SWAPPING ARE " + mem.opcodeMemory[i]);
                opCodeString += mem.opcodeMemory[i];
            }
            _Kernel.krnTrace("OPCODE STRIGNG PRE HEX MEM IS " + opCodeString);
            _Kernel.krnTrace("OPCODE STRING FROM MEMORY IS " + TSOS.fileSystemDeviceDriver.convertStringToHex(opCodeString));
            return opCodeString;
        };
        return memoryManager;
    })();
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
