import Sidebar from "@components/dashboard/Sidebar";
import Main from "@components/dashboard/Main";
import Rightbar from "@components/dashboard/Rightbar";
import { useState } from "react";
import WithCafeAuth from "@components/WithCafeAuth";
// import MyChart from "../components/MyChart";

function Dashboard() {
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  return (
    <>
      <Main display={display} changeDisplay={changeDisplay} />
    </>
  );
}

export default WithCafeAuth(Dashboard);
