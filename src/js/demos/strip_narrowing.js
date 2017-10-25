import * as THREE from 'three';
import { Segment } from '../cross_sections/segment.js';
import { SegmentList } from '../cross_sections/segment_list.js';
import { TimeSeries } from '../time_series/time_series.js';

var GenerateTimeSeries = (scene) => {
    var direction = new THREE.Vector3(0, 1, 0);
    var left = new THREE.Vector3(0, 0, 0);
    var right = new THREE.Vector3(100, 0, 0);
    var s1 = new Segment(scene, left, right, direction);

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
    segments.segments[1].setRandom();

    TS.addSnapshot(segments, 40);
    segments.timeTravel(40, true, true);

    TS.addSnapshot(segments, 50);

    let T = 200;

    return { TS, T };
}

export { GenerateTimeSeries };
