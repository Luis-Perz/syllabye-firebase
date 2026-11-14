import { useState } from "react";

import { Button } from "@/shadcn/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"

import SelectSemester from '@/components/selectors/SelectSemester';
import SelectOfferingStatus from '@/components/selectors/SelectOfferingStatus';
import SelectSubject from '@/components/selectors/SelectSubject';
import SelectProfessor from '@/components/selectors/SelectProfessor';
import OfferingTable from '@/components/offeringTable/OfferingTable';


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
                    <OfferingTable 
                        filters={{
                            statusKey: offeringStatusFilter, 
                            semesterKey: semesterFilter, 
                            subjectKey: subjectFilter,
                            professorKey: professorFilter
                        }}
                    />
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