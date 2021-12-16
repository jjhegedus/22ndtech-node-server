///// <reference path="../../../../typings/globals/mocha/index.d.ts"/>

var chakram = require('chakram'),
    expect = chakram.expect;

    import { getConfig } from '../../../config/test.config';
    var config = getConfig();

let products = [
    { name: 'Cell Phone', description: 'Android cell phone', price: "399.99" },
    { name: 'Ear Buds', description: 'Blue Ear Buds', price: "14.99" },
    { name: 'Necklace', description: 'Blue and Gold Necklace', price: "29.99" },
    { name: 'Mortor and Pestle', description: 'Wooden Mortor and Pestle', price: "9.99" }
];

describe("Add product 0", function () {

    var postRequest0;

    beforeEach(function () {
        postRequest0 = chakram.post(
            config.baseUrl + '/products',
            products[0]);

    });

    it("should just print the returned data", function () {
        return postRequest0.then(function (response) {
            console.log(response.body);
        });
    });

    it("should have status 201", function () {
        return postRequest0.then(function (response) {
            expect(response).to.have.status(201);
        });
    });

    it("should have the application/json header", function () {
        return postRequest0.then(function (response) {
            expect(response).to.have.header("content-type", "application/json");
        });
    });

    it ('should get the product created', function () {
        return postRequest0.then(function (response) {
            return chakram.get(
                config.baseUrl + '/products/' + response.body.id)
                .then(function (getResponse) {
                    expect(getResponse).to.have.status(200);
                    expect(getResponse).to.comprise.of.json(response.body);
                    console.log(response.body);
                });
        });
    });

    it("should delete the product created", function () {
        return postRequest0.then(function (response) {
            return chakram.delete(
                config.baseUrl + '/products/' + response.body.id,
                response.body)
                .then(function (deleteResponse) {
                    expect(deleteResponse).to.have.status(201);
                    console.log(response.body);
                });
        });
    });

});



describe("Add an array of products", function () {

    var postRequest1;

    beforeEach(function () {
        postRequest1 = chakram.post(
            config.baseUrl + '/products',
            products);

    });

    it("should just print the returned data", function () {
        return postRequest1.then(function (response) {
            console.log(response.body);
        });
    });

    it("should have the application/json header", function () {
        return postRequest1.then(function (response) {
            expect(response).to.have.status(201);
            expect(response).to.have.header("content-type", "application/json");
            //expect(response).to.comprise.of.json({
            //    hello: 'Jeff',
            //    world: 'wibble wobble'
            //});
        });
    });

    it ('should get all products', function () {
        return chakram.get(
            config.baseUrl + '/products')
            .then(function (getAllResponse) {
                console.log('allProducts = ' + JSON.stringify(getAllResponse.body));
            })
    });

    //it('should delete all products', function () {
    //    return postRequest1.then(function (response) {
    //        return chakram.delete(
    //            config.baseUrl + '/products')
    //            .then(function (deleteAllResponse) {
    //                expect(deleteAllResponse).to.have.status(201);
    //            });
    //    });
    //});

});

//describe("get products", function () {

//    var postRequest0;

//    before(function () {
//        postRequest0 = chakram.post(
//            config.baseUrl + '/products',
//            products[0]);

//    });



//    it('should get all product images', function () {
//        return chakram.get(
//            config.baseUrl + '/products/images')
//            .then(function (getAllResponse) {
//                console.log('allProducts = ' + JSON.stringify(getAllResponse.body));
//            })
//    });

//});