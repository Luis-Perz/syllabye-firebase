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

    const { isActive = true } = request.data

    const professorUserRoleDocs = (await db.collection("user-roles")
        .where("roleOptionKey", "==", "professor")
        .where("isActive", "==", isActive)
        .get()).docs
    const professorPromises = professorUserRoleDocs.map((userRoleDoc) => {
        const userKey = userRoleDoc.data().userKey
        return db.collection("users").doc(userKey).get()
    })
    const professorSnapshots = await Promise.all(professorPromises)

    const professors = professorSnapshots.map((userDoc) => {
        if (!userDoc.exists) {
            throw new HttpsError("internal", `User document ${userDoc.id} does not exist`);
        }

        return {
            id: userDoc.id,
            data: userDoc.data()
        }
    })

    return professors
})