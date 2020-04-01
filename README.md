# Zotero extension - Add Collection Tag

When a new item is added to a collection with the Zotero Connector (i.e., the Web browser extension), this plugin will automatically tag the item and the related attachement with the name of the **currently selected** collection or sub collection in Zotero.

## Example

With the following layout, the plugin will automatically add the tag `Collection 1` to the new item and the related attachements.

```
My Library:
|_Collection 1
  |_New item added + related attachements (e.g., a PDF)
```

## Installation

To obtain the extension, you can follow one of the two approachs:
- Dowload the file `Zotero-Add-Collection-Tag.xpi` from the latest release.
- Build the extension yourself by an archive including the following files:
  - `chrome/`
  - `chrome.manifest`
  - `install.rdf`
  
  For example: `7z a zotero_add_collection_tag.xpi chrome chrome.manifest install.rdf` using [7zip](https://www.7-zip.org/).
  You can also create a `.zip` an replace the extension by `.xpi` afterwards.

Then you can follow the first instructions of the [Zotero documentation](https://www.zotero.org/support/plugins#plugins_for_zotero).
