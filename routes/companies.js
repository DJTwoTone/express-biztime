const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError")
const db = require("../db")
const slugify = require('slugify')


router.get("/", async function(req, res, next) {
    try {
        const results = await db.query(
            `SELECT code, name
            FROM companies`
        );
        return res.json({companies: results.rows});

    } catch (e) {
        return next(e)
    }
})

router.get("/:code", async function (req, res, next) {
    try {
        const cCode = req.params.code;
        const result = await db.query(
            `SELECT c.code, c.name, c.description, i.industry 
            FROM companies AS c
            LEFT JOIN  companies_industries AS ci
            ON c.code = ci.company_code
            LEFT JOIN industries as i
            ON ci.industry_code = i.code
            WHERE c.code=$1`, [cCode]
        );
        
        if (!result.rows.length) throw new ExpressError("Company code could not be found", 404);
        
        const invoiceRes = await db.query(
            `SELECT id, amt, paid, add_date, paid_date FROM invoices WHERE comp_code=$1`, [cCode]
        )
        let { code, name, description } = result.rows[0]
        let invoices = invoiceRes.rows
        let industries = result.rows.map(r => r.industry)
        return res.json({company: {code, name, description, invoices, industries}})
    } catch (e) {
        return next(e)
    }
})

router.post("/", async function (req, res, next) {
    try {
        const { code, name, description } = req.body;
        slugify(code, {
            lower: true,
            strict: true
        })

        const result = await db.query(
            `INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [code, name, description]
        );

        return res.status(201).json(result.rows[0])
        
    } catch (e) {
        return next(e);
    }
})

router.patch("/:code", async function (req, res, next) {
    try {
        const { name, description } = req.body;
        
        const result = await db.query(
            `UPDATE companies SET name=$1, description=$2
            WHERE code = $3
            RETURNING code, name, description`,
            [name, description, req.params.code]
        );

        return res.json({company: result.rows[0]})
    } catch (e) {
        return next(e)
    }
})

router.delete("/:code", async function (req, res, next) {
    try {
        const result = await db.query(
            `DELETE FROM companies WHERE code = $1`,
            [req.params.code]
        );
        return res.json({status: "Deleted"});
    } catch (e) {
        return next(e)
    }
})

module.exports = router;