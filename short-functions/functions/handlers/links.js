const validUrl = require('valid-url');
const shortid = require('shortid');

const { db } = require('../util/admin');
const domain = require("../util/domain");

const { validateLinkCode, formHttpLink } = require("../util/validators");

const ACCESS_TYPE = require("../util/ACCESS_TYPE");

const CODE_NUMS = 6;
const MAX_GEN_ANOTHER_LINK_ATTEMPS = 3;

exports.postLink = (req, res) => {
  const userLongLink = formHttpLink(req.body.longLink)
  if (!userLongLink) {
    return res.status(400).json({ longLink: 'Invalid base link' });
  }
  if (!validateLinkCode(req.body.linkCode)) {
    return res.status(400).json({ linkCode: 'Invalid code' });
  }
  const newLink = {
    linkCode: (req.body.linkCode) ? req.body.linkCode : shortid.generate().slice(0, CODE_NUMS),
    authorHandle: (req.user) ? req.user.handle : null,
    longLink: userLongLink,
    private: req.body.private ? req.body.private : null,
    createdAt: new Date().toISOString(),
  };
  db.doc(`/links/${newLink.linkCode}`)
    .get()
    .then((doc) => {
      Object.keys(newLink).forEach((key) => (newLink[key] === null) && delete newLink[key]);
      if (doc.exists) {
        if (req.body.linkCode) throw new Error('Code already in use');
        else {
          return generateLinkDoc()
            .then((newDoc) => {
              newLink.linkCode = newDoc.id
              newLink.shortLink = domain.hostDomain + '/' + newLink.linkCode
              return newDoc.set(newLink);
            })
            .catch(() => {
              throw new Error('Please try again');
            })
        }
      } else {
        newLink.shortLink = domain.hostDomain + '/' + newLink.linkCode
        return db.doc(`/links/${newLink.linkCode}`).set(newLink);
      }
    })
    .then(() => {
      return res.json(newLink);
    })
    .catch((err) => {
      if (err.message === 'Code already in use') return res.status(400).json({ linkCode: "Code already in use" });
      else if (err.message === 'Please try again') return res.status(400).json({ general: "Please try again" });
      return res.status(500).json({ general: 'Something went wrong' });
    });
};

async function generateLinkDoc() {
  async function generateDoc() {
    try {
      const linkCode = shortid.generate().slice(0, CODE_NUMS);
      let doc = await db.doc(`/links/${linkCode}`).get();
      if (!doc.exists) return (db.doc(`/links/${linkCode}`));
      else throw new Error('Duplicate');
    } catch (e) {
      throw new Error('Duplicate');
    }
  }
  let attempt = MAX_GEN_ANOTHER_LINK_ATTEMPS;
  /* eslint-disable no-await-in-loop */
  while (attempt) {
    try {
      return await generateDoc()
    } catch (e) {
      attempt = attempt - 1;
    }
  }
  throw new Error('Limit exceeded')
}

exports.changeLinkPrivate = (req, res) => {
  db.doc(`/links/${req.params.linkCode}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error('Link not found');
      }
      if (doc.data().authorHandle !== req.user.handle) {
        throw new Error('Unauthorized');
      } else {
        return doc.ref.update({ 'private': !doc.data().private })
      }
    })
    .then(() => {
      return res.json({ message: 'Updated successfully' });
    })
    .catch((err) => {
      if (err.message === 'Link not found') return res.status(404).json({ errorOnChangePrivate: 'Link not found' });
      else if (err.message === 'Unauthorized') return res.status(403).json({ errorOnChangePrivate: 'Unauthorized' });
      return res.status(500).json({ errorOnChangePrivate: err.code });
    });
};

exports.grantAccess = (req, res) => {
  if (!req.body.subHandle.trim()) return res.status(500).json({ errorOnGrant: 'Something went wrong' });
  const newSub = {
    linkId: req.params.linkCode,
    authorHandle: req.user.handle,
    subHandle: req.body.subHandle,
    type: ACCESS_TYPE.APPROVED,
    createdAt: new Date().toISOString(),
  };
  const subDocument = db
    .collection('subs')
    .where('subHandle', '==', req.body.subHandle)
    .where('linkId', '==', req.params.linkCode)
    .limit(1);
  db.doc(`/links/${req.params.linkCode}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().authorHandle === req.body.subHandle) {
          throw new Error('Access has been already granted');
        }
        if (doc.data().authorHandle === req.user.handle) {
          newSub.shortLink = doc.data().shortLink
          return subDocument.get();
        }
        else throw new Error('Unauthorized');
      }
      else throw new Error('Link does not exist');
    })
    .then((data) => {
      if (data.empty) {
        return db.collection('subs').add(newSub)
      }
      else if (data.docs[0].data().type === ACCESS_TYPE.APPROVED) {
        throw new Error('Access has been already granted');
      }
      else {
        newSub.subId = data.docs[0].id
        return data.docs[0].ref.update({
          'type': ACCESS_TYPE.APPROVED,
          'createdAt': newSub.createdAt
        })
      }
    })
    .then((docum) => {
      if (docum.id) newSub.subId = docum.id
      return res.json(newSub);
    })
    .catch((err) => {
      if (err.message === 'Access has been already granted') return res.status(403).json({ errorOnGrant: 'Access has been already granted' });
      else if (err.message === 'Unauthorized') return res.status(403).json({ errorOnGrant: 'Unauthorized' });
      else if (err.message === 'Link does not exist') return res.status(400).json({ errorOnGrant: "Link does not exist" });
      else if (err.message === 'Access has been already granted') return res.status(400).json({ errorOnGrant: 'Access has been already granted' });
      return res.status(500).json({ errorOnGrant: 'Something went wrong' });
    });
};

