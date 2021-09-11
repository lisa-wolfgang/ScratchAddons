export default async function ({ addon, global, console }) {
  const BlocklyInstance = await addon.tab.traps.getBlockly();
  const originalAppendInput = BlocklyInstance.Block.prototype.appendInput_;

  // `opt_healStack` is a built-in option in scratch-blocks that enables cherry-picking behavior.
  // All this function does is enable that built-in option for every block.
  BlocklyInstance.BlockSvg.prototype.unplug = function (opt_healStack) {
    return originalObject.call(this, opt_healStack);
  };
}
