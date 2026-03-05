
export type Category = "ux" | "dev frontend" | "dev backend";
export type AssignmentStatus = "new" | "doing" | "done";

export interface Member {
    id: string;
    name: string;
    category: Category;
}

export interface Assignment {
    id: string;
    title: string;
    description: string;
    category: Category; 
    status: AssignmentStatus;
    assignedTo: string | null;
    timestamp: string;

}

export interface Database {
    members: Member[];
    assignments: Assignment[];

}