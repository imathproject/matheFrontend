/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import Header from "./components/Header";
import Edit from "./components/Edit";
import { useAuth } from "authContext";
import { useApi } from "api";

function Main() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [role, setRole] = useState();
  const api = useApi();

  useEffect(() => {
    userData();
  }, [token]);

  async function userData() {
    try {
      const data = await api.get("user/getProfile");
      const user = data.data.elements;
      setUser(user);
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
      <Header name={name + " " + surname} role={role} />
      <Edit />
    </SoftBox>
  );
}

export default Main;
