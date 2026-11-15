import { useEffect, useState } from "react";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shadcn/ui/table";

import OfferingActions from "./OfferingActions";



function OfferingTableRow({ offering, onAction }) {
    const [hovering, setHovering] = useState(false);


    return (
        <TableRow
            className="
                border-b border-border/80
                odd:bg-background
                even:bg-muted/20
                transition-colors duration-150
                hover:bg-muted/60
            "
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <TableCell>{offering.display.semesterName}</TableCell>
            <TableCell>{offering.display.subjectCode}</TableCell>
            <TableCell>{offering.display.courseCode}</TableCell>
            <TableCell>{offering.fields.sectionCodeKey}</TableCell>
            <TableCell>{offering.display.professorNameLast + ", " + offering.display.professorNameFirst}</TableCell>
            <TableCell>{offering.display.offeringStatusName}</TableCell>
            <TableCell className="text-right">
                <OfferingActions 
                    offering={offering}
                    onAction={onAction}
                    hovering={hovering}
                />
            </TableCell>
        </TableRow>
    )
}

export default OfferingTableRow;