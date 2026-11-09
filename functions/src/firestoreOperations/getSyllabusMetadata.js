const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore")

const db = getFirestore()

exports.getSyllabusMetadata = onCall(async (request) => {
    const authId = request.auth?.uid
    if (!authId) {
        throw new HttpsError("unauthenticated", "Unauthorized: No auth ID found in request")
    }
    // TODO: Add authorization check (if applicable)
    // Recommended Authorization:
    // All professors
    // All admins

    const { offeringKey, version } = request.data

    const snapshot = await db.collection("syllabus-metadata")
        .where("offeringKey", "==", offeringKey)
        .where("version", "==", version)
        .get()
    
    const document = snapshot.docs[0]

    if (!document) {
        throw new HttpsError("not-found", "No syllabus metadata found for the given offeringKey and version")
    } else if (snapshot.docs.length > 1) {
        throw new HttpsError("internal", "Multiple syllabus metadata documents found for the given offeringKey and version")
    }

    return {
        id: document.id,
        data: document.data()
    }
})