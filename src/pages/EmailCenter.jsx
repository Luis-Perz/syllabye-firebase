import { useState } from 'react';

import { dataConnect } from '../firebase/firebase';
import { listDepartments } from '@dataconnect/generated';

import { Typography, Button } from '@mui/material';

// NOTE: This is all just example code for now!!! Replace it with the actual code that will be used to display the syllabus data from the database.

function StorageSyllabus() {
    const [departments, setDepartments] = useState([]);

    async function handleLoadDepartments() {
        const result = await listDepartments(dataConnect);
        setDepartments(result.data.departments);
    }

    return (
        <>
            <Typography variant="h4">
                Email Center
            </Typography>

            <Button variant="contained" onClick={handleLoadDepartments}>
                Load Departments
            </Button>

            {departments.map((department) => (
                <Typography key={department.code}>
                    {department.name} ({department.code})
                </Typography>
            ))}
        </>
    );
}

export default StorageSyllabus;