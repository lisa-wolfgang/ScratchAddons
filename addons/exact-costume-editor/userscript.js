export default async function ({ addon, global, console }) {
  const state = addon.tab.redux.state;
  // while (true) {
  //   state.scratchPaint.selectedItems[0].position
  // }
  addon.tab.redux.addEventListener("statechanged", (data) => {
    console.log(data.detail.action);
  });
};
