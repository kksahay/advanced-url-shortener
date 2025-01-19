# Advanced URL Shortener

## High-Level Architecture

![HLD](https://raw.githubusercontent.com/kksahay/advanced-url-shortener/refs/heads/main/tutorials/url-shortener-hld.png)

---

## Installation

1. **Create an `.env` file** in the root directory.
2. **Obtain the Client Secret and Client ID** from your Google Service Account.  
   If you don’t already have one, create it via the [Google Cloud Console](https://console.cloud.google.com/).

3. **Add the following environment variables** to your `.env` file:

   ```env
   # Server Configuration
   PORT=3000

   # Database Configuration
   DB_URI=postgresql://url_shortener_5sot_user:tP8ltTz2tXEdwvHGznVII4ZrH0leiFYh@dpg-cu4peft2ng1s73fcmaf0-a.singapore-postgres.render.com/url_shortener_5sot

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google-callback

   # URL Shortener Configuration
   SHORT_URL_PREFIX=https://short.en/

   # JWT Configuration
   JWT_SECRET=advanced-url-shortener
   ```

4. **Run the application using Docker Compose**:  
   Execute the following command in the terminal:

   ```bash
   docker compose up
   ```

5. **Access the application**:  
   Open your browser and navigate to:  
   `http://localhost:3000`

6.
   ![Deployed](https://raw.githubusercontent.com/kksahay/advanced-url-shortener/refs/heads/main/tutorials/deployment.png)

---

## Tutorial: Getting the JWT Key

1. Sign in using the `/api/auth` route:  
   Visit: `http://localhost:3000/api/auth`
   
2. Once authenticated, copy the token provided in the response.  
   This token can be used for authenticated requests.

---

## API Documentation

The full API documentation can be found [here](https://advanced-url-shortener-b0hn.onrender.com/).

---

### Notes:
- Ensure the `.env` file is kept secure and not shared publicly.