exports.requestAccess = (req, res) => {
  const newSub = {
    linkId: req.params.linkCode,
    subHandle: req.user.handle,
    type: ACCESS_TYPE.REQUESTED,
    createdAt: new Date().toISOString(),
  };
  db.doc(`/links/${req.params.linkCode}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().authorHandle === req.user.handle) {
          throw new Error('Access has been already granted');
        }
        newSub.authorHandle = doc.data().authorHandle;
        newSub.shortLink = doc.data().shortLink
        return db.collection('subs')
          .where('subHandle', '==', req.user.handle)
          .where('linkId', '==', req.params.linkCode)
          .limit(1)
          .get();
      }
      else throw new Error('Link does not exist');
    })
    .then((data) => {
      if (data.empty) return db.collection('subs').add(newSub)
      else if (!data.empty && data.docs[0].data().type === ACCESS_TYPE.REQUESTED) {
        newSub.subId = data.docs[0].id
        return data.docs[0].ref.update({
          'type': ACCESS_TYPE.REQUESTED,
          'createdAt': newSub.createdAt
        })
      }
      else throw new Error('Access has been already granted');
    })
    .then((docum) => {
      if (docum.id) newSub.subId = docum.id
      return res.json(newSub);
    })
    .catch((err) => {
      if (err.message === 'Access has been already granted') return res.status(403).json({ errorOnRequest: 'Access has been already granted' });
      else if (err.message === 'Link does not exist') return res.status(400).json({ errorOnRequest: "Link does not exist" });
      else if (err.message === 'Access has been already granted') return res.status(400).json({ errorOnRequest: 'Access has been already granted' });
      return res.status(500).json({ errorOnRequest: 'Something went wrong' });
    });
};

exports.getLinkSubs = (req, res) => {
  db.doc(`/links/${req.params.linkCode}`)
    .get()
    .then((doc) => {
      if (doc.exists && doc.data().authorHandle !== req.user.handle) {
        throw new Error('Unauthorized');
      }
      else if (!doc.exists) {
        throw new Error("Link does not exist");
      }
      else {
        return db.collection('subs')
          .where('linkId', '==', req.params.linkCode)
          .orderBy('createdAt', 'desc')
          .get()
      }
    })
    .then((data) => {
      const subs = [];
      data.forEach((doc) => {
        subs.push({
          authorHandle: doc.data().authorHandle,
          subHandle: doc.data().subHandle,
          linkId: doc.data().linkId,
          shortLink: doc.data().shortLink,
          type: doc.data().type,
          createdAt: doc.data().createdAt,
          subId: doc.id,
        });
      });
      return res.json(subs);
    })
    .catch((err) => {
      if (err.message === 'Unauthorized') return res.status(403).json({ error: 'Unauthorized' });
      else if (err.message === 'Link does not exist') return res.status(400).json({ error: "Link does not exist" })
      return res.status(500).json({ error: err.code });
    });
};

exports.getLink = (req, res) => {
  let longLink;
  db.doc(`/links/${req.params.linkCode}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (!doc.data().private) {
          longLink = doc.data().longLink;
          return res.json(longLink);
        } else {
          if (req.user) {
            if (req.user.handle === doc.data().authorHandle) {
              longLink = doc.data().longLink;
              return res.json(longLink);
            } else {
              return db.collection('subs')
                .where('subHandle', '==', req.user.handle)
                .where('linkId', '==', req.params.linkCode)
                .limit(1)
                .get()
            }
          } else {
            throw new Error('Unauthorized');
          }
        }
      } else {
        throw new Error('Link does not exist');
      }
    })
    .then((data) => {
      if (!res.headersSent) {
        if (data.size > 0 && (data.docs[0].data().type === ACCESS_TYPE.APPROVED)) return res.json(data.docs[0].data().shortLink);
        else if (data.size > 0) return res.status(400).json({ review: "Permission is not granted yet" })
        return res.status(400).json({ private: "Request a permission" })
      }
      return res.status(500).json({ error: 'Something went wrong' });
    })
    .catch((err) => {
      if (err.message === 'Unauthorized') return res.status(403).json({ auth: 'Unauthorized' });
      else if (err.message === 'Link does not exist') return res.status(400).json({ exist: "Link does not exist" })
      return res.status(500).json({ error: 'Something went wrong' });
    });
};