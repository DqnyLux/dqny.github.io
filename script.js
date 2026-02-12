// --- CONFIGURACIÓN ---
const FECHA_INICIO = new Date("2023-08-23"); 
const MENSAJE_HTML = `
<h1>Para mi amor:</h1>
Como las hojas de este árbol,
mi amor por ti es infinito.

Aunque el tiempo pase y el
viento sople, mis raíces
siempre estarán contigo.

Gracias por hacerme feliz.
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
let player; 

// --- YOUTUBE API ---
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '1', width: '1',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': YOUTUBE_VIDEO_ID, 'playsinline': 1 },
        events: { 'onReady': (e) => e.target.setVolume(70) }
    });
};

// --- CLIC INICIAL ---
heartTrigger.addEventListener('click', () => {
    if(isAnimating) return;
    isAnimating = true;
    instruction.style.opacity = 0;
    
    if (player && player.playVideo) player.playVideo();

    heartPath.setAttribute('d', 'M12,2c-5,0-9,4-9,9c0,5,9,13,9,13s9-8,9-13C21,6,17,2,12,2z');
    heartPath.style.fill = "#8d6e63";

    setTimeout(() => {
        heartTrigger.classList.add('falling');
        setTimeout(() => {
            drawResponsiveTree();
        }, 700);
    }, 500);
});

// --- ÁRBOL ---
function drawResponsiveTree() {
    const startX = canvas.width / 2;
    const startY = canvas.height;
    
    // Tronco más corto para que quepa el corazón grande
    const trunkHeight = canvas.height * 0.35; 
    const trunkTopY = startY - trunkHeight;
    const trunkWidth = Math.max(10, Math.min(20, canvas.width * 0.04)); 

    // Tronco
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + (trunkWidth/3), startY - trunkHeight / 2, startX, trunkTopY);
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = trunkWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // Ramas (MÁS PEQUEÑAS - 50%)
    setTimeout(() => {
        let h = trunkHeight * 0.7;
        growSubBranches(startX, startY - h, h*0.4, -Math.PI/2 - 0.7, trunkWidth*0.7, 3);
        growSubBranches(startX, startY - h, h*0.4, -Math.PI/2 + 0.7, trunkWidth*0.7, 3);
    }, 200);

    setTimeout(() => {
        let h = trunkHeight * 0.9;
        growSubBranches(startX, startY - h, h*0.3, -Math.PI/2 - 0.4, trunkWidth*0.6, 3);
        growSubBranches(startX, startY - h, h*0.3, -Math.PI/2 + 0.4, trunkWidth*0.6, 3);
    }, 400);

    setTimeout(() => {
        growSubBranches(startX, trunkTopY, trunkHeight*0.25, -Math.PI/2 - 0.2, trunkWidth*0.5, 3);
        growSubBranches(startX, trunkTopY, trunkHeight*0.25, -Math.PI/2 + 0.2, trunkWidth*0.5, 3);
    }, 600);

    // Corazones
    setTimeout(() => {
        if(isAnimating) generateDenseHearts(trunkTopY);
    }, 1500);
}

// Función recursiva de ramas (Cortas)
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
    // Factor de reducción 0.6 hace que se acorten rápido
    setTimeout(() => {
        growSubBranches(endX, endY, len*0.6, angle - 0.4, width*0.7, depth - 1);
        growSubBranches(endX, endY, len*0.6, angle + 0.4, width*0.7, depth - 1);
    }, 100);
}


// --- GENERACIÓN RÁPIDA Y CORAZÓN GRANDE ---
function generateDenseHearts(trunkTopY) {
    const centerX = canvas.width / 2;
    // Centro ajustado
    const centerY = trunkTopY - (canvas.height * 0.1); 
    // CORAZÓN MÁS GRANDE (0.025 en lugar de 0.02)
    const scale = Math.min(canvas.width, canvas.height) * 0.025; 
    const totalLeaves = 900; 

    let count = 0;
    const interval = setInterval(() => {
        if (count >= totalLeaves) {
            clearInterval(interval);
            setTimeout(startSequenceAndInfiniteFall, 1000);
            return;
        }
        
        // GENERACIÓN MUY RÁPIDA (5 por ciclo)
        for(let i=0; i<5; i++) {
            const pos = getHeartPosition(centerX, centerY, scale);
            createFixedLeaf(pos.x, pos.y, centerY);
            count++;
        }
    }, 1); // 1ms
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
    if (y > centerY + (canvas.height*0.15)) size *= 0.6; // Hojas de abajo más pequeñas
    el.style.setProperty('--size', `${size}px`);
    
    const rot = Math.random()*60 - 30;
    el.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
    treeWrapper.appendChild(el);
    leavesArray.push({el, x, y});
    requestAnimationFrame(() => el.classList.add('bloom'));
}


// --- SECUENCIA FINAL ---
function startSequenceAndInfiniteFall() {
    setInterval(createInfiniteFallingHeart, 200);

    setTimeout(() => {
        if (window.innerWidth > 768) {
             treeWrapper.classList.add('move-wrapper-right');
        } else {
             treeWrapper.classList.add('blur-tree');
        }
        
        // MOSTRAR FOTOS
        showPhotos();

        setTimeout(() => {
            textPanel.classList.add('show');
            setTimeout(() => {
                 typeWriterReal(MENSAJE_HTML, typewriterContent);
            }, 500);
        }, 1500);
        
    }, 1000);
}

// FUNCIONES DE FOTOS CON ZOOM
function showPhotos() {
    const photos = document.querySelectorAll('.polaroid');
    photos.forEach((p, index) => {
        setTimeout(() => p.classList.add('show'), index * 500);
        
        // AGREGAR EVENTO DE CLICK/TOUCH PARA ZOOM
        p.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que el click pase al fondo
            
            // Si ya tiene zoom, quitárselo
            if (this.classList.contains('zoomed')) {
                this.classList.remove('zoomed');
            } else {
                // Quitar zoom a cualquier otra foto primero
                photos.forEach(ph => ph.classList.remove('zoomed'));
                
                // Poner zoom a esta
                this.classList.add('zoomed');
                
                // Quitar zoom automáticamente después de 3 segundos
                setTimeout(() => {
                    this.classList.remove('zoomed');
                }, 3000);
            }
        });
    });
}

function typeWriterReal(html, element) {
    element.innerHTML = "";
    let i = 0;
    function type() {
        if (i < html.length) {
            let char = html.charAt(i);
            if (char === "<") {
                let tag = "";
                while (html.charAt(i) !== ">" && i < html.length) { tag += html.charAt(i); i++; }
                tag += ">"; i++; element.innerHTML += tag; type();
            } else {
                element.innerHTML += char; i++; setTimeout(type, 50);
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
    const trunkHeight = canvas.height * 0.35;
    const trunkTopY = canvas.height - trunkHeight;
    const centerY = trunkTopY - (canvas.height * 0.1);
    const scale = Math.min(canvas.width, canvas.height) * 0.025;

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