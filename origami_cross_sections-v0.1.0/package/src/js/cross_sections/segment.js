import * as THREE from 'three';
import { DrawObject } from './draw_object.js';

var segmentMaterial = new THREE.LineBasicMaterial( {
    color: 0x000000,
    linewidth: 5,
    linecap: 'round', //ignored by WebGLRenderer
    linejoin:  'round' //ignored by WebGLRenderer
} );

var arrowProperties = {
    headLength: 0.1,
    headWidth: 0.1,
    linewidth: 2,
    arrowLength: 0.5,
}

var planeMaterial = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
});
planeMaterial.polygonOffset = true;
planeMaterial.depthTest = true;
planeMaterial.depthWrite = false;
planeMaterial.polygonOffsetFactor = 1;
planeMaterial.polygonOffsetUnits = 1;

var arrowColor = 0x005f00;

class Segment extends DrawObject {
    constructor (scene, left, right, direction, orientation) {
        super();
        this.scale = 0.1;
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
        poly.vertices.push(this.right.clone(), this.left.clone());
        this.left.add(this.orient.clone().multiplyScalar(-T*this.leftVelocity));
        this.right.add(this.orient.clone().multiplyScalar(T*this.rightVelocity));
        this.left.add(this.direction.clone().multiplyScalar(T));
        this.right.add(this.direction.clone().multiplyScalar(T));
        this.makeLines();
        if (polygon) {
            poly.vertices.push(this.right.clone(), this.left.clone());
            poly.vertices.forEach((point) => {
                point.multiplyScalar(this.scale)
            });
            poly.faces.push(new THREE.Face3(0,1,2));
            poly.faces.push(new THREE.Face3(2,3,1));
            var mesh = new THREE.Mesh(poly, planeMaterial);
            //this.scene.add(mesh);
            return mesh;
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
        this.numArrows = Math.floor(0.9*this.delta.length()) * 2;
        if (this.numArrows > 0)
            this.delta.multiplyScalar(1/this.numArrows);
        else
            this.delta = this.left.clone().add(this.right).multiplyScalar(0.5);

        this.line = new THREE.Line(this.geometry, segmentMaterial);
        this.arrows = [];
        let arrowPos = (this.numArrows > 0) ? this.left.clone() : this.delta;
        arrowPos.multiplyScalar(this.scale)
        for (let i = 0 ; i <= this.numArrows ; i++) {
            let arrow = new THREE.ArrowHelper(this.direction,
                                              arrowPos,
                                              arrowProperties.arrowLength,
                                              arrowColor,
                                              arrowProperties.headLength,
                                              arrowProperties.headWidth);
            arrow.line.material.linewidth = arrowProperties.linewidth;
            arrowPos.add(this.delta);
            this.arrows.push(arrow);
        }
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
        return newSegment;
    }
}

export { Segment };
