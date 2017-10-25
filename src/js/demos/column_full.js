import * as THREE from 'three';
import { assert } from 'chai';
import { Segment } from '../cross_sections/segment.js';
import { SegmentList } from '../cross_sections/segment_list.js';
import { TimeSeries } from '../time_series/time_series.js';
import { Column } from '../extrusions/column.js';
import { ColumnMoveDown, ColumnMoveUp } from '../extrusions/column_movement.js';

var GenerateTimeSeries = (scene, col=[1, 3, 1, 2, 0]) => {
    var origin = new THREE.Vector3();
    var x_unit = new THREE.Vector3(1,0,0);
    var y_unit = new THREE.Vector3(0,1,0);
    var z_unit = new THREE.Vector3(0,0,1);

    var width = 100;
    var delta = 30;
    var max_height = Math.max(...col);
    var num_layers = max_height;
    var move = 'forward';

    var curr_height = 0;

    var column = Column.create(scene,
                      origin,
                      width,
                      delta,
                      num_layers,
                      move,
                      curr_height);
    var TS = new TimeSeries(scene, column, width);
    column.timeTravel(width);

    for (let i = 0, len = col.length ; i < len ; ++i) {
        for (let j = 0, len = Math.abs(col[i]-curr_height) ; j < len ; ++j) {
            if (col[i] > curr_height)
                column.moveUp();
            else
                column.moveDown();

            TS.addSnapshot(column, delta);
            column.timeTravel(delta, true, true);

            if (col[i] < curr_height)
                column.moveDown();
            else
                column.moveUp();

            TS.addSnapshot(column, delta);
            column.timeTravel(delta, true, true);

            curr_height += (curr_height < col[i]) ? 1 : -1;
        }

        column.moveForward();
        TS.addSnapshot(column, width);
        column.timeTravel(width);
    }

    let T = TS.maxTime;

    return { TS, T };
}

export { GenerateTimeSeries };
