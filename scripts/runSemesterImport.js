// Sends a semester CSV to the importSemester Cloud Function.
// Usage: node scripts/runSemesterImport.js <csv path> [--commit] [--emulator]
// Without --commit it's a dry run. The deployed function requires the gcloud CLI,
// logged in as a member of the Firebase project.

const fs = require("fs");
const { execSync } = require("child_process");

const PROJECT_ID = "syllabye-4a90d";
const REGION = "us-central1";
const FUNCTION_NAME = "firestoreOperations-importSemester";

const URLS = Object.freeze({
    deployed: `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}`,
    emulator: `http://127.0.0.1:5001/${PROJECT_ID}/${REGION}/${FUNCTION_NAME}`,
});

function parseArgs(args) {
    return {
        csvPath: args.find((arg) => !arg.startsWith("--")),
        commit: args.includes("--commit"),
        emulator: args.includes("--emulator"),
    };
}

function getIdentityToken() {
    return execSync("gcloud auth print-identity-token", { encoding: "utf8" }).trim();
}

async function main() {
    const { csvPath, commit, emulator } = parseArgs(process.argv.slice(2));

    if (!csvPath) {
        console.error("Usage: node scripts/runSemesterImport.js <csv path> [--commit] [--emulator]");
        process.exit(1);
    }

    const url = (emulator ? URLS.emulator : URLS.deployed) + (commit ? "?commit=true" : "");
    const headers = { "Content-Type": "text/csv" };
    if (!emulator) {
        headers.Authorization = `Bearer ${getIdentityToken()}`;
    }

    console.log(`${commit ? "IMPORTING" : "Dry run"}: ${csvPath} → ${emulator ? "emulator" : "deployed function"}\n`);

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: fs.readFileSync(csvPath),
    });

    const text = await response.text();
    try {
        console.log(JSON.stringify(JSON.parse(text), null, 2));
    } catch {
        console.log(text);   // Google's own errors (e.g. 403) aren't JSON
    }

    if (response.status === 401 || response.status === 403) {
        console.error("\nNot authorized. Run `gcloud auth login` with an account that's a member of the project.");
    }
    if (!response.ok) {
        process.exitCode = 1;
    }
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});