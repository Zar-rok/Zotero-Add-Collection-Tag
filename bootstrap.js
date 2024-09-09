if (typeof Zotero == "undefined") {
  var Zotero;
  var window;
}

// In Zotero 6, bootstrap methods are called before Zotero is initialized, and using include.js
// to get the Zotero XPCOM service would risk breaking Zotero startup. Instead, wait for the main
// Zotero window to open and get the Zotero object from there.
//
// In Zotero 7, bootstrap methods are not called until Zotero is initialized, and the 'Zotero' is
// automatically made available.
async function waitForZotero() {
  if (typeof Zotero != "undefined") {
    await Zotero.initializationPromise;
    return;
  }

  var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
  var windows = Services.wm.getEnumerator("navigator:browser");
  var found = false;
  while (windows.hasMoreElements()) {
    let win = windows.getNext();
    if (win.Zotero) {
      window = win;
      Zotero = win.Zotero;
      found = true;
      break;
    }
  }
  if (!found) {
    await new Promise((resolve) => {
      var listener = {
        onOpenWindow: function (aWindow) {
          // Wait for the window to finish loading
          let domWindow = aWindow
            .QueryInterface(Ci.nsIInterfaceRequestor)
            .getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
          domWindow.addEventListener(
            "load",
            function () {
              domWindow.removeEventListener("load", arguments.callee, false);
              if (domWindow.Zotero) {
                Services.wm.removeListener(listener);
                Zotero = domWindow.Zotero;
                resolve();
              }
            },
            false,
          );
        },
      };
      Services.wm.addListener(listener);
    });
  }
  await Zotero.initializationPromise;
}

async function install() {
  await waitForZotero();

  // Retrieve the window, if needed
  if (!window) {
    var windows = Zotero.getMainWindows();
    for (let win of windows) {
      if (!win.ZoteroPane) continue;
      window = win;
      break;
    }
  }

  Zotero.AddCollectionTag = {
    init: function () {
      const notifierID = Zotero.Notifier.registerObserver(
        this.notifierCallback,
        ["item", "item-tag"],
      );
      window.addEventListener(
        "unload",
        function (e) {
          Zotero.Notifier.unregisterObserver(notifierID);
        },
        false,
      );
    },

    notifierCallback: {
      notify: function (event, type, ids, extraData) {
        const sel_col =
          Zotero.getActiveZoteroPane().getSelectedCollection().name;
        if (event == "add" && type == "item") {
          const items = Zotero.Items.get(ids);
          for (let i = 0; i < items.length; ++i) {
            items[i].addTag(sel_col, 1);
            items[i].saveTx();
          }
        }
      },
    },
  };
  window.addEventListener("add", Zotero.AddCollectionTag.init(), false);
}

async function startup({
  id,
  version,
  resourceURI,
  rootURI = resourceURI.spec,
}) {}
function shutdown() {}
function uninstall() {}
