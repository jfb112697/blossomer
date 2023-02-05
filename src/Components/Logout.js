import { signOut } from "firebase/auth";
import Login from "./Login";
import {logout} from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


function Logout() {
  const navigate = useNavigate();
  logout();
  useEffect(() => {
    navigate("/login");
  })
    

  return (<></>);
}
export default Logout;
