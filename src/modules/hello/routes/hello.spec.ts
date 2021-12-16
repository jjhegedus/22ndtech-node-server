var chakram = require('chakram'),
    expect = chakram.expect;

    import { getConfig } from '../../../config/test.config';
    var config = getConfig();

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