export default async function ({ addon, global, console }) {
  let BlocklyInstance = await addon.tab.traps.getBlockly();
  let originalObject = BlocklyInstance.Options;
  BlocklyInstance.Options = function (options) {
    this.horizontalLayout = true;
    return originalObject.call(this, options);
  };
}
