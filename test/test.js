// import assert from 'assert/strict';
const assert = require('assert');
const Registrations = require('../services/regServices');
const pg = require('pg');
const Pool = pg.Pool;

// db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/registration';

console.log(connectionString);

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    }
});

const registrations = Registrations(pool);

describe('Registration web app', async function () {
    beforeEach(async function () {
        await pool.query('delete from registrations;');
    });

    it('Should not add registrations when there is no input in the text field ', async function () {
        let regs = registrations;
        await regs.storeRegs('');
        assert.deepStrictEqual([], await regs.getRegs());
    });

    it('Should return registrations added for all towns', async function () {

        let regs = registrations;
        await regs.storeRegs('CA 123 466');
        await regs.storeRegs('CJ 123 236');
        await regs.storeRegs('CF 789 123');

        let results = await regs.getRegs();
        assert.deepEqual([{'num_plates':'CA 123 466'}, {'num_plates':'CJ 123 236'}, {'num_plates':'CF 789 123'}], results);
    });

    it('Should not add the same registration number twice', async function () {

        let regs = registrations;
        await regs.storeRegs('CA 123 416');
        await regs.storeRegs('CA 123 416');
        await regs.storeRegs('CF 743 621');
        let results = await regs.getRegs();
        var one = results[0].num_plates
        assert.equal('CA 123 416', one);
    });

    it('Should be able to filter registrations from Cape Town', async function () {

        let regs = registrations;
        await regs.storeRegs('CA 123 654');
        await regs.storeRegs('CJ 852 136');

        await regs.getRegs('CA 123 654');
        await regs.getRegs('CJ 852 136');

        var results = await regs.filterByTown('CA');
        var filter = results[0].num_plates
        assert.equal("CA 123 654", filter);
    });

    it('Should be able to filter registrations from Paarl', async function () {

        let regs = registrations;
        await regs.storeRegs('CA 123 654');
        await regs.storeRegs('CJ 852 136');

        await regs.getRegs('CA 123 654');
        await regs.getRegs('CJ 852 136');

        var results = await regs.filterByTown('CJ');
        var filter = results[0].num_plates
        assert.equal("CJ 852 136", filter);
    });

    it('Should be able to filter registrations from Kraaifontein', async function () {

        let regs = registrations;
        await regs.storeRegs('CF 123 654');
        await regs.storeRegs('CJ 852 136');

        await regs.getRegs('CF 123 654');
        await regs.getRegs('CJ 852 136');

        var results = await regs.filterByTown('CF');
        var filter = results[0].num_plates
        assert.equal("CF 123 654", filter);
    });

    it('should to be able to display a registration number entered', async function () {

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