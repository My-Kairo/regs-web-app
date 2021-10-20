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
const registrations = Registrations(pool);
describe('Registration web app', async function () {
    beforeEach(async function () {
        console.log('@@@@@@');
        await pool.query('delete from registrations;');
    });

    it('should not add registrations when text field is empty ', async function () {
        let regs = registrations;
        let results = await regs.numberPlates();
        assert.deepStrictEqual(0, results.length);
    });

    it('should be able to return number of registrations added', async function () {
        let regs = registrations;
        await regs.insertPlates('CA 123 466','1');
        await regs.insertPlates('CY 123 236','2');
        await regs.insertPlates('CF 789 123','3');

        let results = await regs.numberPlates();
        assert.deepEqual(3, results.length);
    });

    it('should not add the same registration number twice', async function () {
        let regs = registrations;
        await regs.insertPlates('CA 123 416', '1');
        await regs.insertPlates('CA 123 416', '1');
        await regs.insertPlates('CF 743 621', '2');

        assert.deepEqual(2, await regs.numberPlates().length);
    });

    it('should to be able to filter registrations from Cape Town', async function () {
        let regs = registrations;
        await regs.addPlates('CA 123 654', '1');
        await regs.addPlates('CJ 852 136', '2');
        await regs.addPlates('CA 852 936', '1');
        let results = await regs.filterByTown('CA');
        assert.deepEqual([{"num_plates":"CA 123 654"},{"num_plates":"CA 852 136"}], results);
    });

    it('should to be able to display a registration number entered', async function () {
        let regs = registrations;
        let reg = ('CA 145 236', '1')
        await regs.insertPlates(reg);
        let plates = {num_plates: reg}
        assert.deepEqual(plates, (await regs.getPlates('CA 145 236'))[0]);
    });

    after(function () {
        pool.end();
    });
});