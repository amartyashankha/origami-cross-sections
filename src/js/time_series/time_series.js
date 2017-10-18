import * as THREE from 'three';
import { assert } from 'chai';
import { Segment } from '../cross_sections/segment.js';
import { SegmentList } from '../cross_sections/segment_list.js';

class TimeSeries {
    constructor (scene, start, maxTime) {
        this.scene = scene;
        if (typeof start != SegmentList) {
            start = (start === undefined) ? 100 : start;
            start = Segment(this.scene,
                            new THREE.Vector3(0,0,0),
                            new THREE.Vector3(start, 0, 0),
                            new THREE.Vector3(0,1,0));
            start = SegmentList(this.scene, [start]);
        }
        maxTime = (maxTime === undefined) ? start.maxTime() : maxTime;
        this.snapshots = [{ snapshot: start, maxTime, startTime: 0, endTime: maxTime }]
        this.maxTime = maxTime;
        this.currTime = 0;
        this.currIndex = 0;
    }

    addSnapshot (segments, maxTime) {
        maxTime = (maxTime === undefined) ? start.maxTime() : maxTime;
        let previous = this.snapshots[this.snapshots.length-1];
        startTime = previous.startTime + previous.maxTime;
        endTime = startTime + maxTime;
        this.snapshots.push({ snapshot: segments, maxTime, startTime, endTime});
        this.maxTime += maxTime;
    }

    timeTravel (T) {
        assert(T <= this.maxTime);
        while (self.snapshots[) {
            
        }
        for (var i = self.currIndex ; ; i--) {
        }
    }
}

export { TimeSeries };
