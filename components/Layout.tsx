import { FC, PropsWithChildren } from "react";
import NavBar from "./NavBar";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default Layout;
