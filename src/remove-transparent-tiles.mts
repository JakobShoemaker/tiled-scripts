import { isGroupLayer, isTileLayer, isTileMap } from "./type-guards.mjs";

const removeTransparentTiles = tiled.registerAction(
  "RemoveTransparentTiles",
  function (action) {
    const map = tiled.activeAsset;
    if (!map || !isTileMap(map)) {
      tiled.alert(
        "To remove transparent tiles, make sure a Map document is active."
      );
      return;
    }

    function isTransparentTile(tile: Tile): boolean {
      const image = tile.image;
      const imageRect = tile.imageRect;
      const xBoundary = imageRect.x + imageRect.width;
      const yBoundary = imageRect.y + imageRect.height;

      for (let x = imageRect.x; x < xBoundary; ++x) {
        for (let y = imageRect.y; y < yBoundary; ++y) {
          if (image.pixel(x, y) !== 0x00000000) {
            return false;
          }
        }
      }

      return true;
    }

    const transparentTiles = new Map<Tileset, Set<number>>();
    for (const tileset of map.tilesets) {
      const tiles: Set<number> = new Set();

      for (const tile of tileset.tiles) {
        if (isTransparentTile(tile)) {
          tiles.add(tile.id);
        }
      }

      transparentTiles.set(tileset, tiles);
    }

    const editedLayers = new Set<string>();
    let removedTilesCount = 0;

    function removeTransparentTilesInLayer(layer: Layer) {
      if (isTileLayer(layer)) {
        const layerEdit = layer.edit();

        const region = layer.region().boundingRect;
        const xBoundary = region.x + region.width;
        const yBoundary = region.y + region.height;

        for (let x = region.x; x < xBoundary; ++x) {
          for (let y = region.y; y < yBoundary; ++y) {
            const tile = layer.tileAt(x, y);
            if (tile && transparentTiles.get(tile.tileset)?.has(tile.id)) {
              layerEdit.setTile(x, y, null);
              editedLayers.add(layer.name);
              ++removedTilesCount;
            }
          }
        }

        layerEdit.apply();
      } else if (isGroupLayer(layer)) {
        for (const childLayer of layer.layers) {
          removeTransparentTilesInLayer(childLayer);
        }
      }
    }

    for (const layer of map.layers) {
      removeTransparentTilesInLayer(layer);
    }

    if (removedTilesCount > 0) {
      tiled.alert(
        `Removed ${removedTilesCount} tiles from layers: ${Array.from(
          editedLayers
        ).join(", ")}`
      );
    } else {
      tiled.alert("Removed 0 tiles.");
    }
  }
);

removeTransparentTiles.text = "Remove Transparent Tiles";

tiled.extendMenu("Map", [
  { action: "RemoveTransparentTiles", before: "MapProperties" },
]);
