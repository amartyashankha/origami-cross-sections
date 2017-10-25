import * as THREE from 'three';
//import { GenerateTimeSeries } from './js/demos/column_test.js';
import { GenerateTimeSeries } from './js/demos/column_full.js';
//import { CrossSection2D } from './js/cross_sections/cross_section_2D.js';
import TrackballControls from './js/controls/TrackballControls.js';
import * as dat from 'dat.gui/build/dat.gui.js';
import {controllerParameterUpdate, initializeCanvas} from './js/initialize_canvas.js';
import './styles/core.scss'

import { SegmentList } from './js/cross_sections/segment_list.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(4, window.innerWidth / window.innerHeight, 0.1, 50000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild( renderer.domElement );
let controls = new THREE.TrackballControls( camera, renderer.domElement );

var initialize = () => {
    let ret = GenerateTimeSeries(scene, [1, 3, 1, 2, 0]);
    ret.TS.timeTravel(ret.T);
    return ret;
};

let { TS, T } = initialize();

// Options to be added to the GUI
let options = {
    controller: {
        rotateSpeed: 1.0,
        zoomSpeed: 1.2,
        panSpeed: 0.1,
    },
    reset: function() {
        camera.position.z = 500;
        camera.position.x = 0;
        camera.position.y = 0;
        let { TS, T } = initialize();
        this.time = T;
    },
    TS: TS,
    time: T,
};

initializeCanvas(scene, camera, renderer, controls, options);

// DAT.GUI Related Stuff
let gui = new dat.GUI({ width: 500, resizable: true });

let controller = gui.addFolder('Trackball Controls');
[
    controller.add(options.controller, 'rotateSpeed', 0.0, 2.0),
    controller.add(options.controller, 'zoomSpeed', 0.0, 2.0),
    controller.add(options.controller, 'panSpeed', 0.0, 0.5),
].forEach(function(C) {
        C.onChange(function(value) {
            controllerParameterUpdate(controls, options);
        });
    });

gui.add(options, 'reset');
let timeController = gui.add(options, 'time', 0, options.time).step(1);

timeController.onChange(function(time) {
    options.TS.timeTravel(time);
});


// Rendering the animation   
render();
function render() {
    requestAnimationFrame( render );
    controls.update();
renderer.render(scene, camera);
}
