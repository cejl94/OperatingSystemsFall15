/**
 * Created by cejl94 on 12/11/15.
 */

module TSOS{

    export class fileSystemDeviceDriver{


        public storageKey: string = "";
        public defaultStorageValue = "0000000000000000000000000000000000000000000000000000000000000000";

       constructor(){

       }


        public init(): void{

            for(var t = 0; t < 4; t++){
                this.storageKey+=t;
                _Kernel.krnTrace(" TSB = " + this.storageKey);
                for(var s = 0; s < 8; s++){
                    this.storageKey+=s;
                    _Kernel.krnTrace(" TSB = " + this.storageKey);
                    for(var b = 0; b < 8; b++){
                        this.storageKey+=b;
                        _Kernel.krnTrace(" TSB = " + this.storageKey);
                        sessionStorage.setItem(this.storageKey, this.defaultStorageValue );

                    }

                }

            }

        }



        public format():void{

            sessionStorage.clear();
            for(var t = 0; t < 4; t++){
                this.storageKey+=t.toString();
                _Kernel.krnTrace(" TSB = " + this.storageKey);
                for(var s = 0; s < 8; s++){
                    this.storageKey+=s;
                    _Kernel.krnTrace(" TSB = " + this.storageKey);
                    for(var b = 0; b < 8; b++){
                        this.storageKey+=b;
                        _Kernel.krnTrace(" TSB = " + this.storageKey);
                        sessionStorage.setItem(this.storageKey, this.defaultStorageValue );
                        //reset the string and add back the track and sector for the next iteration
                        this.storageKey="";
                        this.storageKey=t.toString() + s.toString();


                    }

                    this.storageKey ="";
                    this.storageKey = t.toString();
                }

                this.storageKey ="";

            }


        }

        //Method to add 0s where file data space is unused
        static finishData(value: string):string{


            for(var i = 0; i < 60 - value.length; i++){


                value+="0";
            }

            return value;

        }

        //Method to convert the given file name to hex digits
        static convertName(value: string):string{
            var newValue;
            for(var i = 0; i < value.length; i++){

                var charCode = parseInt(value.charAt(i));

                 var hex = value.charCodeAt(charCode).toString(16);
                 _Kernel.krnTrace("Value of hex = " + hex);
                newValue+=hex;


            }


            return newValue;
        }

        static createFile(value:string):void{

            //check track 0 for the 0 bit in the value.
            var zeroTrack = "0"
            for(var s = 0; s < 7; s++){
                for(var b = 0; b <7; b++){

                    var key = zeroTrack + s.toString() + b.toString();

                    if(sessionStorage.getItem(key.charAt(0) == "0")){

                        _Kernel.krnTrace("WE FOUND AN EMPTY BLOCK");
                        sessionStorage.setItem(key, this.finishData(this.convertName(value)));
                        

                    }

                }

            }




        }







    }




}
