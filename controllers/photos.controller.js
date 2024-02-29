const Photo = require('../models/photo.model');

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {
  const escape = (html) => {
    return html
      .replace(/&/g, '')
      .replace(/</g, '')
      .replace(/>/g, '')
      .replace(/"/g, '')
      .replace(/'/g, '');
  };

  try {
    let { title, author, email } = req.fields;
    title = escape(title);
    author = escape(author);
    email = escape(email);
    const file = req.files.file;

    if (title && author && email && file) {
      // if fields are not empty...

      const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
      const fileExt = fileName.split('.').slice(-1)[0];
      if (fileExt === 'jpg' || fileExt === 'gif' || fileExt === 'png') {
        const newPhoto = new Photo({
          title,
          author,
          email,
          src: fileName,
          votes: 0,
        });
        await newPhoto.save(); // ...save new photo in DB
        res.json(newPhoto);
      } else {
        throw new Error('Wrong input!!');
      }
    } else {
      throw new Error('Wrong input!');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {
  try {
    res.json(await Photo.find());
  } catch (err) {
    res.status(500).json(err);
  }
};

/****** VOTE FOR PHOTO ********/

const addVote = async (res, id) => {
  const photoToUpdate = await Photo.findOne({ _id: id });
  if (!photoToUpdate) res.status(404).json({ message: 'Not found' });
  else {
    photoToUpdate.votes++;
    photoToUpdate.save();
    res.send({ message: 'OK' });
  }
};

exports.vote = async (req, res) => {
  try {
    const voter = await Voter.findOne({ user: req.ip });
    if (!voter) {
      const newVoter = new Voter({ user: req.ip, votes: req.params.id });
      await newVoter.save();
      addVote(res, req.params.id);
    } else if (!voter.votes.includes(req.params.id)) {
      voter.votes.push(req.params.id);
      await voter.save();
      addVote(res, req.params.id);
    } else {
      throw new Error('Wrong vote!');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
