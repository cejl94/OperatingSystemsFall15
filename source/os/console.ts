///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        public matchArray = [];
        public historyBuffer = [];
        public bufferIndex = -1;
        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }


        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        //method that implements scrolling in the CLI
        // CHANGED IT TO NOT A SCROLLBAR ALAN ARE YOU HAPPY NOW
        private scrollableCanvas(): void {

            if(this.currentYPosition > _Canvas.height){
               var myCanvas= _DrawingContext.getImageData(0, _DefaultFontSize + 5 , _Canvas.width, _Canvas.height);
                _DrawingContext.putImageData(myCanvas, 0, 0);
               this.currentYPosition = _Canvas.height - _DefaultFontSize;
            }

        }

        private tabComplete(): void{

            var goodBuffer = this.buffer.replace("\t", "");
            _Kernel.krnTrace("buffer is: " + goodBuffer+".");

            for (var i = 0; i < _OsShell.commandList.length; i++) {

                if (_OsShell.commandList[i].command.startsWith(goodBuffer)) {
                    _Kernel.krnTrace("Command: " +  _OsShell.commandList[i].command);

                    this.matchArray[this.matchArray.length] = _OsShell.commandList[i].command;

                }

            }
            if(this.matchArray.length == 0){
                this.putText("There are no commands starting with this letter");
                this.advanceLine();
                this.putText(">" + this.buffer.trim());


            }

            if(this.matchArray.length == 1){

                this.buffer = this.matchArray[0].toString();
                _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                this.currentXPosition = 0;
                this.putText(">" + this.buffer.trim());

            }
            if(this.matchArray.length > 1){
                _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                this.currentXPosition = 0;
                this.putText(">" + this.buffer.trim());
                this.advanceLine();
                this.putText(this.matchArray.toString());
                this.advanceLine();
                this.putText(">" + this.buffer.trim());



            }

            this.matchArray = [];

        }

        public backspace(): void{
            //split the buffer into a character array
            var tempBuff = this.buffer.split('');
            //create a new buffer that is empty
            var newBuff = "";
            //loop through the array and add everything from the original buffer
            //with the exception of the last character (the one that should be deleted)
            for(var i = 0; i < tempBuff.length - 1; i++){
                newBuff += tempBuff[i];
            }
            //set this.buffer to this new buffer I've made
            this.buffer = newBuff;

            _Kernel.krnTrace("Buffer= "+this.buffer);
            // print it on the screen and deal with the most unholy annoyance EVER (original buffer stays on screen).
            _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
            this.currentXPosition = 0;

            this.putText(">" + newBuff);

        }

        /*public historyUp(): void{

            if(this.bufferIndex < 0){
                //if you havent pressed up or down yet, and you start with up
                // make the buffer equal to the last command that was entered
                this.bufferIndex = this.historyBuffer.length-1;
                this.buffer = this.historyBuffer[this.bufferIndex].trim();
                _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                this.currentXPosition = 0;
                this.putText(">" + this.buffer.trim());

            }
            if(this.bufferIndex == 0){
                //if you are at the first command that was entered,
                // you want to stay at that position, dont exit the history buffer

                this.bufferIndex = 0;
                this.buffer = this.historyBuffer[this.bufferIndex].trim();
                _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                this.currentXPosition = 0;
                this.putText(">" + this.buffer.trim());
            }
            if(this.bufferIndex > 0 && this.bufferIndex <= this.historyBuffer.length){
                this.bufferIndex -= 1;
                this.buffer = this.historyBuffer[this.bufferIndex].trim();
                _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                this.currentXPosition = 0;
                this.putText(">" + this.buffer.trim());

            }



        }

        public historyDown(): void{

            //if it is at the last command in history
            if(this.bufferIndex < 0){
                // if you start by pressing down, dont do anything
                _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                this.currentXPosition = 0;
                this.putText(">" + this.buffer.trim());

            }
            if(this.bufferIndex == 0 || (this.bufferIndex > 0 && this.bufferIndex < (this.historyBuffer.length - 1))){
                // if your bufferIndex is between 0 and length - 1, then go to the
                // next command in the list and print it and put it in the buffer
                this.bufferIndex += 1;
                _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                this.currentXPosition = 0;
                this.buffer = this.historyBuffer[this.bufferIndex].trim();
                this.putText(">" + this.historyBuffer[this.bufferIndex].trim());
            }
            if(this.bufferIndex == this.historyBuffer.length -1){

                    //if the bufferIndex is past the boundary of length - 1, just print out
                    //the command at length - 1 and keep the index and buffer at that point
                    this.bufferIndex += 1;
                    this.buffer = "";
                    _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                    this.currentXPosition = 0;
                    this.putText(">" + this.buffer.trim());

            }



        }

*/
        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.

                var chr = _KernelInputQueue.dequeue();
                // Logic and implementation of tab complete
                if(chr === String.fromCharCode(9)) {

                    this.tabComplete();

                }

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    this.historyBuffer[this.historyBuffer.length] = this.buffer.trim();
                    _OsShell.handleInput(this.buffer.trim());
                    // ... and reset our buffer.
                    this.buffer  = "";
                }

                //This is the backspace logic and implementation
                if(chr === String.fromCharCode(8)){
                  this.backspace();
                }

               /* if(chr === String.fromCharCode(17)){
                    _Kernel.krnTrace(" this is current index " + this.bufferIndex);
                    _Kernel.krnTrace(" this is the history buffer " + this.historyBuffer.toString())
                    _Kernel.krnTrace(" this is current buffer " + this.buffer);
                    this.historyUp();

                }

                if(chr === String.fromCharCode(18)){
                    _Kernel.krnTrace(" this is current index " + this.bufferIndex);
                    _Kernel.krnTrace(" this is the history buffer " + this.historyBuffer.toString())
                    _Kernel.krnTrace(" this is current buffer " + this.buffer);
                    this.historyDown();
                }
*/



                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }


                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            this.scrollableCanvas();
            // TODO: Handle scrolling. (iProject 1)
        }

        //THIS WILL BE WHERE THE LOGIC FOR TABBING/HISTORY GOES - THIS ALSO TESTS COMMITTING TO MY NEW BRANCH
        // FOR PROJECT 1
    }
 }
