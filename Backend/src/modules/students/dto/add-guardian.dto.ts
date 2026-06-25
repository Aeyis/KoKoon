import {IsInt} from "class-validator";

export class AddGuardianDto {
    @IsInt()
    userId: number;
}