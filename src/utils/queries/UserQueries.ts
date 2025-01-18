import { sql } from "../../server";

export class UserQueries {
    async execLogin(emailId: string): Promise<unknown[]> {
        const response = await sql`
            INSERT INTO public.tblUser (user_email)
            VALUES (${emailId})
            ON CONFLICT (user_email) DO UPDATE SET user_email = EXCLUDED.user_email
            RETURNING user_id, user_email;
        `;
        return response;
    }
}
