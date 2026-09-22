import { useState, useEffect } from "react";

// react-router-dom components
import {useNavigate, useSearchParams} from "react-router-dom";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import Header from "./components/Header";
import Edit from "./components/Edit";
import { useAuth } from "authContext";
import { useApi } from 'api';

function Main() {
    const navigate = useNavigate()
    const { token } = useAuth();
    const [user, setUser] = useState([]);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [role, setRole] = useState("");
    const api = useApi();

    useEffect(() => {
        userData()
      }, [token]);

      async function userData() {
        try {
          const data = await api.get("user/getProfile");
          const user = data.data.elements;
          setUser(user)
          setName(user[0].name);
          setSurname(user[0].surname);
          setRole(user[0].role.description);
        } catch (error) {
          // Handle error
        }
      }


    if (!user.length) {
      return null; 
    }
    
  return (
    <SoftBox>
      <Header name={name+" "+surname} role={role}/>
      <Edit/>
    </SoftBox>
  );
}

export default Main;