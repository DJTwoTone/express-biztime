const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db")
const slugify = require('slugify')

router.get("/", async function (req, res, next) {
    try {
        const results = await db.query(
            `SELECT i.code, i.industry, c.code AS comp_code
             FROM industries AS i
             LEFT JOIN companies_industries AS ci
             ON i.code = ci.industry_code
             LEFT JOIN companies AS c
             ON ci.company_code = c.code
             `
        );
        console.log(results)
        return res.json({industries: results.rows})
    } catch (e) {
        return next(e)
    }
})

router.post("/", async function(req, res, next) {
    try {
        const { code, industry } = req.body;
        slugify(code, {
            lower: true,
            strict:true
        })
        const result = await db.query(
            `INSERT INTO industries (code, industry)
            VALUES ($1, $2)
            RETURNING code, industry`,
            [code, industry]
        );
        
        return res.status(200).json(result.rows[0])
    } catch (e) {
        next(e)
    }
})


module.exports = router;