import Main from "@components/dashboard/Main";
import WithCafeAuth from "@components/WithCafeAuth";
import { useState } from "react";
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
