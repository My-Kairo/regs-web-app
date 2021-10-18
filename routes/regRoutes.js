module.exports = function (regServices) {

    async function toHomePage(req, res, next) {
      try {
        let display = await regServices.numberPlates();
        console.log(display)
  
        res.render('index', {
          display: display
        })
      } catch (error) {
        next(error.stack)
      }
    }
    async function resert(req, res) {
      await regServices.reset();
      res.redirect('/');
    }
    async function insertFunc(req, res, next) {
      try {
            let getReg = req.body.names.toUpperCase();
            let reg = /^((CA|CJ|CF)\s\d{3}\-\d{3})$|^((CA|CJ|CF)\s\d{3}\s\d{3})$|^((CA|CJ|CF)\s\d{4})$/.test(getReg);
            if (!reg) {
              req.flash('info', 'Please enter a valid registration number!');
              // return res.redirect('/');
            }else {
                    let addplates = await regServices.getPlates(reg[0]);
                    await regServices.insertPlates(reg, addplates);
                    req.flash('info', 'Registration number successfully added!');

            }
            res.render('index',{
              reg,
              display: await regServices.numberPlates()
            })
  
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