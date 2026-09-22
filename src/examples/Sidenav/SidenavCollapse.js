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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItem";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink } from 'react-router-dom';
import Icon from "@mui/material/Icon";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import List from '@mui/material/List';

// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

// Soft UI Dashboard React context
import { useSoftUIController } from "context";
import { useState } from "react";
import InboxIcon from '@mui/icons-material/Inbox';
import AddIcon from '@mui/icons-material/Add';

function SidenavCollapse({ collapse, color, icon, name, children, active, noCollapse, open, ...rest }) {
  const [controller] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const [open2, setOpen2] = useState(open);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const toggleCollapse = () => {
    setOpen2(!open2);
  };
  return (
    <>
      <ListItem component="li" onClick={toggleCollapse}>
        <SoftBox {...rest} sx={(theme) => collapseItem(theme, { active, transparentSidenav })}>
          <ListItemIcon
            sx={(theme) => collapseIconBox(theme, { active, transparentSidenav, color })}
          >
            <FontAwesomeIcon
              icon={icon}
              size="xs"
              color={active ? 'white' : null}
            />
          </ListItemIcon>

          <ListItemText
            primary={name}
            sx={(theme) => collapseText(theme, { miniSidenav, transparentSidenav, active })}
          />
        </SoftBox>
      </ListItem>
      <Collapse in={open2} timeout="auto" unmountOnExit>
        {collapse && (
          <List component="div" sx={{ mb: 2, width: "90%" }}>
            {collapse.map((item, index) => (
              <NavLink to={item.route} key={index}>
                <ListItemButton
                  alignItems="flex-start"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: 2,
                    py: 1,
                    "& .MuiTypography-body1": {
                      fontSize: "14px",
                    },
                  }}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index)}
                >
                  <ListItemIcon sx={{ ml: 3 }}>
                    <FontAwesomeIcon
                      icon={item.icon}
                      color="#0578b7"
                      size="xs"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      color: "#344776",
                      typography: "body1",
                    }}
                  />
                </ListItemButton>
              </NavLink>
            ))}
          </List>

        )}
      </Collapse>
    </>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  color: "info",
  active: false,
  noCollapse: false,
  children: false,
  open: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  active: PropTypes.bool,
  noCollapse: PropTypes.bool,
  open: PropTypes.bool,
  collapse: PropTypes.array
};

export default SidenavCollapse;
