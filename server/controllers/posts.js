module.exports = {
  readPosts: async (req, res) => {
    // console.log(req.session.user);
    let { id } = req.session.user;
    let { mine, search, oldest } = req.query;
    const db = await req.app.get('db')
    if (mine && !search) {
      if (oldest) {
        db.post.read_all_oldest_first()
          .then(posts => res.status(200).send(posts))
      } else {
        db.post.read_all_posts()
          .then(posts => res.status(200).send(posts))
      }
    } else if (!mine && search) {
      if (oldest) {
        db.search.search_other_oldest_first([`%${search.toLowerCase()}%`, id])
          .then(posts => res.status(200).send(posts))
      } else {
        db.search.search_other_users_posts([`%${search.toLowerCase()}%`, id])
          .then(posts => res.status(200).send(posts))
      }
    } else if (mine && search) {
      if (oldest) {
        db.search.search_all_oldest_first([`%${search.toLowerCase()}%`])
          .then(posts => res.status(200).send(posts))
      } else {
        db.search.search_all_posts([`%${search.toLowerCase()}%`])
          .then(posts => res.status(200).send(posts))
      }
    } else {
      if (oldest) {
        db.post.read_other_oldest_first([id])
          .then(posts => res.status(200).send(posts))
      } else {
        db.post.read_other_users_posts([id])
          .then(posts => res.status(200).send(posts))
      }
    }
  },


  createPost: async (req, res) => {
    //code here
    const db = await req.app.get('db');
    const { title, img, content } = req.body;
    let { id } = req.session.user;
    const date = new Date;
    if (!id) {
      return res.status(403).send(`You must be logged in to post.`)
    }
    const newPost = await db.post.create_post([id, title, img, content, date])
    res.status(200).send(newPost)
  },


  readPost: (req, res) => {
    const { id } = req.params
    const db = req.app.get('db')
    db.post.read_post(id)
      .then(post => post[0] ? res.status(200).send(post[0]) : res.status(200).send({}))
  },


  deletePost: (req, res) => {
    const { id } = req.params
    const db = req.app.get('db')
    db.post.delete_post(id)
      .then(() => res.sendStatus(200))
  }
}