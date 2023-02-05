import { Button, Paper, Typography } from "@mui/material";
import {default as GoogleIcon} from "@mui/icons-material/Google"
import React, { useState } from "react";
import { auth, logout, signInWithEmailAndPassword, signInWithGoogle } from "../firebase";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    function doSignInWithGoogle (){
        signInWithGoogle();
    }

  return (
    <div className="flex content-center gap-3 w-screen p-7 justify-around flex-wrap">
      <Paper className="p-2 flex flex-col items-center justify-center gap-5 w-11/12 max-w-xl">
        <Typography variant="h2">Login</Typography>
        <div className="py-20 px-8 min-p w-11/12 rounded-md border-solid border-slate-400 border-4 flex flex-col gap-6">
         <Button onClick={doSignInWithGoogle} variant="contained" color="error" endIcon={<GoogleIcon/>}>Google Login</Button>
        </div>
        <Typography>User/Password later</Typography>
      </Paper>
    </div>
  );
}
export default Login;
