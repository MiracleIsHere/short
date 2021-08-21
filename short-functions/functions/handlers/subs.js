const { db } = require('../util/admin');

const ACCESS_TYPE = require("../util/ACCESS_TYPE");

exports.rejectAccess = (req, res) => {
  const document = db.doc(`/subs/${req.params.subId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error('Sub not found');
      }
      if (doc.data().authorHandle !== req.user.handle) {
        throw new Error('Unauthorized');
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return res.json({ message: 'Sub deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === 'Sub not found') return res.status(404).json({ error: 'Sub not found' });
      else if (err.message === 'Unauthorized') return res.status(403).json({ error: 'Unauthorized' });
      return res.status(500).json({ error: err.code });
    });
};

exports.cancelAccess = (req, res) => {
  const document = db.doc(`/subs/${req.params.subId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error('Sub not found');
      }
      if (doc.data().subHandle !== req.user.handle) {
        throw new Error('Unauthorized');
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return res.json({ message: 'Sub deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === 'Sub not found') return res.status(404).json({ error: 'Sub not found' });
      else if (err.message === 'Unauthorized') return res.status(403).json({ error: 'Unauthorized' });
      return res.status(500).json({ error: err.code });
    });
};

exports.approveAccess = (req, res) => {
  const updatedDoc = {}
  const document = db.doc(`/subs/${req.params.subId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error('Sub not found');
      }
      if (doc.data().authorHandle !== req.user.handle) {
        throw new Error('Unauthorized');
      }
      else if (doc.data().type === ACCESS_TYPE.APPROVED) {
        throw new Error('Access has been already granted');
      }
      else {
        updatedDoc.authorHandle = doc.data().authorHandle
        updatedDoc.createdAt = new Date().toISOString()
        updatedDoc.linkId = doc.data().linkId
        updatedDoc.shortLink = doc.data().shortLink
        updatedDoc.subHandle = doc.data().subHandle
        updatedDoc.type = ACCESS_TYPE.APPROVED
        updatedDoc.subId = req.params.subId
        return doc.ref.update({
          'type': updatedDoc.type,
          'createdAt': updatedDoc.createdAt
        })
      }
    })
    .then(() => {
      return res.json(updatedDoc);
    })
    .catch((err) => {
      console.error(err);
      if (err.message === 'Sub not found') return res.status(404).json({ error: 'Sub not found' });
      else if (err.message === 'Unauthorized') return res.status(403).json({ error: 'Unauthorized' });
      else if (err.message === 'Access has been already granted') return res.status(403).json({ error: 'Access has been already granted' });
      return res.status(500).json({ error: err.code });
    });
};