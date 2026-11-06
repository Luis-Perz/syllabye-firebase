import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./index";

const functions = getFunctions(app);

export const getCourses = httpsCallable(functions, "firestoreOperations-getCourses");
export const getDepartments = httpsCallable(functions, "firestoreOperations-getDepartments");
export const getOfferings = httpsCallable(functions, "firestoreOperations-getOfferings");
export const getSectionCodes = httpsCallable(functions, "firestoreOperations-getSectionCodes");
export const getSemesters = httpsCallable(functions, "firestoreOperations-getSemesters");
export const getSyllabusMetadata = httpsCallable(functions, "firestoreOperations-getSyllabusMetadata");