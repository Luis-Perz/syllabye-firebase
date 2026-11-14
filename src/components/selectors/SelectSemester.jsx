import { getSemesters } from '@/firebase/functions';
import { useEffect, useState } from "react";

import ResourceSelect from "./ResourceSelect";


function SelectSemester({ value, onValueChange, selectionMode = "required" }) {
    // Component Logic
    const [semesters, setSemesters] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect (() => {
        async function fetchSemesters() {
            try {
                const results = await getSemesters()
                setSemesters(results.data)
            } catch (error) {
                console.error("Failed to fetch semesters:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSemesters()
    }, [])

    const items = semesters.map((semester) => ({
        value: semester.id,
        label: semester.data.name
    }));


    // Render JSX
    return (
        <ResourceSelect
            value={value}
            onValueChange={onValueChange}
            items={items}
            label="Semesters"
            resourceName="semester"
            loading={loading}
            loadingText="Loading Semesters..."
            selectionMode={selectionMode}
        />
    )
}

export default SelectSemester;