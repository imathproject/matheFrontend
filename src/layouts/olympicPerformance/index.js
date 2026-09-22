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
import React, { useState } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import OlympicPageHeader from 'components/olympiads/OlympicPageHeader';
import { useTranslation } from 'react-i18next';
import Collection from './components/Collection';


function OlympicPerformance() {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <OlympicPageHeader title={t("olympiads_performance_page.title", "Olympiads Performance")} />
      <Collection />
    </DashboardLayout>
  );
}

export default OlympicPerformance;