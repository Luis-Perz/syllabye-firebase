import { useState } from 'react';

import { Typography, Button } from '@mui/material';

// NOTE: This is all just example code for now!!! Replace it with the actual code that will be used to display the syllabus data from the database.

function EmailCenter() {
    const [example, setExample] = useState([]);

    async function testFunction() {
        setExample("Hello World");
    }

    return (
        <>
            <Typography variant="h4">
                Email Center
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

export default EmailCenter;