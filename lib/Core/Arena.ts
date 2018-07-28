import { Scene, Engine, EnvironmentHelper } from "babylonjs";
import { ArenaInit } from "./ArenaInit";

export class Arena extends Scene {

    environment: EnvironmentHelper

    constructor(engine: Engine, init: ArenaInit) {
        super(engine);
        this.initialize(init);
    }

    protected initialize(init: ArenaInit) {

        this.environment = this.createDefaultEnvironment({
            createGround: true,
            groundSize: init.ground.size,
            groundTexture: init.ground.texture,
            createSkybox: true,
            skyboxSize: init.walls.height,
            skyboxTexture: init.walls.texture,
            environmentTexture: init.environmentTexture
        });

    }

}