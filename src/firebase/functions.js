import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";


export const getCourses = httpsCallable(functions, "firestoreOperations-getCourses");
export const getOfferings = httpsCallable(functions, "firestoreOperations-getOfferings");
export const getOfferingStatuses = httpsCallable(functions, "firestoreOperations-getOfferingStatuses");
export const getProfessors = httpsCallable(functions, "firestoreOperations-getProfessors");
export const getSectionCodes = httpsCallable(functions, "firestoreOperations-getSectionCodes");
export const getSemesters = httpsCallable(functions, "firestoreOperations-getSemesters");
export const getSubjects = httpsCallable(functions, "firestoreOperations-getSubjects");
export const getSyllabusMetadata = httpsCallable(functions, "firestoreOperations-getSyllabusMetadata");