import { getSubjects } from '@/firebase/functions';
import { useEffect, useState } from "react";

import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/shadcn/ui/combobox"
import { Skeleton } from "@/shadcn/ui/skeleton";


// selectionMode: "all" | "optional"
// "all"      - selecting the All option is allowed
// "optional" - selecting None is allowed

function SelectSubject({ value, onValueChange, selectionMode = "optional" }) {
    // Validate Props
    const validModes = ["all", "optional"];

    if (!validModes.includes(selectionMode)) {
        throw new Error(`Invalid selectionMode: ${selectionMode}`);
    }    
   
    // Component Logic
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect (() => {
        async function fetchSubjects() {
            try {
                const results = await getSubjects()
                setSubjects(results.data)
            } catch (error) {
                console.error("Failed to fetch subjects:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSubjects()
    }, [])


    let placeholderText = ``;
    if (selectionMode === "all") {
        placeholderText = `All Subjects`;
    } else if (selectionMode === "optional") {
        placeholderText = `None`;
    }

    // Render JSX
    return (
        <Combobox
            items={subjects.map((subject) => subject.id)}
            value={value}
            onValueChange={onValueChange}
            filter={(subjectId, query) =>
                subjectId.toLowerCase().includes(query.toLowerCase())
            }
            autoHighlight
        >
            <ComboboxInput 
                className="h-10 w-64"
                placeholder={placeholderText} 
                showClear 
            />

            <ComboboxContent>
                {loading ? (
                    <div className="flex flex-col gap-2 p-2" role="status">
                        <span className="sr-only">Loading subjects...</span>
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-3/4" />
                    </div>
                ) : (
                    <>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>

                        <ComboboxList>
                            {(subjectId) => (
                                <ComboboxItem key={subjectId} value={subjectId}>
                                    {subjectId}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </>
                )}
            </ComboboxContent>
        </Combobox>
    )
}

export default SelectSubject;