import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class MailService {
    constructor(private readonly config: ConfigService) {}

    async sendInvitation(email: string, token: string): Promise<string> {
        const frontendUrl = this.config.get('FRONTEND_URL') ?? 'http://localhost:4200';
        const link = `${frontendUrl}/onboarding?token=${token}`;
        console.log(`[MAIL] invitation for ${ email } : ${link}`);
        return link;
    }
}
