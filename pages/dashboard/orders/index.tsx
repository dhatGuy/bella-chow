import OrderList from "@components/dashboard/OrderList";
import WithCafeAuth from "@components/WithCafeAuth";

const Orders = () => {
  return (
    <>
      <OrderList />
    </>
  );
};

export default WithCafeAuth(Orders);
