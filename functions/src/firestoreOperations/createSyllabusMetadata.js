const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const db = getFirestore();
const storage = getStorage();

exports.createSyllabusMetadata = onCall(async (request) => {
    const authId = request.auth?.uid;
    if (!authId) {
        throw new HttpsError("unauthenticated", "Unauthorized: No auth ID found in request");
    }
    // TODO: Add authorization check
    // All professors
    // All admins


    const { offeringKey, syllabusMetadataUUID } = request.data;
    if (!offeringKey || !syllabusMetadataUUID) {
        throw new HttpsError("invalid-argument", `An "offeringKey" and "syllabusMetadataUUID" must be given`);
    }

    // Verify that the uploaded file exists in Storage
    const storagePath = `offerings/${offeringKey}/${syllabusMetadataUUID}`;
    const storageFile = storage.bucket().file(storagePath);
    const [fileExists] = await storageFile.exists();

    if (!fileExists) {
        throw new HttpsError("not-found", "Uploaded syllabus file not found");
    }

    // Create syllabus metadata
    await db.collection("syllabi-metadata").doc(syllabusMetadataUUID).set({
        offeringKey: offeringKey,
        uploadedBy: "TODO: Feature not implemented",
        uploadedAt: FieldValue.serverTimestamp(),
        version: -1
    });

    return { success: true };
});