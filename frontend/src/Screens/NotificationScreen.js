import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Store } from '../Store';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { toast } from "react-toastify";
import {  ThreeDots } from "react-loader-spinner";




export default function NotificationScreen() {
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [notificationMark, setNotificationMark] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const maxPageNumbers = 5; // Maximum page numbers to show directly

  const reversedNotifications = [...notificationMessage].reverse();
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentNotifications = reversedNotifications.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(notificationMessage.length / itemsPerPage);

  console.log('currentNotifications',currentNotifications)

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const SocketUrl = process.env.REACT_APP_SOCKETURL ;
  const socket = io(SocketUrl);
  socket.on('connectionForNotify', (data) => {
  });

  useEffect(() => {
    const handleNotification = (notifyUser, message) => {
      if (notifyUser == userInfo._id) {
        console.log('notifyProjectFrontend', notifyUser, message);
        // ctxDispatch({ type: 'NOTIFICATION', payload: { notifyUser, message } });
        setNotificationMessage((prevNotifications) => [
          ...prevNotifications,
          { notifyUser, message },
        ]);
      }
    };
    socket.on('notifyUserFrontend', handleNotification);
    socket.on('notifyProjectFrontend', handleNotification);
    // Consolidate both event listeners

    return () => {
      socket.off('notifyUserFrontend', handleNotification); // Remove the listeners
      socket.off('notifyProjectFrontend', handleNotification);
     
    };
  }, []);

  // useEffect(() => {
  //   ctxDispatch({ type: 'NOTIFICATION-NULL' });
  // }, []);

  useEffect(() => {

    const fetchNotificationData = async () => {
        ctxDispatch({ type: 'NOTIFICATION-NULL' });
      try {
        const response = await axios.get(`/api/notification/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const NotifyData = response.data;
        setNotificationMessage(NotifyData);
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
  }, [userInfo._id ,notificationMark]);


  const handleUpdateStatus = async (e) => {
    try {
      const data = await axios.put(
        `/api/notification/updateStatus/${e.target.value}`,
        { status: 'unseen' },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
setNotificationMark(data)
     
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <>
{currentNotifications?(
  <>
  <div className="container mt-5">
<div className="row">
  <div className="col">
    <h2 className="mb-3">Notifications</h2>
    <ul className="list-group custom-list">
      {currentNotifications.map((item, index) => (
        <li
          key={index}
          className={`list-group-item custom-list-item ${item.status === 'seen' ? 'list-group-item-light' : 'list-group-item-dark'}`}
        >
          <div className='NotificationMsg'>
          {item.message}
          </div>
          <button className='MarkAsRead' style={{display: item.status=='seen'? "none":"block"}} value={item._id} onClick={handleUpdateStatus} >Mark as read</button>{' '}

        </li>
      ))}
    </ul>
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        {pageNumbers
          .slice(currentPage - 1, currentPage - 1 + maxPageNumbers)
          .map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button
                onClick={() => handlePageChange(number)}
                className="page-link"
              >
                {number}
              </button>
            </li>
          ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</div>
</div>
</>
):( 
  
  <>  <div className="d-flex mt-3 justify-content-center">
<ThreeDots
  height="50"
  width="50"
  radius="9"
  className="ThreeDot  justify-content-center"
  color="#0e0e3d"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClassName=""
  visible={true}
/>
</div>
</>

)}

</>

  
  );
}
