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

const WRITE_ORDER = Object.freeze([
    "semesters", "periods", "subjects", "sectionCodes", "courses", "users", "offerings",
]);

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

    // Writes the plan group by group. Stops before later groups if anything fails,
    // so offerings are never written pointing to documents that weren't created.
    async function commit(writes) {
        const writer = db.bulkWriter();
        const failures = [];
        let written = 0;

        for (const group of WRITE_ORDER) {
            for (const action of ["create", "update"]) {
                const pending = writes[group]
                    .filter((w) => w.action === action)
                    .map((w) => {
                        const ref = db.collection(COLLECTIONS[group]).doc(w.id);
                        const result = action === "create"
                            ? writer.create(ref, w.data)
                            : writer.set(ref, w.data, { merge: true });
                        return result
                            .then(() => { written++; })
                            .catch((err) => failures.push({ group, id: w.id, error: err.message }));
                    });
                await writer.flush();
                await Promise.all(pending);
            }
            if (failures.length > 0) {
                break;
            }
        }

        await writer.close();
        return { written, failures };
    }

    return { loadExisting, newId, commit };

}

module.exports = { createFirestoreRepository };