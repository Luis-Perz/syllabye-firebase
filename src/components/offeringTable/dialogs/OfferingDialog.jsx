import { Dialog, DialogContent } from "@/shadcn/ui/dialog";

import EmailReminderDialogContent from "./EmailReminderDialogContent";
import UploadSyllabusDialogContent from "./UploadSyllabusDialogContent"
import ViewSyllabusDialogContent from "./ViewSyllabusDialogContent"
import EditOfferingDialogContent from "./EditOfferingDialogContent";


function OfferingDialog({ option, offering, onClose }) {
    const dialogContent = {
        email: {
            component: EmailReminderDialogContent,
            preventOutsideClose: false
        },
        upload: {
            component: UploadSyllabusDialogContent,
            preventOutsideClose: true
        },
        view: {
            component: ViewSyllabusDialogContent,
            preventOutsideClose: false
        },
        edit: {
            component: EditOfferingDialogContent,
            preventOutsideClose: false
        }
    };

    const selectedDialog = dialogContent[option];

    if (!selectedDialog) return null; // not a supported dialog type

    const Content = selectedDialog.component;
    const preventOutsideClose = selectedDialog.preventOutsideClose;

    return (
        <Dialog
            open={true}
            onOpenChange={() => {
                if (!preventOutsideClose) onClose();
            }}
        >
            <DialogContent showCloseButton={!preventOutsideClose}>
                <Content offering={offering} onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
}

export default OfferingDialog;