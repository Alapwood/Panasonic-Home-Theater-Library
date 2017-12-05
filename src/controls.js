async function execute(host, control, cb = () => {}) {
  try {
    await fetch(`http://${host}/WAN/dvdr/dvdr_NAI003.cgi`, {
      headers: {
        "User-Agent": "MEI-LAN-REMOTE-CALL"
      },
      method: "POST",
      body: `cCMD_${control}.x=100&cCMD_${control}.y=100`
    });
  } catch (e) {
    if (e.code == "ECONNRESET") {
      cb();
    } else {
      console.log(e);
    }
  }
}

const controls = require("./controls.json");

module.exports = controls.reduce((acc, control) => {
  acc[control] = (host, release) =>
    execute(host, control, () => {
      if (release && control.startsWith("RC") && control !== "RC_RELEASE") {
        execute(host, "RC_RELEASE", () => console.log(control));
      } else {
        console.log(control);
      }
    });
  return acc;
}, {});
