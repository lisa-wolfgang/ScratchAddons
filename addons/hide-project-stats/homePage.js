// NOTE: This userscript is currently incomplete.

export default async function ({ addon, global, console, msg, safeMsg: m }) {
  // If the user has the "show stats on my own projects" setting enabled,
  // show the remix and love counts if the user owns the projects.
  // Figure out who each project's creator is and show the stats if that project creator is the user.
  function refreshLabels() {
    document.querySelectorAll(".thumbnail").forEach((element) => {
      console.log(element);
      if (!addon.self.disabled && addon.settings.get("showOwnStats")) {
        let creator = element.getElementsByClassName("thumbnail-creator")[0].querySelector("a").innerText;
        if (creator == addon.auth.fetchUsername()) {
          element.style = "display: inline-block;";
        }
      } else {
        element.style = "";
      }
    });
  }

  refreshLabels();

  addon.settings.addEventListener("change", () => {
    refreshLabels();
  });
  addon.self.addEventListener("disabled", () => {
    refreshLabels();
  });
  addon.self.addEventListener("reenabled", () => {
    refreshLabels();
  });
}
