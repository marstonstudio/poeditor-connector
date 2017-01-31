var connector = require("../app/index");

describe("Poeditor REST", function() {

    //beforeEach(function() {
    //   connector.init();
    //});

    /*
    it("lists languages", function(done) {
        connector.listProjectLanguages()
            .then(function(list){
                console.log(list);
                expect(list.length).toBeGreaterThan(0);
                done();
            })
            .catch(function(exception) {
                console.error(exception);
                expect(exception).toBeUndefined();
                done();
            });
    });
    */

    /*
    it("imports data", function(done) {
        connector.importMessages()
            .then(function(){
                expect(true).toBe(true);
                done();
            })
            .catch(function(exception) {
                console.error(exception);
                expect(exception).toBeUndefined();
                done();
            });
    });
    */

    /*
    it("exports language zh", function(done) {
        connector.exportProjectLanguage("zh-CN")
            .then(function(file){
                console.log(file);
                expect(file).toContain("zh");
                done();
            })
            .catch(function(exception) {
                console.error(exception);
                expect(exception).toBeUndefined();
                done();
            });
    });
    */

    /*
    it("exports all languages", function(done) {
        connector.exportAllLanguages();
        done();

            .then(function(){
                console.log("done");
                expect(true).toBe(true);
                done();
            })
            .catch(function(exception) {
                console.error(exception);
                expect(exception).toBeUndefined();
                done();
            });

    });
     */

    it("executes", function() {
        connector.execute();
    })

});