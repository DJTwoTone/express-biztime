process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testCompany;
let testInvoice;

beforeEach(async () => {
    let compResult = await db.query(
        `INSERT INTO companies (code, name, description)
        VALUES ('test', 'The Test Company', 'We test your patience')
        RETURNING code, name, description`
        );
        testCompany = compResult.rows[0];
        console.log(testCompany)
    
    let invResult = await db.query(
        `INSERT INTO invoices (comp_code, amt)
        VALUES ('test', 500)
        RETURNING id, comp_code, amt, paid, add_date, paid_date`
        );
        testInvoice = invResult.rows[0];
        console.log(testInvoice)
    });
    
    afterEach(async () => {
        await db.query(`DELETE from invoices`);
        await db.query(`DELETE from companies`);
        testCompany = {};
        testInvoice = {};
        // console.log(testCompany)
        // console.log(testInvoice)
    });

afterAll(async function() {
    await db.end();
});

describe("GET /companies", function() {
    test("Gets a list of companies", async function() {
        const resp = await request(app).get('/companies');
        console.log
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({companies: [testCompany]});
    });
});

describe("GET /companies/:code", function () {
    test("gets a spedific company from the db", async function() {
        const resp = await request(app).get('/companies/test');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ testCompany });
    })
})