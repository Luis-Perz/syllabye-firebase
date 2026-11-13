import { useState } from 'react';
import { getOfferings } from '../firebase/functions';

import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";


// NOTE: This is all just example code for now!!! Replace it with the actual code that will be used to display the syllabus data from the database.

function SyllabusStorage() {
    const [example, setExample] = useState([]);

    async function testFunction() {
        const offerings = await getOfferings();
        setExample(JSON.stringify(offerings));
    }

    return (
        <>
            <h1>
                Syllabus Storage
            </h1>

            <Button variant="default" size="lg" className="rounded-full" onClick={testFunction}>
                Test Button
            </Button>

            <Input placeholder="Enter syllabus data (PLACEHOLDER)..." />

            {example && (
                <p>
                    {example}
                </p>
            )}
        </>
    );
}

export default SyllabusStorage;