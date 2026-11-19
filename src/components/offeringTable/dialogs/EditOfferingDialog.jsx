import { useState, useEffect } from "react";

import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shadcn/ui/dialog";

import SelectProfessor from "@/components/selectors/SelectProfessor";



function EditOfferingDialog({ offering, onClose }) {
    const [selectedProfessor, setSelectedProfessor] = useState(offering.fields.professorKey)


    function handleSave() {
        // TODO: Save offering changes to Firestore
        onClose();
    }

    return (
        <Dialog
            open={true}
            onOpenChange={onClose}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Offering</DialogTitle>
                    <DialogDescription>
                        Update the professor or status for this offering.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <SelectProfessor
                        value={selectedProfessor}
                        onValueChange={setSelectedProfessor}
                        selectionMode="optional"
                    />
                    <div>
                        <label>Professor</label>
                        {/* TODO: Professor selector */}
                    </div>

                    {/* Status selector */}
                    <div>
                        <label>Status</label>
                        {/* TODO: Status selector */}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default EditOfferingDialog;
