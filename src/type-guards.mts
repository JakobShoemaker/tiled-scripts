export function isTileMap(asset: Asset | null): asset is TileMap {
  return asset !== null && asset.isTileMap;
}

export function isTileset(asset: Asset | null): asset is Tileset {
  return asset !== null && asset.isTileset;
}

export function isGroupLayer(layer: Layer | null): layer is GroupLayer {
  return layer !== null && layer.isGroupLayer;
}

export function isImageLayer(layer: Layer | null): layer is ImageLayer {
  return layer !== null && layer.isImageLayer;
}

export function isObjectLayer(layer: Layer | null): layer is ObjectGroup {
  return layer !== null && layer.isObjectLayer;
}

export function isTileLayer(layer: Layer | null): layer is TileLayer {
  return layer !== null && layer.isTileLayer;
}
