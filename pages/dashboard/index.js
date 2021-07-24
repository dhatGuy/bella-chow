import Sidebar from "@components/dashboard/Sidebar";
import Main from "@components/dashboard/Main";
import Rightbar from "@components/dashboard/Rightbar";
import { useState } from "react";
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
