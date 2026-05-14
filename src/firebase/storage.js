// YOU WILL NOT BEAT ME FORCING NAME CONVENTION

import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Old stuff that works but no forced naming
//export async function uploadSyllabus(file){
    //const path = `syllabi/${Date.now()}_${file.name}`;
    //const storageRef = ref(storage, path);
    //await uploadBytes(storageRef, file);
    //const downloadURL = await getDownloadURL(storageRef);
    //return downloadURL;
//}

// New stuff trying the forced naming again
export async function uploadSyllabus(file, data) {
    const extension = file.name.split(".").pop();
    const professorName = data.instructor
        .replace(/\s+/g, "")
        .toLowerCase();
    const semester = data.semester
        .replace(/\s+/g, "");
    const cleanName = `${data.department}-${data.courseNumber}-${data.section}-${professorName}-${semester}.${extension}`;
    
    const path = `syllabi/${cleanName}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}