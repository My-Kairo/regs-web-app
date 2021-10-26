const assert = require('assert');
const Registrations = require('../services/regServices');
const pg = require('pg');
const Pool = pg.Pool;

// SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/registration';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});
const registrations = Registrations(pool);
describe('Registration web app', async function () {
    beforeEach(async function () {
        console.log('@@@@@@');
        await pool.query('delete from registrations;');
    });
// what is a difference between equal, deepequal and strict equal

    it('Should not add registrations when there is no input in the text field ', async function () {
        let regs = registrations;
        let results = await regs.getRegs();
        assert.deepStrictEqual(0, results.length);
    });

    it('Should count how many registrations added', async function () {
        await pool.query('delete from registrations;');

        let regs = registrations;
        await regs.storeRegs('CA 123 466');
        await regs.storeRegs('CJ 123 236');
        await regs.storeRegs('CF 789 123');

        let results = await regs.getRegs();
        assert.equal(3, results.length);
    });

    it('Should not add the same registration number twice', async function () {
        await pool.query('delete from registrations;');

        let regs = registrations;
        await regs.storeRegs('CA 123 416');
        await regs.storeRegs('CA 123 416');
        await regs.storeRegs('CF 743 621');
        let results = await regs.getRegs();
        var one = results[0].num_plates
        assert.equal('CA 123 416', one);
    });

    it('Should be able to filter registrations from Cape Town', async function () {
        await pool.query('delete from registrations;');

        let regs = registrations;
        await regs.storeRegs('CA 123 654');
        await regs.storeRegs('CJ 852 136');

        await regs.getRegs('CA 123 654');
        await regs.getRegs('CJ 852 136');

        var results = await regs.filterByTown('CA');
        var filter = results[0].num_plates
        assert.equal("CA 123 654", filter);
    });

    it('should to be able to display a registration number entered', async function () {
        await pool.query('delete from registrations;');

        let regs = registrations;
        await regs.storeRegs('CA 123 456');
        var results = await regs.getRegs();
        var reg = results[0].num_plates
        assert.equal('CA 123 456', reg);
    });

    after(function () {
        pool.end();
    });
});