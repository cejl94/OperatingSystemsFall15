///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (  // ALL OF THE FOLLOWING CODE COULD BE BETTER AND IT WILL BE UPDATED AT SOME POINT. BUT I DIGRESS, IT WORKS.

                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)                     ||   // enter
                        (keyCode == 8)                   ||
            (keyCode == 9)){       // backspace
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode >=219) && (keyCode <=221)) {
                if(isShifted){
                    chr = String.fromCharCode(keyCode - 96);
                }
                else{
                    chr = String.fromCharCode(keyCode - 128);
                }

                _KernelInputQueue.enqueue(chr);
            }
            else if((keyCode ==188) || (keyCode >=190) && (keyCode <=191)) {
                if(isShifted){
                    chr = String.fromCharCode(keyCode - 128);
                }
                else{
                    chr = String.fromCharCode(keyCode - 144);
                }

                _KernelInputQueue.enqueue(chr);
            }
            else if(keyCode ==192) {
                if(isShifted){
                    chr = String.fromCharCode(keyCode - 66);
                }
                else{
                    chr = String.fromCharCode(keyCode - 96);
                }

                _KernelInputQueue.enqueue(chr);
            }

            else if(keyCode ==173) {
                if(isShifted){
                    chr = String.fromCharCode(keyCode - 78);
                }
                else{
                    chr = String.fromCharCode(keyCode - 128);
                }

                _KernelInputQueue.enqueue(chr);
            }
            else if(keyCode ==222) {
                if(isShifted){
                    chr = String.fromCharCode(keyCode - 188);
                }
                else{
                    chr = String.fromCharCode(keyCode - 183);
                }

                _KernelInputQueue.enqueue(chr);
            }
            else if(keyCode ==59) {
                if(isShifted){
                    chr = String.fromCharCode(keyCode - 1);
                }
                else{
                    chr = String.fromCharCode(keyCode);
                }

                _KernelInputQueue.enqueue(chr);
            }

            else if(keyCode ==61) {
                if(isShifted){
                    chr = String.fromCharCode(keyCode - 18);
                }
                else{
                    chr = String.fromCharCode(keyCode);
                }

                _KernelInputQueue.enqueue(chr);
            }
            // Shifted and non shifted numbers
            else if(((keyCode >= 48) && (keyCode <= 57)) ) {
                if(isShifted) {
                    // CASE FOR 1, 3, 4 and 5
                    if ((keyCode == 49) || (keyCode == 51) || (keyCode == 52) || (keyCode == 53)) {
                        chr = String.fromCharCode(keyCode - 16);
                    }
                    // 2
                     if (keyCode == 50) {

                        chr = String.fromCharCode(keyCode + 14);
                    }
                    //6
                     if (keyCode == 54) {
                        chr = String.fromCharCode(keyCode + 40);
                    }
                    //7
                     if (keyCode == 55) {
                        chr = String.fromCharCode(keyCode - 17);
                    }
                    //8
                     if (keyCode == 56) {
                        chr = String.fromCharCode(keyCode - 14);
                    }
                    //9
                     if (keyCode == 57) {
                        chr = String.fromCharCode(keyCode - 17);
                    }
                    //0
                     if (keyCode == 48) {
                        chr = String.fromCharCode(keyCode - 7);
                    }
                }
                else{
                    chr = String.fromCharCode(keyCode);
                }



                _KernelInputQueue.enqueue(chr);
            }


        }
    }
}
