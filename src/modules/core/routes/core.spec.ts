var chakram = require('chakram'),
    expect = chakram.expect;

import { getConfig } from '../../../config/test.config';
var config = getConfig();

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