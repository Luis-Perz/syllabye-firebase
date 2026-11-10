import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { getOfferings } from '../firebase/functions';

// NOTE: This is all just example code for now!!! Replace it with the actual code that will be used to display the syllabus data from the database.

function SyllabusStorage() {
    const [example, setExample] = useState([]);

    async function testFunction() {
        const offerings = await getOfferings();
        setExample(JSON.stringify(offerings));
    }

    return (
        <>
            <Typography variant="h4">
                Syllabus Storage
            </Typography>

            <Button variant="contained" onClick={testFunction}>
                Test Button
            </Button>

            {example && (
                <Typography>
                    {example}
                </Typography>
            )}
        </>
    );
}

export default SyllabusStorage;