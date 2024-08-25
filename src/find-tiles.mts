import { isGroupLayer, isTileLayer, isTileMap } from "./type-guards.mjs";

function findTiles(searchAllLayers: boolean) {
  const map = tiled.activeAsset;
  if (!isTileMap(map)) {
    tiled.alert("To select tiles, make sure a Map document is active.");
    return;
  }

  const tiles = new Set<Tile>();

  for (const tile of tiled.mapEditor.tilesetsView.selectedTiles) {
    tiles.add(tile);
  }

  let selectedCount = 0;
  const selection = map.selectedArea.get();
  selection.subtract(selection);

  const checkedLayers = new Set<Layer>();

  function selectTilesInLayer(layer: Layer) {
    if (checkedLayers.has(layer)) {
      return;
    }

    if (isTileLayer(layer)) {
      const region = layer.region();
      const rects = region.rects;
      const rectCount = rects.length;

      for (let i = 0; i < rectCount; ++i) {
        const rect = rects[i];
        const xBoundary = rect.x + rect.width;
        const yBoundary = rect.y + rect.height;

        for (let x = rect.x; x < xBoundary; ++x) {
          for (let y = rect.y; y < yBoundary; ++y) {
            const tile = layer.tileAt(x, y);
            if (tile && tiles.has(tile)) {
              ++selectedCount;
              selection.add(Qt.rect(x, y, 1, 1));
            }
          }
        }
      }
    } else if (isGroupLayer(layer)) {
      let layerCount = layer.layerCount;
      for (let i = 0; i < layerCount; ++i) {
        selectTilesInLayer(layer.layers[i]);
      }
    }

    checkedLayers.add(layer);
  }

  const layers = searchAllLayers ? map.layers : map.selectedLayers;
  const layerCount = layers.length;

  for (let i = 0; i < layerCount; ++i) {
    selectTilesInLayer(layers[i]);
  }

  if (selectedCount > 0) {
    map.selectedArea.set(selection);
  }

  tiled.alert(`Found ${selectedCount} instances.`);
}

const findTilesInLayerAction = tiled.registerAction(
  "FindTilesInLayer",
  function (action) {
    findTiles(false);
  }
);

findTilesInLayerAction.text = "Find Tiles In Layer";

const findTilesInMapAction = tiled.registerAction(
  "FindTilesInMap",
  function (action) {
    findTiles(true);
  }
);

findTilesInMapAction.text = "Find Tiles In Map";

tiled.extendMenu("Layer", [{ action: "FindTilesInLayer" }]);
tiled.extendMenu("Map", [{ action: "FindTilesInMap" }]);
