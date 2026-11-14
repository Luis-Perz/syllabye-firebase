import { Button } from "@/shadcn/ui/button";
import { Mail, Upload, Eye, Pencil } from "lucide-react";


function OfferingActions({ offering, onAction, hovering = false }) {
    return (
        <div className="
            flex items-center gap-1
            rounded-lg border
            bg-muted/10
            p-1
            transition-colors duration-200
            group-hover:bg-muted
        ">
            <Button
                variant={hovering ? "default" : "outline"}
                size="icon"
                className="transition-colors duration-1000 ease-in-out"
                title="Send reminder"
                onClick={() => onAction("email", offering)}
            >
                <Mail className="h-4 w-4" />
            </Button>

            <Button
                variant={hovering ? "default" : "outline"}
                size="icon"
                className="transition-colors duration-750 ease-in-out"
                title="Upload syllabus"
                onClick={() => onAction("upload", offering)}
            >
                <Upload className="h-4 w-4" />
            </Button>

            <Button
                variant={hovering ? "default" : "outline"}
                size="icon"
                className="transition-colors duration-500 ease-in-out"
                title="View syllabus"
                onClick={() => onAction("view", offering)}
            >
                <Eye className="h-4 w-4" />
            </Button>

            <Button
                variant={hovering ? "default" : "outline"}
                size="icon"
                className="transition-colors duration-250 ease-in-out"
                title="Edit offering"
                onClick={() => onAction("edit", offering)}
            >
                <Pencil className="h-4 w-4" />
            </Button>
        </div>
    );
}

export default OfferingActions;