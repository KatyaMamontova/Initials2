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

        // light.castShadow = true;
        // light.shadow.mapSize.width = 1000;
        // light.shadow.mapSize.height = 1000;
        scene.add(light);
    }

    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            // 'https://community.theta360.guide/uploads/default/original/2X/8/87a28fdbb7d4850d72472f34e116ce43127042cf.jpeg',
            // 'https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
            // 'https://d2kiovrlj2atne.cloudfront.net/panos/24853/pano.tiles/thumb900x450.jpg',
            // 'https://img.immoviewer.com/items/jll/5aa170eec9e77c005082b1d7/Tour/B1611_C631_P766_30_08_2017_edit_felix5907.jpg',
            // 'https://live.staticflickr.com/2127/2043866600_edddae7146_h.jpg',
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

    //Г

    const material1 = new THREE.MeshToonMaterial({
        color: '#cc4',
        shininess: 100,
        emissive: '#555555'
    });

    const widthLB = 0.3;
    const height = 1.6;
    const depthB = 0.2;
    const longBoxGeometry = new THREE.BoxGeometry(widthLB, height, depthB);
    const box1 = new THREE.Mesh(longBoxGeometry, material1);
    box1.position.x = -2;

    const widthSB = 0.2;
    const heightSB = 1;
    const shortBoxGeometry = new THREE.BoxGeometry(widthSB, heightSB, depthB);
    const box2 = new THREE.Mesh(shortBoxGeometry, material1);
    box2.position.x = box1.position.x + heightSB / 2 - widthLB / 2;
    box2.position.y = height / 2 - widthSB / 2;
    box2.rotateZ(Math.PI / 2);

    const groupG = new THREE.Group();
    groupG.add(box1);
    groupG.add(box2);
    scene.add(groupG);


    //Л

    const material2 = new THREE.MeshStandardMaterial({
        color: '#faf',
        roughness: 0.4,
        metalness: 0.6
    });

    const radiusTop = 0.2;
    const radiusBottom = 0.2;
    const heightC = height - 0.05;
    const radialSegments = 100;
    const longCylinderGeometry = new THREE.CylinderGeometry(
        radiusTop, radiusBottom, heightC, radialSegments);
    const cylinder1 = new THREE.Mesh(longCylinderGeometry, material2);
    cylinder1.position.x = -0.6;
    cylinder1.rotateZ(-Math.PI / 9);

    const shortCylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, heightC, radialSegments);
    const cylinder2 = new THREE.Mesh(shortCylinderGeometry, material2);
    cylinder2.position.x = cylinder1.position.x + 0.5;
    cylinder2.rotateZ(Math.PI / 9);

    const radius = 0.27;
    const widthSegments = 100;
    const heightSegments = 100;
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
    const sphere = new THREE.Mesh(sphereGeometry, material2);
    sphere.position.x = cylinder1.position.x + 0.25;
    sphere.position.y = height / 2 - 0.2;

    const groupL = new THREE.Group();
    groupL.add(cylinder1);
    groupL.add(cylinder2);
    groupL.add(sphere);
    scene.add(groupL);
    groupL.position.y = -0.05;


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

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
