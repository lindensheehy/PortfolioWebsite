const resolution = 1000;

// Hidden precomputed bitmap canvas
const bitmapCanvas = document.createElement('canvas');
bitmapCanvas.width = resolution;
bitmapCanvas.height = resolution;
const bitmapCtx = bitmapCanvas.getContext('2d');

// Visible canvases
const canvas = document.getElementById('noise-canvas');
const ctx = canvas.getContext('2d');

const canvas_nav = document.getElementById('noise-canvas-nav');
const ctx_nav = canvas_nav.getContext('2d');

// Disable image smoothing
ctx.imageSmoothingEnabled = false;
ctx_nav.imageSmoothingEnabled = false;

// Hotspots and colors
const hotspotsPixels = [
    [-55, -55, 0x0B1D41],
    [556, 444, 0x223022],
    [1222, 556, 0x1B1035],
    [1000, 222, 0x1E1B2C],
    [1111, 889, 0x122B2B],
    [-111, 1222, 0x2B1A1A]
];

// Prebake pixel data into hidden canvas
function bakePixels() {
    const imageData = bitmapCtx.createImageData(resolution, resolution);
    const data = imageData.data;

    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            let r = 0, g = 0, b = 0;
            let totalWeight = 0;

            for (const [px, py, hexColor] of hotspotsPixels) {
                const dx = x - px;
                const dy = y - py;
                const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
                const weight = 1 / (dist * dist);

                totalWeight += weight;

                const red   = (hexColor >> 16) & 0xFF;
                const green = (hexColor >> 8)  & 0xFF;
                const blue  = hexColor & 0xFF;

                r += red * weight;
                g += green * weight;
                b += blue * weight;
            }

            r = Math.min(255, r / totalWeight);
            g = Math.min(255, g / totalWeight);
            b = Math.min(255, b / totalWeight);

            const idx = (y * resolution + x) * 4;
            data[idx]     = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255; // full opacity
        }
    }

    bitmapCtx.putImageData(imageData, 0, 0);
}

// Draw baked bitmap onto screen
function drawNoise() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas_nav.width = window.innerWidth;
    canvas_nav.height = window.innerHeight * 0.1;

    // Draw full bitmap scaled to screen
    ctx.drawImage(bitmapCanvas, 0, 0, canvas.width, canvas.height);

    // Draw a slice from middle of bitmap for nav
    const sliceY = Math.floor(resolution * 0.6);
    ctx_nav.drawImage(
        bitmapCanvas,
        0, sliceY, resolution, resolution * 0.1, // source rect
        0, 0, canvas_nav.width, canvas_nav.height // destination
    );
}

// Set hooks
document.addEventListener('DOMContentLoaded', () => {
    bakePixels();
    drawNoise();
});

window.addEventListener('resize', drawNoise);
