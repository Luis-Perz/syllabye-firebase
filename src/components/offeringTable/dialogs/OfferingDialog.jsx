import EmailReminderDialog from "./EmailReminderDialog";
import UploadSyllabusDialog from "./UploadSyllabusDialog"
import ViewSyllabusDialog from "./ViewSyllabusDialog"
import EditOfferingDialog from "./EditOfferingDialog";


function OfferingDialog({ option, offering, onClose }) {
    const dialogContent = {
        email: {component: EmailReminderDialog},
        upload: {component: UploadSyllabusDialog},
        view: {component: ViewSyllabusDialog},
        edit: {component: EditOfferingDialog}
    };

    const selectedDialog = dialogContent[option];
    if (!selectedDialog) return null; // not a supported dialog type
    const Content = selectedDialog.component;


    return (
        <Content offering={offering} onClose={onClose} />
    );
}

export default OfferingDialog;