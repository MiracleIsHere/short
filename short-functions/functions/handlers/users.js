const { admin, db } = require("../util/admin");

const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
} = require("../util/validators");


exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        throw new Error('This handle is already taken');
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === 'This handle is already taken') return res.status(400).json({ handle: "This handle is already taken" });
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already is use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked read" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("links")
          .where("authorHandle", "==", req.user.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        throw new Error('Document does not exist');
      }
    })
    .then((data) => {
      userData.links = [];
      data.forEach((doc) => {
        userData.links.push(doc.data());
      });
      return db
        .collection("subs")
        .where("subHandle", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .get();
    })
    .then((data) => {
      userData.subs = [];
      data.forEach((doc) => {
        userData.subs.push({
          type: doc.data().type,
          linkId: doc.data().linkId,
          createdAt: doc.data().createdAt,
          subHandle: doc.data().subHandle,
          authorHandle: doc.data().authorHandle,
          shortLink: doc.data().shortLink,
          subId: doc.id,
        });
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(100)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          type: doc.data().type,
          linkId: doc.data().linkId,
          shortLink: doc.data().shortLink,
          read: doc.data().read,
          createdAt: doc.data().createdAt,
          subId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      if (err.message === 'Document does not exist') return res.status(500).json({ error: 'Document does not exist' });
      return res.status(500).json({ error: err.code });
    });
};