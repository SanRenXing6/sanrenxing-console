import { Skill } from "./Skill";

export interface Profile {
    userId: string;
    description: string;
    imageId: string;
    needs: string;
    skills: Skill[];
}