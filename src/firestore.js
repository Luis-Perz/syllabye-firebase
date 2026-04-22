import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore'

const storeSyllabus = async (term, department, courseNumber,
                            sectionNumber, courseName, instructorName )
    try{
        const docRef = await addDoc(collection(db, "syllabi"), {
            term,
            department,
            courseNumber,
            sectionNumber,
            courseName,
            instructorName
        });
    console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.log("Error adding document: ", error);
    }