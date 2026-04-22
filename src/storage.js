import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "firebase/app";

const storage = getStorage(app);

const storeSyllabus = async file => {
    try {
        const storageRef = ref(storage, `syllabi/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("File uploaded, URL: ", downloadURL);
        return downloadURL;
    } catch(error){
        console.error("Error uploading file: ", error);
    }

};
export default storeSyllabus;