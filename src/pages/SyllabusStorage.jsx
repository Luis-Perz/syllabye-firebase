import { useState } from 'react';

import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shadcn/ui/table";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"

import SelectSemester from '@/components/selectors/SelectSemester';
import SelectOfferingStatus from '@/components/selectors/SelectOfferingStatus';
import SelectSubject from '@/components/selectors/SelectSubject';
import SelectProfessor from '@/components/selectors/SelectProfessor';


function SyllabusStorage() {
    const [offeringStatusFilter, setOfferingStatusFilter] = useState(null)
    const [semesterFilter, setSemesterFilter] = useState(null)
    const [subjectFilter, setSubjectFilter] = useState(null)
    const [professorFilter, setProfessorFilter] = useState(null)


    return (
        <>
            <h1>
                Syllabus Storage
            </h1>

            
            <Card>
                <CardHeader>
                    <h2>Filter Offerings</h2>
                    <SelectOfferingStatus
                        value={offeringStatusFilter}
                        onValueChange={setOfferingStatusFilter}
                        selectionMode='all'
                    />
                    <SelectSemester
                        value={semesterFilter}
                        onValueChange={setSemesterFilter}
                        selectionMode='all'
                    />
                    <SelectSubject 
                        value={subjectFilter}
                        onValueChange={setSubjectFilter}
                        selectionMode='all'
                    />
                    <SelectProfessor
                        value={professorFilter}
                        onValueChange={setProfessorFilter}
                        selectionMode='all'
                        filterIsActive={true}
                    />
                </CardHeader>
                <CardContent>
                    <h2>Offerings</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Column 1</TableHead>
                                <TableHead>Column 2</TableHead>
                                <TableHead>Column 3</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Data 1</TableCell>
                                <TableCell>Data 2</TableCell>
                                <TableCell>Data 3</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Data 4</TableCell>
                                <TableCell>Data 5</TableCell>
                                <TableCell>Data 6</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <Button variant="outline">
                        Load More
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}

export default SyllabusStorage;