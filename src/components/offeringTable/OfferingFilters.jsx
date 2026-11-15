import { Label } from "@/shadcn/ui/label";


function OfferingFilters({ SelectOfferingStatus, SelectSemester, SelectSubject, SelectProfessor }) {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 space-y-2">
                <Label>Status</Label>
                {SelectOfferingStatus}
            </div>

            <div className="min-w-0 space-y-2">
                <Label>Semester</Label>
                {SelectSemester}
            </div>

            <div className="min-w-0 space-y-2">
                <Label>Subject</Label>
                {SelectSubject}
            </div>

            <div className="min-w-0 space-y-2">
                <Label>Professor</Label>
                {SelectProfessor}
            </div>
        </div>
    )
}

export default OfferingFilters