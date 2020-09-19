\c biztime

DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS companies_industries;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS invoices;


CREATE TABLE industries (
  code TEXT PRIMARY KEY,
  industry TEXT NOT NULL
);

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE companies_industries (
  company_code TEXT NOT NULL REFERENCES companies,
  industry_code TEXT NOT NULL REFERENCES industries,
  PRIMARY KEY(company_code, industry_code)
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO industries
  VALUES ('tech', 'technology'),
          ('pc', 'personal computers'),
          ('phone', 'telecommunications'),
          ('b2b', 'business to business');

INSERT INTO companies_industries
  VALUES ('apple', 'tech'),
          ('apple', 'pc'),
          ('apple', 'phone'),
          ('ibm', 'tech'),
          ('ibm', 'pc'),
          ('ibm', 'b2b');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);