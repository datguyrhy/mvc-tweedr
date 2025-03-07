module.exports = (db) => {
  //create new user form
  let newUserCallback = (req, res) => {
    res.render('/user/new');
  };
  //submit new user into db
  let createUserCallback = (req, res) => {
    db.user.createUser(req.body, (err, result) => {
      data = {
        result: req.body
      }
      res.render('user/create', data);
    });
  };

  let userLoginFormCallback = (req, res) => {
    res.render('users/login');
  };
  let userLoginCallback = (req, res) => {
    db.user.userLogin(req.body, (err, result) => {
      if (err) {
        res.send('error');
      } else {
        if (result.rows.length > 0) {
          let hashedPassword = sha256(req.body.password + salt);
          if (hashedPassword === result.rows[0].password) {
            let user_id = result.rows[0].id;
            let hashedCookie = sha256(user_id + salt);

            res.cookie('user_id', user_id);
            res.cookie('hasLoggedIn', hashedCookie);
            res.cookie('username', req.body.username);
            res.redirect('/tweedr');
          } else {
            res.status(403).send('wrong password');
          }
        }
      }
    });
  };

  return {
    newUser: newUserCallback,
    createUser: createUserCallback,
    userLoginForm: userLoginFormCallback,
    userLogin: userLoginCallback
  };
};
