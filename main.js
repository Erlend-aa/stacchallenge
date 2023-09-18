
let renderer, scene, camera, cameraCtrl;
let width, height, cx, cy, wWidth, wHeight;
const TMath = THREE.Math;

let conf = {
  color: 0xb8e6e8 ,
  objectWidth: 12,
  objectThickness: 3,
  ambientColor: 0x808080,
  light1Color: 0xffffff,
  shadow: false,
  perspective: 75,
  cameraZ: 75,
};

let objects = [];
let geometry, material;
let hMap, hMap0, nx, ny;

init();

function init() {
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene-container'), antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(conf.perspective, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = conf.cameraZ;

  scene = new THREE.Scene();
  geometry = new THREE.BoxGeometry(conf.objectWidth, conf.objectWidth, conf.objectThickness);


  
  const triggerButton = document.getElementById('triggerbutton');
  

  triggerButton.addEventListener('click', initScene);

  animate();



};

function initScene() {
  onResize();
  scene = new THREE.Scene();
  initLights();
  initObjects();

  const starttekst = document.querySelector('.starttekst');
  const trigg = document.querySelector('triggerbutton');
  

  starttekst.style.opacity = 0;
  
  setTimeout(() => {
  
  starttekst.style.zIndex = 1;
  trigg.style.zIndex = 1;
}, 3000);

}

function initLights() {
  scene.add(new THREE.AmbientLight(conf.ambientColor));
  let light = new THREE.PointLight(0xffffff);
  light.position.z = 100;
  scene.add(light);
}

function initObjects() {
  objects = [];
  nx = Math.round(wWidth / conf.objectWidth) + 1;
  ny = Math.round(wHeight / conf.objectWidth) + 1;
  let mesh, x, y;
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      material = new THREE.MeshLambertMaterial({ color: conf.color, transparent: true, opacity: 1 });
      mesh = new THREE.Mesh(geometry, material);
      x = -wWidth / 2 + i * conf.objectWidth;
      y = -wHeight / 2 + j * conf.objectWidth;
      mesh.position.set(x, y, 0);
      objects.push(mesh);
      scene.add(mesh);
    }
  }
  document.body.classList.add('loaded');
  startAnim();
}

function startAnim() {
  document.body.classList.remove('revealed');
  objects.forEach(mesh => {
    mesh.rotation.set(0, 0, 0);
    mesh.material.opacity = 1;
    mesh.position.z = 0;
    let delay = TMath.randFloat(1, 2);
    let rx = TMath.randFloatSpread(2 * Math.PI);
    let ry = TMath.randFloatSpread(2 * Math.PI);
    let rz = TMath.randFloatSpread(2 * Math.PI);
    gsap.to(mesh.rotation, { duration: 2, x: rx, y: ry, z: rz, delay: delay });
    gsap.to(mesh.position, { duration: 2, z: 80, delay: delay + 0.5, ease: "power1.out" });
    gsap.to(mesh.material, { duration: 2, opacity: 0, delay: delay + 0.5 });
  });
  setTimeout(() => {
    document.body.classList.add('revealed');
    const calculator = document.querySelector('.calculator');
    const chartContainer = document.querySelector('.chart-container');
    

  
    calculator.style.opacity = 1;
    chartContainer.style.opacity = 1;
  }, 3000);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

function getRendererSize() {
  const cam = new THREE.PerspectiveCamera(conf.perspective, camera.aspect);
  const vFOV = cam.fov * Math.PI / 180;
  const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
  const width = height * cam.aspect;
  return [width, height];
}

function onResize() {
    width = window.innerWidth; cx = width / 2;
    height = window.innerHeight; cy = height / 2;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  
    var size = getRendererSize();
    wWidth = size[0];
    wHeight = size[1];
}






function createLineChart(years, principal, finalAmount, rate) {
    const ctx = document.getElementById('line-chart').getContext('2d');

    const chartData = {
        labels: Array.from({ length: years + 1 }, (_, i) => `Year ${i}`), // Include year 0
        datasets: [
            {
                label: 'Principal',
                data: Array.from({ length: years + 1 }, () => principal.toFixed(2)), // Include year 0
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: false,
            },
            {
                label: 'Calculated Amount',
                data: Array.from({ length: years + 1 }, (_, i) => i === 0 ? principal.toFixed(2) : (principal * Math.pow(1 + rate, i)).toFixed(2)), // Start at principal value
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    };


   
const maxYValue = principal * (1 + rate) * 1.1;

const yTickStep = maxYValue / 10; 

const yTicks = Array.from({ length: 11 }, (_, i) => i * yTickStep);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: 'Year',
            },
        },
        y: {
            display: true,
            title: {
                display: true,
                text: 'Amount',
            },
            ticks: {
                beginAtZero: true, 
                max: maxYValue, 
                stepSize: yTickStep, 
                callback: (value) => value.toFixed(2), 
            },
        },
    },
};



    if (window.myLineChart) {
        window.myLineChart.destroy();
    }

    window.myLineChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions,
    });
}


function calculate() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const years = parseInt(document.getElementById('years').value);

    const compoundInterest = (principal * Math.pow(1 + rate, years)).toFixed(2);
    
    
    
    console.log(`Compound Interest: ${compoundInterest}`);

   
    createLineChart(years, principal, compoundInterest, rate);
}



