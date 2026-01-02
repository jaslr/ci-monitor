export interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}
export declare function sendEmail(options: EmailOptions): Promise<void>;
//# sourceMappingURL=email.d.ts.map