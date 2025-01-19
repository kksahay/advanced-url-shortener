"use strict";Object.defineProperty(exports,"__esModule",{value:true});Object.defineProperty(exports,"UserQueries",{enumerable:true,get:function(){return UserQueries}});const _server=require("../../server");class UserQueries{async execLogin(emailId){const response=await (0,_server.sql)`
            INSERT INTO public.tblUser (user_email)
            VALUES (${emailId})
            ON CONFLICT (user_email) 
            DO UPDATE SET user_email = EXCLUDED.user_email
            RETURNING user_id, user_email;
        `;return response}}