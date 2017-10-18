import * as THREE from 'three';

class DrawObject {
    refresh () {
        this.undraw();
        this.draw();
    }
}

export { DrawObject };
