import { Request, Response } from "express";
import { UserQueries } from "../utils/queries/UserQueries";
import { BaseController } from "./BaseController";
import { User } from "../types";
import jwt from "jsonwebtoken";

export class UserController extends BaseController {
    private client_id: string;
    private client_secret: string;
    private redirect_uri: string;
    private userQueries: UserQueries;

    constructor() {
        super();
        this.client_id = process.env.GOOGLE_CLIENT_ID!;
        this.client_secret = process.env.GOOGLE_CLIENT_SECRET!;
        this.redirect_uri = process.env.GOOGLE_REDIRECT_URI!;
        this.userQueries = new UserQueries();
    }

    async signIn(req: Request, res: Response): Promise<Response> {
        try {
            const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&response_type=code&scope=profile email`;
            return res.status(200).json({ url });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async googleCallback(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.query;
            if (!code) {
                return res.status(400).json({ message: "Invalid code" });
            }

            const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: this.client_id,
                    client_secret: this.client_secret,
                    code: code,
                    redirect_uri: this.redirect_uri,
                    grant_type: 'authorization_code',
                }),
            });

            if (!tokenResponse.ok) {
                const errorData = await tokenResponse.json();
                throw new Error(errorData.error || "Failed to obtain access token");
            }

            const { access_token } = await tokenResponse.json();

            const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            if (!profileResponse.ok) {
                const errorData = await profileResponse.json();
                throw new Error(errorData.error || "Failed to fetch user profile");
            }

            const { email } = await profileResponse.json();

            const results: unknown[] = await this.userQueries.execLogin(email);
            const values: string[] = this.getValues(results);

            const user = new User(parseInt(values[0]), values[1]);

            const jwtToken = jwt.sign({ user_id: user.user_id, user_email: user.user_email }, process.env.JWT_SECRET!, {
                expiresIn: '1d',
            });

            return res.status(200).json({ access_token: jwtToken });


        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
