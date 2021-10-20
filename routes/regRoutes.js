module.exports = function (regServices) {

    async function toHomePage(req, res, next) {
      try {
        let display = await regServices.numberPlates();
        console.log(display)
  
        res.render('index', {
          display
        })
      } catch (error) {
        next(error)
      }
    }
    async function resert(req, res) {
      req.flash('info', 'Database successfully deleted!')
      await regServices.reset();
      res.redirect('/');
    }
    async function insertFunc(req, res, next) {
      try {
            let getReg = req.body.names;
            // let reg = /^((CA|CJ|CF)\s\d{3}\-\d{3})$|^((CA|CJ|CF)\s\d{3}\s\d{3})$|^((CA|CJ|CF)\s\d{4})$/.test(getReg);
            console.log(getReg);
            if (getReg == "" || getReg == undefined) {
              console.log('meyoo');
              req.flash('info', 'Please enter a valid registration number!');
              return res.redirect('/');
            }
            let split = getReg.split(" ");
            let all = split[0];
            all = all.trim().toUpperCase();
            let edd = await regServices.getTown(all);
            if(edd.length > 0){
              // let addplates = await regServices.addPlates(getReg, edd[0].id);
              let display = await regServices.numberPlates();
              req.flash('info', 'Registration successfully added!')
              res.render('index', {
                edd,
                display
              })
            }
            else {
                    // let addplates = await regServices.getPlates(getReg);
                    // await regServices.insertPlates(getReg, reg);
                    req.flash('info', 'Registration number successfully added!');
                    res.redirect('/');
            }
            // res.render('index',{
            //   getReg,
            //   display: await regServices.numberPlates()
            // })
  
      } catch (error) {
        next(error)
      }
    }
  
    async function filter(req, res, next) {
      try {
        let townFilter = req.params.filtered;
        let display = await regServices.filterByTown(townFilter);
        // console.log(display)
        res.render('index', {
          display
        })
  
      } catch (err) {
        next(err);
      }
    }
  
  
    return {
      toHomePage,
      insertFunc,
      filter,
      resert
    }
  
  }