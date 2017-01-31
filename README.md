poeditor-connector
===========

Connect javascript applications with [poeditor.com](https://poeditor.com) for easy internationalization support. 

Can be used to upload XMB message files generated from Angular2 i18n process and download translated XTB files suitable for bundling.

Install with npm.

```sh
npm install poeditor-connector --save
```

### Requirements
Requires that you set up a project on [poeditor.com](https://poeditor.com) and generate an API key. Instructions are available on their [API reference](https://poeditor.com/api_reference)

### Angular i18n
This project was written specifically to connect an Angular typescript application to [poeditor.com](https://poeditor.com) for use with the XMB message format.

The [Angular documentation on i18n](https://angular.io/docs/ts/latest/cookbook/i18n.html) focuses on the XLIFF format, but [poeditor.com](https://poeditor.com) only supports XMB. 
XMB is used heavily inside of Google, but is not well documented [externally](http://cldr.unicode.org/development/development-process/design-proposals/xmb).
Note that XMB is the file format for messageterms that have been extracted from the application. XTB is the related file format for the translation output that is actually bunded in the application. 

### Configuration
A sample config file is included in the project under config/poeditor.sample.json. This will need to be modified to support your preferred settings

* **apiToken** : poeditor.com api token
* **projectId** : poeditor.com projectId
* **importFile** : relative location of the terms to be posted to the api
* **importSyncTerms** : whether or not to delete terms from the project not found in the import file when uploading
* **exportDir** : local directory to download translated files
* **exportFiles** : hash map of languages to download and the file name to use

```json
{
  "apiToken":"REPLACE_WITH_YOUR_API_TOKEN",
  "projectId":"REPLACE_WITH_YOUR_PROJECT_ID",
  "importFile":"spec/messages.xmb",
  "importSyncTerms": 1,
  "exportDir":"locale",
  "exportFiles":{
    "en":"messages.en.xtb",
    "tl":"messages.tl.xtb",
    "zh-CN":"messages.zh.xtb"
  }
}
```

## Usage

Use from npm package.json:

```json
{
  "scripts": {
    "i18n": "npm run compile:aot && ng-xi18n --i18nFormat=xmb && npm run i18n:poeditor",
    "i18n:poeditor": "poeditor --config=./config/poeditor.json" 
  }
}
```

invoke from the shell
```sh
npm run i18n
```

## License

[MIT](LICENSE). Copyright (c) 2017 Jon Marston.
