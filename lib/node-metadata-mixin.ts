import { Node } from "babylonjs";
import { Constructor } from "./types/Constructor";

/**
 * Expand `Node` constructor.
 * - Initialize property `metadata` at object initialization
 * @param base 
 */
export const nodeMetadata:any = (base: Constructor<Node>) => class extends base {

   constructor(...args: any[]) {
      super(...args);
      this.metadata = {};
   }

}

BABYLON.Node = nodeMetadata(Node);