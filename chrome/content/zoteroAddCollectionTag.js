Zotero.AddCollectionTag = {
  init: function () {
    const notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item', 'item-tag']);
    window.addEventListener('unload', function(e) {
        Zotero.Notifier.unregisterObserver(notifierID);
    }, false);
  },

  notifierCallback: {
    notify: function(event, type, ids, extraData) {
      //alert(event + ' - ' + type + JSON.stringify(ids));
      /* New tags added are automaticaly removed ...
       *
       * Example trace of events:
       * ------------------------
       * add    - item     [207]
       * modify - item     [207]
       * add    - item-tag ["207-610"]
       * modify - item     [207]        ?!
       * remove - item-tag ["207-610"]  ?! Why auto removing
       * modify - item     [207]
       * trash  - item     [207]
       * delete - item     [207]
       *
       * Details for the add - item:
       * (https://github.com/zotero/zotero/blob/4e11c7927d63486dd94ee227ae667a4b082e2af4/chrome/content/zotero/xpcom/data/item.js#L1749)
       * ---------------
       * _tags - _changedData.tags
       * [] - undefined
       * # addTag(.)
       * [] - [{"tag":"General"}]
       * # saveTx()
       * [] - [{"tag":"General"}] _tags never updated ? Hence the '?!' ?
       */

      const sel_col = ZoteroPane.getSelectedCollection().name;

      // First attempts to add the new tag
      if (event == 'add' && type == 'item') {
        const items = Zotero.Items.get(ids);
        for (let i = 0; i < items.length; ++i) {
          items[i].addTag(sel_col);
          items[i].saveTx();
        }
      }

      // Second attempts to force adding the new tag
      // which is automatically removed ...
      if (event == 'remove' && type == 'item-tag') {
        const id_sc = Zotero.Tags.getID(sel_col);
        for (let i = 0; i < ids.length; ++i) {
          const [id_item, id_tag] = ids[i].split('-');
          if (id_tag == id_sc) {
            const item = Zotero.Items.get(id_item);
            item.addTag(sel_col);
            item.saveTx();
          }
        }
      }
    }
  }
};

window.addEventListener('add', Zotero.AddCollectionTag.init(), false);
