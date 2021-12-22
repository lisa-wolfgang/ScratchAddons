export default async function ({ addon, global, console }) {
  const buttonSelector = `[aria-label="${addon.tab.scratchMessage(
    "gui.menuBar.tutorialsLibrary"
  )}"][class*="menu-bar_menu-bar-item"][class*="menu-bar_hoverable"]`;
  let button = await addon.tab.waitForElement(buttonSelector);
  refresh();

  addon.self.addEventListener("urlChange", () => refresh());
  addon.settings.addEventListener("change", () => refresh());
  addon.self.addEventListener("disabled", () => refresh());
  addon.self.addEventListener("reenabled", () => refresh());

  function refresh() {
    button = document.querySelector(buttonSelector);
    if (!addon.self.disabled && addon.settings.get("mode") == "scratch2") {
      button.querySelector("span").innerText = "Help";
      button.removeEventListener("click", openTab);
      button.addEventListener("click", openTab);
    } else {
      button.querySelector("span").innerText = addon.tab.scratchMessage("gui.menuBar.tutorialsLibrary");
      button.removeEventListener("click", openTab);
    }
  }

  async function openTab() {
    let oldContent = [
      await addon.tab.waitForElement('.ReactModalPortal .ReactModal__Overlay [class*="library_filter-bar"]'),
      await addon.tab.waitForElement('.ReactModalPortal .ReactModal__Overlay [class*="library_library-scroll-grid"]'),
    ];
    let newContent = document.createElement("iframe");
    newContent.setAttribute("src", "https://scratch.mit.edu/help/studio/tips/home/");
    oldContent.forEach((e) => e.remove());
    let container = await addon.tab.waitForElement('.ReactModalPortal .ReactModal__Overlay [class*="box_box"]');
    container.appendChild(newContent);
  }
}
