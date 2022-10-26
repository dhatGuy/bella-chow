import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import Main from "~components/dashboard/Main";
// import MyChart from "../components/MyChart";
/**
 * cafe can change order status to
 * 1. completed
 * 2. pending
 * 3. processing
 * 4. on hold
 * 5. delivered
 * can also delete order
 */
function Dashboard() {
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  return (
    <>
      <Main />
    </>
  );
}

export default Dashboard;

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
});
