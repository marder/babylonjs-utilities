import { Scene, Mesh, Nullable } from "babylonjs";

export type MeshConstructor = {
   new(name: string, scene?: Nullable<Scene>, parent?: Nullable<Node>, source?: Nullable<Mesh>, doNotCloneChildren?: boolean, clonePhysicsImpostor?: boolean): Mesh
}