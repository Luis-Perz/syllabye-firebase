
import { useState } from "react";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

import { FileText, X } from "lucide-react";
import { Button } from "@/shadcn/ui/button";

import "filepond/dist/filepond.min.css";
import "./filepond.css";



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

registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
);

export default function FileUpload({ onFileSelect, maxFileSizeMB = 10 }) {
    if (typeof onFileSelect !== "function") {
        throw new Error("FileUpload requires an onFileSelect callback.");
    }

    const [files, setFiles] = useState([]);

    const selectedFile = files[0]?.file ?? null;


    function handleUpdateFiles(fileItems) {
        setFiles(fileItems);

        onFileSelect(fileItems[0].file, null);
    }

    function handleError(error) {
        onFileSelect(null, error)
    }

    function handleRemoveFile() {
        setFiles([]);
        onFileSelect(null, null);
    }

    return (
        <div>
            {!selectedFile ? (
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
                    labelFileTypeNotAllowed="Unsupported file type"
                    fileValidateTypeLabelExpectedTypes="Please upload a PDF or DOCX file"
                    maxFileSize={`${maxFileSizeMB}MB`}
                    labelMaxFileSizeExceeded="File is too large"
                    labelMaxFileSize="Maximum file size is {filesize}"
                    stylePanelAspectRatio="2:1"
                    stylePanelLayout="integrated"
                />
            ) : (
                <div className="flex flex-col items-center justify-center box-border aspect-2/1 p-2 border bg-muted/50">
                    <div className="h-[60%] flex items-center justify-center">
                        <div className="flex items-center justify-center p-2 gap-3 border-2 rounded-md bg-muted max-h-[80%]">
                            <FileText className="size-10 text-muted-foreground" />

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium max-w-70">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024).toFixed(0)} KB
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
            )}
        </div>
    );
}
