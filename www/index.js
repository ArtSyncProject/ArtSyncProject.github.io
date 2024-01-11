const pickrContainer = document.querySelector('.pickr-container');
const themeContainer = document.querySelector('.theme-container');
const themes = [
    [
        'nano',
        {
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)'
            ],

            defaultRepresentation: 'HEXA',
            components: {
                preview: true,
                opacity: true,
                hue: true,

                interaction: {
                    hex: false,
                    rgba: false,
                    hsva: false,
                    input: true,
                    clear: true,
                    save: true
                }
            }
        }
    ]
];

const buttons = [];
let pickr = null;
const drawingContainer = document.querySelector('.drawing-container');
const canvas = document.getElementById('myCanvas');
const lineWidthInput = document.getElementById('lineWidth'); // Assuming you have an input element with id 'lineWidth'
var drawing = false;
var context;
var newImage = new Image();
newImage.src = 'www/syncbg.png';
var audioPlayer = document.getElementById("audio");

newImage.onload = () =>{
    context.drawImage(newImage,0,0,317,317);
    audioPlayer.play();
}

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function stopDrawing() {
    drawing = false;
    context.beginPath();
}

function draw(e) {
    if (!drawing) return;

    context.lineCap = 'round';
    context.lineWidth = lineWidthInput.value; // Update line width dynamically
    context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    context.stroke();
    context.beginPath();
    context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

// Set up the canvas size to match the div
canvas.width = drawingContainer.offsetWidth;
canvas.height = drawingContainer.offsetHeight;

// Set up the canvas context
context = canvas.getContext('2d');
context.strokeStyle = '#000'; // Set your desired stroke color here

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
lineWidthInput.addEventListener('input', () => {
    context.lineWidth = lineWidthInput.value; // Update line width dynamically on input change
});

// Set an initial line width value
context.lineWidth = lineWidthInput.value;

function handleColorChange(color) {
    context.strokeStyle = color.toRGBA().toString(0);
}

for (const [theme, config] of themes) {
    const button = document.createElement('button');
    button.innerHTML = theme;
    buttons.push(button);

    button.addEventListener('click', () => {
        const el = document.createElement('p');
        pickrContainer.appendChild(el);

        // Delete previous instance
        if (pickr) {
            pickr.destroyAndRemove();
        }

        // Apply active class
        for (const btn of buttons) {
            btn.classList[btn === button ? 'add' : 'remove']('active');
        }

        // Create fresh instance
        pickr = new Pickr(Object.assign({
            el, theme,
            default: '#42445a'
        }, config));

        // Set events
        pickr.on('save', (color, instance) => {
            handleColorChange(color);
        }).on('change', (color, instance) => {
            handleColorChange(color);
        });

        // Set initial color
        handleColorChange(pickr.getColor());
    });
}

buttons[0].click();
