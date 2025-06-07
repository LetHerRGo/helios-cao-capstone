import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Flex, Text, IconButton, Box, Avatar, Heading } from "@chakra-ui/react";
import {
  FiMenu,
  FiHome,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiBriefcase,
  FiSettings,
} from "react-icons/fi";
import NavItem from "./NavItem.jsx";
import { CiLogout, CiSearch } from "react-icons/ci";
import { MdOutlineDirectionsRailway } from "react-icons/md";
import { CgPlayListAdd } from "react-icons/cg";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [navSize, changeNavSize] = useState("large");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Flex
      bg="#79a5b2"
      pos="sticky"
      left="5"
      h="95vh"
      marginTop="2.5vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius={navSize == "small" ? "15px" : "30px"}
      w={navSize == "small" ? "75px" : "250px"}
      flexDir="column"
      justifyContent="space-between"
      transition="all 0.3s ease"
    >
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize == "small" ? "center" : "flex-start"}
        as="nav"
      >
        <IconButton
          aria-label="Toggle sidebar"
          background="none"
          mt={5}
          _hover={{
            background: "#d8ecee",
            boxShadow: "none",
            textDecor: "none",
          }}
          _focus={{ boxShadow: "none" }}
          _active={{ boxShadow: "none" }}
          onClick={() => {
            if (navSize == "small") changeNavSize("large");
            else changeNavSize("small");
          }}
        >
          <FiMenu />
        </IconButton>
        <NavLink to="/trace" style={{ width: "100%" }}>
          <NavItem
            navSize={navSize}
            icon={MdOutlineDirectionsRailway}
            title="Trace"
            active={location.pathname === "/trace"}
          />
        </NavLink>
        <NavLink to="/track" style={{ width: "100%" }}>
          <NavItem
            navSize={navSize}
            icon={CiSearch}
            title="Track"
            active={location.pathname === "/track"}
          />
        </NavLink>
        <NavLink to="/addshipment" style={{ width: "100%" }}>
          <NavItem
            navSize={navSize}
            icon={CgPlayListAdd}
            title="Add Shipment"
            active={location.pathname === "/addshipment"}
          />
        </NavLink>
        <NavItem
          navSize={navSize}
          icon={CiLogout}
          title="Log Out"
          onClick={handleLogout}
        />
      </Flex>

      <Flex
        p="5%"
        flexDir="column"
        // w="100%"
        alignItems={navSize == "small" ? "center" : "flex-start"}
        mb={4}
      >
        <Box display={navSize == "small" ? "none" : "flex"} />
        <Flex mt={4} align="center">
          {/* <Avatar size="sm" /> */}
          <Flex
            flexDir="column"
            ml={4}
            display={navSize == "small" ? "none" : "flex"}
          >
            <Heading as="h3" size="sm">
              Sylwia Weller
            </Heading>
            <Text color="gray">Admin</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
