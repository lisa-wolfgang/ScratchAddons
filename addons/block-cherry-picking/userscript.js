import UndoGroup from "/addons/editor-devtools/blockly/UndoGroup.js";

export default async function ({ addon, global, console }) {
  const BlocklyInstance = await addon.tab.traps.getBlockly();
  const originalDraggingObject = BlocklyInstance.BlockSvg.prototype.setDragging;
  var ctrlMode = addon.settings.get("ctrlMode");
  console.log("Cherry-picking addon is enabled");

  BlocklyInstance.BlockSvg.prototype.setDragging = function (adding) {
    console.log(this);
    if (ctrlMode === "fullEnable") {
      // Mostly taken from editor-devtools
      let workspace = BlocklyInstance.getMainWorkspace();
      let dataId = this && this.id;
      let block = workspace.getBlockById(dataId);
      if (block) {
        block.select();
        let next = block.getNextBlock();
        if (next) {
          next.unplug(false);
        }

        if (next) {
          workspace.undo();
        }
        let block = wksp.getBlockById(dataId);
        UndoGroup.startUndoGroup(wksp);
        block.dispose(true);
        UndoGroup.endUndoGroup(wksp);
      }
    }
    return originalDraggingObject.call(this, adding);
  };

  addon.settings.addEventListener("change", function () {
    ctrlMode = addon.settings.get("ctrlMode");
  });
}
