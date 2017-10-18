import * as THREE from 'three';
import { assert } from 'chai';
import { Segment } from './segment.js';
import { DrawObject } from './draw_object.js';

class SegmentList extends DrawObject {
    constructor (scene, segments) {
        super();
        if (__DEV__)
            for (var i = 0, len = segments.length; i < len-1; i++) {
                let first = segments[i];
                let second = segments[i+1];
                assert(first.right.equals(second.left), 'segments are not continuous');
                let firstCross = first.orient.clone().cross(first.direction).normalize();
                let secondCross = second.orient.clone().cross(second.direction).normalize();
                assert(firstCross.add(secondCross).length() === 0, 'directions are not correct');
            }
        this.scene = scene;
        this.segments = segments;
        this.updateVelocities();
    }

    timeTravel (T, polygon=false, filter=false) {
        assert(T <= this.maxTime(), 'You\'re going to (max)time prison');
        assert(T >= this.minTime(), 'You\'re going to (min)time prison');
        this.segments.forEach(function(segment) {
            segment.timeTravel(T, polygon);
        });
        if (filter) {
            this.segments = this.segments.filter(function(segment) {
                return segment.length > 0;
            });
            this.updateVelocities();
        }
    }

    updateVelocities () {
        let len = this.segments.length;
        for (var i = 0; i < len-1; i++) {
            let first = this.segments[i];
            let second = this.segments[i+1];
            // TODO: make this more general <07-10-17, shankha> //
            first.rightVelocity = Math.sign(first.orientation.dot(second.direction));
            second.leftVelocity = -first.rightVelocity;
        }
        this.segments[0].leftVelocity = 0;
        this.segments[len-1].rightVelocity = 0;
    }

    minTime () {
        return this.segments.map(segment => segment.minTime())
                   .reduce((curr_min, max_time) => Math.max(curr_min, max_time), -Infinity);
    }


    maxTime () {
        return this.segments.map(segment => segment.maxTime())
                   .reduce((curr_min, max_time) => Math.min(curr_min, max_time), Infinity);
    }

    draw () {
        this.segments.forEach(function(segment) {
            segment.draw();
        });
    }

    undraw () {
        this.segments.forEach(function(segment) {
            segment.undraw();
        });
    }

    clone () {
        return new SegmentList(this.segments.map(segment => segment.clone()));
    }

    // TODO: Implement case where index = -1 <18-10-17, shankha> //
    makeSegment(index, orientation, direction) {
        let origin = new THREE.Vector3();
        let newSegment = new Segment(this.scene,
                                     origin.clone(),
                                     origin.clone(),
                                     direction.clone(),
                                     orientation.clone());
        newSegment.translate(this.segments[index].right);
        this.segments.splice(index+1, 0, newSegment);
        let first = this.segments[index];
        let second = this.segments[index+1];
        let firstCross = first.orient.clone().cross(first.direction).normalize();
        let secondCross = second.orient.clone().cross(second.direction).normalize();
        if (firstCross.add(secondCross).length() === 0) {
            this.reverseSegments(index+2, this.segments.length);
        } else {
            this.reverseSegments(0, index+1);
        }
        this.updateVelocities();
    }

    reverseSegments(beg, end) {
        for (var i = beg; i < end; i++) {
            this.segments[i].reverse();
        }
    }

    setDirection(direction) {
        this.segments.forEach(function(segment) {
            segment.direction = direction;
            segment.makeLines();
        });
        this.updateVelocities();
    }
}

export { SegmentList };
