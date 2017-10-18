import * as THREE from 'three';
import { Segment } from './segment.js';
import { SegmentList } from './segment_list.js';

class CrossSection2D extends SegmentList {
//class CrossSection2D {
    constructor(segments) {
        super(segments);
    }

    // TODO: Implement case where index = -1 <18-10-17, shankha> //
    makeSegment(index, orientation, direction) {
        let origin = THREE.Vector3(0,0,0);
        let newSegment = Segment(this.scene, origin, origin, direction, orientation);
        newSegment.translate(this.segments[index].right);
        let first = segments[index];
        let second = segments[index+1];
        let directionCross = first.direction.clone().cross(second.direction).normalize();
        let orientCross = first.orient.clone().cross(second.orient).normalize();
        if (directionCross.add(orientCross).length() === 0) {
            this.reverseSegments(index+1, this.segments.length);
        } else {
            this.reverseSegments(0, index+1);
        }
    }

    reverseSegments(beg, end) {
        for (var i = beg; i < end; i++) {
            this.segments[i].reverse();
        }
    }

}

export { CrossSection2D };
