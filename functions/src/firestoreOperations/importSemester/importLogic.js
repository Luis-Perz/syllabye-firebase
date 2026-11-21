const { parse } = require("csv-parse/sync");

// If registrar renames a column for the CSV, change it here
const COLUMNS = Object.freeze({
    semester: "TERM",
    subject: "SUBJECT",
    courseCode: "COURSE NO.",
    section: "SECTION NO.",
    period: "PERIOD DESC",
    courseName: "COURSE NAME",
    status: "STATUS",
    lastName: "LAST NAME",
    firstName: "FIRST NAME",
    email: "EMAIL ADDRESS",
});

const REQUIRED_FIELDS = Object.freeze([
    "semester", "subject", "courseCode", "section", "period", "courseName",
]);

const INSTRUCTOR_FIELDS = Object.freeze(["lastName", "firstName", "email"]);

// Reject if TERM doesn't include/has a typo for the season
const ALLOWED_SEASONS = Object.freeze(["SPRING", "SUMMER", "FALL"]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// -- Normalization --
function normalizeText(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
}

function normalizeEmail(value) {
    return normalizeText(value).toLowerCase();
}

function normalizeSubject(value) {
    return normalizeText(value).toUpperCase();
}

// 1 -> 001, if code isn't numeric, left as-is
function normalizeSection(value) {
    const s = normalizeText(value);
    return /^\d+$/.test(s) ? s.padStart(3, "0") : s;
}

function parseSemester(value) {
    const match = normalizeText(value).toUpperCase().match(/^([A-Z]+) (\d{4})$/);
    if (!match || !ALLOWED_SEASONS.includes(match[1])) {
        return null;
    }
    return { season: match[1], year: match[2] };
}

function semesterId(semester) {
    return `${semester.season.toLowerCase()}${semester.year}`;
}

function semesterName(semester) {
    const season = semester.season.charAt(0) + semester.season.slice(1).toLowerCase();
    return `${season} ${semester.year}`;
}

// "Sixteen Weeks" -> "sixteen-weeks"
function periodId(value) {
    return normalizeText(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

// In-memory labels for finding docs with random IDs; not stored in Firestore.
const courseLookup = (subjectKey, courseCode) => `${subjectKey}|${courseCode}`;
const offeringLookup = (courseId, sectionCode) => `${courseId}|${sectionCode}`;

function normalizeRow(rawRow) {
    const get = (field) => rawRow[COLUMNS[field]];
    return {
        semester: parseSemester(get("semester")),
        semesterText: normalizeText(get("semester")),
        subject: normalizeSubject(get("subject")),
        courseCode: normalizeText(get("courseCode")),
        section: normalizeSection(get("section")),
        period: normalizeText(get("period")),
        courseName: normalizeText(get("courseName")),
        status: normalizeText(get("status")),
        lastName: normalizeText(get("lastName")),
        firstName: normalizeText(get("firstName")),
        email: normalizeEmail(get("email")),
    };
}

const isBlank = (rawRow, field) => normalizeText(rawRow[COLUMNS[field]]) === "";

const ERROR_RULES = [
    (raw) => REQUIRED_FIELDS
        .filter((field) => isBlank(raw, field))
        .map((field) => `${COLUMNS[field]} is blank`),
    (_raw, row) => row.semesterText && !row.semester
        ? `TERM "${row.semesterText}" is not a recognized semester (e.g. "SPRING 2027")`
        : null,
    (_raw, row) => row.email && !EMAIL_PATTERN.test(row.email)
        ? `EMAIL ADDRESS "${row.email}" is not a valid email`
        : null,
    (raw) => {
        const blank = INSTRUCTOR_FIELDS.filter((field) => isBlank(raw, field));
        return blank.length > 0 && blank.length < INSTRUCTOR_FIELDS.length
            ? `instructor is incomplete (${blank.map((f) => COLUMNS[f]).join(", ")} blank)`
            : null;
    },
];

const WARNING_RULES = [
    (_raw, row) => row.status && row.status.toLowerCase() !== "active"
        ? `STATUS is "${row.status}", not Active`
        : null,
];

function applyRules(rules, rawRow, row, line) {
    return rules
        .flatMap((rule) => [].concat(rule(rawRow, row) ?? []))
        .map((message) => `Row ${line}: ${message}`);
}

// Returns { rows, errors, warnings }. Any error means nothing should be imported
function validateRows(rawRows) {
    if (rawRows.length === 0) {
        return { rows: [], errors: ["The file has no data rows."], warnings: [] };
    }

    const missing = [...REQUIRED_FIELDS, ...INSTRUCTOR_FIELDS]
        .map((field) => COLUMNS[field])
        .filter((header) => !(header in rawRows[0]));
    if (missing.length > 0) {
        return { rows: [], errors: [`Missing columns: ${missing.join(", ")}`], warnings: [] };
    }

    const errors = [];
    const warnings = [];
    const semesters = new Set();
    const firstLineBySection = new Map();

    const rows = rawRows.map((rawRow, index) => {
        const line = index + 2;   // matches the row number in Excel (line 1 is the header)
        const row = normalizeRow(rawRow);

        errors.push(...applyRules(ERROR_RULES, rawRow, row, line));
        warnings.push(...applyRules(WARNING_RULES, rawRow, row, line));

        if (row.semester) {
            semesters.add(semesterId(row.semester));
        }

        const sectionKey = `${row.subject} ${row.courseCode}-${row.section}`;
        if (firstLineBySection.has(sectionKey)) {
            errors.push(`Row ${line}: duplicate of row ${firstLineBySection.get(sectionKey)} (${sectionKey})`);
        } else {
            firstLineBySection.set(sectionKey, line);
        }

        return row;
    });

    if (semesters.size > 1) {
        errors.push(`File contains more than one semester: ${[...semesters].join(", ")}`);
    }

    return { rows, errors, warnings };
}

function parseCsv(csvText) {
    return parse(csvText, {
        columns: true,
        trim: true,
        skip_empty_lines: true,
        bom: true,
    });
}

module.exports = {
    parseCsv,
    validateRows,
    semesterId,
    semesterName,
    periodId,
    courseLookup,
    offeringLookup,
    // exported for unit tests
    parseSemester,
    normalizeSection,
};