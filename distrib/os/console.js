///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.matchArray = [];
            this.historyBuffer = [];
            this.bufferIndex = -1;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        //method that implements scrolling in the CLI
        // CHANGED IT TO NOT A SCROLLBAR ALAN ARE YOU HAPPY NOW
        Console.prototype.scrollableCanvas = function () {
            if (this.currentYPosition > _Canvas.height) {
                var myCanvas = _DrawingContext.getImageData(0, _DefaultFontSize + 5, _Canvas.width, _Canvas.height);
                _DrawingContext.putImageData(myCanvas, 0, 0);
                this.currentYPosition = _Canvas.height - _DefaultFontSize;
            }
        };
        Console.prototype.tabComplete = function () {
            var goodBuffer = this.buffer.replace("\t", "");
            _Kernel.krnTrace("buffer is: " + goodBuffer + ".");
            for (var i = 0; i < _OsShell.commandList.length; i++) {
                if (_OsShell.commandList[i].command.startsWith(goodBuffer)) {
                    _Kernel.krnTrace("Command: " + _OsShell.commandList[i].command);
                    this.matchArray[this.matchArray.length] = _OsShell.commandList[i].command;
                }
            }
            if (this.matchArray.length == 0) {
                this.putText("There are no commands starting with this letter");
                this.advanceLine();
                this.putText(">" + this.buffer.trim());
            }
            if (this.matchArray.length == 1) {
                this.buffer = this.matchArray[0].toString();
                _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                this.currentXPosition = 0;
                this.putText(">" + this.buffer.trim());
            }
            if (this.matchArray.length > 1) {
                _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                this.currentXPosition = 0;
                this.putText(">" + this.buffer.trim());
                this.advanceLine();
                this.putText(this.matchArray.toString());
                this.advanceLine();
                this.putText(">" + this.buffer.trim());
            }
            this.matchArray = [];
        };
        Console.prototype.backspace = function () {
            //split the buffer into a character array
            var tempBuff = this.buffer.split('');
            //create a new buffer that is empty
            var newBuff = "";
            //loop through the array and add everything from the original buffer
            //with the exception of the last character (the one that should be deleted)
            for (var i = 0; i < tempBuff.length - 1; i++) {
                newBuff += tempBuff[i];
            }
            //set this.buffer to this new buffer I've made
            this.buffer = newBuff;
            _Kernel.krnTrace("Buffer= " + this.buffer);
            // print it on the screen and deal with the most unholy annoyance EVER (original buffer stays on screen).
            _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
            this.currentXPosition = 0;
            this.putText(">" + newBuff);
        };
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
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Logic and implementation of tab complete
                if (chr === String.fromCharCode(9)) {
                    this.tabComplete();
                }
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    this.historyBuffer[this.historyBuffer.length] = this.buffer.trim();
                    _OsShell.handleInput(this.buffer.trim());
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                //This is the backspace logic and implementation
                if (chr === String.fromCharCode(8)) {
                    this.backspace();
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        };
        Console.prototype.putText = function (text) {
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
        };
        Console.prototype.advanceLine = function () {
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
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
