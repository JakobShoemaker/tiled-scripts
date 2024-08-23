function isTileMap(asset: Asset): asset is TileMap {
  return asset && asset.isTileMap;
}

function isTileset(asset: Asset): asset is Tileset {
  return asset && asset.isTileset;
}

function isGroupLayer(layer: Layer): layer is GroupLayer {
  return layer && layer.isGroupLayer;
}

function isImageLayer(layer: Layer): layer is ImageLayer {
  return layer && layer.isImageLayer;
}

function isObjectLayer(layer: Layer): layer is ObjectGroup {
  return layer && layer.isObjectLayer;
}

function isTileLayer(layer: Layer): layer is TileLayer {
  return layer && layer.isTileLayer;
}
