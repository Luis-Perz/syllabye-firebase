const { setGlobalOptions } = require("firebase-functions/v2");

setGlobalOptions({
    invoker: "public",
    maxInstances: 10
});

const admin = require("firebase-admin");

admin.initializeApp();

exports.firestoreOperations = require("./firestoreOperations");
exports.retreiveCourseInfo = require("./genai/retreiveCourseInfo").retreiveCourseInfo;