import { Constructor } from "../../types/Constructor";
import { Camera } from "babylonjs";

export const AnimatableCamera = (superClass: Constructor<Camera>) => class extends superClass {

    private __frameHandle: number
    private __animate: (time: number) => void

    public startRenderAnimation() {

        if (!this.__animate) {
            this.__animate = time => {
                this.renderAnimation(time);
                this.__frameHandle = requestAnimationFrame(this.__animate);
            }
        }

        this.__frameHandle = requestAnimationFrame(this.__animate);

    }
    protected renderAnimation(time: number) {

        if (!this.isEnabled()) {
            return
        }

        const scene = this.getScene();
        scene.render();

    }
    public stopRenderAnimation() {

        if (this.__frameHandle) {
            cancelAnimationFrame(this.__frameHandle);
        }

    }

    dispose() {
        this.__animate = undefined;
        this.__frameHandle = undefined;
        super.dispose();
    }

}