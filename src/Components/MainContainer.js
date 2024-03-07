import "./myStyles.css";
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { createContext, useState } from "react";

export const myContext = createContext();

function MainContainer() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const [refresh, setRefresh] = useState(true);
  

  return (
    <div className={"main-container" + (lightTheme ? "" : " dark")}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
        <Sidebar />
        <Outlet />
      </myContext.Provider>
      {/*    <Welcome /> */}
      {/* <ChatArea props={conversations[0]} /> */}
      {/*   <Users /> */}

    </div>
  );
}

export default MainContainer;