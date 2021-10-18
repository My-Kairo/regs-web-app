const assert = require('assert');
const Registrations = require('../services/regServices');
const pg = require('pg');
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/registration';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

describe('Registration database web app', async function () {
    beforeEach(async function () {
        await pool.query('delete from registrations;');
    });

    it('should not add registrations when text field is empty ', async function () {
        // the Factory Function is called CategoryService
        const registrations = Registrations(pool);
        let results = await registrations.numberPlates();
        assert.deepStrictEqual(0, results.length);
    });

    it('should to shouls be able to return number of registrations added', async function () {
        const registrations = Registrations(pool);
        await registrations.getPlates('CA 123 466');
        await registrations.getPlates('CY 123 236');
        await registrations.getPlates('CA 789 123');

        let results = await registrations.numberPlates();
        assert.deepEqual(0, results.length);
    });

    it('should not add the same registration number twice', async function () {
        const registrations = Registrations(pool);
        await registrations.insertPlates('CA 123 416', '1');
        await registrations.insertPlates('CA 123 366', '1');
        let results = await registrations.numberPlates();

        assert.deepEqual(1, results.length);
    });

    it('should to be able to filter all registrations from Cape Town', async function () {
        const registrations = Registrations(pool);
        await registrations.addPlates('CA 123 654', '1');
        await registrations.addPlates('CJ 852 136', '2');
        await registrations.addPlates('CA 852 936', '1');
        let results = await registrations.filterByTown('CA');
        assert.deepEqual([{"num_plates":"CA 123 654"},{"num_plates":"CA 852 136"}], results);
    });

    it('should to be able to filter all registrations number', async function () {
        // the Factory Function is called CategoryService
        const registrations = Registrations(pool);
        await registrations.addPlates('CA 789 231', '1');
        await registrations.addPlates('CF 458 162', '2');
        let results = await registrations.filterByTown('All');
        assert.deepEqual([ {'num_plates':'CA 789 231'},
        {'num_plates': 'CF 458 162' } ], results);
    });

    after(function () {
        pool.end();
    });
});