"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chakram = require('chakram'), expect = chakram.expect;
const test_config_1 = require("../../../config/test.config");
var config = test_config_1.getConfig();
var name = 'Jeff';
describe("Test the hello service", function () {
    it("support getting the status of the service", function () {
        return chakram.get(config.baseUrl + '/hello/' + name)
            .then(function (response) {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "application/json");
            expect(response).to.comprise.of.json({
                hello: 'Jeff',
                world: 'wibble wobble'
            });
            console.log(response.body);
        });
    });
});
//# sourceMappingURL=hello.spec.js.map