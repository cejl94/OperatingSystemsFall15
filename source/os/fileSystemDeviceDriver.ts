/**
 * Created by cejl94 on 12/11/15.
 */

module TSOS{

    export class fileSystemDeviceDriver{


        //public storageKey: string = "";
        //60 0s to begin
        public defaultStorageValue = "000000000000000000000000000000000000000000000000000000000000";
        public mbrStorageValue ="MBR000000000000000000000000000000000000000000000000000000000";


        constructor(){

        }


        public init(): void{

            sessionStorage.clear();
            for(var t = 0; t < 4; t++){

                for(var s = 0; s < 8; s++){

                    for(var b = 0; b < 8; b++){
                        var storageKey = t.toString() + s.toString() + b.toString();
                        if(storageKey=="000"){
                            sessionStorage.setItem(storageKey, "1" + "000" + this.mbrStorageValue +this.defaultStorageValue);
                        }
                        else{
                            sessionStorage.setItem(storageKey, "0" + "000" + this.defaultStorageValue + this.defaultStorageValue);
                        }
                    }
                }

            }

        }



        //format really just resets the sessions storage
        public static format():void{

            var defaultStorageValue = "000000000000000000000000000000000000000000000000000000000000";
            var mbrStorageValue ="MBR000000000000000000000000000000000000000000000000000000000";
            sessionStorage.clear();
            for(var t = 0; t < 4; t++){

                for(var s = 0; s < 8; s++){

                    for(var b = 0; b < 8; b++){
                        var storageKey = t.toString() + s.toString() + b.toString();
                        if(storageKey=="000"){
                            sessionStorage.setItem(storageKey, "1" + "000" + mbrStorageValue+defaultStorageValue);
                        }
                        else{
                            sessionStorage.setItem(storageKey, "0" + "000" + defaultStorageValue +defaultStorageValue );
                        }
                    }
                }

            }


        }

        //Method to add 00s where file data space is unused
        public static finishData(value: string):string{

            _Kernel.krnTrace(" length of before string is " + value.length);
            var finalData = value;

            for(var i = 0; i < 60 - (value.length/2); i++){


                finalData+="00";
            }

            _Kernel.krnTrace("This is the value of the whole string" + finalData);
            _Kernel.krnTrace(" length of string is " + finalData.length);
            return finalData;

        }




        //Method to convert the given file name to hex digits
        public static convertStringToHex(value: string):string{
            var newValue ="";
            for(var i = 0; i < value.length; i++){

                //_Kernel.krnTrace("char = " + value.toString().charAt(i));
               // var charCode = parseInt(value.charAt(i));
               // _Kernel.krnTrace("charcode= " + value.toString().charCodeAt(i));

                var hex = value.toString().charCodeAt(i).toString(16);
               // _Kernel.krnTrace("Value of hex = " + hex);
                newValue+=hex.toString();



            }


           // _Kernel.krnTrace("heres the string" + newValue);
            return newValue;
        }

        public static convertHexToString(value:string):string{
            var newValue="";
            for(var i = 0; i < value.length; i+=2) {
                var hexCode = (value.charAt(i) + value.charAt(i + 1)).toString();
              //  _Kernel.krnTrace("HEX CODE = " + hexCode);
                var ascii = parseInt(hexCode, 16);

               // _Kernel.krnTrace("CODE FOR ZEROZERO BECOMES= " + parseInt()
                _Kernel.krnTrace("ASCII = " +ascii)


                var string = String.fromCharCode(ascii);

               // if(string.length == 1){
               //     string = "0" + string;
               // }

                newValue+= string;
            }

            return newValue;
        }

        //returns the TSB number for an open data block
        public static checkDirectoryTrack():string {


            var zeroTrack = "0";
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {

                    var directoryKey = zeroTrack + s.toString() + b.toString();

                    if (sessionStorage.getItem(directoryKey).charAt(0) == "0") {

                        //_Kernel.krnTrace("WE FOUND AN EMPTY BLOCK" + directoryKey);

                        return directoryKey;


                    }

                }

            }


