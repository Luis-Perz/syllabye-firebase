import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectSeparator } from "@/shadcn/ui/select";
import { Spinner } from "@/shadcn/ui/spinner";


// selectionMode: "all" | "required" | "optional"
// "all"      - selecting the All option is allowed
// "optional" - selecting None is allowed
// "required" - user must select a specific option

function ResourceSelect({
    value,
    onValueChange,
    items,
    label,
    resourceName,
    loading,
    loadingText,
    selectionMode = "required"
}) {
    // Validate Props
    const validModes = ["all", "optional", "required"];

    if (!validModes.includes(selectionMode)) {
        throw new Error(`Invalid selectionMode: ${selectionMode}`);
    }

    // Component Logic
    let specialOption = null;
    let placeholderText = `Select a ${resourceName}`;

    if (selectionMode === "all") {
        specialOption = { value: null, label: `All ${label}` };
        placeholderText = `All ${label}`;
    } else if (selectionMode === "optional") {
        specialOption = { value: null, label: "None" };
        placeholderText = "None";
    }

    const selectItems = specialOption
        ? [specialOption, ...items]
        : items;

    // Render JSX
    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            disabled={loading}
            items={selectItems}
        >
            <SelectTrigger className="data-[size=default]:h-10 w-64">
                { loading ?
                    (
                        <div className="flex items-center gap-2">
                            <Spinner />
                            <span>{loadingText}</span>
                        </div>
                    ) : (
                        <SelectValue placeholder={placeholderText} />
                    )
                }
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>

                    {specialOption && (
                        <>
                            <SelectItem value={null}>
                                {specialOption.label}
                            </SelectItem>
                            <SelectSeparator />
                        </>
                    )}

                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default ResourceSelect;