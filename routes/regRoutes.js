module.exports = function (regServices) {

    async function Home(req, res, next) {
      try {
        let display = await regServices.getRegs();
        let regs = await regServices.Regs();
        // console.log(display)
        res.render('index', {
          display: display,
          display: regs
        })
      } catch (error) {
        next(error)
      }
    }
    
    async function Register(req, res, next) {
      try {
        await regServices.getRegs();
        let getReg = req.body.names.toUpperCase();
        let valid = /^((CA|CJ|CF)\s\d{3}\-\d{3})$|^((CA|CJ|CF)\s\d{3}\s\d{3})$|^((CA|CJ|CF)\s\d{4})$/.test(getReg);
        console.log(getReg);
        if (valid == "" || valid == undefined) {
          // console.log(reg);
          req.flash('error', 'Valid registration number required!');
          // return res.redirect('/');
        }else{
          await regServices.storeRegs(getReg)
          req.flash('info', await regServices.getMessage());
        }
        res.render('index', {
          display: await regServices.Regs(),
          display: await regServices.getRegs()
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
        // req.flash('info', await regServices.getFill())
        res.render('index', {
          display: display
        })
  
      } catch (err) {
        next(err);
      }
    }

    async function Reset(req, res) {
      req.flash('info', 'Database successfully deleted!')
      await regServices.reset();
      res.redirect('/');
    }
  
  
    return {
      Home,
      Register,
      filter,
      Reset
    }
  
  }