            return "None";

        }

        public static checkDataTracksForSpace():string{

            for(var t = 1; t < 4; t++){
                for(var s =0; s <8; s++){
                    for(var b = 0; b < 8; b++){
                        var dataTrackKey = t.toString() + s.toString() + b.toString();

                        if(sessionStorage.getItem(dataTrackKey).charAt(0) =="0"){
                            return dataTrackKey;
                        }
                    }

                }
            }

            return "None";
        }

        //checks to see if the filename matches an existing file, returns true if so and false otherwise
        public static checkDirectoryTrackForName(fileName:string):boolean{

            var fileN = this.convertStringToHex(fileName);
           // _Kernel.krnTrace("FILE NAME IN HEX LENGTH IS " + fileN.length);
            var zeroTrack = "0";
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {

                    var directoryKey = zeroTrack + s.toString() + b.toString();

                   // _Kernel.krnTrace("DIR TSB IS " + directoryKey);

                  //  _Kernel.krnTrace("THIS IS WHAT IM TRYING TO MATCH " + sessionStorage.getItem(directoryKey).slice(4, fileN.length + 4));

                    if (sessionStorage.getItem(directoryKey).slice(4, fileN.length+4) == fileN)
                    {

                        return true;


                    }


                }


            }
            return false;


        }


        //method to determine how many data blocks are needed given the length of a string to be written
        public static determineNumberOfBlocks(value:string):number{

            //Math.ceil(value.length/60);


            return Math.ceil(value.length/60);




        }


        //returns the TSB number for an open data block
        public static checkDataTracks():string {

            for (var t = 1; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        var trackKey = t.toString() + s.toString() + b.toString();

                        if (sessionStorage.getItem(trackKey).charAt(0) =="0"){
                            //if the data block is free, put something there

                            return trackKey;


                        }


                    }
                }

            }




        }


        //returns the data TSB for the first sata block for a file
        public static checkDirectoryForNameDataTSB(fileName:string):string{


            //convert the name to hex for easier matching

            var nameToMatch = this.convertStringToHex(fileName);
            _Kernel.krnTrace("MATCH NAME IS " + nameToMatch);
            var zeroTrack = "0";
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {

                    var directoryKey = zeroTrack + s.toString() + b.toString();

                    _Kernel.krnTrace("HERES THE SLICED STRING " +  sessionStorage.getItem(directoryKey).slice(4, nameToMatch.length+4));
                    if (sessionStorage.getItem(directoryKey).slice(4, nameToMatch.length+4) == nameToMatch) {

                        _Kernel.krnTrace("WE THE BLOCK WITH THE MATCHING NAME"  + directoryKey);
                        //IF we have the block with the matching name, what we REALLY want is the second through 4th
                        //data bits, because thats the corresponding DataTrackTSB

                        //this is the tsb where we can start to write our file
                        var dataTrackTSB = sessionStorage.getItem(directoryKey).slice(1, 4);
                        //sessionStorage.setItem(dataTrackTSB, 1+"")

                        return dataTrackTSB;


                    }

                }

            }

        }

        // returns the tsb of the directory block a file name is stored in
        public static getDirectoryBlockTSB(fileName:string):string{

            var nameToMatch = this.convertStringToHex(fileName);
            _Kernel.krnTrace("MATCH NAME IS " + nameToMatch);
            var zeroTrack = "0";
            for(var s = 0; s < 8; s++){
                for(var b = 0; b < 8; b++){

                    var directoryKey = zeroTrack + s.toString() + b.toString();

                    _Kernel.krnTrace("HERES THE SLICED STRING " +  sessionStorage.getItem(directoryKey).slice(4, nameToMatch.length+4));
                    if (sessionStorage.getItem(directoryKey).slice(4, nameToMatch.length+4) == nameToMatch) {

                        return directoryKey;

                    }
                }
            }



        }

        //loop through tsbs and set their meta bits to one depending on how many
        //blocks a chain will need
        public static setChain(fileData:string, fileName:string):void{

            var defaultStorageValue ="000000000000000000000000000000000000000000000000000000000000";
            var firstDataBlock = this.checkDirectoryForNameDataTSB(fileName);
            var blocksNeeded = this.determineNumberOfBlocks(fileData);
            _Kernel.krnTrace("Number of blocks neeede is " + blocksNeeded);

            for(var i = 1; i < blocksNeeded; i++){
                //_Kernel.krnTrace("ITERATED LOOPS " + firstDataBlock);
                var tracks = this.checkDataTracks();
               // _Kernel.krnTrace("TRACKS OPEN IS " + tracks);
                sessionStorage.setItem(firstDataBlock, "1" + tracks + defaultStorageValue + defaultStorageValue);
                sessionStorage.setItem(tracks, "1" + "000" + defaultStorageValue + defaultStorageValue);
                //_Kernel.krnTrace("Current TSB = " + firstDataBlock + " AND ITS LINK IS " + sessionStorage.getItem(firstDataBlock).slice(1,4));
                firstDataBlock = this.getNextTSB(firstDataBlock);
                //_Kernel.krnTrace("DEBUG STATEMENT = " + firstDataBlock);

            }



        }

        //get the next TSB in a chain
        public static getNextTSB(TSB:string):string{
            //gets the next TSB in a chain.
            return sessionStorage.getItem(TSB).slice(1,4);
        }

        public static deleteChain(fileName:string):void{

            var defaultStorageValue ="000000000000000000000000000000000000000000000000000000000000";
            var firstDataBlock = this.checkDirectoryForNameDataTSB(fileName);
            //var blocksNeeded = this.determineNumberOfBlocks(fileData);
            var savedTSB= "";

            while(this.getNextTSB(firstDataBlock) !="000"){
                savedTSB = this.getNextTSB(firstDataBlock);
                sessionStorage.setItem(firstDataBlock, defaultStorageValue+defaultStorageValue);
                firstDataBlock = savedTSB;

            }
            sessionStorage.setItem(firstDataBlock, defaultStorageValue + defaultStorageValue);
        }

        public static writeChain(fileData:string, fileName:string):void {
            var defaultStorageValue = "000000000000000000000000000000000000000000000000000000000000";
            var firstDataBlock = this.checkDirectoryForNameDataTSB(fileName);
            var blocksNeeded = this.determineNumberOfBlocks(fileData);
            var startSubString = 0;
            var endSubString = 60;


            while (this.getNextTSB(firstDataBlock) != "000") {

                var substring = this.convertStringToHex(fileData.slice(startSubString, endSubString));

                _Kernel.krnTrace("START SUBSTRING = " + startSubString + " END SUBSTRING = " + endSubString);
                _Kernel.krnTrace("SUBSTRING = " + substring + "ITS LENGTH IS " + substring.length);
               // var substring = hex.substr(startSubString, endSubString);
               // _Kernel.krnTrace("SUBSTRIGN IS " + substring);
                sessionStorage.setItem(firstDataBlock, "1" + this.getNextTSB(firstDataBlock) + substring);
                firstDataBlock = this.getNextTSB(firstDataBlock);
                startSubString += 60;
                endSubString += 60;

               // _Kernel.krnTrace("SUBSTRING AFTER SETTING THE COUNTERS =" + substring)

            }

                sessionStorage.setItem(firstDataBlock, "1"+ "000" + this.finishData(this.convertStringToHex(fileData.slice(startSubString))));

            //}


        }

        public static readChain(fileName:string):string{

            if (this.checkDirectoryTrackForName(fileName) == false) {

                _StdOut.putText("File " + fileName + " does not exist.");
            }
            else {

                var defaultStorageValue = "000000000000000000000000000000000000000000000000000000000000";
                var firstDataBlock = this.checkDirectoryForNameDataTSB(fileName);
                //var blocksNeeded = this.determineNumberOfBlocks(fileData);
                var data = "";
                while (this.getNextTSB(firstDataBlock) != "000") {
                    var concat = sessionStorage.getItem(firstDataBlock).slice(4);
                    data += concat;
                    firstDataBlock = this.getNextTSB(firstDataBlock);


                }

                data += sessionStorage.getItem(firstDataBlock).slice(4);
                var ascii = this.convertHexToString(data);

                _Kernel.krnTrace("returned " + ascii);
                return ascii;
                //sessionStorage.setItem(firstDataBlock, "1"+ "000" + this.finishData(this.convertStringToHex(fileData.substr(startSubString))));

            }

        }

        //Create a file with the name that was entered
        public static createFile(fileName:string):void {

            if(this.checkDirectoryTrackForName(fileName)==true){

                _StdOut.putText("File " + fileName + " already exists" );
            }
            else if(this.checkDirectoryTrack() == "None"){
                _StdOut.putText("No space available");
            }
            else {


                var defaultInUseTrackValue = "000000000000000000000000000000000000000000000000000000000000000";


                //the key here is the TSB of the first free directory track
                //the value here is the Meta bit being changed to 1, the TSB of the first open data block, and then the hex value of
                //the name that was entered followed by the appropriate number of zeros.
                sessionStorage.setItem(this.checkDirectoryTrack(), "1" + this.checkDataTracks() + this.finishData(this.convertStringToHex(fileName)));
                //also, set the META bit of that data block to 1.
                sessionStorage.setItem(this.checkDataTracks(), "1" + defaultInUseTrackValue + defaultInUseTrackValue + "0");

            }

        }

        //writes the data specified in quotes to the file name that was entered
        public static writeFile(fileName:string, fileData:string):void{

            if (this.checkDirectoryTrackForName(fileName) == false) {

                _StdOut.putText("File " + fileName + " does not exist.");
            }
            else if(this.checkDataTracksForSpace()=="None"){

                _StdOut.putText("No space available.");

            }


            else {



                    //we want the TSB of the first data track block associated with the file
                    // then we want to take the string we entered, convert it to hex,
                    // and set the item value to that new string entered.
                    //if the string is greater than 120 characters(hex is 2 characters per byte, 60 bytes),
                    //then find the next open block, and set the value to the sliced string of the original.


                    // if the fileData is not longer than 60 bytes, then dont worry about chaining to a new data track
                    if (this.convertStringToHex(fileData).length <= 120) {

                        sessionStorage.setItem(this.checkDirectoryForNameDataTSB(fileName), "1" + "000" + this.finishData(this.convertStringToHex(fileData)));

                    }
                    else {
                        this.setChain(fileData, fileName);
                        this.writeChain(fileData, fileName);

                    }
               // }
            }

        }

        public static deleteFile(fileName:string):void {

            if (this.checkDirectoryTrackForName(fileName) == false) {

                _StdOut.putText("File " + fileName + " does not exist.");
            }
            else {

                var defaultStorageValue = "0000000000000000000000000000000000000000000000000000000000000000";

                this.deleteChain(fileName);

                sessionStorage.setItem(this.getDirectoryBlockTSB(fileName), defaultStorageValue + defaultStorageValue);

            }
        }

        public static readFile(fileName:string):void{

            if (this.checkDirectoryTrackForName(fileName) == false) {

                _StdOut.putText("File " + fileName + " does not exist.");
            }
            else {


                _Kernel.krnTrace("READ STRING IS" + this.readChain(fileName));
                _StdOut.putText(this.readChain(fileName));
            }


        }

        public static ls():void{

            var zeroTrack = "0";
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {

                    var directoryKey = zeroTrack + s.toString() + b.toString();

                   if(sessionStorage.getItem(directoryKey).charAt(1) == "1"){

                       _StdOut.putText(this.convertHexToString(sessionStorage.getItem(directoryKey).slice(4)));
                       _StdOut.advanceLine();
                   }

                }

            }

        }



    }

}