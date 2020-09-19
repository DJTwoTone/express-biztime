const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

router.get("/", async function (req, res, next) {
    try {
        const results = await db.query(
            `SELECT * FROM invoices`
        );
        return res.json({invoices: results.rows})
    } catch (e) {
        return next(e)
    }
})

router.get("/:id", async function (req, res, next) {
    try {
        const id = req.params.id
        const resultInvoice = await db.query(
            `SELECT *
            FROM invoices
            WHERE id=$1`, [id]
        )
        if (!resultInvoice.rows.length) throw new ExpressError("Invoice could not be found", 404)
        
        const compCode = resultInvoice.rows[0].comp_code
        const resultCompany = await db.query(
            `SELECT code, name, description
            FROM companies
            WHERE code=$1`, [compCode]
        )
        const invoice = resultInvoice.rows[0]
        delete invoice.comp_code
        invoice.company = resultCompany.rows[0]
        
        return res.json({ invoice })
    } catch (e) {
        next(e)
    }
})

router.post("/", async function(req, res, next) {
    try {
        const { comp_code, amt } = req.body;

        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt)
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]
        );

        return res.status(201).json(result.rows[0])

    } catch (e) {
        next(e)
    }
})

router.patch("/:id", async function (req, res, next) {
    try {
        const { amt } = req.body;

        const result = await db.query(
            `UPDATE invoices SET amt=$1
            WHERE id=$2
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, req.params.id]
        );
        const invoice = result.rows[0];
        return res.json({ invoice })
        
    } catch (e) {
        return next(e);
    }
})

router.put("/:id", async function (req, res, next) {
    try {
        const { amt, paid } = req.body;

// If invoice cannot be found, returns a 404.

// Needs to be passed in a JSON body of {amt, paid}

// If paying unpaid invoice: sets paid_date to today
// If un-paying: sets paid_date to null
// Else: keep current paid_date
// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}


    } catch (e) {
        next(e)
    }
})

router.delete("/:id", async function (req, res, next) {
    try {
        const result = await db.query(
            `DELETE FROM invoices WHERE id=$1`, [req.params.id]
        );
        return res.json({status: "deleted"});

    } catch (e) {
        return next(e)
    }
})

module.exports = router;