Zotero.AddCollectionTag = {
  init: function () {
    const notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item', 'item-tag']);
    window.addEventListener('unload', function(e) {
        Zotero.Notifier.unregisterObserver(notifierID);
    }, false);
  },

  notifierCallback: {
    notify: function(event, type, ids, extraData) {
      const sel_col = ZoteroPane.getSelectedCollection().name;
      if (event == 'add' && type == 'item') {
        const items = Zotero.Items.get(ids);
        for (let i = 0; i < items.length; ++i) {
          items[i].addTag(sel_col, 1);
          items[i].saveTx();
        }
      }
    }
  }
};

window.addEventListener('add', Zotero.AddCollectionTag.init(), false);
