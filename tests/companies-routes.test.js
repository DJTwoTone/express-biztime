process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testCompany;
let testInvoice;



beforeEach(async () => {
    // await db.query("DELETE FROM industries")
    // await db.query("DELETE FROM companies")
    // await db.query("DELETE FROM companies_industries")
    // await db.query("DELETE FROM invoices")
    // await db.query("ALTER SEQUENCE invoices_id_seq RESTART WITH 1")



    let compResult = await db.query(
        `INSERT INTO companies (code, name, description)
        VALUES ('test', 'The Test Company', 'We test your patience')
        RETURNING code, name`
        );
        testCompany = compResult.rows[0];
        // console.log(testCompany)

        // await db.query(`DELETE from invoices`);
    let invResult = await db.query(
        `INSERT INTO invoices (comp_code, amt)
        VALUES ('test', 500)
        RETURNING id, comp_code, amt, paid, add_date, paid_date`
        );
        testInvoice = invResult.rows[0];
        console.log(testInvoice)
    });
    
    afterEach(async () => {
        await db.query("DELETE FROM industries")
        await db.query("DELETE FROM companies")
        // await db.query("DELETE FROM companies_industries")
        // await db.query("DELETE FROM invoices")
        await db.query("ALTER SEQUENCE invoices_id_seq RESTART WITH 1");
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
        expect(resp.statusCode).toEqual(200);
        console.log(resp.body);
        expect(resp.body).toEqual({companies: [testCompany]});
    });
});

// describe("GET /companies/:code", function () {
//     test("gets a spedific company from the db", async function() {
//         const resp = await request(app).get('/companies/test');
//         expect(resp.statusCode).toBe(200);
//         // console.log(resp.body)
//         // console.log(resp.body.company)
//         // console.log(resp.body.company.invoices)
//         // console.log({...testCompany})
//         expect(resp.body).toEqual({testCompany});
//     })
// })


// {
//     "company": {
//       "code": "ibm",
//       "name": "IBM",
//       "description": "Big blue.",
//       "invoices": [
//         {
//           "id": 4,
//           "amt": 400,
//           "paid": false,
//           "add_date": "2020-09-27T15:00:00.000Z",
//           "paid_date": null
//         }
//       ],
//       "industries": [
//         "technology",
//         "personal computers",
//         "business to business"
//       ]
//     }
//   }