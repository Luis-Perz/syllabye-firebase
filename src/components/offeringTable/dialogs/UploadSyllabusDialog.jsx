import { useState } from "react";

import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebase";

import { createSyllabusMetadata } from '@/firebase/functions';

import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shadcn/ui/dialog";

import SyllabusUpload from "./components/SyllabusUpload"



const MAX_FILE_SIZE_MB = 10

function UploadSyllabusDialog({ offering, onClose }) {
    const [uploadStatus, setUploadStatus] = useState("idle"); // "idle", "error", "selected", "uploading", "success"

    const [selectedFile, setSelectedFile] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)


    function handleFileSelect(file, error) {
        if (file) {
            setUploadStatus("selected")
        } else {
            setUploadStatus("idle")
        }

        if (error) {
            console.log("upload dialog error", error)

            setSelectedFile(null)
            setErrorMessage(error)
            setUploadStatus("error")
        } else {
            setSelectedFile(file)
            setErrorMessage(null)
        }
        
    }

    async function handleConfirm() {
        if (!selectedFile) return;

        try {
            // Generate UUID for syllabus metadata
            const syllabusMetadataUUID = crypto.randomUUID()

            // Upload file to Firebase Storage
            const storageRef = ref(
                storage,
                `offerings/${offering.id}/${syllabusMetadataUUID}`
            )

            setUploadStatus("uploading")
            await uploadBytes(storageRef, selectedFile)

            // Create Firestore metadata
            createSyllabusMetadata({
                offeringKey: offering.id, 
                syllabusMetadataUUID: syllabusMetadataUUID
            })

            // If we made is this far, the upload was a success!
            setUploadStatus("success")
        } catch (error) { // this should never happen under normal circumstances!
            setErrorMessage({
                main: "Upload failed",
                sub: error.message || "An unknown error occured."
            })
        }
    }
    

    // render JSX
    function renderFooterContent() {
        if (uploadStatus == "success") {
            return (
                <span>
                    You're all set! You may now close this window.
                </span>
            )
        }
        if (uploadStatus == "uploading") {
            return (
                <Button disabled={true}>
                    Uploading...
                </Button>
            )
        }
        if (errorMessage) {
            return (
                <div className="flex flex-col">
                    <span className="text-destructive">
                        {errorMessage.main}
                    </span>
                    {errorMessage.sub && (
                        <span className="text-sm text-muted-foreground">
                            {errorMessage.sub}
                        </span>
                    )}
                </div>
            )
        }
        if (selectedFile) {
            return (
                <Button onClick={handleConfirm}>
                    Confirm Upload
                </Button>
            )
        }
        return (
            <span>
                Select a PDF or DOCX file before confirming the upload.
            </span>
        )
    }

    function allowOutsideClose() {
        return (uploadStatus === "success" || (!selectedFile && !errorMessage))
    }

    return (
        <Dialog
            open={true}
            onOpenChange={() => {
                if (allowOutsideClose()) onClose();
            }}
        >
            <DialogContent showCloseButton={allowOutsideClose()}>
                <DialogHeader>
                    <DialogTitle className="mb-0">
                        Upload Syllabus
                    </DialogTitle>
                    <div className="space-y-1">
                        <DialogDescription className="mt-0">
                        {offering.display.subjectCode + "-" 
                        + offering.display.courseCode + "-"
                        + offering.fields.sectionCodeKey + " | "
                        + offering.display.courseName}
                        </DialogDescription>
                        <DialogDescription className="mt-0">
                            {offering.display.semesterName + " | " 
                            + offering.display.professorNameLast + ", "
                            + offering.display.professorNameFirst}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                
                <SyllabusUpload
                    onFileSelect={handleFileSelect}
                    maxFileSizeMB={MAX_FILE_SIZE_MB}
                    status={uploadStatus}
                />

                <DialogFooter className="flex items-center justify-center h-10 p-3">
                    {renderFooterContent()}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default UploadSyllabusDialog;
