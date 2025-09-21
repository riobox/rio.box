const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Cursor
let mouse = { x: -1000, y: -1000 };

// Background drift
let bgOffsetX = 0;
let bgOffsetY = 0;

// Hex
const hexWidth = 100;
const hexHeight = 87;
const strokeColor = 'rgba(57,211,83,0.15)';
const lineWidth = 2;
const rowSpacing = hexHeight * 0.75; // vertical distance between rows

const startCol = Math.floor(-bgOffsetX / hexWidth) - 1;
const endCol = Math.ceil((width - bgOffsetX) / hexWidth) + 1;

const startRow = Math.floor(-bgOffsetY / rowSpacing) - 1;
const endRow = Math.ceil((height - bgOffsetY) / rowSpacing) + 1;

// Ripples
let ripples = [];

// Draw single hex
function drawHex(x, y) {
    ctx.beginPath();
    ctx.moveTo(x + hexWidth/2, y);
    ctx.lineTo(x + hexWidth, y + 25);
    ctx.lineTo(x + hexWidth, y + 62);
    ctx.lineTo(x + hexWidth/2, y + 87);
    ctx.lineTo(x, y + 62);
    ctx.lineTo(x, y + 25);
    ctx.closePath();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

// Draw background
function drawBackground() {
    ctx.clearRect(0, 0, width, height);

    // Compute loop bounds based on current offsets
    const startCol = Math.floor(-bgOffsetX / hexWidth) - 1;
    const endCol = Math.ceil((width - bgOffsetX) / hexWidth) + 1;

    const startRow = Math.floor(-bgOffsetY / rowSpacing) - 1;
    const endRow = Math.ceil((height - bgOffsetY) / rowSpacing) + 1;

    for (let row = startRow; row < endRow; row++) {
        const rowOffset = (row % 2 !== 0) ? (hexWidth / 2) : 0;

        for (let col = startCol; col < endCol; col++) {
            const hSpacing = 4; // horizontal gap in pixels
const rowOffset = (row % 2 !== 0) ? (hexWidth + hSpacing)/2 : 0;
const baseX = col * (hexWidth + hSpacing) + bgOffsetX + rowOffset;

            const baseY = row * rowSpacing + bgOffsetY;

            let offsetX = 0;
            let offsetY = 0;

            // Mouse effect
            const dx = baseX - mouse.x;
            const dy = baseY - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
                const force = (1 - dist/150) * 5;
                offsetX += Math.sin(dy/20) * force;
                offsetY += Math.cos(dx/20) * force;
            }

            // Click ripple
            ripples.forEach(r => {
                const dxr = baseX - r.x;
                const dyr = baseY - r.y;
                const distR = Math.sqrt(dxr*dxr + dyr*dyr);
                if (distR < 150) {
                    const force = (1 - distR/150) * r.strength;
                    offsetX += Math.sin(dyr/20) * force;
                    offsetY += Math.cos(dxr/20) * force;
                }
            });

            drawHex(baseX + offsetX, baseY + offsetY);
        }
    }
}

// Animate
function animate() {
    bgOffsetX += 0.15; // move right
    bgOffsetY += 0.1;  // move down

    drawBackground();

    ripples = ripples.filter(r => {
        r.strength -= 0.25;
        return r.strength > 0;
    });

    requestAnimationFrame(animate);
}
animate();

// Mouse
document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Click ripple
document.addEventListener('click', e => {
    ripples.push({ x: e.clientX, y: e.clientY, strength: 50 });
});

// Resize
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

document.querySelectorAll('[data-icon]').forEach(el => {
  const url = el.dataset.icon;
  fetch(url)
    .then(res => res.text())
    .then(svg => {
      el.innerHTML = svg;
    });
});