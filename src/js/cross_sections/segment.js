import * as THREE from 'three';
import { DrawObject } from './draw_object.js';

var y_drift = 0.3;
var y_unit = new THREE.Vector3(0,1,0);

var segmentMaterialProperties = {
    color: 0x000000,
    linewidth: 5,
    linecap: 'round', //ignored by WebGLRenderer
    linejoin:  'round' //ignored by WebGLRenderer
};

var arrowProperties = {
    headLength: 0.5,
    headWidth: 0.5,
    linewidth: 10,
    arrowLength: 2.5,
}

var planeMaterial = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
});
planeMaterial.polygonOffset = true;
planeMaterial.depthTest = true;
planeMaterial.depthWrite = false;
planeMaterial.polygonOffsetFactor = 1;
planeMaterial.polygonOffsetUnits = 1;

var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

var color_counter = 0;
var arrowColor = (arrow_counter, darken=0) => {
    let center = 128-darken;
    let width = 87;
    width = Math.min(center, width);
    let frequency = 2.4;
    var r = Math.sin(frequency*arrow_counter + 0) * width + center;
    var g = Math.sin(frequency*arrow_counter + 2) * width + center;
    var b = Math.sin(frequency*arrow_counter + 4) * width + center;
    return b | (g << 8) | (r << 16);
};

class Segment extends DrawObject {
    constructor (scene, left, right, direction, orientation) {
        super();
        this.scale = 0.2;
        this.scene = scene;
        this.left = left;
        this.right = right;
        this.direction = direction;

        // TODO: Edge case when segment has length 0 <07-10-17, shankha> //
        this.orientation = (typeof orientation !== 'undefined') ? orientation : right.clone().sub(left);

        this.makeLines();

        // Indicates whether the current object has been drawn
        this.status = false;

        // Outwards velocity of endpoints
        this.leftVelocity = 0;
        this.rightVelocity = 0;

        this.arrow_counter = 0;
        this.random = false;
    }

    setRandom () {
        let len = 20;
        this.random = true;
        this.random_offsets = Array.from(Array(len).keys()).map(() => {
            return (Math.random()-0.5)*0.8;
        });
        this.random_offsets[0] = 0;
    }

    reverse () {
        this.direction.multiplyScalar(-1);
    }

    translate (v) {
        this.left.add(v);
        this.right.add(v);
        this.makeLines();
    }

    timeTravel (T, polygon) {
        let poly = new THREE.Geometry();
        let outline = new THREE.Geometry();
        let orig = this.right.clone();
        poly.vertices.push(this.right.clone(), this.left.clone());
        outline.vertices.push(this.right.clone(), this.left.clone());
        this.left.add(this.orient.clone().multiplyScalar(-T*this.leftVelocity));
        this.right.add(this.orient.clone().multiplyScalar(T*this.rightVelocity));
        this.left.add(this.direction.clone().multiplyScalar(T));
        this.right.add(this.direction.clone().multiplyScalar(T));
        this.left.add(y_unit.clone().multiplyScalar(T*y_drift));
        this.right.add(y_unit.clone().multiplyScalar(T*y_drift));
        this.makeLines();
        if (polygon) {
            poly.vertices.push(this.left.clone(), this.right.clone());
            outline.vertices.push(this.left.clone(), this.right.clone());
            outline.vertices.push(orig);
            poly.vertices.forEach((point) => {
                point.multiplyScalar(this.scale)
            });
            outline.vertices.forEach((point) => {
                point.multiplyScalar(this.scale)
            });
            poly.faces.push(new THREE.Face3(0,1,3));
            poly.faces.push(new THREE.Face3(3,2,1));
            var mesh = new THREE.Mesh(poly, planeMaterial);
            var line = new THREE.Line(outline, lineMaterial);
            this.scene.add(line);
            return { line, mesh };
        }
    }

    makeLines () {
        this.undraw();

        this.geometry = new THREE.Geometry();
        this.geometry.vertices.push(this.left.clone().multiplyScalar(this.scale));
        this.geometry.vertices.push(this.right.clone().multiplyScalar(this.scale));

        // TODO: Edge case when segment has length 0 <07-10-17, shankha> //
        this.orient = this.right.clone().sub(this.left);
        this.length = this.orient.length();
        if (this.length === 0)
            this.orient = this.orientation.normalize();
        this.delta = this.orient.clone().multiplyScalar(this.scale);
        this.orient.normalize();
        let m = 1;
        this.numArrows = Math.floor(0.9*m*this.delta.length());
        if (this.numArrows > 0)
            this.delta.multiplyScalar(1/this.numArrows);
        else
            this.delta = this.left.clone().add(this.right).multiplyScalar(0.5);

        segmentMaterialProperties.color = arrowColor(this.arrow_counter, 70);
        let segmentMaterial = new THREE.LineBasicMaterial(segmentMaterialProperties);
        segmentMaterial.polygonOffset = true;
        segmentMaterial.depthTest = true;
        segmentMaterial.depthWrite = false;
        segmentMaterial.polygonOffsetFactor = 1;
        segmentMaterial.polygonOffsetUnits = 1;
        this.line = new THREE.Line(this.geometry, segmentMaterial);
        this.arrows = [];
        let arrowPos = (this.numArrows > 0) ? this.left.clone() : this.delta;
        arrowPos.multiplyScalar(this.scale)
        for (let i = 0 ; i <= this.numArrows ; i++) {
            let arrowPosition = arrowPos.clone();
            if (this.random && i < this.numArrows) {
                arrowPosition.add(this.delta.clone().multiplyScalar(this.random_offsets[i]));
            }
            let arrow = new THREE.ArrowHelper(this.direction,
                                              arrowPosition,
                                              arrowProperties.arrowLength,
                                              arrowColor(this.arrow_counter),
                                              arrowProperties.headLength,
                                              arrowProperties.headWidth);
            arrow.line.material.linewidth = arrowProperties.linewidth;
            arrowPos.add(this.delta);
            this.arrows.push(arrow);
        }
        ++color_counter;
    }

    netVelocity () {
        return this.leftVelocity + this.rightVelocity;
    }

    minTime () {
        if (this.netVelocity() <= 0) {
            return -Infinity
        }
        return -this.length / this.netVelocity();
    }

    maxTime () {
        if (this.netVelocity() >= 0) {
            return Infinity
        }
        return -this.length / this.netVelocity();
    }

    draw () {
        if (!this.status) {
            this.scene.add(this.line);
            for (let arrow of this.arrows)
                this.scene.add(arrow);
            this.status = !this.status;
        }
    }

    undraw () {
        if (this.status) {
            this.scene.remove(this.line);
            for (let arrow of this.arrows)
                this.scene.remove(arrow);
            this.status = !this.status;
        }
    }

    clone () {
        let newSegment = new Segment(this.scene,
                                     this.left.clone(),
                                     this.right.clone(),
                                     this.direction.clone(),
                                     this.orientation.clone());
        newSegment.scale = this.scale;
        newSegment.status = this.status;
        newSegment.leftVelocity = this.leftVelocity;
        newSegment.rightVelocity = this.rightVelocity;
        newSegment.arrow_counter = this.arrow_counter;
        newSegment.random = this.random;
        newSegment.random_offsets = this.random_offsets;
        return newSegment;
    }
}

export { Segment };
