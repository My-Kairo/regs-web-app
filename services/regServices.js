module.exports = function (pool) {
    
    let message = "";
    let plates = pool;
    let filter = [];

    async function storeRegs(regi) {
        var string = regi.toString().substring(0, 2);
        const town = await plates.query(`SELECT * FROM townnames WHERE init_town = $1;`, [string]);
        const reg = await plates.query(`SELECT * FROM registrations WHERE num_plates = '${regi}'`);
        if (town.rows.length == 0) {
            message = "Enter registration numbers!"
        } else if(reg.rows.length == 0){
            await plates.query(`insert into registrations (num_plates, town_id) values ('${regi}', ${town.rows[0].id})`)
            message = "Registration number successfully added!"
        }else{
            message = "Registration number already added!"
        }
    }

    async function getMessage(){
        return message;
    }

    async function getRegs() {
        let regs = await plates.query('SELECT num_plates FROM registrations;');
        return regs.rows;
    }

    async function Regs() {
        let regs = await plates.query("SELECT * FROM townnames;");
        return regs.rows;
      }

    async function filterByTown(towns){
        
        if(towns == 'All'){
            filter = await plates.query('select num_plates from registrations;');
            message = "All towns have been selected"
        return filter.rows;
        }
        else{
            filter = await plates.query('select num_plates from townnames join registrations on registrations.town_id=townnames.id where init_town=$1',[towns]);
            message = "A town was selected"
            return filter.rows;
        }
    }

    async function reset () {
        await plates.query('delete from registrations');

    }

    return {
        storeRegs,
        getRegs,
        filterByTown,
        Regs,
        reset,
        getMessage
    }
}