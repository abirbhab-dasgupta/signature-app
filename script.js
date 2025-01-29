// Get DOM elements
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const backgroundPicker = document.getElementById('backgroundPicker');
const fontSizeSelect = document.getElementById('font');
const saveBtn = document.querySelector('.btn-success');
const retrieveBtn = document.getElementById('retrieve');

// Drawing state variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Initialize canvas
function initCanvas() {
    // Set initial background to white
    backgroundPicker.value = '#FFFFFF';  // Set color picker to white
    ctx.fillStyle = '#FFFFFF';  // Set canvas background to white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set initial drawing style
    colorPicker.value = '#000000';  // Set default drawing color to black
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = parseInt(fontSizeSelect.value);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

// Event listeners for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getMousePos(canvas, e);
}

function draw(e) {
    if (!isDrawing) return;
    
    const [currentX, currentY] = getMousePos(canvas, e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    [lastX, lastY] = [currentX, currentY];
}

function stopDrawing() {
    isDrawing = false;
}

// Helper function to get correct mouse position
function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return [
        e.clientX - rect.left,
        e.clientY - rect.top
    ];
}

// Clear function that resets to white background
function clearCanvas() {
    ctx.fillStyle = '#FFFFFF';  // Always clear to white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = colorPicker.value;  // Restore drawing color
}

// Color and style controls
colorPicker.addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
});

backgroundPicker.addEventListener('change', (e) => {
    // Save current canvas content
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Fill with new background
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Restore content
    ctx.putImageData(imageData, 0, 0);
});

fontSizeSelect.addEventListener('change', (e) => {
    ctx.lineWidth = parseInt(e.target.value);
});

// Clear canvas
clearBtn.addEventListener('click', clearCanvas);

// Save signature
saveBtn.addEventListener('click', () => {
    // Create temporary link for download
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvas.toDataURL('image/png');
    
    // Save to localStorage for later retrieval
    localStorage.setItem('savedSignature', canvas.toDataURL());
    
    // Trigger download
    link.click();
});

// Retrieve saved signature
retrieveBtn.addEventListener('click', () => {
    const savedSignature = localStorage.getItem('savedSignature');
    if (savedSignature) {
        const img = new Image();
        img.onload = () => {
            clearCanvas();  // Clear to white first
            ctx.drawImage(img, 0, 0);
        };
        img.src = savedSignature;
    } else {
        alert('No saved signature found!');
    }
});

// Touch support for mobile devices
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

// Initialize canvas when page loads
window.addEventListener('load', initCanvas);