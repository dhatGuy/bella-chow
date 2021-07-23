/* eslint-disable react/no-children-prop */
import React, { useState } from "react";
import {
  Flex,
  Heading,
  Avatar,
  AvatarGroup,
  Text,
  Icon,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Link,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  FiHome,
  FiPieChart,
  FiDollarSign,
  FiBox,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiCreditCard,
  FiSearch,
  FiBell,
} from "react-icons/fi";
import Sidebar from "@components/dashboard/Sidebar";
import Main from "@components/dashboard/Main";
import Rightbar from "@components/dashboard/Rightbar";
// import MyChart from "../components/MyChart";

export default function Dashboard() {
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  return (
    <>
      {/* Column 1 */}
      {/* <Sidebar /> */}
      {/* Column 2 */}
      <Main display={display} changeDisplay={changeDisplay} />

      {/* Column 3 */}
      {/* <Rightbar value={value} changeValue={changeValue} /> */}
    </>
  );
}
