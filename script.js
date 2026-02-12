// --- CONFIGURACIÓN ---
const FECHA_INICIO = new Date("2023-08-23"); 
const MENSAJE_HTML = `
<h1>Para mi amor:</h1>
Igual que este árbol florece,
mi amor por ti crece cada día.

Eres mi lugar seguro y
mi momento favorito.
<br>
<strong>¡Te Amo!</strong>
`;

const heartColors = ['#d32f2f', '#c2185b', '#e91e63', '#ff4081', '#f48fb1', '#ffcdd2'];
const YOUTUBE_VIDEO_ID = "Y2Vnjmb2gFs"; 

// --- REFERENCIAS ---
const heartTrigger = document.getElementById('heart-trigger');
const heartPath = document.getElementById('heart-path');
const instruction = document.querySelector('.click-instruction');
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
const treeWrapper = document.getElementById('tree-wrapper');
const textPanel = document.getElementById('textPanel');
const typewriterContent = document.getElementById('typewriter-content');

// --- RESPONSIVE CANVAS ---
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); 

let isAnimating = false;
let leavesArray = []; 

// --- 1. CLIC INICIAL ---
heartTrigger.addEventListener('click', () => {
    if(isAnimating) return;
    isAnimating = true;
    instruction.style.opacity = 0;
    
    // Música iframe (Método infalible)
    const musicIframe = document.createElement('iframe');
    musicIframe.setAttribute('src', `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&showinfo=0&autohide=1&mute=0`);
    musicIframe.style.width = '1px'; musicIframe.style.height = '1px';
    musicIframe.style.opacity = '0'; musicIframe.style.position = 'absolute';
    musicIframe.allow = "autoplay"; 
    document.body.appendChild(musicIframe);

    // Gota
    heartPath.setAttribute('d', 'M12,2c-5,0-9,4-9,9c0,5,9,13,9,13s9-8,9-13C21,6,17,2,12,2z');
    heartPath.style.fill = "#8d6e63";

    setTimeout(() => {
        heartTrigger.classList.add('falling');
        setTimeout(() => {
            drawResponsiveTree();
        }, 700);
    }, 500);
});


// --- 2. ÁRBOL PROPORCIONAL (SOLUCIÓN AL TRONCO GRANDE) ---
function drawResponsiveTree() {
    const startX = canvas.width / 2;
    const startY = canvas.height;
    
    // Altura del tronco: 40% de la pantalla
    const trunkHeight = canvas.height * 0.4; 
    const trunkTopY = startY - trunkHeight;
    
    // CORRECCIÓN: Grosor dinámico. Mínimo 8px, Máximo 22px, basado en el ancho.
    // Esto hace que en celular el tronco sea fino y elegante.
    const trunkWidth = Math.max(8, Math.min(22, canvas.width * 0.035)); 

    // Tronco
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + (trunkWidth/3), startY - trunkHeight / 2, startX, trunkTopY);
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = trunkWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // Ramas
    setTimeout(() => {
        let h = trunkHeight * 0.75;
        growSubBranches(startX, startY - h, h*0.5, -Math.PI/2 - 0.7, trunkWidth*0.7, 3);
        growSubBranches(startX, startY - h, h*0.5, -Math.PI/2 + 0.7, trunkWidth*0.7, 3);
    }, 200);

    setTimeout(() => {
        let h = trunkHeight * 0.95; // Casi arriba
        growSubBranches(startX, startY - h, h*0.4, -Math.PI/2 - 0.4, trunkWidth*0.6, 3);
        growSubBranches(startX, startY - h, h*0.4, -Math.PI/2 + 0.4, trunkWidth*0.6, 3);
    }, 400);

    setTimeout(() => {
        // Copa
        growSubBranches(startX, trunkTopY, trunkHeight*0.3, -Math.PI/2 - 0.2, trunkWidth*0.5, 3);
        growSubBranches(startX, trunkTopY, trunkHeight*0.3, -Math.PI/2 + 0.2, trunkWidth*0.5, 3);
    }, 600);

    // Corazones
    setTimeout(() => {
        if(isAnimating) generateDenseHearts(trunkTopY);
    }, 2000);
}

function growSubBranches(x, y, len, angle, width, depth) {
    if (depth <= 0) return;
    const endX = x + len * Math.cos(angle);
    const endY = y + len * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x, y - len*0.2, endX, endY);
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.stroke();
    setTimeout(() => {
        growSubBranches(endX, endY, len*0.7, angle - 0.35, width*0.7, depth - 1);
        growSubBranches(endX, endY, len*0.7, angle + 0.35, width*0.7, depth - 1);
    }, 150);
}


