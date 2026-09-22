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
// prop-types is a library for typechecking of props

import DonutChart from "layouts/performance/charts/Donut";

// @mui material components
import Grid from "@mui/material/Grid";
import { Card, CardContent } from "@mui/material";


// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

function Cards() {
  return (
    <SoftBox position="relative">
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="4rem"
        borderRadius="xl"
        sx={{
          backgroundColor: "#0578b7",
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          backdropFilter: `saturate(200%) blur(30px)`,
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: "relative",
          mt: -6,
          mx: 2,
          py: 2,
          px: 2,
        }}
      >
        <CardContent>
          <Grid container justifyContent="center">
            <DonutChart />
          </Grid>
        </CardContent>
      </Card>
    </SoftBox>
  );
}

export default Cards;
