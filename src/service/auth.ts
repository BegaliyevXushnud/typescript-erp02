
import https from "./config"

import {AuthRequest} from "@types"

const auth: AuthRequest = {
    sign_in: (data) => https.post("/auth/sign-in", data),
    sign_up: (data) => https.post("/auth/user/sign-up", data)
  };
  
export default auth