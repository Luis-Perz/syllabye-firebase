import { useState } from "react";

import { Button } from "@/shadcn/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Separator } from "@/shadcn/ui/separator";



function ProfessorManagement() {
    


    return (
        <div className="mx-auto w-full max-w-screen-2xl space-y-6 px-4 py-6">
            <h1 className="text-3xl font-bold tracking-tight">
                Syllabus Storage
            </h1>

            
            <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                    <CardTitle>Filter Professors</CardTitle>
                    <CardDescription>
                        Narrow down professors by status, name, and email.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <p>Still working on this page...</p>
                    <p>Maybe put the filters here...</p>
                </CardContent>
                
                <Separator />

                <CardContent className="space-y-4 pt-6">
                    <div>
                        <CardTitle>Professors</CardTitle>
                        <CardDescription className="mt-1">
                            Manage the filtered professors.
                        </CardDescription>
                    </div>

                    <p>Still working on this page...</p>
                    <p>Maybe put a table here with each row being a professor...</p>
                </CardContent>

                <CardFooter className="justify-between border-t bg-muted/20 py-4">
                    <Button variant="outline">
                        Example Button
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default ProfessorManagement;