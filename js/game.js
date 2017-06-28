
(function(global) {
    function Game(canvas, context) {
        // Game details
        var sides = 3; // 3x3

        var tiles = [], blank;

        this.active = false;

        this.start = function() {
            if (!isSquare(canvas))
                throw "Not a square.";

            if (canvas && context) {
                this.active = true;
                context.fillStyle = "black";
                context.fillRect(0, 0, canvas.width, canvas.height);

                // Random blank tile pos
                tiles = shuffle(fillTiles(tiles));
                tiles.push({ order: 0, data: null });
                blank = tiles.length - 1;

                global.addEventListener("keydown", keyPush);
            }
        };

        function keyPush(event) {
            switch(event.keyCode) {
                case 37:
                    handleSwap(blank + 1);
                    break;
                case 38:
                    handleSwap(blank + sides);
                    break;
                case 39:
                    handleSwap(blank - 1);
                    break;
                case 40:
                    handleSwap(blank - sides);
                    break;
            }

            game();
            //setTimeout(game(), 500);
        }

        function handleSwap(blockIndex) {
            // Swappable?
            var difference = blank - blockIndex;
            console.log(difference);

            // Right swap
            if (difference === -1 && (blockIndex) % sides === 0)
                return;

            // Left swap
            if (difference === 1 && (blank) % sides === 0)
                return;

            // Top/bottom swaps
            if (blockIndex < 0 || blockIndex > tiles.length)
                return;

            console.log(tiles);
            console.log("Swapping indices " + blank + " and " + blockIndex);
            swapIn(tiles, blank, blockIndex);
            blank = blockIndex;
        }

        function game() {
            context.fillStyle = "black";
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Render tiles
            var blockWidth = canvas.width / sides, blockHeight = canvas.height / sides;
            var fillX = 0, fillY = 0;

            var c = 1;

            for (var i = 0; i < tiles.length; i++) {
                context.fillStyle = "#ff9add";

                // Skip blank block
                if (i !== 0 && i % sides === 0) {
                    fillX = 0;
                    fillY += blockHeight;
                }

                if (tiles[i].order === 0) {
                    fillX += blockWidth;
                    continue;
                }

                context.fillRect(fillX + 10, fillY + 10, blockWidth - 20, blockHeight - 20);

                context.fillStyle = "black";
                context.font = "48px roboto";
                context.fillText(tiles[i].order, fillX + 50, fillY + 80);
                fillX += blockWidth;

                console.log("Filled in " + (c++));
            }
        }

        // TODO: check winner.
        function tilesInOrder(tiles) {

        }

        function fillTiles(tiles) {
            for (var i = 0; i < sides * sides - 1; i++) {
                tiles.push({
                    order: i + 1,
                    data: "LOL"
                });
            }

            return tiles;
        }

        function shuffle(array) {
            var current = array.length,
                temp, random;

            while (current !== 0) {
                random = Math.floor(Math.random() * current);
                current -= 1;

                temp = array[current];
                array[current] = array[random];
                array[random] = temp;
            }

            return array;
        }

        function swapIn(array, a, b) {
            // Fixes some bad stuff that happens.
            if (!array[a] || !array[b]) {
                console.log("detected abnormality!");
                return;
            }

            array[a] = array.splice(b, 1, array[a])[0];
        }

        function isSquare(canvas) {
            return canvas.width === canvas.height;
        }
    }

    global.blockGame = function(canvas, context) { return new Game(canvas, context); };
})(window);