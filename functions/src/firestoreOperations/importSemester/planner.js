const { semesterId, semesterName, periodId, courseLookup, offeringLookup, } = require("./importLogic");

// Status for newly created offerings; existing offerings keep theirs.
const INITIAL_STATUS = "NOT_UPLOADED";

const create = (id, data) => ({ action: "create", id, data });
const update = (id, data) => ({ action: "update", id, data });

function buildPlan(rows, existing, newId) {
    const semester = rows[0].semester;
    const semesterKey = semesterId(semester);

    const writes = {
        semesters: [], periods: [], subjects: [], sectionCodes: [],
        courses: [], users: [], offerings: [],
    };

    const known = {
        periods: new Set(existing.periodIds),
        subjects: new Set(existing.subjectIds),
        sectionCodes: new Set(existing.sectionCodeIds),
        users: new Map(existing.userIdsByEmail),
        courses: new Map(existing.coursesByLookup),
        offerings: new Map(existing.offeringIdsByLookup),
    };

    const ensure = (group, id, data) => {
        if (!known[group].has(id)) {
            known[group].add(id);
            writes[group].push(create(id, data));
        }
    };

    if (!existing.semesterIds.has(semesterKey)) {
        writes.semesters.push(create(semesterKey, { name: semesterName(semester) }));
    }

    for (const row of rows) {
        const termKey = periodId(row.period);
        ensure("periods", termKey, { name: row.period });
        ensure("subjects", row.subject, { name: row.subject });   // placeholder name for Firestore
        ensure("sectionCodes", row.section, {});

        const courseKey = planCourse(row, known, writes, newId);
        const professorKey = planUser(row, known, writes, newId);

        const lookup = offeringLookup(courseKey, row.section);
        const offering = {
            semesterKey,
            courseKey,
            sectionCodeKey: row.section,
            termKey,
            ...(professorKey && { professorKey }),
        };

        const existingId = known.offerings.get(lookup);
        if (existingId) {
            writes.offerings.push(update(existingId, offering));
        } else {
            const id = newId("offerings");
            known.offerings.set(lookup, id);
            writes.offerings.push(create(id, { ...offering, statusKey: INITIAL_STATUS }));
        }
    }

    return { writes, summary: summarize(writes) };
}

function planCourse(row, known, writes, newId) {
    const lookup = courseLookup(row.subject, row.courseCode);
    const course = known.courses.get(lookup);

    if (!course) {
        const id = newId("courses");
        known.courses.set(lookup, { id, name: row.courseName });
        writes.courses.push(create(id, {
            courseCode: row.courseCode,
            name: row.courseName,
            subjectKey: row.subject,
        }));
        return id;
    }

    if (course.name !== row.courseName) {
        known.courses.set(lookup, { ...course, name: row.courseName });
        writes.courses.push(update(course.id, { name: row.courseName }));
    }
    return course.id;
}

// Returns the professor's user ID, or null if the row has no professor.
function planUser(row, known, writes, newId) {
    if (!row.email) {
        return null;
    }
    const existingId = known.users.get(row.email);
    if (existingId) {
        return existingId;   // existing names are never overwritten
    }
    const id = newId("users");
    known.users.set(row.email, id);
    writes.users.push(create(id, {
        activeProfessor: true,
        email: row.email,
        nameFirst: row.firstName,
        nameLast: row.lastName,
    }));
    return id;
}

function summarize(writes) {
    const count = (list, action) => list.filter((w) => w.action === action).length;
    return {
        ...Object.fromEntries(Object.entries(writes).map(([group, list]) =>
            [group, { create: count(list, "create"), update: count(list, "update") }])),
        newSubjects: writes.subjects.map((w) => w.id),   // need names added by hand for new subjects
    };
}

module.exports = { buildPlan };