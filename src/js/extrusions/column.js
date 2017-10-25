import * as THREE from 'three';
import { assert } from 'chai';
import { Segment } from '../cross_sections/segment.js';
import { SegmentList } from '../cross_sections/segment_list.js';
import { ColumnMoveDown, ColumnMoveUp } from './column_movement.js';

var Column = {
    create: function(scene, origin, width, del, layers, move, init_layers=0) {
        var instance = Object.create(this);

        var segments = [];
        var x_unit = new THREE.Vector3(1,0,0);
        var y_unit = new THREE.Vector3(0,1,0);
        var z_unit = new THREE.Vector3(0,0,1);
        var delta = x_unit.clone().multiplyScalar(del);
        var rev_delta = x_unit.clone().multiplyScalar(-del);

        if (move == 'forward') {
            var top_direction = y_unit.clone();
            var left_direction = y_unit.clone();
            var right_direction = y_unit.clone();
        } else if (move == 'up') {
            var top_direction = z_unit.clone();
            var left_direction = x_unit.clone();
            var right_direction = x_unit.clone().multiplyScalar(-1);
        } else if (move == 'down') {
            var top_direction = z_unit.clone().multiplyScalar(-1);
            var left_direction = x_unit.clone();
            var right_direction = x_unit.clone().multiplyScalar(-1);
        } else {
            assert(false, "Invalid direction");
        }

        var new_origin = origin.clone()
                               .add(z_unit.clone()
                                          .multiplyScalar(2*del*init_layers));
        segments.push(new Segment(scene,
                                  origin.clone(),
                                  new_origin.clone(),
                                  left_direction,
                                  z_unit.clone()));
        origin = new_origin;

        if (move == 'down') {
            segments.push(new Segment(scene,
                                      origin.clone(),
                                      origin.clone(),
                                      top_direction,
                                      x_unit.clone().multiplyScalar(-1)));
        }

        for(let i = init_layers ; i < layers ; ++i) {
            segments.push(new Segment(scene,
                                      origin.clone(),
                                      origin.clone().add(delta),
                                      top_direction));
            segments.push(new Segment(scene,
                                      origin.clone().add(delta),
                                      origin.clone(),
                                      top_direction));
            segments[segments.length-1].setRandom();
            segments[segments.length-2].setRandom();
        }

        new_origin = origin.clone();
        new_origin.add(x_unit.clone().multiplyScalar(width));
        segments.push(new Segment(scene,
                                  origin.clone(),
                                  new_origin.clone(),
                                  top_direction));
        origin = new_origin;

        for(let i = init_layers ; i < layers ; ++i) {
            segments.push(new Segment(scene,
                                      origin.clone(),
                                      origin.clone().add(rev_delta),
                                      top_direction));
            segments.push(new Segment(scene,
                                      origin.clone().add(rev_delta),
                                      origin.clone(),
                                      top_direction));
            segments[segments.length-1].setRandom();
            segments[segments.length-2].setRandom();
        }

        if (move == 'down') {
            segments.push(new Segment(scene,
                                      origin.clone(),
                                      origin.clone(),
                                      top_direction,
                                      x_unit.clone().multiplyScalar(-1)));
        }

        new_origin = origin.clone()
                               .add(z_unit.clone()
                                          .multiplyScalar(-2*del*init_layers));
        segments.push(new Segment(scene,
                                  origin.clone(),
                                  new_origin.clone(),
                                  right_direction,
                                  z_unit.clone().multiplyScalar(-1)));

        let segment_list = new SegmentList(scene, segments);
        Object.keys(segment_list).forEach(key => {
            instance[key] = segment_list[key];
        });
        instance.segments = segments;
        //instance.__proto__ = SegmentList.prototype;

        return instance;
    },

    moveForward: function() {
        this.setDirection(new THREE.Vector3(0,1,0));
    },

    moveUp: function() {
        ColumnMoveUp(this.segments);
        this.updateVelocities();
    },

    moveDown: function() {
        ColumnMoveDown(this.segments);
        this.updateVelocities();
    }
};

Column.__proto__ = SegmentList.prototype;

export { Column };
