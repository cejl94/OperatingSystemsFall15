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
        Console.prototype.scrollableCanvas = function () {
            if (this.currentYPosition > _Canvas.height) {
                var myCanvas = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                _Canvas.height += 500;
                _DrawingContext.putImageData(myCanvas, 0, 0);
            }
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Logic and implementation of tab complete
                if (chr === String.fromCharCode(9)) {
                    this.buffer = "";
                    _Kernel.krnTrace("" + _OsShell.commandList[1].command);
                    for (var i = 0; i < _OsShell.commandList.length; i++) {
                        if (_OsShell.commandList[i].command.startsWith(this.buffer)) {
                            _Kernel.krnTrace("Command= " + _OsShell.commandList[i].command);
                            this.buffer = _OsShell.commandList[i].command;
                            _Kernel.krnTrace("Buffer= " + this.buffer);
                            _DrawingContext.clearRect(0, this.currentYPosition - _DefaultFontSize, this.currentXPosition, _DefaultFontSize + 5);
                            this.currentXPosition = 0;
                            this.putText(">" + this.buffer);
                        }
                    }
                }
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) {
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
