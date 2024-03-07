import React, { useContext, useEffect, useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SearchIcon from '@mui/icons-material/Search';
import "./myStyles.css";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from 'react-router-dom';
import LightModeIcon from "@mui/icons-material/LightMode";
import { useDispatch, useSelector} from "react-redux";
import axios from "axios";
import { toggleTheme } from '../Features/themeSlice';
import { myContext } from "./MainContainer";
import { refreshSidebarFun } from '../Features/refreshSidebar';

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [users1, setUsers1] = useState([]);
  const lightTheme = useSelector((state) => state.themeKey);
  // const refresh = useSelector((state) => state.refreshKey);
  const { refresh, setRefresh } = useContext(myContext);
  console.log("Context API : refresh : ", refresh);
  const [conversations, setConversations] = useState([]);
   console.log("Conversations of Sidebar : ", conversations);
  const userData = JSON.parse(localStorage.getItem("userData"));
   console.log("Data from LocalStorage : ", userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData.data;
  useEffect(() => {
     console.log("Sidebar : ", user.token);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios.get("http://localhost:5000/chat/", config).then((response) => {
      console.log("Data refresh in sidebar ", response.data);
      setConversations(response.data);
      // setRefresh(!refresh);
    });
  }, []);

  
 const handleSearch = (e)=>{
  //  setSearchValue(users.target.value);
     let value =users1.filter(user => user.name.includes(e.target.value))
     setUsers(value);
     console.log(value)
     }
   
    return (
      <div className="sidebar-container">
      <div className={"sb-header" + (lightTheme ? "" : " dark")}>
        <div className="other-icons">
          <IconButton
            onClick={() => {
              nav("/app/welcome");
            }}
          >
            <AccountCircleIcon
              className={"icon" + (lightTheme ? "" : " dark")}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              navigate("users");
            }}
          >
            <PersonAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
        

          <IconButton
            onClick={() => {
              dispatch(toggleTheme());
            }}
          >
            {lightTheme && (
              <NightlightIcon
                className={"icon" + (lightTheme ? "" : " dark")}
              />
            )}
            {!lightTheme && (
              <LightModeIcon className={"icon" + (lightTheme ? "" : " dark")} />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              localStorage.removeItem("userData");
              navigate("/");
            }}
          >
            <ExitToAppIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
        </div>
      </div>
      <div className={"sb-conversations" + (lightTheme ? "" : " dark")}>
        {conversations.map((conversation, index) => {
           console.log("current convo : ", conversation);
          if (conversation.users.length === 1) {
            return <div key={index}></div>;
          }
          if (conversation.latestMessage === undefined) {
             console.log("No Latest Message with ", conversation.users[1]);
            return (
              <div
                key={index}
                onClick={() => {
                  console.log("Refresh fired from sidebar");
                   dispatch(refreshSidebarFun());
                  setRefresh(!refresh);
                }}
              >
                <div
                  key={index}
                  className="conversation-container"
                  onClick={() => {
                    navigate(
                      "chat/" +
                        conversation._id +
                        "&" +
                        conversation.users[1].name
                    );
                  }}
                  // dispatch change to refresh so as to update chatArea
                >
                  <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                    {conversation.users[1].name[0]}
                  </p>
                  <p className={"con-title" + (lightTheme ? "" : " dark")}>
                    {conversation.users[1].name}
                  </p>

                  <p className="con-lastMessage">
                    No previous Messages, click here to start a new chat
                  </p>
                <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {conversation.timeStamp}
              </p> 
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  navigate(
                    "chat/" +
                      conversation._id +
                      "&" +
                      conversation.users[1].name
                  );
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {conversation.users[1].name[0]}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {conversation.users[1].name}
                </p>

                <p className="con-lastMessage">
                  {conversation.latestMessage.content}
                </p>
                 <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {conversation.timeStamp}
              </p> 
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Sidebar