export class User {
    user_id!: number;
    user_email!: string;

    constructor(user_id: number, user_email: string) {
        this.user_id = user_id;
        this.user_email = user_email;
    }
}