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
hoverImage.src = '../imgs/cirrus.jpg';  // Default hover image (S1)

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

function handleMove(event) {
    var mouseX, mouseY;

    // Get the bounding rectangle of the canvas to account for positioning on the page
    var canvasRect = canvas.getBoundingClientRect();

    if (event.offsetX && event.offsetY) {
        // Mouse event
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    } else if (event.changedTouches && event.changedTouches[0]) {
        // Touch event
        mouseX = event.changedTouches[0].pageX - canvasRect.left;  // Adjust by canvas left offset
        mouseY = event.changedTouches[0].pageY - canvasRect.top;   // Adjust by canvas top offset

        // Apply small offsets to move the circle above the touch point (Y) and slightly adjust X
        var touchOffsetX = 15;   // Adjust this value to control the X offset (optional)
        var touchOffsetY = -10;   // Adjust this value to control the Y offset (default -20)
        mouseX += touchOffsetX;   // Apply X offset
        mouseY += touchOffsetY;   // Apply Y offset
    } else {
        // Fallback for other cases (desktop or non-touch devices)
        mouseX = event.clientX - canvasRect.left;
        mouseY = event.clientY - canvasRect.top;
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

// Function to set the active button
function setActiveButton(button) {
    // Get all the buttons
    var buttons = document.querySelectorAll('button');
    
    // Remove 'active' class from all buttons
    buttons.forEach(function (btn) {
        btn.classList.remove('active');
    });
    
    // Add 'active' class to the clicked button
    button.classList.add('active');
}

// Update button event listeners
document.getElementById('cirrusBtn').addEventListener('click', function () {
    hoverImage.src = '../imgs/cirrus.jpg';  // Set to Cirrus image
    setActiveButton(this);  // Set this button as active
});

document.getElementById('iceBtn').addEventListener('click', function () {
    hoverImage.src = '../imgs/ice.jpg';  // Set to Ice image
    setActiveButton(this);  // Set this button as active
});

document.getElementById('cloudHeightBtn').addEventListener('click', function () {
    hoverImage.src = '../imgs/height-map.jpg';  // Set to Height map image
    setActiveButton(this);  // Set this button as active
});