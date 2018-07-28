import { Texture, Camera, Material, AbstractMesh, StandardMaterial } from "babylonjs";

export type ArenaGroundInit = {
    /** Size on x and z axis */
    size: number
    /** texture for the material (StandardMaterial) */
    texture: Texture
};

export type ArenaWallsInit = {
    /** Size on y axis */
    height: number
    /** Texture or Textures for the material (StandardMaterial) */
    texture?: Texture
};

export type ArenaRoofInit = {
    /** texture for the roof */
    texture?: Texture
};

export type ArenaInit = {
    ground: ArenaGroundInit
    walls: ArenaWallsInit
    roof?: ArenaRoofInit
    environmentTexture: Texture | string
}