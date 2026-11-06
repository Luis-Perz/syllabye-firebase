const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore")

const db = getFirestore()

exports.getSectionCodes = onCall(async (request) => {
    const authId = request.auth?.uid
    if (!authId) {
        throw new HttpsError("unauthenticated", "Unauthorized: No auth ID found in request")
    }
    // TODO: Add authorization check (if applicable)
    // Recommended Authorization:
    // All professors
    // All admins

    const snapshot = await db.collection("section-codes").get()
    
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data()
    }))
})