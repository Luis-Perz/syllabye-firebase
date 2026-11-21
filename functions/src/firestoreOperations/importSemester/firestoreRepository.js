const { courseLookup, offeringLookup } = require("./importLogic");

const COLLECTIONS = Object.freeze({
    semesters: "semesters",
    subjects: "subjects",
    sectionCodes: "section-codes",
    periods: "periods",
    users: "users",
    courses: "courses",
    offerings: "offerings",
});

function createFirestoreRepository(db) {
    const getAll = (name) => db.collection(COLLECTIONS[name]).get();

    async function loadExisting(semesterId) {
        const [semesters, subjects, sectionCodes, periods, users, courses, offerings] =
            await Promise.all([
                getAll("semesters"),
                getAll("subjects"),
                getAll("sectionCodes"),
                getAll("periods"),
                getAll("users"),
                getAll("courses"),
                db.collection(COLLECTIONS.offerings).where("semesterKey", "==", semesterId).get(),
            ]);

        const ids = (snapshot) => new Set(snapshot.docs.map((doc) => doc.id));

        return {
            semesterIds: ids(semesters),
            subjectIds: ids(subjects),
            sectionCodeIds: ids(sectionCodes),
            periodIds: ids(periods),
            userIdsByEmail: new Map(users.docs.map((doc) =>
                [String(doc.get("email") ?? "").trim().toLowerCase(), doc.id])),
            coursesByLookup: new Map(courses.docs.map((doc) => [
                courseLookup(doc.get("subjectKey"), doc.get("courseCode")),
                { id: doc.id, name: doc.get("name") },
            ])),
            offeringIdsByLookup: new Map(offerings.docs.map((doc) =>
                [offeringLookup(doc.get("courseKey"), doc.get("sectionCodeKey")), doc.id])),
        };
    }

    const newId = (group) => db.collection(COLLECTIONS[group]).doc().id;

    return { loadExisting, newId };
}

module.exports = { createFirestoreRepository };