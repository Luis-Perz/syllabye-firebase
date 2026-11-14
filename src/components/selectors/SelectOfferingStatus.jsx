import { getOfferingStatuses } from '@/firebase/functions';
import { useEffect, useState } from "react";

import ResourceSelect from "./ResourceSelect";


function SelectOfferingStatus({ value, onValueChange, selectionMode = "required" }) {
    // Component Logic
    const [offeringStatuses, setOfferingStatuses] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect (() => {
        async function fetchOfferingStatuses() {
            try {
                const results = await getOfferingStatuses()
                setOfferingStatuses(results.data)
            } catch (error) {
                console.error("Failed to fetch offering statuses:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchOfferingStatuses()
    }, [])

    const items = offeringStatuses.map((status) => ({
        value: status.id,
        label: status.data.name
    }));


    // Render JSX
    return (
        <ResourceSelect
            value={value}
            onValueChange={onValueChange}
            items={items}
            label="Offering Statuses"
            resourceName="status"
            loading={loading}
            loadingText="Loading Offering Statuses..."
            selectionMode={selectionMode}
        />
    )
}

export default SelectOfferingStatus;