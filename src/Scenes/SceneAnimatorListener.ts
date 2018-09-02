import { Observer, Scene, TransformNode, AbstractMesh, Material, Camera, Observable } from "babylonjs";

type Observers = {
    [key: string]: Observer<any>
}

/**
 * This class is meant to check for changes in Camera, TransformNode, Mesh, Material, that might require a rerender.
 * 
 * Currently watching on:
 * - TransformNode: onAfterWorldMatrixUpdateObservable
 */
export class SceneAnimatorListener {

    protected _scene: Scene;
    protected _observers = new Map<any, Observers>();


    public renderRequired = false;

    constructor(scene: Scene) {
        this.setScene(scene);
    }

    public requestRender() {
        this.renderRequired = true;
    }

    public getObserversFor(node: any, create = true) {

        let observers: Observers

        if (this._observers.has(node)) {
            observers = this._observers.get(node);
        } else if (create) {
            observers = {};
            this._observers.set(node, observers);
        }

        return observers;
    }

    public setScene(value: Scene) {

        if (this._scene == value) {
            return;
        }

        if (this._scene) {
            this.removeScene(this._scene);
        }

        this._scene = value;
        this._observers.set(value, {
            afterRender: value.onAfterRenderObservable.add(() => this.renderRequired = false)
        });

    }
    public removeScene(scene: Scene) {

        const observers = this.getObserversFor(scene, false);

        if (observers) {

            const observers = this._observers.get(scene);

            if (observers.afterRender) {
                scene.onAfterRenderObservable.remove(observers.afterRender);
                observers.afterRender = undefined;
            }

            this._observers.delete(scene);
        }
    }

    public addTransformNode(transformNode: TransformNode) {

        const observers = this.getObserversFor(transformNode);

        if (!observers.worldMatrixUpdate) {
            observers.worldMatrixUpdate = transformNode.onAfterWorldMatrixUpdateObservable.add(() => this.requestRender());
        }

        return observers;
    }
    public removeTransformNode(transformNode: TransformNode) {

        if (this._observers.has(transformNode)) {

            const observers = this._observers.get(transformNode);

            if (observers.worldMatrixUpdate) {
                transformNode.onAfterWorldMatrixUpdateObservable.remove(observers.worldMatrixUpdate);
            }


            this._observers.delete(transformNode);
            return observers;
        }

        return null;
    }

    public addMesh(abstractMesh: AbstractMesh) {

        const observers = this.addTransformNode(abstractMesh);

        if (!observers.materialChange) {
            observers.materialChange = abstractMesh.onMaterialChangedObservable.add(() => this.requestRender());
        }

        return observers;

    }
    public removeMesh(abstractMesh: AbstractMesh) {

        const observers = this.removeTransformNode(abstractMesh);

        if (observers) {

            if (!observers.materialChange) {
                abstractMesh.onMaterialChangedObservable.remove(observers.materialChange);
                observers.materialChange = undefined;
            }

        }

    }

    public addCamera(camera: Camera) {

        const observers = this.getObserversFor(camera);

        if (observers) {
            if (!observers.projectionMatrixUpdate) {
                observers.projectionMatrixUpdate = camera.onProjectionMatrixChangedObservable.add(() => this.requestRender())
            }
            if (!observers.viewMatrixUpdate) {
                observers.viewMatrixUpdate = camera.onViewMatrixChangedObservable.add(() => this.requestRender())
            }
        }

        return observers;
    }
    public removeCamera(camera: Camera) {

        const observers = this.getObserversFor(camera);

        if (observers) {

            if (observers.projectionMatrixUpdate) {
                camera.onProjectionMatrixChangedObservable.remove(observers.projectionMatrixUpdate);
                observers.projectionMatrixUpdate = undefined;
            }

            if (observers.viewMatrixUpdate) {
                camera.onViewMatrixChangedObservable.remove(observers.viewMatrixUpdate);
                observers.viewMatrixUpdate = undefined;
            }

            this._observers.delete(camera);
        }

    }

}