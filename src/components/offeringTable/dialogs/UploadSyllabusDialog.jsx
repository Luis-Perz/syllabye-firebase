import { useState } from "react";

import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shadcn/ui/dialog";

import SyllabusUpload from "./components/SyllabusUpload"



const MAX_FILE_SIZE_MB = 10

function UploadSyllabusDialog({ offering, onClose }) {
    const [selectedFile, setSelectedFile] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    function handleFileSelect(file, error) {
        if (error) {
            setSelectedFile(null)
            setErrorMessage(error)
            return
        }
        setErrorMessage(null)
        setSelectedFile(file)
    }

    async function handleConfirm() {
        if (!selectedFile) return;

        try {
            // TODO: Upload file to Firebase Storage

            // TODO: Update Firestore metadata

            onClose();
        } catch (error) {
            console.error("Failed to upload syllabus:", error);
            setErrorMessage({
                main: "Upload failed",
                sub: "Please try again."
            });
        }
    }
    

    return (
        <Dialog
            open={true}
            onOpenChange={() => {
                if (!selectedFile && !errorMessage) onClose();
            }}
        >
            <DialogContent showCloseButton={!selectedFile && !errorMessage}>
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
                />

                <DialogFooter className="flex items-center justify-center h-10 p-3">
                    {selectedFile && !errorMessage ? (
                        <Button onClick={handleConfirm}>
                            Confirm Upload
                        </Button>
                    ) : (
                        <span>
                            {errorMessage ? (
                                <>
                                    <span className="block text-destructive">
                                        {errorMessage.main}
                                    </span>
                                    {errorMessage.sub && (
                                        <span className="block text-sm text-muted-foreground">
                                            {errorMessage.sub}
                                        </span>
                                    )}
                                </>
                            ) : (
                                "Select a PDF or DOCX file before confirming the upload."
                            )}
                        </span>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default UploadSyllabusDialog;
