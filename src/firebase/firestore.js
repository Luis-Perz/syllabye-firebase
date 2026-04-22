import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export async function syllabus(data) {
    await addDoc(collection(db, "syllabi"), {
        semester: data.semester,
        department: data.department,
        courseName: data.courseName,
        courseNumber: data.courseNumber,
        section: data.section,
        instructor: data.instructor,
        fileURL: data.fileURL
    });
}