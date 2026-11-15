import { getOfferings } from "@/firebase/functions";
import { useEffect, useState } from "react";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shadcn/ui/table";
import { Skeleton } from "@/shadcn/ui/skeleton";

import OfferingTableRow from "./OfferingTableRow";
import OfferingDialog from "./dialogs/OfferingDialog";



function OfferingTable({filters = {}}) {
    // Read Filters
    const {
        statusKey = null,
        semesterKey = null, 
        subjectKey = null,
        professorKey = null
    } = filters


    // Component Logic
    const [offerings, setOfferings] = useState([])
    const [loading, setLoading] = useState(true) 
    
    const [activeDialog, setActiveDialog] = useState(null)



    useEffect(() => {
        let ignoreResults = false // We may want to ignore the fetch results if the client makes a new request before the current one is done executing

        async function fetchOfferings() {
            setLoading(true)

            try {
                const results = await getOfferings({
                    statusKey: statusKey,
                    semesterKey: semesterKey,
                    subjectKey: subjectKey,
                    professorKey: professorKey
                })
                if (!ignoreResults) {
                    setOfferings(results.data)
                }
            } catch (error) {
                if (!ignoreResults) {
                    console.error("Failed to fetch offerings:", error)
                }
            } finally {
                if (!ignoreResults) {
                    setLoading(false)
                }
            }
        }

        fetchOfferings()

        return () => {ignoreResults = true}
    }, [statusKey, semesterKey, subjectKey, professorKey])

    function openDialog(dialogOption, offering) {
        setActiveDialog({
            option: dialogOption,
            offering: offering
        })
    }

    function closeDialog() {
        setActiveDialog(null)
    }


    // Render JSX
    return (
        <>
            <div className="overflow-x-auto">
                <Table className="w-full max-w-[1600px] min-w-[700px] border-collapse">
                    <colgroup>
                        <col className="w-[10%]" />
                        <col className="w-[10%]" />
                        <col className="w-[10%]" />
                        <col className="w-[10%]" />
                        <col className="w-[calc(50%-180px)]" />
                        <col className="w-[15%]" />
                        <col className="w-[180px]" />
                    </colgroup>

                    <TableHeader className="bg-muted/75">
                        <TableRow>
                            <TableHead>Semester</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Course Number</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Professor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 10 }).map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {Array.from({ length: 7 }).map((_, cellIndex) => (
                                        <TableCell key={cellIndex}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            offerings.map((offering) => (
                                <OfferingTableRow 
                                    key={offering.id}
                                    offering={offering}
                                    onAction={openDialog}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {activeDialog && (
                <OfferingDialog
                    option={activeDialog.option}
                    offering={activeDialog.offering}
                    onClose={closeDialog}
                />
            )}
        </>
    )
}

export default OfferingTable;