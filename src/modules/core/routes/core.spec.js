"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chakram = require('chakram'), expect = chakram.expect;
const test_config_1 = require("../../../config/test.config");
var config = test_config_1.getConfig();
describe("Test the Core", function () {
    it("support getting the status of the service", function () {
        console.log('baseUrl = ' + config.baseUrl);
        return chakram.get(config.baseUrl)
            .then(function (response) {
            expect(response).to.have.status(200);
            console.log(response.body);
        });
    });
});
//# sourceMappingURL=core.spec.js.map