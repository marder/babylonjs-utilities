import { Scene, AbstractMesh, Observer, Observable } from "babylonjs";
import { SceneAnimatorListener } from "./SceneAnimatorListener";

/**
 * > IN DEVELOPMENT
 * 
 * Rendering costs lot of power. Especially on mobile devices with a battery.
 * So this is a try to only render, if there is a reason for it.
 * 
 * So if you want the scene to render in a case, that is not caught within this class, you should call function `requestRender`.
 * Then the scene will be rendered on next iteration of `requestAnimationFrame`
 * 
 * @param superClass 
 */
export class SceneAnimator {

    private _scene: Scene;
    private _animateHandle: number
    private _renderRequested = false;
    
    public forceRendering = false;
    public animatorListener: SceneAnimatorListener

    constructor(scene: Scene) {
        this.setScene(scene);
        this.animatorListener = new SceneAnimatorListener(scene);
    }

    /**
     * Overwrite the Scene assigned to this animator.
     * Also manage required observers.
     */
    public setScene(value: Scene) {
        this._scene = value;
    }

    /**
     * Return the Scene assigned to this animator.
     */
    public getScene() {
        return this._scene;
    }

    /**
     * 
     */
    public enablePassiveRendering() {
        if (typeof this._animateHandle != "number") {
            this._animateHandle = requestAnimationFrame(this._animate);
        }
    }

    /**
     * 
     */
    public disablePassiveRendering() {

        if (typeof this._animateHandle == "number") {
            cancelAnimationFrame(this._animateHandle);
            this._animateHandle = undefined;
        }

    }

    /**
     * Enforce rendering the scene on next frame, if animation is enabled.
     */
    public requestRender() {
        this._renderRequested = true;
    }

    /**
     * The actual animation frame call. This should only be called by `requestAnimationFrame`
     */
    protected _animate() {

        if (this._scene && this._shouldRender()) {
            this._scene.render();
            this._renderRequested = false;
        }

        this._animateHandle = requestAnimationFrame(this._animate);

    }

    /**
     * Check if there is a reason for rerendering the scene. For example, an updated matrix of a mesh, updated material, 
     */
    protected _shouldRender() {
        return this.forceRendering || this._renderRequested || this.animatorListener.renderRequired;
    }

}