import * as THREE from 'three';
import { assert } from 'chai';
import { Segment } from '../cross_sections/segment.js';

var ColumnMoveUp = segments => {
    if (segments[1].direction.z > 0) {
        segments[0].reverse();
        segments[segments.length-1].reverse();
    } else if (segments[1].direction.z < 0) {
        segments.forEach(segment => {
            segment.reverse();
        });
    } else {
        segments.forEach((segment, i, segments) => {
            if (i === 0)
                segment.direction = new THREE.Vector3(1,0,0);
            else if (i === segments.length-1)
                segment.direction = new THREE.Vector3(-1,0,0);
            else
                segment.direction = new THREE.Vector3(0,0,1);
        });
    }
};

var ColumnMoveDown = segments => {
    if (segments[1].direction.z < 0 && segments[1].orientation.x < 0) {
        let scene = segments[0].scene;
        let left = segments[0].right;
        segments.splice(1, 0,
                        new Segment(scene,
                                    left.clone(),
                                    left.clone(),
                                    segments[1].direction,
                                    new THREE.Vector3(1,0,0)));
        let right = segments[segments.length-1].left;
        segments.splice(segments.length-1, 0,
                        new Segment(scene,
                                    right.clone(),
                                    right.clone(),
                                    segments[1].direction,
                                    new THREE.Vector3(1,0,0)));
        segments[0].reverse();
        segments[segments.length-1].reverse();
    } else if (segments[1].direction.z > 0){
        segments.forEach(segment => {
            segment.reverse();
        });
    } else {
        let scene = segments[0].scene;
        let left = segments[0].right;
        segments.splice(1, 0,
                        new Segment(scene,
                                    left.clone(),
                                    left.clone(),
                                    segments[1].direction,
                                    new THREE.Vector3(-1,0,0)));
        let right = segments[segments.length-1].left;
        segments.splice(segments.length-1, 0,
                        new Segment(scene,
                                    right.clone(),
                                    right.clone(),
                                    segments[1].direction,
                                    new THREE.Vector3(-1,0,0)));
        segments.forEach((segment, i, segments) => {
            if (i === 0)
                segment.direction = new THREE.Vector3(1,0,0);
            else if (i === segments.length-1)
                segment.direction = new THREE.Vector3(-1,0,0);
            else
                segment.direction = new THREE.Vector3(0,0,-1);
        });
    }
};

export { ColumnMoveDown, ColumnMoveUp };
