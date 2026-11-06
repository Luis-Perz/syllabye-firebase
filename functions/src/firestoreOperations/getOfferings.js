const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore")

const db = getFirestore()

exports.getOfferings = onCall(async (request) => {
    const authId = request.auth?.uid
    if (!authId) {
        throw new HttpsError("unauthenticated", "Unauthorized: No auth ID found in request")
    }
    // TODO: Add authorization check (if applicable)
    // Recommended Authorization:
    // All professors
    // All admins

    const { courseKey, professorKey, sectionCodeKey, semesterKey, status } = request.data ?? {}

    let query = db.collection("offerings")
    if (courseKey) {
        query = query.where("courseKey", "==", courseKey)
    }
    if (professorKey) {
        query = query.where("professorKey", "==", professorKey)
    }
    if (sectionCodeKey) {
        query = query.where("sectionCodeKey", "==", sectionCodeKey)
    }
    if (semesterKey) {
        query = query.where("semesterKey", "==", semesterKey)
    }
    if (status) {
        query = query.where("status", "==", status)
    }

    const snapshot = await query.get()

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data()
    }))
})