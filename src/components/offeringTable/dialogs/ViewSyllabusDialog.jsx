import { useState, useEffect } from "react";

import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shadcn/ui/dialog";


function ViewSyllabusDialog({ offering, onClose }) {
    function handleConfirm() {
        // TODO: update Firestore as needed
        onClose();
    }
    
    return (
        <Dialog
            open={true}
            onOpenChange={onClose}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Title</DialogTitle>
                    <DialogDescription>
                        Description goes here.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <p>Content goes here</p>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default ViewSyllabusDialog;
