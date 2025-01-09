var canvas = document.getElementById('projectCanvas');
var ctx = canvas.getContext('2d');
var baseImage = new Image();
var hoverImage = new Image();

var maxRadius = 100; // Maximum radius for stationary (low speed)
var minRadius = 50;  // Minimum radius for fast (high speed)
var radius = maxRadius; // Initial radius
var lastX = 0;
var lastY = 0;
var lastTime = 0;

// Load the base and hover images
baseImage.src = '../imgs/rgb.jpg';
hoverImage.src = '../imgs/ice.jpg';  // Default hover image (S1)

// Function to update canvas size based on window size, ensuring it never exceeds 100% of viewport width
function updateCanvasSize() {
    // Get the viewport width
    var viewportWidth = window.innerWidth;

    // Calculate the aspect ratio from the base image (e.g., width:height)
    var aspectRatio = baseImage.width / baseImage.height;

    // Set canvas width to the smaller of viewport width or 100% of parent element width
    var canvasWidth = Math.min(viewportWidth, canvas.parentElement.offsetWidth);

    // Set canvas height based on aspect ratio to maintain the correct proportions
    canvas.height = canvasWidth / aspectRatio;

    // Update canvas width
    canvas.width = canvasWidth;

    // Redraw the base image on the canvas after resizing
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas first
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
}

// Initialize canvas size when images are loaded
baseImage.onload = function() {
    updateCanvasSize(); // Set canvas size when the image is loaded
};

// Resize canvas on window resize
window.addEventListener('resize', updateCanvasSize);

// Function to calculate speed (distance/time)
function calculateSpeed(x, y, time) {
    var dx = x - lastX;
    var dy = y - lastY;
    var distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance
    var deltaTime = time - lastTime;

    // Calculate speed (distance per millisecond)
    var speed = distance / deltaTime;

    // Update radius based on speed (stationary -> maxRadius, fast -> minRadius)
    radius = Math.max(minRadius, Math.min(maxRadius, maxRadius - speed * 10)); // Adjust multiplier to fine-tune speed-to-radius relation

    // Update last position and time
    lastX = x;
    lastY = y;
    lastTime = time;
}

// Function to handle touch or mousemove
function handleMove(event) {
    // For mousemove event
    var mouseX, mouseY;

    if (event.offsetX && event.offsetY) {
        // Mouse event
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    } else if (event.changedTouches && event.changedTouches[0]) {
        // Touch event
        mouseX = event.changedTouches[0].pageX - canvas.offsetLeft;
        mouseY = event.changedTouches[0].pageY - canvas.offsetTop;
    } else {
        // Fallback for other cases
        mouseX = event.clientX - canvas.offsetLeft;
        mouseY = event.clientY - canvas.offsetTop;
    }

    var currentTime = Date.now();

    // Calculate speed
    calculateSpeed(mouseX, mouseY, currentTime);

    // Clear the canvas and redraw the base image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Create a circular clipping region based on mouse/touch position and dynamic radius
    ctx.save();
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
    ctx.clip();

    // Draw the hover image inside the circular area
    ctx.drawImage(hoverImage, 0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// Event listeners for mouse and touch events
canvas.addEventListener('mousemove', handleMove);

// Mobile touch events for a similar experience on mobile
canvas.addEventListener('touchmove', function (event) {
    event.preventDefault(); // Prevent default touch behavior (scrolling)
    handleMove(event);
}, { passive: false });

// Add event listeners for the buttons
document.getElementById('cirrusBtn').addEventListener('click', function () {
    hoverImage.src = '../imgs/36U_97R_S1.png';  // Set to S1 on Cirrus button click
});

document.getElementById('iceBtn').addEventListener('click', function () {
    hoverImage.src = '../imgs/ice.jpg';  // Set on Ice button click
});

document.getElementById('cloudHeightBtn').addEventListener('click', function () {
    hoverImage.src = '../imgs/height-map.jpg';  // Set on height button click
});