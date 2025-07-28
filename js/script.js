function doNoise() {

    const canvas = document.getElementById('noise-canvas');
    const ctx = canvas.getContext('2d');

    const canvas_nav = document.getElementById('noise-canvas-nav');
    const ctx_nav = canvas_nav.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas_nav.width = window.innerWidth;
    canvas_nav.height = window.innerHeight * 0.1;

    /*
        Colors:

        0x0B1D51, // Midnight Blue
        0x1B1035, // Dark Purple
        0x3C1F2B, // Deep Maroon
        0x122B2B, // Dark Teal
        0x241332, // Eggplant Purple
        0x2E3A59, // Steel Blue
        0x4B2C3B, // Wine Red
        0x162B3A, // Dark Slate Blue
        0x291F3F, // Indigo
        0x223322, // Forest Green
        0x1E1B2C, // Space Purple
        0x3A2E39, // Smoky Plum
        0x2B1A1A, // Dark Brownish Red
        0x253547, // Charcoal Blue
        0x341F4D, // Royal Purple
    */

    // Viewport units
    const hotspots = [
        [-0.055, -0.055],
        [0.556, 0.444],
        [1.222, 0.556],
        [1.000, 0.222],
        [1.111, 0.889],
        [-0.111, 1.222]
    ];

    let hotspotsPixels = [
        [0, 0, 0x0B1D41],
        [0, 0, 0x223022],
        [0, 0, 0x1B1035],
        [0, 0, 0x1E1B2C],
        [0, 0, 0x122B2B],
        [0, 0, 0x2B1A1A]
    ];

    // Convert factor coords into actual pixels using canvas size
    for (let i = 0; i < hotspots.length; i++) {
        const fx = hotspots[i][0];
        const fy = hotspots[i][1];
        hotspotsPixels[i][0] = fx * canvas.width;
        hotspotsPixels[i][1] = fy * canvas.height;
    }

    let bakedImageData;

    bakedImageData = ctx.createImageData(canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {

            let r = 0, g = 0, b = 0;
            let totalWeight = 0;

            for (const [px, py, hexColor] of hotspotsPixels) {
                const dx = x - px;
                const dy = y - py;
                const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
                const weight = 1 / (dist * dist);

                totalWeight += weight;

                const red = (hexColor >> 16) & 0xFF;
                const green = (hexColor >> 8) & 0xFF;
                const blue = hexColor & 0xFF;

                r += red * weight;
                g += green * weight;
                b += blue * weight;
            }

            r = Math.min(255, r / totalWeight);
            g = Math.min(255, g / totalWeight);
            b = Math.min(255, b / totalWeight);

            const idx = (y * canvas.width + x) * 4;
            bakedImageData.data[idx] = r;
            bakedImageData.data[idx + 1] = g;
            bakedImageData.data[idx + 2] = b;
            bakedImageData.data[idx + 3] = 255;

        }
    }

    ctx.putImageData(bakedImageData, 0, 0);
    const slice = ctx.getImageData(0, canvas.height * 0.6, canvas_nav.width, canvas_nav.height);
    ctx_nav.putImageData(slice, 0, 0);

}

document.addEventListener('DOMContentLoaded', doNoise);
window.addEventListener('resize', doNoise);
