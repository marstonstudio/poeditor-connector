var request = require("request");
var fs = require('fs');
var Promise = require("require-promise");
var rimraf = require("rimraf");

var poeditorBaseUrl = "http://poeditor.com/api/";

var poeditorApiToken;
var poeditorProjectId;

var importFile;
var importSyncTerms;
var exportDir;
var exportFiles;

// https://poeditor.com/api_reference/


function parseResponse(error, response, body) {
    if (error || response.statusCode != 200) {
        throw error || response.statusCode;
    }

    try {
        return JSON.parse(body);
    } catch (e) {
        throw "JSON parse exception error. body is: "+ body;
    }
}

module.exports = {

    init: function(configFilePath) {

        if (configFilePath == undefined) {
            throw Error("must initialize with a configFilePath");
        }

        var confString = fs.readFileSync(configFilePath, "utf8");
        var confObj = JSON.parse(confString);

        poeditorApiToken = confObj.apiToken;
        if (poeditorApiToken == undefined) {
            console.error("poeditorApiToken");
            throw Error(configFilePath + " must contain an api_token value entry 'apiToken'");
        }

        poeditorProjectId = confObj.projectId;
        if (poeditorProjectId == undefined) {
            console.error("poeditorProjectId");
            throw Error(configFilePath + " must contain an id value entry 'projectId'");
        }

        importFile = confObj.importFile;
        if (importFile == undefined || !fs.existsSync(importFile)) {
            console.error("importFile");
            throw Error(configFilePath + " must contain an existing import file entry 'importFile'");
        }

        importSyncTerms = confObj.importSyncTerms;
        if (importSyncTerms == undefined) {
            importSyncTerms = 0;
        }

        exportDir = confObj.exportDir;
        if (exportDir == undefined) {
            console.error("exportDir");
            throw Error(configFilePath + " must contain an existing export directory 'exportDir'");
        }

        if (!fs.existsSync(exportDir)) {
            console.log("creating " + exportDir);
            fs.mkdirSync(exportDir);
        }

        exportFiles = confObj.exportFiles;
    },

    importMessages: function() {
        //console.log('importMessages');

        return new Promise(function(resolve, reject) {

            request.post({
                    url: poeditorBaseUrl,
                    formData: {
                        api_token: poeditorApiToken,
                        action: "upload",
                        id: poeditorProjectId,
                        updating: "terms_definitions",
                        language: "en",
                        sync_terms: importSyncTerms,
                        file: fs.createReadStream(importFile)
                    }
                },
                function(error, response, body) {
                    if (error) {
                        reject(error);
                        return;
                    }

                    try {
                        var result = parseResponse(error, response, body);
                    } catch (e) {
                        reject(e);
                        return;
                    }

                    if (result && !result.details) {
                        reject("missing result details");
                        return;
                    }

                    console.log("uploaded terms. parsed:" + result.details.terms.parsed + ", added:" + result.details.terms.parsed + ", deleted:" + result.details.terms.deleted);
                    resolve();
                });
        })
    },

    /**
     * return an array of languages that exist for this project
     *
     * example: [ 'zh-CN', 'en', 'ja', 'ko', 'pt', 'ru', 'es', 'tr', 'vi' ]
     */
    listProjectLanguages: function() {
        //console.log("listProjectLanguages");

        return new Promise(function(resolve, reject) {

            request.post({
                    url: poeditorBaseUrl,
                    form: {api_token: poeditorApiToken, action: "list_languages", id: poeditorProjectId}
                },
                function(error, response, body) {
                    try {
                        var result = parseResponse(error, response, body);
                    } catch (e) {
                        reject(e);
                    }

                    if (!result.list || !result.list.length) {
                        resolve([]);
                    }

                    resolve(result.list.map(function(language) {
                        return language.code;
                    }));
                });
        })
    },

    /**
     * Download a file for a particular language
     */
    exportProjectLanguage: function(lang) {
        console.log("started downloading language: " + lang);

        var exportFile = exportFiles[lang];
        if (exportFile == undefined) {
            throw Error("No exportFile defined for language " + lang);
        }
        var target = exportDir + "/" + exportFile;

        return new Promise(function(resolve, reject) {

            request.post({
                    url: poeditorBaseUrl,
                    form: {
                        api_token: poeditorApiToken,
                        action: "export",
                        id: poeditorProjectId,
                        language: lang,
                        type: "xtb"
                    }
                },
                function(error, response, body) {
                    try {
                        var result = parseResponse(error, response, body);
                    } catch (e) {
                        return reject(e);
                    }

                    if (!result) {
                        console.error("empty result was parsed", body);
                        return reject("empty result")
                    }

                    if (!result.item) {
                        return reject("missing 'item' in " + body);
                    }

                    var url = decodeURI(result.item);
                    //console.log('language file at ' + url);
                    request.get(url).pipe(fs.createWriteStream(target));
                    console.log("downloaded: " + target);
                    resolve(target);
                });
        })
    },

    exportAllLanguages: function() {
        //console.log("exportAllLanguages");

        rimraf.sync(exportDir);
        fs.mkdirSync(exportDir);

        return module.exports.listProjectLanguages()
            .then(function(languages) {
                if (!languages.length) {
                    return Promise.reject("no languages list available");
                }

                var languagePromises = languages.map(function(language) {
                    return module.exports.exportProjectLanguage(language);
                });

                return Promise.all(languagePromises);
            })
            .catch(function(exception) {
                console.error(exception);
            });
    }

};