// --- 3. CORAZONES ---
function generateDenseHearts(trunkTopY) {
    const centerX = canvas.width / 2;
    const centerY = trunkTopY - (canvas.height * 0.05); 
    const scale = Math.min(canvas.width, canvas.height) * 0.02; // Escala móvil
    const totalLeaves = 800; 

    let count = 0;
    const interval = setInterval(() => {
        if (count >= totalLeaves) {
            clearInterval(interval);
            setTimeout(startSequenceAndInfiniteFall, 1500);
            return;
        }
        const pos = getHeartPosition(centerX, centerY, scale);
        createFixedLeaf(pos.x, pos.y, centerY);
        count++;
    }, 1);
}

function getHeartPosition(centerX, centerY, scale) {
    let t = Math.random() * Math.PI * 2;
    let r = Math.sqrt(Math.random());
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    return { 
        x: centerX + (x * scale * r) + (Math.random() * 10 - 5), 
        y: centerY + (y * scale * r) + (Math.random() * 10 - 5) 
    };
}

function createFixedLeaf(x, y, centerY) {
    const el = document.createElement('div');
    el.classList.add('flower'); el.innerHTML = '❤';
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    
    let size = Math.random() * 10 + 5; 
    if (y > centerY + (canvas.height*0.1)) size *= 0.6; 
    el.style.setProperty('--size', `${size}px`);
    
    const rot = Math.random()*60 - 30;
    el.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
    treeWrapper.appendChild(el);
    leavesArray.push({el, x, y});
    requestAnimationFrame(() => el.classList.add('bloom'));
}


// --- 4. SECUENCIA FINAL CON FOTOS ---
function startSequenceAndInfiniteFall() {
    setInterval(createInfiniteFallingHeart, 200);

    setTimeout(() => {
        // En móvil solo desenfocamos
        if (window.innerWidth > 768) {
             treeWrapper.classList.add('move-wrapper-right');
        } else {
             treeWrapper.classList.add('blur-tree');
        }
        
        // MOSTRAR FOTOS (Secuencia)
        showPhotos();

        // MOSTRAR TEXTO DESPUÉS DE LAS FOTOS
        setTimeout(() => {
            textPanel.classList.add('show');
            setTimeout(() => {
                 typeWriterReal(MENSAJE_HTML, typewriterContent);
            }, 500);
        }, 1500);
        
    }, 1000);
}

// Nueva función para mostrar fotos
function showPhotos() {
    const p1 = document.querySelector('.p1');
    const p2 = document.querySelector('.p2');
    const p3 = document.querySelector('.p3');
    
    if(p1) setTimeout(() => p1.classList.add('show'), 100);
    if(p2) setTimeout(() => p2.classList.add('show'), 600);
    if(p3) setTimeout(() => p3.classList.add('show'), 1100);
}

function typeWriterReal(html, element) {
    element.innerHTML = "";
    let i = 0;
    function type() {
        if (i < html.length) {
            let char = html.charAt(i);
            if (char === "<") {
                let tag = "";
                while (html.charAt(i) !== ">" && i < html.length) {
                    tag += html.charAt(i); i++;
                }
                tag += ">"; i++;
                element.innerHTML += tag;
                type();
            } else {
                element.innerHTML += char;
                i++;
                setTimeout(type, 50);
            }
        } else {
            document.getElementById('timer').classList.remove('hidden');
            startTimer();
        }
    }
    type();
}

function createInfiniteFallingHeart() {
    const centerX = canvas.width / 2;
    const trunkHeight = canvas.height * 0.4;
    const trunkTopY = canvas.height - trunkHeight;
    const centerY = trunkTopY - (canvas.height * 0.05);
    const scale = Math.min(canvas.width, canvas.height) * 0.02;

    const pos = getHeartPosition(centerX, centerY, scale);
    const el = document.createElement('div');
    el.classList.add('infinite-flower'); el.innerHTML = '❤';
    el.style.setProperty('--start-x', pos.x + 'px');
    el.style.setProperty('--start-y', pos.y + 'px');
    el.style.left = pos.x + 'px'; el.style.top = pos.y + 'px';
    el.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    const size = Math.random() * 8 + 4;
    el.style.setProperty('--size', `${size}px`);
    treeWrapper.appendChild(el);
    setTimeout(() => { el.remove(); }, 6000);
}

function startTimer() {
    const t = document.getElementById('timer');
    setInterval(() => {
        const diff = new Date() - FECHA_INICIO;
        const d = Math.floor(diff / (1000*60*60*24));
        const h = Math.floor((diff / (1000*60*60)) % 24);
        const m = Math.floor((diff / 1000/60) % 60);
        const s = Math.floor((diff / 1000)%60);
        t.innerText = `Juntos: ${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}