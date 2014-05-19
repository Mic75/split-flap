/**
 * 
 * @param {type} cell
 * @returns {undefined}
 */
define(["cell"], function(cell) {

    var manager = function(spec, my) {
        /*
         * Private Members
         */
        var that, cells, fontsTexture, gl;

        my = my || {};

        function measureCharHeight(fontStyle, width, height, ch) {

            // create a temp canvas
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.font = fontStyle;
            ctx.clearRect(0, 0, width, height);
            ctx.fillText(ch, 0, height);

            // Get the pixel data from the canvas
            var data = ctx.getImageData(0, 0, width, height).data,
                    first = false,
                    last = false,
                    r = height,
                    c = 0;

            // Find the last line with a non-transparent pixel
            while (!last && r) {
                r--;
                for (c = 0; c < width; c++) {
                    if (data[r * width * 4 + c * 4 + 3]) {
                        last = r;
                        break;
                    }
                }
            }

            // Find the first line with a non-transparent pixel
            while (r) {
                r--;
                for (c = 0; c < width; c++) {
                    if (data[r * width * 4 + c * 4 + 3]) {
                        first = r;
                        break;
                    }
                }

                // If we've got it then return the height
                if (first !== r)
                    return last - first;
            }

            // error condition if we get here
            return 0;
        }

        function createEmptyCanvas(w, h) {
            var canvas, context;

            canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;

            context = canvas.getContext("2d");
            context.fillStyle = "black";
            context.fillRect(0, 0, w, h);
            return canvas;
        }

        function getFontTexture(ch) {
            var canvas, context, metrics, fontSize, fontHeight, fontFamily, texture;

            canvas = createEmptyCanvas(128, 256);
            context = canvas.getContext("2d");

            if (typeof ch !== "undefined") {
                context.fillStyle = "yellow";
                fontSize = 190;
                fontFamily = "Arial";
                context.font = fontSize + "pt " + fontFamily;
                context.textAlign = "center";
                fontHeight = measureCharHeight(context.font, 2 * fontSize, 2 * fontSize, ch);
                context.fillText(ch, canvas.width / 2, (canvas.height * 0.9 + fontHeight + 1) / 2, fontHeight / 2);
            }
            
            texture = gl.createTexture();
            texture.image = canvas;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            
            return texture;

        }

        function initFontCanvas() {
            var currentFont, i, emptyCanvas;

            fontsTexture = [];
            fontsTexture.push(getFontTexture());

            //loop from '0' to '9'
            for (i = 48; i < 58; i++) {
                fontsTexture.push(getFontTexture(String.fromCharCode(i)));
            }

            //loop from 'A' to 'Z'
            for (i = 65; i < 91; i++) {
                fontsTexture.push(getFontTexture(String.fromCharCode(i)));
            }
        }

        function displayCells() {

        }

        /*
         * Intern init
         */
        try {
            that = {};
            gl = spec.graphics.gl;
            initFontCanvas();
            displayCells();
        }
        catch (e) {
            throw e;
        }

        /*
         * Public interface
         */

        function updateCell(c, r, ch) {

        }
        that.updateCell = updateCell;

        /*
         * Test interface
         */
        that.testInitFontCanvas = function() {
            fontsTexture.forEach(function(texture) {
                texture.image.style.marginRight = "1px";
                document.body.appendChild(texture.image);
            });
        };

        return that;

    };

    return manager;

});

