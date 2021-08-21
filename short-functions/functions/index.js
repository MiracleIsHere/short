const functions = require('firebase-functions');
const app = require('express')();

const { FBAuth, GetLinkAuth } = require('./util/auth');

const ACCESS_TYPE = require("./util/ACCESS_TYPE");

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin');

const {
  postLink,
  changeLinkPrivate,
  grantAccess,
  requestAccess,
  getLinkSubs,
  getLink
} = require('./handlers/links');

const {
  rejectAccess,
  cancelAccess,
  approveAccess
} = require('./handlers/subs');

const {
  signup,
  login,
  getAuthenticatedUser,
  markNotificationsRead
} = require('./handlers/users');

// links routes
app.post('/link', FBAuth, postLink);
app.post('/NAlink', postLink);
app.post('/link/:linkCode/private', FBAuth, changeLinkPrivate);
app.post('/link/:linkCode/grant', FBAuth, grantAccess);
app.post('/link/:linkCode/request', FBAuth, requestAccess);
app.get('/link/:linkCode', GetLinkAuth, getLink);
app.get('/link/:linkCode/subs', FBAuth, getLinkSubs);

// subs routes
app.post('/subs/:subId/reject', FBAuth, rejectAccess);
app.post('/subs/:subId/cancel', FBAuth, cancelAccess);
app.post('/subs/:subId/approve', FBAuth, approveAccess);

// users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/notifications', FBAuth, markNotificationsRead);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);

//triggers
exports.createNotificationOnSubUpdate = functions
  .region('europe-west1')
  .firestore.document('subs/{id}')
  .onUpdate((snapshot) => {
    return db
      .doc(`/links/${snapshot.before.data().linkId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          let recipient, sender;
          if (snapshot.after.data().type === ACCESS_TYPE.APPROVED) {
            recipient = snapshot.after.data().subHandle;
            sender = doc.data().authorHandle;
          }
          else if (snapshot.after.data().type === ACCESS_TYPE.REQUESTED) { //Rerequest
            sender = snapshot.after.data().subHandle;
            recipient = doc.data().authorHandle;
          }
          return db.doc(`/notifications/${snapshot.after.id}`).set({
            recipient: recipient,
            sender: sender,
            type: snapshot.after.data().type,
            linkId: doc.id,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
        else {
          throw new Error('Ooops');
        }
      })
      .catch((err) => console.error(err));
  });

exports.createNotificationOnSubCreate = functions
  .region('europe-west1')
  .firestore.document('subs/{id}')
  .onCreate((snapshot) => {
    let recipient, sender
    if (snapshot.data().type === ACCESS_TYPE.APPROVED) {
      recipient = snapshot.data().subHandle;
      sender = snapshot.data().authorHandle;
    } else {//ACCESS_TYPE.REQUESTED
      sender = snapshot.data().subHandle;
      recipient = snapshot.data().authorHandle;
    }
    return db.doc(`/notifications/${snapshot.id}`).set({
      recipient: recipient,
      sender: sender,
      type: snapshot.data().type,
      linkId: snapshot.data().linkId,
      read: false,
      createdAt: new Date().toISOString()
    })
      .catch((err) => {
        console.error(err);
        return;
      });
  })

exports.deleteNotificationOnUnSub = functions
  .region('europe-west1')
  .firestore.document('subs/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });