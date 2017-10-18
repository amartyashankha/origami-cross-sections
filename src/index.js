import * as THREE from 'three';
import { Segment } from './js/cross_sections/segment.js';
import { SegmentList } from './js/cross_sections/segment_list.js';
import { TimeSeries } from './js/time_series/time_series.js';
import { CrossSection2D } from './js/cross_sections/cross_section_2D.js';
import TrackballControls from './js/controls/TrackballControls.js';
import {controllerParameterUpdate, initializeCanvas} from './js/initialize_canvas.js';
import './styles/core.scss'

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(4, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild( renderer.domElement );
let controls = new THREE.TrackballControls( camera, renderer.domElement );

var direction = new THREE.Vector3(0, 1, 0);
var left = new THREE.Vector3(0, 0, 0);
var right = new THREE.Vector3(100, 0, 0);
var s1 = new Segment(scene, left, right, direction);

//var direction = new THREE.Vector3(1, 0, 0);
//var left = new THREE.Vector3(50, 0, 0);
//var right = new THREE.Vector3(50, 50, 0);
//var s2 = new Segment(scene, left, right, direction);

var segments = new SegmentList(scene, [s1]);

let TS = new TimeSeries(scene, segments, 70);

segments.timeTravel(70);
var orientation = new THREE.Vector3(0,1,0);
var direction = new THREE.Vector3(-1,0,0);
segments.makeSegment(0, orientation, direction);

TS.addSnapshot(segments, 40);
segments.timeTravel(40, true);

var orientation = new THREE.Vector3(-1,0,0);
var direction = new THREE.Vector3(0,1,0);
segments.makeSegment(0, orientation, direction);

TS.addSnapshot(segments, 40);
segments.timeTravel(40, true, true);

TS.addSnapshot(segments, 50);
//segments.timeTravel(20, true);

//segments.setDirection(new THREE.Vector3(0,0,1));
//segments.timeTravel(20, true);

//segments.refresh();

var T = 40

// Options to be added to the GUI
let options = {
    controller: {
        rotateSpeed: 1.0,
        zoomSpeed: 1.2,
        panSpeed: 0.1,
    },
    reset: function() {
        this.velx = 0.1;
        this.vely = 0.1;
        camera.position.z = 75;
        camera.position.x = 0;
        camera.position.y = 0;
        cube.scale.x = 1;
        cube.scale.y = 1;
        cube.scale.z = 1;
        cube.material.wireframe = true;
    },
    time: T,
};

initializeCanvas(scene, camera, renderer, controls, options);

// DAT.GUI Related Stuff
let gui = new dat.GUI({ width: 900 });

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
let timeController = gui.add(options, 'time', 0, 200).step(1);

timeController.onChange(function(time) {
    TS.timeTravel(time);
});


// Rendering the animation   
render();
function render() {
    requestAnimationFrame( render );
    controls.update();
renderer.render(scene, camera);
}
