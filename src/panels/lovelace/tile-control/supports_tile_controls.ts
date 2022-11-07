import { HassEntity } from "home-assistant-js-websocket";
import { computeDomain } from "../../../common/entity/compute_domain";
import { supportsFeature } from "../../../common/entity/supports-feature";
import { CoverEntityFeature } from "../../../data/cover";
import { lightSupportsBrightness } from "../../../data/light";
import { LovelaceTileControlConfig } from "./types";

type TileControlType = LovelaceTileControlConfig["type"];
export type SupportsTileControl = (stateObj: HassEntity) => boolean;

const TILE_CONTROLS: Record<TileControlType, SupportsTileControl> = {
  "cover-open-close": (stateObj) =>
    computeDomain(stateObj.entity_id) === "cover" &&
    (supportsFeature(stateObj, CoverEntityFeature.OPEN) ||
      supportsFeature(stateObj, CoverEntityFeature.CLOSE)),
  "cover-position": (stateObj) =>
    computeDomain(stateObj.entity_id) === "cover" &&
    supportsFeature(stateObj, CoverEntityFeature.SET_POSITION),
  "light-brightness": (stateObj) =>
    computeDomain(stateObj.entity_id) === "light" &&
    lightSupportsBrightness(stateObj),
};

export const supportsTileControl = (
  stateObj: HassEntity,
  control: TileControlType
): boolean => {
  const supportFunction = TILE_CONTROLS[control] as
    | SupportsTileControl
    | undefined;
  return !supportFunction || supportFunction(stateObj);
};
