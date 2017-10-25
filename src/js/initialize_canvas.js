let initializeCanvas = (scene, camera, renderer, controls, options) => {
    camera.position.z = -500;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.lookAt(scene.position);
    camera.updateMatrixWorld();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff );

    controllerParameterUpdate(controls, options);

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener( 'change', () => {renderer.render(scene, camera);});
};

let controllerParameterUpdate = (controls, options) => {
    controls.rotateSpeed = options.controller.rotateSpeed;
    controls.zoomSpeed = options.controller.zoomSpeed;
    controls.panSpeed = options.controller.panSpeed;
}

export { initializeCanvas, controllerParameterUpdate };
