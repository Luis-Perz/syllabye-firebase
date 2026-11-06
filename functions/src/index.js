const { setGlobalOptions } = require("firebase-functions/v2");

setGlobalOptions({
    maxInstances: 10
});

const admin = require("firebase-admin");

admin.initializeApp();

exports.firestoreOperations = require("./firestoreOperations");