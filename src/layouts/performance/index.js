/**
=========================================================
* Soft UI Dashboard React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Soft UI Dashboard React examples
import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Collection from './components/Collection';
import Title from './components/Title';


function Performance() {

  return (
    <DashboardLayout>
      <Title />
      <Collection />
    </DashboardLayout>
  );
}

export default Performance;