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

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/profile/components/Header";
import Information from "./components/Information";
import Testimonial from "./components/Testimonial";
import Edit from "./components/Edit";
import NewPassword from "./components/NewPassword";
import { useApi } from "api";

import { useAuth } from "authContext";

function Overview() {
  const { token } = useAuth();
  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [typology, setTypology] = useState();
  const [role, setRole] = useState("");
  const [currentView, setCurrentView] = useState("information");
  const api = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get("user/getProfile");
        const user = data.data.elements;

        setUser(user);
        setName(user[0].name + " " + user[0].surname);
        setRole(user[0].role.description);
        setTypology(user[0].typology);
      } catch (error) {
      }
    };

    fetchData();
  }, [token]);

  const handleEdit = () => {
    setCurrentView("edit");
  };

  const handleNewPassword = () => {
    setCurrentView("password");
  };

  const handleTestimonial = () => {
    setCurrentView("testimonial");
  };

  if (!user.length) {
    return null;
  }

  return (
    <DashboardLayout>
      <Header
        name={name}
        role={role}
        typology={typology}
        onEdit={handleEdit}
        onPassword={handleNewPassword}
        onTestimonial={handleTestimonial}
      />
      {currentView === "edit" ? <Edit /> : <></>}
      {currentView === "password" ? <NewPassword /> : <></>}
      {currentView === "information" ? <Information /> : <></>}
      {currentView === "testimonial" ? <Testimonial /> : <></>}
    </DashboardLayout>
  );
}

export default Overview;
