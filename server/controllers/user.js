const bcrypt = require('bcryptjs');

module.exports = {

  register: async (req, res) => {
    const { username, password } = req.body;
    let profile_pic = `https://robohash.org/${username}.png`
    const db = req.app.get('db');

    const foundUser = await db.user.find_user_by_username({ username });
    if (foundUser[0]) {
      return res.status(409).send(`${username} is already in use.`)
    };

    let salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = await db.user.create_user([username, hash, profile_pic]);

    req.session.user = newUser;
    res.status(201).send(req.session.user);
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db');

    const foundUser = await db.user.find_user_by_username({ username });
    if (!foundUser[0]) {
      return res.status(404).send(`${username} does not exist. Please register before attempting to log in.`)
    };

    const authenticated = bcrypt.compareSync(password, foundUser[0].password);
    if (!authenticated) {
      return res.status(401).send('Incorrect password for this user.')
    };

    delete foundUser[0].password;
    req.session.user = foundUser[0];
    res.status(202).send(req.session.user)

  },

  getUser: async (req, res) => {
    const { username } = req.body;
    const db = req.app.get('db');

    const foundUser = await db.user.find_user_by_username({ username });
    if (!foundUser[0]) {
      return res.sendStatus(404)
    };
    req.session.user = foundUser[0];
    res.status(202).send(req.session.user);
  },

  logout: (req, res) => {
    req.session.destroy();
    res.sendStatus(200)
  }
};
