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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if(this.isExecuting) {
                var opcode = memManager.readCodeInMemory(this.PC);
                switch (opcode) {
                    case "A9":
                        // Take the next byte in memory, convert it to a decimal number, and store it in the accumulator
                        var next = memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(next, 16);
                        this.Acc = num;
                        this.PC += 2;
                        _Kernel.krnTrace("The accumulator value is " + this.Acc);
                        Control.updateCPUtable();

                        break;
                    case "AD":
                        // Take the next 2 bytes in memory, swap them, convert (the two byte string)
                        // to a decimal number, and load the value at memory at that decimal number into the
                        // accumulator

                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var stringThis = mem.opcodeMemory[num];
                        this.Acc = parseInt(stringThis, 16);
                        this.PC += 3;
                        _Kernel.krnTrace("The loaded accumulator value is " + this.Acc);
                        Control.updateCPUtable();
                        break;
                    case "8D":
                        // Take the next 2 bytes in memory, swap them, convert (the two byte string)
                        // to a decimal number, and store the value of the accumulator in memory at
                        // the position of that decimal number

                        var valueToStore = this.Acc.toString(16);
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        mem.opcodeMemory[num] = valueToStore;
                        this.PC += 3;
                        _Kernel.krnTrace("The stored accumulator value is " + this.Acc);
                        Control.updateCPUtable();
                        break;
                    case "6D":
                        // Load a value from memory, and add it to the accumulator
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var toAdd = mem.opcodeMemory[num];
                        var toAddNum = parseInt(toAdd, 16);
                        this.Acc = this.Acc + toAddNum;
                        this.PC += 3;
                        _Kernel.krnTrace("The added carry accumulator value is " + this.Acc);
                        Control.updateCPUtable();
                        break;
                    case "A2":
                        // Load an immediate value into the X register
                        var next = memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(next, 16);
                        this.Xreg = num;
                        this.PC += 2;
                        _Kernel.krnTrace("The X register value is " + this.Xreg);
                        Control.updateCPUtable();
                        break;
                    case "AE":
                        // Load a value from memory into the X register
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var stringThis = mem.opcodeMemory[num];
                        this.Xreg = parseInt(stringThis, 16);
                        this.PC += 3;
                        _Kernel.krnTrace("The loaded X register value is " + this.Xreg);
                        Control.updateCPUtable();
                        break;
                    case "A0":
                        // Load an immediate value into the Y register
                        var next = memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(next, 16);
                        this.Yreg = num;
                        this.PC += 2;
                        _Kernel.krnTrace("The Y register value is " + this.Yreg);
                        Control.updateCPUtable();
                        break;
                    case "AC":
                        // Load a value from memory into the Y register
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var stringThis = mem.opcodeMemory[num];
                        this.Yreg = parseInt(stringThis, 16);
                        this.PC += 3;
                        _Kernel.krnTrace("The loaded Y register value is " + this.Yreg);
                        Control.updateCPUtable();
                        break;
                    case "EA":
                        // No operation, simply increase the program counter
                        this.PC++;
                        break;
                    case "00":
                        // If this opcode is seen, stop executing the program, and place the prompt character back
                            this.isExecuting = false;
                             _StdOut.advanceLine();
                            _StdOut.putText("The program has finished running");
                             _StdOut.advanceLine();
                            _StdOut.putText(">");

                        Control.updateCPUtable();
                        prosBlock.PC = this.PC;
                        prosBlock.Acc = this.Acc;
                        prosBlock.Xreg = this.Xreg;
                        prosBlock.Yreg = this.Yreg;
                        prosBlock.Zflag = this.Zflag;
                        break;
                    case "EC":
                        // Compare the value of an address in memory to the X register
                        // If they match, Zflag = 1, else Zflag = 0;
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var stringThis = mem.opcodeMemory[num];
                        var toCompare = parseInt(stringThis, 16);
                        _Kernel.krnTrace("Is " + toCompare + " going to equal " + this.Xreg);
                        if (this.Xreg == toCompare) {
                            this.Zflag = 1;

                            this.PC += 3;

                        }
                        else{
                            this.Zflag = 0;
                            this.PC += 3;
                        }

                        _Kernel.krnTrace(" the z flag is now " + this.Zflag);
                        Control.updateCPUtable();

                        break;
                    case "D0":
                        // This is a BNE code, jumps back to the correct place in memory to loop
                        _Kernel.krnTrace("ok so here we PRORPEOgo, PC is " + this.PC);
                        ++this.PC;
                        var swap = memManager.readCodeInMemory(this.PC);
                        var num = parseInt(swap, 16);
                        if(this.Zflag == 0){
                            _Kernel.krnTrace("ok so here we go, PC is " + this.PC);
                            var jump = this.PC + num;
                            _Kernel.krnTrace("the jump variable is " + jump.toString());
                            if(jump > 255){
                                this.PC = jump -255;

                            }
                            else{
                                _Kernel.krnTrace("ok so MAYBE WE GOT IT here we go, PC is " + this.PC);
                                this.PC = jump + 1;
                                _Kernel.krnTrace("ok so MAYBE WE GOT IT AFTERWARDS here we go, PC is " + this.PC);

                            }


                        }
                        else{
                            this.PC+=1;
                        }
                        Control.updateCPUtable();

                        break;
                    case "EE":
                        // Grab a value from an address in memory and add one to it, then put it back in memory
                        var swap = memManager.readCodeInMemory(this.PC + 2) + memManager.readCodeInMemory(this.PC + 1);
                        var num = parseInt(swap, 16);
                        var stringThis = mem.opcodeMemory[num];
                        var toIncrement = parseInt(stringThis, 16);
                        toIncrement += 1;
                        var placeBack = toIncrement.toString(16);
                        mem.opcodeMemory[num] = placeBack;
                        this.PC += 3;
                        _Kernel.krnTrace("the byte is now " + parseInt(mem.opcodeMemory[num], 16));
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
                            var place = this.Yreg;
                            while(mem.opcodeMemory[place] != "00"){
                                _Kernel.krnTrace("printing " + String.fromCharCode(parseInt(mem.opcodeMemory[place],16)));
                                var ascii = String.fromCharCode(parseInt(mem.opcodeMemory[place],16))
                                _StdOut.putText(ascii);
                                place++;

                            }


                            this.PC++;
                        }


                        if(this.Xreg > 2 || this.Xreg < 1){
                            _StdOut.putText("Syscall will not occur when x register is neither 1 or 2");
                        }
                        Control.updateCPUtable();
                            break;
                    default:
                        //more of a debugging statement currently
                        _StdOut.putText("the code at "  + mem.opcodeMemory[this.PC] + " is incorrect")
                        this.isExecuting = false;

                }
            }




        }
    }
}
