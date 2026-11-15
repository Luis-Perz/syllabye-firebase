const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore")

const db = getFirestore()



// Helper functions
async function getDocument(collection, id) {
    if (!id) return null;

    const doc = await db.collection(collection).doc(id).get();

    return doc.exists ? doc.data() : null;
}


exports.getOfferings = onCall(async (request) => {
    const authId = request.auth?.uid
    if (!authId) {
        throw new HttpsError("unauthenticated", "Unauthorized: No auth ID found in request")
    }
    // TODO: Add authorization check (if applicable)
    // Recommended Authorization:
    // All professors
    // All admins

    const { 
        courseKey, 
        professorKey, 
        sectionCodeKey, 
        semesterKey, 
        statusKey,

        subjectKey
    } = request.data ?? {}

    // filter the offerings
    let query = db.collection("offerings")
    if (courseKey != null) {
        query = query.where("courseKey", "==", courseKey)
    }
    if (professorKey != null) {
        query = query.where("professorKey", "==", professorKey)
    }
    if (sectionCodeKey != null) {
        query = query.where("sectionCodeKey", "==", sectionCodeKey)
    }
    if (semesterKey != null) {
        query = query.where("semesterKey", "==", semesterKey)
    }
    if (statusKey != null) {
        query = query.where("statusKey", "==", statusKey)
    }

    let snapshot = await query.get()

    if (subjectKey != null) {
        const filteredOfferings = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data()

                const course = await getDocument("courses", data.courseKey)

                return course?.subjectKey === subjectKey ? doc : null
            })
        );

        snapshot = {
            docs: filteredOfferings.filter(doc => doc !== null)
        }
    }


    // get the display data associated with each offering (basically a custom join operation)
    const offerings = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data()

        const [course, professor, semester, offeringStatus] = await Promise.all([
            getDocument("courses", data.courseKey),
            getDocument("users", data.professorKey),
            getDocument("semesters", data.semesterKey),
            getDocument("offering-statuses", data.statusKey)
        ])
        return  {
            id: doc.id,
            fields: data,
            display: {
                courseCode: course?.courseCode ?? null,
                courseName: course?.name ?? null,
                subjectCode: course?.subjectKey ?? null,
                professorEmail: professor?.email ?? null,
                professorNameFirst: professor?.nameFirst ?? null,
                professorNameLast: professor?.nameLast ?? null,
                semesterName: semester?.name ?? null,
                offeringStatusName: offeringStatus?.name ?? null
            }
        }
    }))

    return offerings
})