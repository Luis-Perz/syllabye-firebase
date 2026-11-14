import { getProfessors } from '@/firebase/functions';
import { useEffect, useState, useMemo } from "react";

import { Combobox as ComboboxPrimitive } from "@base-ui/react"; 

import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/shadcn/ui/combobox"
import { Skeleton } from "@/shadcn/ui/skeleton";


// selectionMode: "all" | "optional"
// "all"      - selecting the All option is allowed
// "optional" - selecting None is allowed

function SelectProfessor({ value, onValueChange, selectionMode = "optional", filterIsActive = true }) {
    // Validate Props
    const validModes = ["all", "optional"];

    if (!validModes.includes(selectionMode)) {
        throw new Error(`Invalid selectionMode: ${selectionMode}`);
    }    
   
    // Component Logic
    const [professors, setProfessors] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect (() => {
        async function fetchProfessors() {
            try {
                const results = await getProfessors({isActive: filterIsActive})
                console.log(results)
                setProfessors(results.data)
            } catch (error) {
                console.error("Failed to fetch professors:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfessors()
    }, [filterIsActive])


    const items = useMemo( // Create Combobox items using professor UUIDs as values
        () => ComboboxPrimitive.createItems(professors, {
            getValue: (professor) => professor.id,
            getLabel: (professor) => `${professor.data.nameFirst} ${professor.data.nameLast}`
        }),
        [professors]
    )

    let placeholderText = ``;
    if (selectionMode === "all") {
        placeholderText = `All professors`;
    } else if (selectionMode === "optional") {
        placeholderText = `None`;
    }

    // Render JSX
    return (
        <Combobox
            items={items}
            value={value}
            onValueChange={onValueChange}
            filter={(professor, query) => {
                const search = query.toLocaleLowerCase().trim()
                return (
                    professor.data.nameFirst?.toLocaleLowerCase().includes(search) ||
                    professor.data.nameLast?.toLocaleLowerCase().includes(search) ||
                    professor.data.email?.toLocaleLowerCase().includes(search)
                )
            }}
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
                        <span className="sr-only">Loading professors...</span>
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-3/4" />
                    </div>
                ) : (
                    <>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>

                        <ComboboxList>
                            {(professor) => (
                                <ComboboxItem
                                    key={professor.id}
                                    value={professor.id}
                                    className="py-2"
                                >
                                    <div className="flex min-w-0 flex-col gap-0.5">
                                        <span className="font-medium">
                                            {professor.data.nameLast} {professor.data.nameFirst}
                                        </span>

                                        <span className="truncate text-xs text-muted-foreground">
                                            {professor.data.email}
                                        </span>
                                    </div>
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </>
                )}
            </ComboboxContent>
        </Combobox>
    )
}

export default SelectProfessor;