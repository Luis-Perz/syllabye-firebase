const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore")

const db = getFirestore()

exports.getProfessors = onCall(async (request) => {
    const authId = request.auth?.uid
    if (!authId) {
        throw new HttpsError("unauthenticated", "Unauthorized: No auth ID found in request")
    }
    // TODO: Add authorization check (if applicable)
    // Recommended Authorization:
    // All professors
    // All admins


    // isActive: filter by active professor status if request field is present
    const { isActive = null } = request.data ?? {}

    let query = db.collection("users")
    if (isActive === null) {
        query = query.where("activeProfessor", "in", [true, false])
    } else if (isActive === true) {
        query = query.where("activeProfessor", "==", true)
    } else if (isActive === false) {
        query = query.where("activeProfessor", "==", false)
    } else {
        throw new HttpsError("invalid-argument", "isActive must be true, false, or null.")
    }

    const snapshot = await query.get()

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        fields: doc.data()
    }))
})