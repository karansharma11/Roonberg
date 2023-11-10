import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { HiClipboardList, HiUserGroup } from 'react-icons/hi';
import { CiBoxList } from 'react-icons/ci';
import { FaListAlt, FaListUl , } from 'react-icons/fa';
import { FaPeopleGroup } from 'react-icons/fa';

import { IoMdNotifications } from 'react-icons/io';
import { AiFillHome, AiOutlineProject } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { MdGroup, MdGroups2, MdLogout, MdOutlineGroups2 } from 'react-icons/md';
import { BsFillChatLeftQuoteFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import { ImCross } from 'react-icons/im';
import axios from 'axios';

function Sidebar({ sidebarVisible, setSidebarVisible }) {

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, NotificationData } = state;
  const [unseeNote,setUnseenNote]= useState(NotificationData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(true);

  const socketUrl = process.env.REACT_APP_SOCKETURL;
const socket = io(socketUrl); // Replace with your server URL

  // const SocketUrl = process.env.SOCKETURL;
  // const socket = io(SocketUrl);
  // const socket = io('https://roonsocket.onrender.com'); // Replace with your server URL

  console.log('socket ',socket)
  socket.emit('connectionForNotify', () => {
    console.log('oiuhjioyhi');
  });

  useEffect(() => {
    const handleNotification = (notifyUser, message) => {
      if (notifyUser == userInfo._id) {
        console.log('notifyProjectFrontend', notifyUser, message);
        ctxDispatch({ type: 'NOTIFICATION', payload: { notifyUser, message } });
       
      }
    };
    socket.on('notifyProjectFrontend', handleNotification);
    return () => {
      socket.off('notifyProjectFrontend', handleNotification);
    };
  }, []);

  useEffect(() => {

    const handleNotification = async(notifyUser, message)=>{
     console.log('notificationformsocke')
      
      const {data} = await axios.get(`/api/notification/${userInfo._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      ctxDispatch({ type: 'NOTIFICATION-NULL' });
      data.map((item)=>{
  if(item.status=="unseen")
  ctxDispatch({ type: 'NOTIFICATION', payload: { item } });
})
    }
    socket.on('notifyUserFrontend', handleNotification);
   }, []);


  console.log('NotificationData',NotificationData)

  const signoutHandler = () => {
    const userConfirm = window.confirm('Are you sure you want to logout?');
    if (userConfirm) {
      ctxDispatch({ type: 'USER_SIGNOUT' });
      localStorage.removeItem('userInfo');
      window.location.href = '/';
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1179);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const handleResponsiveSidebarVisable = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const handlSmallScreeneClick = () => {
    if (isSmallScreen) {
      setSidebarVisible(!sidebarVisible);
    }
  };
  // const handelforNOtification = () => {
  //   ctxDispatch({ type: 'NOTIFICATION-NULL' });

  // };
  useEffect(() => {

    const fetchNotificationData = async () => {
        ctxDispatch({ type: 'NOTIFICATION-NULL' });
      try {
        const response = await axios.get(`/api/notification/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const NotifyData = response.data;
        ctxDispatch({ type: 'NOTIFICATION-NULL' });


NotifyData.map((item)=>{
  if(item.status=="unseen")
  ctxDispatch({ type: 'NOTIFICATION', payload: { item } });
})
      } catch (error) {
        console.error('Error fetching notification data:', error);
      }
    };

    fetchNotificationData();
  }, []);

  const uniqueNotificationData = [...new Set(NotificationData)];
  console.log('uniqueNotificationData ',uniqueNotificationData)
  useEffect(() => {
    const noteData = [...NotificationData];
    const data = noteData.filter((note)=>{
        if(note.notificationId ){

        }
    })
  }, []);
  return (
    <div className={`sidebar ${sidebarVisible ? 'visible' : ''} `}>
      <div className="blank-box"></div>
      <ImCross
        className="sidebarCrossBtn"
        onClick={handleResponsiveSidebarVisable}
      />
      <ul className="dash-list ">
        <Link
          to="/dashboard"
          className="text-decoration-none"
          onClick={handlSmallScreeneClick}
        >
          <li
            className={selectedItem === 'dashboard' ? 'selected' : ''}
            onClick={() => {
              setSelectedItem('dashboard');
            }}
          >
            <AiFillHome className="me-3 fs-5" />
            Dashboard
          </li>
        </Link>
        {userInfo.role == 'superadmin' ? (
          <Link
            to="/adminList-screen"
            className="text-decoration-none"
            onClick={handlSmallScreeneClick}
          >
            <li
              className={selectedItem === 'adminList' ? 'selected' : ''}
              onClick={() => {
                setSelectedItem('adminList');
              }}
            >
              <MdOutlineGroups2 className="me-3 fs-5" />
              Admin List
            </li>
          </Link>
        ) : null}

        {userInfo.role === 'admin' || userInfo.role === 'superadmin' ? (
          <>
            <Link
              to="/adminAgentList"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={selectedItem === 'agentList' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('agentList');
                }}
              >
                <HiUserGroup className="me-3 fs-5" />
                Agent List
              </li>
            </Link>
            <Link
              to="/adminContractorList"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={selectedItem === 'contractorList' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('contractorList');
                }}
              >
                <MdGroup className="me-3 fs-5" />
                Contractor List
              </li>
            </Link>
            <Link
              to="/adminCategoriesList"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={selectedItem === 'categoriesList' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('categoriesList');
                }}
              >
                <FaListUl className="me-3 fs-5" />
                Categories List
              </li>
            </Link>
            <Link
              to="/adminProjectList"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={
                  selectedItem === 'ProjectListAdmin' ? 'selected' : ''
                }
                onClick={() => {
                  setSelectedItem('ProjectListAdmin');
                }}
              >
                <AiOutlineProject className="me-3 fs-5" />
                Project List
              </li>
            </Link>
          </>
        ) : null}

        {userInfo.role == 'contractor' ? (
          <>
            <Link
              to="/project-list-screen"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={selectedItem === 'addProjects' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('addProjects');
                }}
              >
                <AiOutlineProject className="me-3 fs-5" />
                Project List
              </li>
            </Link>
            <Link
              to="/add-project"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li
                className={selectedItem === 'addProject' ? 'selected' : ''}
                onClick={() => {
                  setSelectedItem('addProject');
                }}
              >
                <AiFillHome className="me-3 fs-5" />
                Add Project
              </li>
            </Link>
          </>
        ) : null}
        {userInfo.role == 'agent' ? (
          <>
            <Link
              to="/agentProjectList"
              className="text-decoration-none"
              onClick={handlSmallScreeneClick}
            >
              <li>
                <AiOutlineProject className="me-3 fs-5" />
                Project List
              </li>
            </Link>

          </>
        ) : null}
        <Link
          to="/notificationScreen"
          className="text-decoration-none"
          onClick={handlSmallScreeneClick}
        >
          <li
            className={
              selectedItem === 'notificationScreen' ? 'selected d-flex' : 'd-flex'
            }
            onClick={() => {
              setSelectedItem('notificationScreen');
            }}
          >
            <IoMdNotifications className="me-3 fs-5 " />
            <div className="position-relative">
  Notification
  
  {uniqueNotificationData.length > 0 && (
    <span className="position-absolute notification-badge top-0 start-110 translate-middle badge rounded-pill bg-danger">
      {uniqueNotificationData.length}
    </span>
  )}
</div>

          </li>
        </Link>
        {/* <Link
          to="/projectNotification"
          className="text-decoration-none"
          onClick={handlSmallScreeneClick}
        >
          <li
            className={
              selectedItem === 'projectNotification' ? 'selected' : ''
            }
            onClick={() => {
              setSelectedItem('projectNotification');
            }}
          >
            <IoMdNotifications className="me-3 fs-5" />
            Project Notification
          </li>
        </Link> */}
        <Link
          to="#Logout"
          onClick={signoutHandler}
          className="text-decoration-none"
        >
          <li
            className={selectedItem === 'logout' ? 'selected' : ''}
            onClick={() => {
              setSelectedItem('logout');
            }}
          >
            <MdLogout className="me-3 fs-5" />
            Logout
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Sidebar;