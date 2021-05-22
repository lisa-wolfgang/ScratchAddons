export default async function ({ addon, global, console }) {
  const vm = addon.tab.traps.vm;
  await new Promise((resolve, reject) => {
    if (vm.editingTarget) return resolve();
    vm.runtime.once("PROJECT_LOADED", resolve);
  });
  const originalBlocklyListen = vm.editingTarget.blocks.constructor.prototype.blocklyListen;
  var Blockly = await addon.tab.traps.getBlockly();

  // Necessary to detect the CTRL key
  var ctrlKeyPressed = false;
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey) {
      ctrlKeyPressed = true;
    }
  });
  document.addEventListener("keyup", function (e) {
    if (!e.ctrlKey) {
      ctrlKeyPressed = false;
    }
  });

  // Limits all script running to CTRL + click
  const newBlocklyListen = function (e) {
    if (!addon.self.disabled && e.element === "stackclick" && !ctrlKeyPressed) {
      return;
    } else {
      originalBlocklyListen.call(this, e);
    }
  };
  vm.editingTarget.blocks.constructor.prototype.blocklyListen = newBlocklyListen;

  // Disables Ctrl+Click activating the context menu on macOS
  let untoggle = false
  const contextMenuWithCtrlClickDisabled = function (options) {
    console.log(this)
    if ((addon.self.disabled || ctrlKeyPressed) && !untoggle) {
      console.log('Disabled')
      this.contextMenu = false;
    } else {
      console.log('Not disabled')
      this.contextMenu = true;
    }
  };
  const injectCustomContextMenu = (block) => {
    if (block._customContextMenuInjected) {
      return;
    }
    block._customContextMenuInjected = true;

    if (block.customContextMenu) {
      block._originalCustomContextMenu = block.customContextMenu;
    }

    block.customContextMenu = contextMenuWithCtrlClickDisabled;
  };
  const changeListener = (change) => {
    if (change.type !== "create") {
      return;
    }

    for (const id of change.ids) {
      const block = Blockly.getMainWorkspace().getBlockById(id);
      if (!block) continue;
      injectCustomContextMenu(block);
    }
  };
  const inject = () => {
    const workspace = Blockly.getMainWorkspace();
    workspace.getAllBlocks().forEach(injectCustomContextMenu);
    workspace.addChangeListener(changeListener);
    const languageSelector = document.querySelector('[class^="language-selector_language-select"]');
    if (languageSelector) {
      languageSelector.addEventListener("change", () => {
        setTimeout(inject);
      });
    }
  };
  if (addon.tab.editorMode === "editor") {
    const interval = setInterval(() => {
      if (Blockly.getMainWorkspace()) {
        inject();
        clearInterval(interval);
      }
    }, 100);
  }
  addon.tab.addEventListener("urlChange", () => addon.tab.editorMode === "editor" && inject());
 
}
