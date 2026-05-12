import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadSyllabus(file, data) {

    const extension = file.name.split(".").pop();
    const cleaned = `${data.department}${data.courseNumber}_${Date.now()}.${extension}`;
    const path = `syllabi/${cleaned}`;

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}