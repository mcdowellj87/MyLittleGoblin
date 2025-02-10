<!DOCTYPE html>
<html>
<head>
    <title>Numbered Centroids of Magenta Blobs</title>
</head>
<body>
    <img id="myImage" src="images/head.png" style="display:none;" />
    <canvas id="myCanvas" style="border:1px solid black;"></canvas>

    <script>
        const img = document.getElementById('myImage');
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            const magentaPixels = [];
            const centroids = []; // Array to store centroid positions

            // Function to draw a cyan dot at (x, y)
            function drawCyanDot(x, y) {
                ctx.fillStyle = '#00FFFF';
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Function to draw a yellow dot at the centroid
            function drawYellowDot(x, y, label) {
                ctx.fillStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();

                // Draw the label number next to the dot
                ctx.fillStyle = 'black';
                ctx.font = '14px Arial';
                ctx.fillText(label, x + 8, y - 8); // Offset label for visibility
            }

            // Step 1: Collect all magenta pixel coordinates
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const index = (y * canvas.width + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    const a = data[index + 3];

                    if (r === 255 && g === 0 && b === 255 && a !== 0) {
                        magentaPixels.push({ x, y });
                        drawCyanDot(x, y);
                    }
                }
            }

            console.log(`Total magenta pixels detected: ${magentaPixels.length}`);

            // Step 2: Group nearby pixels into blobs
            const distanceThreshold = 10;
            const blobs = [];

            magentaPixels.forEach(pixel => {
                let addedToBlob = false;

                for (const blob of blobs) {
                    for (const point of blob) {
                        const dx = pixel.x - point.x;
                        const dy = pixel.y - point.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance <= distanceThreshold) {
                            blob.push(pixel);
                            addedToBlob = true;
                            break;
                        }
                    }
                    if (addedToBlob) break;
                }

                if (!addedToBlob) {
                    blobs.push([pixel]);
                }
            });

            console.log(`Total blobs detected: ${blobs.length}`);

            // Step 3: Calculate centroids and number them
            blobs.forEach((blob, index) => {
                const sumX = blob.reduce((acc, p) => acc + p.x, 0);
                const sumY = blob.reduce((acc, p) => acc + p.y, 0);
                const centerX = Math.floor(sumX / blob.length);
                const centerY = Math.floor(sumY / blob.length);

                centroids.push({ id: index + 1, x: centerX, y: centerY }); // Store centroid with ID
                drawYellowDot(centerX, centerY, index + 1); // Draw dot with number

                console.log(`Blob ${index + 1}: Centroid at (x: ${centerX}, y: ${centerY}), Size: ${blob.length}`);
            });

            // Final array of centroids
            console.log('Centroids:', centroids);
        };
    </script>
</body>
</html>