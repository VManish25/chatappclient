import React, { useContext, useEffect, useState } from 'react'
import "./myStyles.css";
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from "../Images/live-chat_512px.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { myContext } from "./MainContainer";
import RefreshIcon from "@mui/icons-material/Refresh";
import { refreshSidebarFun } from '../Features/refreshSidebar';

function Users() {
   //  const [refresh, setRefresh] = useState(true);
  const { refresh, setRefresh } = useContext(myContext);

  const lightTheme = useSelector((state) => state.themeKey);
  const [users, setUsers] = useState([]);
  const [users1, setUsers1] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
   console.log("Data from LocalStorage : ", userData);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  

  if (!userData) {
    console.log("User not Authenticated");
    nav(-1);
  }

  useEffect(() => {
    // console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios.get("https://chatappserver-28ck.onrender.com/user/fetchUsers", config).then((data) => {
    //  console.log("UData refreshed in Users panel ");
      setUsers(data.data);
      setUsers1(data.data);

       setRefresh(!refresh);
    });
  }, []);

 const handleSearch = (e)=>{
    let value =users1.filter(user => user.name.includes(e.target.value))
    setUsers(value);
    console.log(value)
    }

   
  




    return (
      <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          duration: "0.3",
        }}
        className="list-container"
      >
        <div className={"ug-header" + (lightTheme ? "" : " dark")}>
          <img
            src={logo}
            style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
          />
          <p className={"ug-title" + (lightTheme ? "" : " dark")}>
            Available Users
          </p>
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </div>
        <div className={"sb-search" + (lightTheme ? "" : " dark")}>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
         
         
          
            <SearchIcon />
          </IconButton>
          <input
            placeholder="Search"
            className={"search-box" + (lightTheme ? "" : " dark")}
            onChange={(e)=>handleSearch(e)} 
          />
        </div>
        <div className="ug-list">
          {users.map((user, index) => {
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={"list-tem" + (lightTheme ? "" : " dark")}
                key={index}
                onClick={() => {
                  console.log("Creating chat with ", user.name);
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.data.token}`,
                    },
                  };
                  axios.post(
                    "https://chatappserver-28ck.onrender.com/chat/",
                    {
                      userId: user._id,
                    },
                    config
                  );
                  dispatch(refreshSidebarFun());
                }}
              >
                   <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {user.name[0]}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {user.name}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
    )
}


export default Users