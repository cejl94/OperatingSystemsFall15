var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager() {
        }
        // this method will actually load the user input into memory
        memoryManager.prototype.loadInputToMemory = function (instructions) {
            //address in memory
            var memoryPlace = 0;
            // Loop through each two character "byte" of user input
            for (var i = 0; i < instructions.length; i += 2) {
                // concat two characters to make a byte, and then store in it memory
                var buildOpCode = instructions.charAt(i) + instructions.charAt(i + 1);
                mem.opcodeMemory[memoryPlace] = buildOpCode;
                memoryPlace++;
            }
            if (memoryPlace > 256) {
                _StdOut.putText("This program is too long to be executed");
                mem = new TSOS.memory();
            }
        };
        memoryManager.prototype.readCodeInMemory = function (address) {
            return mem.opcodeMemory[address];
        };
        return memoryManager;
    })();
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
