const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { parseCsv, validateRows, semesterId } = require("./importLogic");

const db = getFirestore();

exports.importSemester = onRequest({ invoker: "private" }, async (req, res) => {

    if (req.method !== "POST") {
        res.status(405).json({ error: "Use POST with the CSV file as the body" });
        return;
    }

    const csvText = req.rawBody ? req.rawBody.toString("utf8") : "";

    if (!csvText) {
        res.status(400).json({ error: "No CSV received" });
        return;
    }

    let rawRows;
    try {
        rawRows = parseCsv(csvText);
    } catch (err) {
        res.status(400).json({ error: "Could not read the CSV", details: err.message });
        return;
    }

    const { rows, errors, warnings } = validateRows(rawRows);

    if (errors.length > 0) {
        res.status(400).json({
            error: "Validation failed. Nothing was imported.",
            errorCount: errors.length,
            errors: errors.slice(0, 50),   // first 50, so the reply stays readable
            warnings,
        });
        return;
    }

    res.status(200).json({
        message: "CSV is valid",
        rowCount: rows.length,
        semester: semesterId(rows[0].semester),
        withoutProfessor: rows.filter((row) => !row.email).length,
        warnings,
    });

});