import * as THREE from 'three';
import { assert } from 'chai';
import { Segment } from '../cross_sections/segment.js';
//import { SegmentList } from '../cross_sections/segment_list.js';

class TimeSeries {
    constructor (scene, start, maxTime) {
        this.scene = scene;
        //if (typeof start != SegmentList) {
            //start = (start === undefined) ? 100 : start;
            //start = Segment(this.scene,
                            //new THREE.Vector3(0,0,0),
                            //new THREE.Vector3(start, 0, 0),
                            //new THREE.Vector3(0,1,0));
            //start = SegmentList(this.scene, [start]);
        //}
        maxTime = (maxTime === undefined) ? start.maxTime() : maxTime;
        let snapshot = start.clone();
        this.snapshots = [{ snapshot, maxTime, startTime: 0, endTime: maxTime }]
        this.maxTime = maxTime;
        this.currTime = 0;
        this.currIndex = 0;
    }

    origin () {
        let curr = this.snapshots[this.currIndex];
        return curr.snapshot.segments[0].left.clone();
    }

    addSnapshot (segments, maxTime) {
        maxTime = (maxTime === undefined) ? segments.maxTime() : maxTime;
        let previous = this.snapshots[this.snapshots.length-1];
        let startTime = previous.startTime + previous.maxTime;
        let endTime = startTime + maxTime;
        let snapshot = segments.clone();
        this.snapshots.push({ snapshot, maxTime, startTime, endTime});
        this.maxTime += maxTime;
    }

    timeTravel (T) {
        assert(T <= this.maxTime);
        let curr = this.snapshots[this.currIndex];
        let delta = curr.startTime-this.currTime;
        curr.snapshot.undraw();
        curr.snapshot.timeTravel(delta);
        this.scene.remove(curr.polygons);
        while (this.currIndex > 0 && this.snapshots[this.currIndex-1].endTime > T) {
            // TODO: Delete faces <18-10-17, shankha> //
            let curr = this.snapshots[--this.currIndex];
            curr.snapshot.timeTravel(-curr.maxTime);
            this.scene.remove(curr.polygons);
        }
        while (true) {
            let curr = this.snapshots[this.currIndex++];
            if (curr.endTime < T) {
                let polygons = curr.snapshot.timeTravel(curr.maxTime, true);
                curr.polygons = polygons;
                this.scene.add(polygons);
            } else {
                let polygons = curr.snapshot.timeTravel(T-curr.startTime, true);
                curr.polygons = polygons;
                this.scene.add(polygons);
                curr.snapshot.draw();
                break;
            }
        }
        this.currIndex--;
        this.currTime = T;
    }
}

export { TimeSeries };
