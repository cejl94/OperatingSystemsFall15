/**
 * Created by cejl94 on 10/18/15.
 */
module TSOS {

    export class memory {




        // memory is represented by an array of strings
        constructor(public opcodeMemory = []) {

        }



        // initalize the length to 256
        public init():void {
             for (var i = 0; i < 256; i++){
                 this.opcodeMemory[i] = "00";
                             }

        }





    }
}