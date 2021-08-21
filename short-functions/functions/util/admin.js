const admin = require('firebase-admin');
//firebase-adminsdk
var serviceAccount = require("...");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "..." //.firebaseio.com
});

const db = admin.firestore();

module.exports = { admin, db };