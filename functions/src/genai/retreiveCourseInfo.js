const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions");
const logger = require("firebase-functions/logger");
const {defineSecret} = require("firebase-functions/params");
const {GoogleGenAI} = require("@google/genai");


const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

setGlobalOptions({maxInstances: 10, region: "us-central1"});

exports.retreiveCourseInfo = onCall(
    {
      enforceAppCheck: true,
      secrets: [GEMINI_API_KEY],
    },
    async (request) => {
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "Sign in required.");
      }

      const {base64, mimeType} = request.data;
      if (!base64 || !mimeType) {
        throw new HttpsError("invalid-argument", "Missing file data.");
      }

      const prompt =
          "This is a university syllabus. Return the semester " +
          "(for example Fall 2026, Spring 2027, Summer 2027), " +
          "department name (for example Computer Science, " +
          "Mathematics, Accounting, Biology), course number " +
          "(for example 20000), course section number (3 " +
          "character long code 001, 002, LT1, LS1), course " +
          "name, and instructor name (for example John Smith with no title)";

      const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY.value()});

      try {
        const result = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: [
            {
              role: "user",
              parts: [
                {text: prompt},
                {inlineData: {data: base64, mimeType}},
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                semester: {type: "string"},
                department: {type: "string"},
                courseNumber: {type: "string"},
                sectionNumber: {type: "string"},
                courseName: {type: "string"},
                instructorName: {type: "string"},
              },
              required: [
                "semester",
                "department",
                "courseNumber",
                "sectionNumber",
                "courseName",
                "instructorName",
              ],
            },
          },
        });

        const parsed = JSON.parse(result.text);
        return parsed;
      } catch (err) {
        logger.error("Gemini call failed", err);
        throw new HttpsError("internal", "Failed to process the file.");
      }
    },
);
