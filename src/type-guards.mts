export function isTileMap(asset: Asset): asset is TileMap {
  return asset && asset.isTileMap;
}

export function isTileset(asset: Asset): asset is Tileset {
  return asset && asset.isTileset;
}

export function isGroupLayer(layer: Layer): layer is GroupLayer {
  return layer && layer.isGroupLayer;
}

export function isImageLayer(layer: Layer): layer is ImageLayer {
  return layer && layer.isImageLayer;
}

export function isObjectLayer(layer: Layer): layer is ObjectGroup {
  return layer && layer.isObjectLayer;
}

export function isTileLayer(layer: Layer): layer is TileLayer {
  return layer && layer.isTileLayer;
}
