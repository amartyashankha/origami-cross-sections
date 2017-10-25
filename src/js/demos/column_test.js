import * as THREE from 'three';
import { Segment } from '../cross_sections/segment.js';
import { SegmentList } from '../cross_sections/segment_list.js';
import { TimeSeries } from '../time_series/time_series.js';
import { Column } from '../extrusions/column.js';
import { ColumnMoveDown, ColumnMoveUp } from '../extrusions/column_movement.js';

var GenerateTimeSeries = (scene) => {
    var origin = new THREE.Vector3();
    var x_unit = new THREE.Vector3(1,0,0);
    var y_unit = new THREE.Vector3(0,1,0);
    var z_unit = new THREE.Vector3(0,0,1);

    var width = 100;
    var delta = 30;
    var num_layers = 3;
    var init_layers = 2;
    var move = 'forward';
    var segment_list = Column.create(scene,
                      origin,
                      width,
                      delta,
                      num_layers,
                      move,
                      init_layers);

    let TS = new TimeSeries(scene, segment_list, 30);
    segment_list.timeTravel(delta);
    TS.timeTravel(delta);

    origin = TS.origin();
    move = 'down';
    var segment_list = Column.create(scene,
                      origin,
                      width,
                      delta,
                      num_layers,
                      move,
                      init_layers);

    TS.addSnapshot(segment_list, delta);

    segment_list.timeTravel(delta, true, move === 'up');
    segment_list.moveDown();

    TS.addSnapshot(segment_list, delta);

    segment_list.timeTravel(delta, true, move === 'up');
    segment_list.setDirection(y_unit);
    TS.addSnapshot(segment_list, 30);

    let T = 120;

    return { TS, T };
}

export { GenerateTimeSeries };
