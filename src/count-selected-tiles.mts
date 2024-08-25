import { isGroupLayer, isTileLayer, isTileMap } from "./type-guards.mjs";

const countSelectedTiles = tiled.registerAction(
  "CountSelectedTiles",
  function (action) {
    const map = tiled.activeAsset;
    if (!map || !isTileMap(map)) {
      tiled.alert(
        "To count selected tiles, make sure a Map document is active."
      );
      return;
    }

    const currentTileset = tiled.mapEditor.tilesetsView.currentTileset;
    const selectedTileIds = new Set<number>();
    const tileCounts = new Map<number, Map<number, number>>();
    const layerNames: { [layerId: number]: string } = {};

    for (const tile of tiled.mapEditor.tilesetsView.selectedTiles) {
      selectedTileIds.add(tile.id);
      tileCounts.set(tile.id, new Map());
    }

    function countSelectedTilesInLayer(layer: Layer) {
      layerNames[layer.id] = layer.name;

      if (isTileLayer(layer)) {
        const region = layer.region().boundingRect;
        const xBoundary = region.x + region.width;
        const yBoundary = region.y + region.height;

        for (let x = region.x; x < xBoundary; ++x) {
          for (let y = region.y; y < yBoundary; ++y) {
            const tile = layer.tileAt(x, y);
            if (
              tile &&
              tile.tileset === currentTileset &&
              selectedTileIds.has(tile.id)
            ) {
              const counts = tileCounts.get(tile.id)!;
              if (counts.has(layer.id)) {
                counts.set(layer.id, counts.get(layer.id)! + 1);
              } else {
                counts.set(layer.id, 1);
              }
            }
          }
        }
      } else if (isGroupLayer(layer)) {
        for (const childLayer of layer.layers) {
          countSelectedTilesInLayer(childLayer);
        }
      }
    }

    for (const layer of map.layers) {
      countSelectedTilesInLayer(layer);
    }

    let lines = [];

    for (const [tileId, counts] of tileCounts) {
      let sum = 0;
      let countStrings: string[] = [];

      for (const [layerId, count] of counts) {
        sum += count;
        countStrings.push(`${layerNames[layerId]}: ${count}`);
      }

      if (sum) {
        lines.push(`[${tileId}]: ${sum} [${countStrings.join(", ")}]`);
      }
    }

    tiled.alert(
      lines.length > 0
        ? `Selected tile counts:\n${lines.join("\n")}`
        : "No tiles found."
    );
  }
);

countSelectedTiles.text = "Count Selected Tiles";

tiled.extendMenu("Map", [
  { action: "CountSelectedTiles", before: "MapProperties" },
]);
