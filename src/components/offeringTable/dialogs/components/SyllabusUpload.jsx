
import { useState } from "react";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

import { FileText, X, LoaderCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/shadcn/ui/button";

import "filepond/dist/filepond.min.css";
import "./filepond.css";



registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
);

export default function FileUpload({ 
    onFileSelect, 
    maxFileSizeMB = 10, 
    status = "idle" 
}) {
    if (typeof onFileSelect !== "function") {
        throw new Error("FileUpload requires an onFileSelect callback.");
    }

    console.log("FileUpload state:", status)

    const [files, setFiles] = useState([]);

    const selectedFile = files[0]?.file ?? null;


    function handleUpdateFiles(fileItems) {
        setFiles(fileItems);

        onFileSelect(fileItems[0].file, null);
    }

    function handleError(error) {
        // manually set the sub errors we want to display
        if (error.main === "File is of invalid type") {
            error.sub = "Please select a PDF or DOCX file."
        } else if (error.main === "File is too large") {
            error.sub = `Please select a file under ${maxFileSizeMB} MB`
        }
        // send the error to the callback
        onFileSelect(null, error)
    }

    function handleRemoveFile() {
        setFiles([]);
        onFileSelect(null, null);
    }


    // Render JSX
    function renderIdle() {
        const labelIdle = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
            ">
                <svg xmlns="http://www.w3.org/2000/svg"
                    width="36" height="36" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>
                    Drag & Drop your syllabus or
                    <span class="filepond--label-action">Browse</span>
                </span>
            </div>
        `;
        return (
            <FilePond
                files={files}
                onupdatefiles={handleUpdateFiles}
                onerror={handleError}
                allowMultiple={false}
                maxFiles={1}
                acceptedFileTypes={[
                    "application/pdf",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ]}
                credits={false}
                labelIdle={labelIdle}
                maxFileSize={`${maxFileSizeMB}MB`}
                stylePanelAspectRatio="2:1"
                stylePanelLayout="integrated"
            />
        );
    }

    function renderSelected() {
        function formatFileSize(bytes) {
            if (bytes < 1024 * 1024) {
                return `${Math.round(bytes / 1024)} KB`;
            }

            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
        return (
            <div className="flex flex-col items-center justify-center box-border aspect-2/1 p-2 border bg-muted/50">
                <div className="h-[60%] flex items-center justify-center">
                    <div className="flex items-center justify-center p-2 gap-3 border-2 rounded-md bg-muted max-h-[80%]">
                        <FileText className="size-10 text-muted-foreground" />

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium max-w-70">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex mt-1">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleRemoveFile}
                    >
                        Delete <X/>
                    </Button>
                </div>
            </div>
        );
    }

    function renderUploading() {
        return (
            <div className="flex flex-col items-center justify-center aspect-2/1 border bg-muted/50 gap-3">
                <LoaderCircle className="size-12 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    Uploading syllabus...
                </p>
            </div>
        );
    }

    function renderSuccess() {
        return (
            <div className="flex flex-col items-center justify-center aspect-2/1 border bg-muted/50 gap-3">
                <CheckCircle2 className="size-16 text-green-600 animate-success-pop" />
                <p className="text-sm font-medium">
                    Syllabus uploaded successfully!
                </p>
            </div>
        );
    }


    return (
        <div>
            {status === "idle" && renderIdle()}
            {(status === "selected" || status === "error") && renderSelected()} {/* We still want the user to deselect the file if it is in an error state */}
            {status === "uploading" && renderUploading()}
            {status === "success" && renderSuccess()}
        </div>
    );
}
