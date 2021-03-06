/**
 * Block Slider
 */

(function(global) {
    function Game(canvas, context, config) {
        // Game details
        var moves = 0; // 3x3... for now
        var tiles = [], blank,
            active = false;

        var cfg = {
            tiles: 3,
            winCallback: function(moves, time) {
                alert("You won in " + time + " [time unit] within " + moves + " moves!");
            }
        };

        if (config)
            _extend(config, cfg);

        this.start = function() {
            if (!isSquare(canvas))
                throw "Not a square.";

            if (canvas && context) {
                active = true;
                context.fillStyle = "black";
                context.fillRect(0, 0, canvas.width, canvas.height);

                // Random blank tile pos
                // And ensure combinations are solvable.
                tiles = shuffle(fillTiles());

                while (!solvable(tiles))
                    shuffle(tiles);

                tiles.push({ order: 0, data: null });
                blank = tiles.length - 1;

                if (tiles)
                    fillCanvas();

                global.addEventListener("keydown", keyDown);
            }
        };

        function keyDown(event) {
            if (active) {
                switch (event.keyCode) {
                    case 37:
                        handleSwap(blank + 1);
                        break;
                    case 38:
                        handleSwap(blank + cfg.tiles);
                        break;
                    case 39:
                        handleSwap(blank - 1);
                        break;
                    case 40:
                        handleSwap(blank - cfg.tiles);
                        break;
                }

                moves++;

                if (fillCanvas() && tilesInOrder(tiles)) {
                    active = false;

                    setTimeout(cfg.winCallback(moves), 200);
                }
            }
        }

        function handleSwap(blockIndex) {
            // Swappable?
            var difference = blank - blockIndex;

            // Right swap
            if (difference === -1 && (blockIndex) % cfg.tiles === 0)
                return;

            // Left swap
            if (difference === 1 && (blank) % cfg.tiles === 0)
                return;

            // Top/bottom swaps
            if (blockIndex < 0 || blockIndex >= tiles.length)
                return;

            console.log("Swapping indices " + blank + " and " + blockIndex);
            swapIn(tiles, blank, blockIndex);
            blank = blockIndex;
        }

        function fillCanvas() {
            context.fillStyle = "black";
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Render tiles
            var blockWidth = canvas.width / cfg.tiles, blockHeight = canvas.height / cfg.tiles;
            var fillX = 0, fillY = 0;

            for (var i = 0; i < tiles.length; i++) {
                context.fillStyle = "#ff9add";

                // Skip blank block
                if (i !== 0 && i % cfg.tiles === 0) {
                    fillX = 0;
                    fillY += blockHeight;
                }

                if (tiles[i].order === 0) {
                    fillX += blockWidth;
                    continue;
                }

                context.fillRect(fillX + 5, fillY + 5, blockWidth - 10, blockHeight - 10);

                context.fillStyle = "black";
                context.font = "36px roboto";
                context.fillText(tiles[i].order, fillX + 30, fillY + 60);
                fillX += blockWidth;
            }

            return true;
        }
        
        function tilesInOrder(tiles) {
            for (var i = 0; i < tiles.length - 1; i++) {
                if (tiles[i].order === 0)
                    return false;

                if (tiles[i - 1] && tiles[i - 1].order > tiles[i].order)
                    return false;
            }

            return true;
        }

        function fillTiles() {
            var tiles = [];

            for (var i = 0; i < cfg.tiles * cfg.tiles - 1; i++) {
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

        function solvable(tiles) {
            var inversions = 0;

            for (var i = 0; i < tiles.length; i++)
                for (var j = i; j < tiles.length; j++)
                    inversions += tiles[i].order > tiles[j].order;

            return inversions % 2 === 0;
        }
    }

    function _extend(source, host) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                host[key] = source[key];
            }
        }
    }

    global.blockGame = function(canvas, context, config) { return new Game(canvas, context, config); };
})(window);