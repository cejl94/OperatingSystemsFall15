///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        //update the CPU with the contents of the process control block that is about to be executing
        Cpu.prototype.updateCPU = function (currentlyExecuting) {
            this.PC = currentlyExecuting.PC;
            this.Acc = currentlyExecuting.Acc;
            this.Xreg = currentlyExecuting.Xreg;
            this.Yreg = currentlyExecuting.Yreg;
            this.Zflag = currentlyExecuting.Zflag;
        };
        Cpu.prototype.updatePCB = function (mainCPU) {
            currentlyExecuting.PC = this.PC;
            currentlyExecuting.Acc = this.Acc;
            currentlyExecuting.Xreg = this.Xreg;
            currentlyExecuting.Yreg = this.Yreg;
            currentlyExecuting.Zflag = this.Zflag;
        };
        Cpu.prototype.printCPU = function () {
            _Kernel.krnTrace("Accumulator value is " + this.Acc);
            _Kernel.krnTrace("Xreg value is " + this.Xreg);
            _Kernel.krnTrace("Yreg value is " + this.Yreg);
            _Kernel.krnTrace("Zflag value is " + this.Zflag);
        };
        Cpu.prototype.resetCPU = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            //if(readyQueue.isEmpty()){
            //    this.isExecuting = false;
            //}
            /* if(currentlyExecuting.limitCounter > currentlyExecuting.limit){
 
                 _Kernel.krnTrace("Bounds have been breached");
                 this.isExecuting = false;
             }*/
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (this.isExecuting) {
                var opcode = memManager.readCodeInMemory(this.PC);
                _Kernel.krnTrace("PROGRAM COUNTER IS" + _CPU.PC + " OPCODE IS " + mem.opcodeMemory[this.PC]);
                switch (opcode) {
                    case "A9":
                        // Take the next byte in memory, convert it to a decimal number, and store it in the accumulator
                        var next = memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(next, 16);
                        this.Acc = num;
                        this.PC += 2;
                        //_Kernel.krnTrace("The accumulator value is " + this.Acc);
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "AD":
                        // Take the next 2 bytes in memory, swap them, convert (the two byte string)
                        // to a decimal number, and load the value at memory at that decimal number into the
                        // accumulator
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var stringThis = mem.opcodeMemory[num + currentlyExecuting.base];
                        this.Acc = parseInt(stringThis, 16);
                        this.PC += 3;
                        // _Kernel.krnTrace("The loaded accumulator value is " + this.Acc);
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "8D":
                        // Take the next 2 bytes in memory, swap them, convert (the two byte string)
                        // to a decimal number, and store the value of the accumulator in memory at
                        // the position of that decimal number
                        var valueToStore = this.Acc.toString(16);
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        // limit testing
                        if (num + currentlyExecuting.base <= currentlyExecuting.limit) {
                            mem.opcodeMemory[num + currentlyExecuting.base] = valueToStore;
                            this.PC += 3;
                        }
                        else {
                            _StdOut.putText("Memory breached. Terminating process ");
                            _StdOut.advanceLine();
                            _OsShell.shellKill(currentlyExecuting.pid);
                        }
                        // _Kernel.krnTrace("The stored accumulator value is " + this.Acc);
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updateMemoryTable();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "6D":
                        // Load a value from memory, and add it to the accumulator
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var toAdd = mem.opcodeMemory[num + currentlyExecuting.base];
                        var toAddNum = parseInt(toAdd, 16);
                        this.Acc = this.Acc + toAddNum;
                        this.PC += 3;
                        // _Kernel.krnTrace("The added carry accumulator value is " + this.Acc);
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "A2":
                        // Load an immediate value into the X register
                        var next = memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(next, 16);
                        this.Xreg = num;
                        this.PC += 2;
                        // _Kernel.krnTrace("The X register value is " + this.Xreg);
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "AE":
                        // Load a value from memory into the X register
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var stringThis = mem.opcodeMemory[num + currentlyExecuting.base];
                        this.Xreg = parseInt(stringThis, 16);
                        this.PC += 3;
                        //_Kernel.krnTrace("The loaded X register value is " + this.Xreg);
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "A0":
                        // Load an immediate value into the Y register
                        var next = memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(next, 16);
                        this.Yreg = num;
                        this.PC += 2;
                        //_Kernel.krnTrace("The Y register value is " + this.Yreg);
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "AC":
                        // Load a value from memory into the Y register
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var stringThis = mem.opcodeMemory[num + currentlyExecuting.base];
                        this.Yreg = parseInt(stringThis, 16);
                        this.PC += 3;
                        //_Kernel.krnTrace("The loaded Y register value is " + this.Yreg);
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "EA":
                        // No operation, simply increase the program counter
                        this.PC++;
                        break;
                    case "00":
                        //if this opcode is seen, we want to update the currently executing PCB with the
                        //content of the CPU
                        //then we want to switch to the next process, and NOT enqueue this process again
                        TSOS.Control.updateCPUtable();
                        this.updatePCB(_CPU);
                        //processTerminated = true;
                        this.isExecuting = false;
                        TSOS.cpuScheduler.contextSwitchBreak();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "EC":
                        // Compare the value of an address in memory to the X register
                        // If they match, Zflag = 1, else Zflag = 0;
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var stringThis = mem.opcodeMemory[num + currentlyExecuting.base];
                        var toCompare = parseInt(stringThis, 16);
                        //_Kernel.krnTrace("Is " + toCompare + " going to equal " + this.Xreg);
                        if (this.Xreg == toCompare) {
                            this.Zflag = 1;
                            this.PC += 3;
                        }
                        else {
                            this.Zflag = 0;
                            this.PC += 3;
                        }
                        //_Kernel.krnTrace(" the z flag is now " + this.Zflag);
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "D0":
                        // This is a BNE code, jumps back to the correct place in memory to loop
                        //_Kernel.krnTrace("ok so here we PRORPEOgo, PC is " + this.PC);
                        ++this.PC;
                        var swap = memManager.readCodeInMemory(this.PC);
                        var num = parseInt(swap, 16);
                        if (this.Zflag == 0) {
                            // _Kernel.krnTrace("ok so here we go, PC is " + this.PC);
                            var jump = this.PC + num;
                            // _Kernel.krnTrace("the jump variable is " + jump.toString());
                            if (jump > currentlyExecuting.limit) {
                                this.PC = jump - 255;
                            }
                            else {
                                //_Kernel.krnTrace("ok so MAYBE WE GOT IT here we go, PC is " + this.PC);
                                this.PC = jump + 1;
                            }
                        }
                        else {
                            this.PC += 1;
                        }
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updatePcbTable();
                        break;
                    case "EE":
                        // Grab a value from an address in memory and add one to it, then put it back in memory
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var stringThis = mem.opcodeMemory[num + currentlyExecuting.base];
                        var toIncrement = parseInt(stringThis, 16);
                        toIncrement += 1;
                        var placeBack = toIncrement.toString(16);
                        mem.opcodeMemory[num + currentlyExecuting.base] = placeBack;
                        this.PC += 3;
                        //_Kernel.krnTrace("the byte is now " + parseInt(mem.opcodeMemory[num + currentlyExecuting.base], 16));
                        break;
                    case "FF":
                        // If Xreg is 1, print out the Y register
                        if (this.Xreg == 1) {
                            _Kernel.krnTrace("printing " + this.Yreg.toString());
                            _StdOut.putText(this.Yreg.toString());
                            this.PC++;
                        }
                        // If Xreg is 2, print out the 00 terminated string starting at the specified address in memory
                        if (this.Xreg == 2) {
                            // this gets the position in memory of the first asciicharacter
                            var place = this.Yreg + currentlyExecuting.base;
                            while (mem.opcodeMemory[place] != "00") {
                                _Kernel.krnTrace("printing " + String.fromCharCode(parseInt(mem.opcodeMemory[place], 16)));
                                var ascii = String.fromCharCode(parseInt(mem.opcodeMemory[place], 16));
                                _StdOut.putText(ascii);
                                place++;
                            }
                            this.PC++;
                        }
                        if (this.Xreg > 2 || this.Xreg < 1) {
                            _StdOut.putText("Syscall will not occur when x register is neither 1 or 2");
                        }
                        TSOS.Control.updateCPUtable();
                        TSOS.Control.updatePcbTable();
                        break;
                    default:
                        //more of a debugging statement currently
                        _Kernel.krnTrace("the code at " + mem.opcodeMemory[this.PC] + " is incorrect");
                        this.isExecuting = false;
                }
            }
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
