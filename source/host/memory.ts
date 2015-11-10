/**
 * Created by cejl94 on 10/18/15.
 */
module TSOS {

    export class memory {




        // memory is represented by an array of strings
        constructor(public opcodeMemory = []) {

        }



        // initalize the length to 256
        // as stated in lab 5, increase memory to 768
        public init():void {
             for (var i = 0; i < 768; i++){
                 this.opcodeMemory[i] = "00";
                             }

        }





    }
}