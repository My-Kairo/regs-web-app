module.exports = function (pool) {
    
    let message = "";

    async function getTown(town) {
        const results = await pool.query('select * from townnames where init_town = $1', [town]);
        return results.rows;
    }

    async function getPlates(plate) {
        const results = await pool.query('select * from registrations where num_plates = $1',[plate])
        return results.rows;
    }

    async function insertPlates(regNum, locID) {

        let regs = await pool.query('insert into registrations (num_plates,town_id)values($1,$2)',[regNum, locID])
        return regs.rows;
   }
    async function numberPlates(){
        const results = await pool.query('select * from registrations')
        return results.rows;
    }
    
    async function addPlates(regNum, id) {
        let results = await getPlates(regNum);
        if (results.length == 0){
            message: 'Insert registrations!';
        }
        else{
            await insertPlates(regNum,id);
            message: 'Registration successfully added!';
        }

    }
    async function filterByTown(towns){
        let results = [];
        if(towns == 'All'){
        results = await pool.query('select num_plates from registrations');
        return results.rows;
        }
        else{
         results = await pool.query('select num_plates from townnames join registrations on registrations.town_id=townnames.id where init_town=$1',[towns])
            return results.rows;
        }
    }
    async function reset () {
        await pool.query('delete from registrations');

    }

    async function InvalidChecker(matchReg) {
        let result = await pool.query('Select init_town from townnames where init_town=$1', ['matchReg']);
        return result.rows;
        console.log(result.rows)

    }

    return {
        numberPlates,
        filterByTown,
        getTown,
        getPlates,
        addPlates,
        insertPlates,
        reset, InvalidChecker
    }
}