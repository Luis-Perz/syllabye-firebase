import { useState } from "react";

import { Button } from "@/shadcn/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Label } from "@/shadcn/ui/label";
import { Separator } from "@/shadcn/ui/separator";

import OfferingFilters from "@/components/offeringTable/OfferingFilters";
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
        <div className="mx-auto w-full max-w-screen-2xl space-y-6 px-4 py-6">
            <h1 className="text-3xl font-bold tracking-tight">
                Syllabus Storage
            </h1>

            
            <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                    <CardTitle>Filter Offerings</CardTitle>
                    <CardDescription>
                        Narrow down offerings by status, semester, subject, or professor.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <OfferingFilters 
                        SelectOfferingStatus={
                            <SelectOfferingStatus
                                value={offeringStatusFilter}
                                onValueChange={setOfferingStatusFilter}
                                selectionMode='all'
                            />
                        }
                        SelectSemester={
                            <SelectSemester
                                value={semesterFilter}
                                onValueChange={setSemesterFilter}
                                selectionMode='all'
                            />
                        }
                        SelectSubject={
                            <SelectSubject 
                                value={subjectFilter}
                                onValueChange={setSubjectFilter}
                                selectionMode='all'
                            />
                        }
                        SelectProfessor={
                            <SelectProfessor
                                value={professorFilter}
                                onValueChange={setProfessorFilter}
                                selectionMode='all'
                                filterIsActive={true}
                            />
                        }
                    />
                </CardContent>
                
                <Separator />

                <CardContent className="space-y-4 pt-6">
                    <div>
                        <CardTitle>Offerings</CardTitle>
                        <CardDescription className="mt-1">
                            Manage and review course offerings.
                        </CardDescription>
                    </div>

                    <OfferingTable 
                        filters={{
                            statusKey: offeringStatusFilter, 
                            semesterKey: semesterFilter, 
                            subjectKey: subjectFilter,
                            professorKey: professorFilter
                        }}
                    />
                </CardContent>

                <CardFooter className="justify-between border-t bg-muted/20 py-4">
                    <Button variant="outline">
                        Load More
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default SyllabusStorage;