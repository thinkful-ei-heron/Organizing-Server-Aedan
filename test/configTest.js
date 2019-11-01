const {expect} = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;

module.exports = {
    API_TOKEN : process.env.API_TOKEN
};