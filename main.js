function main() {
  const canvas = document.querySelector('.screen');
  const renderer = new THREE.WebGLRenderer({ canvas, antialiasing: true });
  // renderer.shadowMap.enabled = true;

  const fov = 95;
  const aspect = 2;
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);

    let lightX = -1;
    let lightY = 2;
    const lightZ = 2;
    light.position.set(lightX, lightY, lightZ);

    scene.add(light);
  }

  const loader = new THREE.TextureLoader();
  {
    const texture = loader.load(

      'https://upload.wikimedia.org/wikipedia/commons/a/af/Cologne_at_Night_–_360°_panorama_from_high_up_–_July_2021.jpg',

      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });
  }

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();


  //материалы

  const colorInput = document.getElementById('colorInput');
  colorInput.addEventListener('input', () => {
    materialColor.color.set(colorInput.value)
  })
  const materialColor = new THREE.MeshStandardMaterial({
    color: colorInput.value,
    roughness: 0.3,
    metalness: 0.2
  });


  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024);
  const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
  const materialMirror = new THREE.MeshStandardMaterial({
    envMap: cubeRenderTarget.texture,
    roughness: 0.01,
    metalness: 1,
    side: THREE.DoubleSide,
  });


  const imgTexture = loader.load(
    "https://live.staticflickr.com/6079/6048692245_f0b933bb17_c.jpg"
  );
  const materialImage = new THREE.MeshPhongMaterial({
    map: imgTexture,
    side: THREE.DoubleSide,
  });


  const materialTransparent = new THREE.MeshStandardMaterial({
    color: 0x0088FF,
    roughness: 0.3,
    metalness: 0.2,
    transparent: true,
    opacity: 0.5
  });


  uniforms = {
    "time": { value: 1.1 },
    resolution: { type: "v2", value: new THREE.Vector2 }
  };
  const materialShader = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: document.getElementById('vs').textContent,
    fragmentShader: document.getElementById('fsBox').textContent,
    side: THREE.DoubleSide,
    transparent: true,
  });


  //Г

  const widthLB = 0.3;
  const height = 1.6;
  const depthB = 0.2;
  const longBoxGeometry = new THREE.BoxGeometry(widthLB, height, depthB);
  const box1 = new THREE.Mesh(longBoxGeometry, materialMirror);
  box1.position.x = -2;

  const widthSB = 0.2;
  const heightSB = 1;
  const shortBoxGeometry = new THREE.BoxGeometry(widthSB, heightSB, depthB);
  const box2 = new THREE.Mesh(shortBoxGeometry, materialMirror);
  box2.position.x = box1.position.x + heightSB / 2 - widthLB / 2;
  box2.position.y = height / 2 - widthSB / 2;
  box2.rotateZ(Math.PI / 2);

  const groupG = new THREE.Group();
  groupG.add(box1);
  groupG.add(box2);
  scene.add(groupG);


  //Л

  const radiusTop = 0.2;
  const radiusBottom = 0.2;
  const heightC = height - 0.05;
  const radialSegments = 100;
  const cylinderGeometry = new THREE.CylinderGeometry(
    radiusTop, radiusBottom, heightC, radialSegments);
  const cylinder1 = new THREE.Mesh(cylinderGeometry, materialMirror);
  cylinder1.position.x = -0.6;
  cylinder1.rotateZ(-Math.PI / 9);

  const cylinder2 = new THREE.Mesh(cylinderGeometry, materialMirror);
  cylinder2.position.x = cylinder1.position.x + 0.5;
  cylinder2.rotateZ(Math.PI / 9);

  const radius = 0.27;
  const widthSegments = 100;
  const heightSegments = 100;
  const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
  const sphere = new THREE.Mesh(sphereGeometry, materialMirror);
  sphere.position.x = cylinder1.position.x + 0.25;
  sphere.position.y = height / 2 - 0.2;

  const groupL = new THREE.Group();
  groupL.add(cylinder1);
  groupL.add(cylinder2);
  groupL.add(sphere);
  scene.add(groupL);
  groupL.position.y = -0.05;


  //Ф

  const widthLP = 0.3;
  const heightLP = height;
  const longPlaneGeometry = new THREE.PlaneGeometry(widthLP, heightLP);

  const widthSP = 0.3;
  const heightSP = heightLP / 2;
  const shortPlaneGeometry = new THREE.PlaneGeometry(widthSP, heightSP);

  const plane1 = new THREE.Mesh(longPlaneGeometry, materialMirror);
  plane1.position.x = 1.5;

  const plane2 = new THREE.Mesh(longPlaneGeometry, materialMirror);
  plane2.position.x = plane1.position.x;
  plane2.position.y = heightLP / 2;
  plane2.rotateZ(Math.PI / 2);

  const plane3 = new THREE.Mesh(longPlaneGeometry, materialMirror);
  plane3.position.x = plane1.position.x;
  plane3.rotateZ(Math.PI / 2);

  const plane4 = new THREE.Mesh(shortPlaneGeometry, materialMirror);
  plane4.position.x = plane1.position.x - heightLP / 2;
  plane4.position.y = heightLP / 4;

  const plane5 = new THREE.Mesh(shortPlaneGeometry, materialMirror);
  plane5.position.x = plane1.position.x + heightLP / 2;
  plane5.position.y = heightLP / 4;

  const groupF = new THREE.Group();
  groupF.add(plane1);
  groupF.add(plane2);
  groupF.add(plane3);
  groupF.add(plane4);
  groupF.add(plane5);
  scene.add(groupF);

  //поворот

  let needRotateG = false;
  let needRotateL = false;
  let needRotateF = false;

  document.addEventListener('keyup', event => {
    (event.code == 'Digit1') ? needRotateG = true :
      (event.code == 'Digit2') ? needRotateL = true :
        (event.code == 'Digit3') ? needRotateF = true : () => {
          needRotateG = false;
          needRotateL = false;
          needRotateF = false;
        };
  });

  const step = Math.PI / 100;
  let angleG = 0;
  let angleL = 0;
  let angleF = 0;

  //выбор буквы кликом
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let currentMaterial = materialColor;
  let intersects;

  function onMouseClick(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.parent.children.forEach(child => child.material = currentMaterial)
    }
  }

  window.addEventListener('click', onMouseClick, false);
  //

  //выбор материала

  let materialInputs = document.querySelectorAll('input[name="material"]');

  materialInputs.forEach(input => {
    input.addEventListener('change', () => {
      currentMaterial =
        (input.value === 'mirror') ? materialMirror :
          (input.value === 'picture') ? materialImage :
            (input.value === 'transparency') ? materialTransparent :
              (input.value === 'shader') ? materialShader : materialColor
    });
  });

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;
    uniforms['time'].value = time;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if (needRotateG) {
      if (angleG < 2 * Math.PI) {
        angleG += step;
        groupG.rotation.x = angleG;
      } else {
        angleG = 0;
        needRotateG = false;
      }
    }

    if (needRotateL) {
      if (angleL < 2 * Math.PI) {
        angleL += step;
        groupL.rotation.x = angleL;
      } else {
        angleL = 0;
        needRotateL = false;
      }
    }

    if (needRotateF) {
      if (angleF < 2 * Math.PI) {
        angleF += step;
        groupF.rotation.x = angleF;
      } else {
        angleF = 0;
        needRotateF = false;
      }
    }

    cubeCamera.update(renderer, scene);
    materialMirror.envMap = cubeRenderTarget.texture;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
