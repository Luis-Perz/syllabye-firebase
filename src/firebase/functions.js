import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";


export const getCourses = httpsCallable(functions, "firestoreOperations-getCourses");
export const getDepartments = httpsCallable(functions, "firestoreOperations-getDepartments");
export const getOfferings = httpsCallable(functions, "firestoreOperations-getOfferings");
export const getSectionCodes = httpsCallable(functions, "firestoreOperations-getSectionCodes");
export const getSemesters = httpsCallable(functions, "firestoreOperations-getSemesters");
export const getSyllabusMetadata = httpsCallable(functions, "firestoreOperations-getSyllabusMetadata");