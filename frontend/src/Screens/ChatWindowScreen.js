import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Image ,
  InputGroup,
} from "react-bootstrap";
import { IoSendSharp } from "react-icons/io5";
import { RxFontStyle } from "react-icons/rx";
// import MyStatefulEditor from "../Components/rte_test";
import { Store } from "../Store";
import { Socket, io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "timeago.js";
import { BsDownload, BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import Modal from "react-bootstrap/Modal";
import { Audio, ColorRing, ThreeDots } from "react-loader-spinner";
import Button from "react-bootstrap/Button";
import { Editor } from "@tinymce/tinymce-react";
// import { EditorValue } from "react-rte";
// import MUIRichTextEditor from 'mui-rte';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MdCancel } from "react-icons/md";

function ChatWindowScreen() {
  const { id } = useParams();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const [showFontStyle, setShowFontStyle] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [conversationID, setConversationID] = useState();
  const [projectData, SetProjectData] = useState();
  const [chatOpositeMember, SetChatOpositeMember] = useState();
  const [fileForModel, SetFileForModel] = useState(null);
  const [projectStatus, setProjectStatus] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedfile, setSelectedfile] = useState(null);
  const [selectedFileAudio, setSelectedFileAudio] = useState(null);
  const [selectedFileVideo, setSelectedFileVideo] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [editorCheck, setEditorCheck] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileOfInput, setFileOfInput] = useState(null);

  const [showImage, setShowImage] = useState(false);


  const [mediaType, setMediaType] = useState("image");
  const audioChunks = useRef([]);
  const audioRef = useRef();
  const SocketUrl = process.env.REACT_APP_SOCKETURL ;
  // const socket = io(SocketUrl); // Replace with your server URL

  useEffect(() => {
    if (selectedfile && selectedfile.type) {
      const mediaType =
        selectedfile.type.includes("video") ||
          selectedfile.type.includes("audio")
          ? "video"
          : "image";

      //console.log('Media Type:', mediaType);
      setMediaType(mediaType);
    }
  }, [selectedfile]);

  const socket = useRef(io(SocketUrl));
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io(SocketUrl);
    socket.current.on("audio", (data) => {
      const audioBlob = new Blob([data.audio], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setArrivalMessage({
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        sender: data.senderId,
        audio: audioUrl,
        createdAt: Date.now(),
      });
      setAudioStream(data.audio);
    });
    socket.current.on("audioFile", (data) => {
      // console.log("audioFile ", data.audio);
      setArrivalMessage({
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        sender: data.senderId,
        audio: data.audio,
        createdAt: Date.now(),
      });
      setAudioStream(data.audio);
    });
    socket.current.on("video", (data) => {
      // console.log("vedoodile ", data.video);
      setArrivalMessage({
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        sender: data.senderId,
        video: data.video,
        createdAt: Date.now(),
      });
      setAudioStream(data.video);
    });

    socket.current.on("image", (data) => {
      // console.log("image", data);
      setArrivalMessage({
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        sender: data.senderId,
        image: data.image,
        createdAt: Date.now(),
      });
    });
    socket.current.on("getMessage", (data) => {
      // console.log("data ", data);
      setArrivalMessage({
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    const getSendRole = async () => {
      try {
        const { data } = await axios.get(
          "/api/user/role/" + arrivalMessage.sender
        );
        if (data.role === "admin" || data.role === "superadmin") {
          arrivalMessage &&
            setChatMessages((prev) => [...prev, arrivalMessage]);
        } else {
          arrivalMessage &&
            conversationID?.members.includes(arrivalMessage.sender) &&
            setChatMessages((prev) => [...prev, arrivalMessage]);
        }
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    };
    getSendRole();
  }, [arrivalMessage, conversationID]);

  const startRecording = (e) => {
    e.preventDefault(); // Prevent the form from submitting and the page from refreshing

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };
        const receiverdId = conversationID.members.find(
          (member) => member !== userInfo._id
        );
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/wav",
          });
          //console.log('audiobulb', audioBlob);
          if (userInfo.role === "admin" || userInfo.role === "superadmin") {
            const messageData = {
              senderFirstName: userInfo.first_name,
              senderLastName: userInfo.last_name,
              Sender_Profile: userInfo.profile_picture,
              senderId: userInfo._id,
              receiverdId: conversationID.members,
              audio: audioBlob,
            };
            //console.log('messageData', messageData);
            socket.current.emit("audio", messageData);
            // socket.current.emit('audio', audioBlob);
            audioChunks.current.length = 0;
          } else {
            const messageData = {
              senderFirstName: userInfo.first_name,
              senderLastName: userInfo.last_name,
              Sender_Profile: userInfo.profile_picture,
              senderId: userInfo._id,
              receiverdId: receiverdId,
              audio: audioBlob,
            };
            //console.log('messageData', messageData);
            socket.current.emit("audio", messageData);
            // socket.current.emit('audio', audioBlob);
            audioChunks.current.length = 0;
          }

          const formDatas = new FormData();
          formDatas.append("media", audioBlob);
          formDatas.append("mediaType", "video");
          formDatas.append("conversationId", id);
          formDatas.append("sender", userInfo._id);
          formDatas.append("senderFirstName", userInfo.first_name);
          formDatas.append("senderLastName", userInfo.last_name);
          formDatas.append("Sender_Profile", userInfo.profile_picture);

          try {
            const { data } = await axios.post("/api/message/audio", formDatas);
          } catch (err) {
            console.log(err.response?.data?.message);
          }
        };

        recorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing the microphone:", error);
        setIsRecording(false); // Ensure that the button is disabled in case of an error
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    socket.current.emit("addUser", userInfo._id, userInfo.role);
    socket.current.on("getUsers", (users) => { });
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`/api/message/${id}`);
        setChatMessages(data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [conversation]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const { data } = await axios.post(`/api/conversation/${id}`);
        setConversationID(data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversation();
  }, []);
  useEffect(() => {
    const GetProject = async () => {
      try {
        const { data } = await axios.get(
          `/api/project/${conversationID.projectId}`
        );
        setProjectStatus(data.projectStatus);
        SetProjectData(data);
      } catch (err) {
        console.log(err);
      }
    };
    GetProject();
  }, [conversationID]);

  const handleStatusUpdate = async (e) => {
    setProjectStatus(e.target.value);
    try {
      const data = await axios.put(
        `/api/project/update/${projectData._id}`,
        { projectStatus: e.target.value },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log("dataaaa", data);
      if (data.status === 200) {
        toast.success("Project Status updated Successfully !");
      }
      setProjectStatus(data.projectStatus);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    const receiverdId = conversationID?.members.find(
      (member) => member !== userInfo._id
    );
    const getChatMemberName = async () => {
      try {
        const { data } = await axios.get(
          `/api/user/${receiverdId}`
        );
        SetChatOpositeMember(data.first_name)
      } catch (err) {
        console.log(err);
      }
    };
    getChatMemberName();
  }, [conversationID]);



  const showFontStyleBox = () => {
    setShowFontStyle(!showFontStyle);
  };
  
  // const [messages, setMessages] = useState([]);
  const [clearEditor, setClearEditor] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const handleSendMessage = async () => {
    setClearEditor(true); 
    setShowModal(false);
    const messageObject = {
      senderFirstName: userInfo.first_name,
      senderLastName: userInfo.last_name,
      text: newMessage,
      Sender_Profile: userInfo.profile_picture,
      sender: userInfo._id,
    };
    if (newMessage.trim() !== "") {
      setChatMessages([...chatMessages, messageObject]);
      setNewMessage("");
    }

    submitHandler();
  };
  const onChange = (value) => {
    setNewMessage(value);
  };
  const maxFileSizeBytes = 40 * 1024 * 1024; // 40 MB
  const isFileSizeValid = (file) => {
    return file?.size <= maxFileSizeBytes;
  };
  console.log('file of input ',fileOfInput)

  const handleFileChange = (e) => {
    if (e) {
      e.preventDefault();
    }
    const file = e.target.files[0];
    console.log("file", file)
    if (isFileSizeValid(file)) {
      SetFileForModel(file)
      setShowModal(true);
      e.target.value = null;
      if (file.type.includes("image")) {
        setSelectedfile(file);
      } else if (file.type.includes("audio")) {
        setSelectedFileAudio(file);
      } else if (file.type.includes("video")) {
        setSelectedFileVideo(file);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;

        //setSelectedImage(base64Data);
        if (file.type.includes("image")) {
          setSelectedImage(base64Data);
        } else if (file.type.includes("audio")) {
          setSelectedAudio(base64Data);
        } else if (file.type.includes("video")) {
          setSelectedVideo(base64Data);
        }
      };

      reader.readAsDataURL(file);
    } else if (file) {
      alert("Selected image file size exceeds the 40 MB limit.");
    }
  };

  const submitHandler = async (e) => {
    const receiverdId = conversationID.members.find(
      (member) => member !== userInfo._id
    );
    console.log('receiverdId', receiverdId)
    if (selectedImage) {
      if (userInfo.role === "admin" || userInfo.role === "superadmin") {
        const messageData = {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          senderId: userInfo._id,
          receiverdId: conversationID.members,
          image: selectedImage,
        };
        socket.current.emit("image", messageData);
      } else {
        const messageData = {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          senderId: userInfo._id,
          receiverdId: receiverdId,
          image: selectedImage,
        };
        socket.current.emit("image", messageData);
      }
      const formDatas = new FormData();
      formDatas.append("media", selectedfile);
      formDatas.append("mediaType", mediaType);
      formDatas.append("conversationId", id);
      formDatas.append("sender", userInfo._id);
      formDatas.append("text", newMessage);
      formDatas.append("senderFirstName", userInfo.first_name);
      formDatas.append("senderLastName", userInfo.last_name);
      formDatas.append("Sender_Profile", userInfo.profile_picture);
      try {
        const { data } = await axios.post("/api/message/", formDatas);
      } catch (err) {
        console.log(err.response?.data?.message);
      }
      setSelectedImage(null);
    } else if (selectedAudio && selectedAudio != null) {
      if (userInfo.role === "admin" || userInfo.role === "superadmin") {
        const messageData = {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          senderId: userInfo._id,
          receiverdId: conversationID.members,
          audio: selectedAudio,
        };
        socket.current.emit("audioFile", messageData);
      } else {
        const messageData = {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          senderId: userInfo._id,
          receiverdId: receiverdId,
          audio: selectedAudio,
        };
        socket.current.emit("audioFile", messageData);
      }
      const formDatas = new FormData();
      formDatas.append("media", selectedFileAudio);
      formDatas.append("mediaType", "video");
      formDatas.append("conversationId", id);
      formDatas.append("sender", userInfo._id);
      formDatas.append("text", newMessage);
      formDatas.append("senderFirstName", userInfo.first_name);
      formDatas.append("senderLastName", userInfo.last_name);
      formDatas.append("Sender_Profile", userInfo.profile_picture);
      try {
        const { data } = await axios.post("/api/message/audio", formDatas);
        setSelectedAudio(null);
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    } else if (selectedVideo && selectedVideo != null) {
      const formDatas = new FormData();
      formDatas.append("media", selectedFileVideo);
      formDatas.append("mediaType", "video");
      formDatas.append("conversationId", id);
      formDatas.append("sender", userInfo._id);
      formDatas.append("text", newMessage);
      formDatas.append("senderFirstName", userInfo.first_name);
      formDatas.append("senderLastName", userInfo.last_name);
      formDatas.append("Sender_Profile", userInfo.profile_picture);

      try {
        setIsSubmiting(true);
        const { data } = await axios.post("/api/message/video", formDatas);
        if (userInfo.role === "admin" || userInfo.role === "superadmin") {
          const messageData = {
            senderFirstName: userInfo.first_name,
            senderLastName: userInfo.last_name,
            Sender_Profile: userInfo.profile_picture,
            senderId: userInfo._id,
            receiverdId: conversationID.members,
            video: data.video,
          };
          socket.current.emit("video", messageData);
        } else {
          const messageData = {
            senderFirstName: userInfo.first_name,
            senderLastName: userInfo.last_name,
            Sender_Profile: userInfo.profile_picture,
            senderId: userInfo._id,
            receiverdId: receiverdId,
            video: data.video,
          };
          socket.current.emit("video", messageData);
        }
        setIsSubmiting(false);
      } catch (err) {
        console.log(err.response?.data?.message);
        setIsSubmiting(false);
      }

      setSelectedVideo(null);
    } else {
      if (userInfo.role === "admin" || userInfo.role === "superadmin") {
        socket.current.emit("sendMessage", {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          senderId: userInfo._id,
          receiverdId: conversationID.members,
          text: newMessage,
        });
      } else {
        socket.current.emit("sendMessage", {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          senderId: userInfo._id,
          receiverdId: receiverdId,
          text: newMessage,
        });
      }
      setEditorValue({content: "" });
      try {
        const { data } = await axios.post("/api/message/", {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          conversationId: id,
          sender: userInfo._id,
          text: newMessage,
        });
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    }

  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, newMessage]);

  // console.log("conversationID ", conversationID);
  // console.log("chatMessages ", chatMessages);
  const handleClose = () => {
    setShowImage(false)
    setShowModal(false);
    setSelectedfile(null)
    setSelectedFileAudio(null);
    setSelectedFileVideo(null);
    setSelectedAudio(null)
    setSelectedImage(null)
    setSelectedVideo(null)
  };
 const handleforshowimage=(e)=>{
    setShowImage(true)
  }


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };
  // const myTheme = createTheme({
  //   // Set up your custom MUI theme here
  // });
  
  const [editorValue,setEditorValue]=useState({content:''})
  const handleEditorChange = (data) => {
   // setEditorValue({content});
   console.log('content ',data);
    setNewMessage(data)
  };

  const handleDownload = () => {
    // Create an invisible anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.target = '_blank';
    downloadLink.download = 'downloaded-image.png'; // Specify the desired file name

    // Simulate a click on the anchor element to trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleforsetImage = (e) => {
    setShowImage(true)
    setImageUrl(e.target.src)
    };



  console.log("image for the modal",imageUrl)
  return (
    <div className=" justify-content-center align-items-center">
      <div className="d-flex justify-content-center gap-3 ">
        <Card className="chatWindow mt-3">
          <CardHeader>{chatOpositeMember} </CardHeader>

          <CardBody className="chatWindowBody pb-0">
            {chatMessages.map((item) => (
              <>
                {userInfo._id == item.sender ? (
                  <>
                    {item.text ? (
                      <div
                        ref={scrollRef}
                        className="chat-receiverMsg d-flex flex-column"
                      >
                        <div className="d-flex w-100">
                          <div className="d-flex flex-column forWidth ">
                            <div className="text-start d-flex justify-content-end  px-2 timeago2">
                              {item.senderFirstName} {item.senderLastName}
                            </div>
                            <p
                              className="chat-receiverMsg-inner p-2 mb-0"
                              dangerouslySetInnerHTML={{ __html: item.text }}
                            ></p>
                            <div className="timeago text-end mb-3 ">
                              {format(item.createdAt)}
                            </div>
                          </div>
                          <div>
                            {" "}
                            <img 
                              className="chat-dp"
                              src={item.Sender_Profile?(item.Sender_Profile):("./avatar.png")}
                            ></img>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                      <div
                        ref={scrollRef}
                        className="chat-receiverMsg d-flex flex-row"
                      >
                        <div className="w-100 mediachats" >
                        <div className="d-flex flex-row">
                          <div className="text-start px-2 timeago2">
                            {item.senderFirstName} {item.senderLastName}
                          </div>
                        
                        </div>
                        {item.audio ? (
                          <audio
                            className="chat-receiverMsg-inner w-100 p-2"
                            controls
                          >
                            <source src={item.audio} type="audio/wav" />
                          </audio>
                        ) : (
                          <>
                            {item.video ? (
                              <video
                                className="chat-receiverMsg-inner w-100 p-2"
                                controls
                              >
                                <source src={item.video} type="video/mp4" />
                              </video>
                            ) : (
                              <>
                              <img onClick={handleforsetImage}
                                src={
                                  item.conversationId
                                    ? item.image
                                    : `${SocketUrl}/${item.image}`
                                }
                                className="chat-receiverMsg-inner w-100 p-2"
                              />
                            </>
                            )}
                          </>
                        )}

                        <div className="timeago">{format(item.createdAt)}</div>
                        </div>

                        <img
                        className="chat-dp"
                        src={item.Sender_Profile?(item.Sender_Profile):("./avatar.png")}
                        ></img>


                      </div>
                       
                        </>
                    )}
                  </>
                ) : (
                  <>
                    {item.text ? (
                      <div
                        ref={scrollRef}
                        className="chat-senderMsg d-flex flex-column "
                      >
                        <div className="d-flex w-100">
                          <div>
                            {" "}
                            <img
                              className="chat-dp"
                              src={item.Sender_Profile?(item.Sender_Profile):("./avatar.png")}
                            ></img>
                          </div>
                          <div className="d-flex flex-column  forWidth  ">
                            <div className="text-start px-2 timeago2">
                              {item.senderFirstName} {item.senderLastName}
                            </div>
                            <p
                              className="chat-senderMsg-inner p-2 mb-0"
                              dangerouslySetInnerHTML={{ __html: item.text }}
                            ></p>
                            <div className="timeago text-start mb-3 ">
                              {format(item.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        ref={scrollRef}
                        className="chat-senderMsg d-flex flex-row "
                      >
                         <img
                            className="chat-dp"
                            src={item.Sender_Profile?(item.Sender_Profile):("./avatar.png")}
                            ></img>
                        <div className="w-100">
                        <div className="d-flex flex-row">
                         
                          <div className="text-start px-2 timeago2">
                            {item.senderFirstName} {item.senderLastName}
                          </div>
                        </div>

                        {item.audio ? (
                          <audio
                            className="chat-senderMsg-inner w-100 p-2"
                            controls
                          >
                            <source src={item.audio} type="audio/wav" />
                          </audio>
                        ) : (
                          <>
                            {item.video ? (
                              <video
                                className="chat-senderMsg-inner w-100 p-2"
                                controls
                              >
                                <source src={item.video} type="video/mp4" />
                              </video>
                            ) : (
                              <>   
                                                         <img
                              onClick={handleforsetImage}
                                src={
                                  item.conversationId
                                    ? item.image
                                    : `${SocketUrl}/${item.image}`
                                }
                                className="chat-senderMsg-inner w-100 p-2"
                              />
                              
                            </>

                            )}
                          </>
                        )}
                        <div className=" text-start timeago">{format(item.createdAt)}</div>

                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ))}
               <Modal className="modal-content1" show={showImage} onHide={handleClose}>
                              
                              <MdCancel className="close-button" onClick={handleClose}/>
      
                              <img
                              className="w-100"
                                src={imageUrl}
                              />
                                <BsDownload className="btn-send downloadBtn" onClick={handleDownload}/>
                            </Modal>
          </CardBody>
          <CardFooter className="d-flex align-items-center">
            <Form className="w-100">
              <InputGroup>
                <Form.Control
                  disabled={isSubmiting}
                  type="text"
                  style={{ display: showFontStyle ? "none" : "block" }}
                  placeholder="Type your message here..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  onKeyPress={handleKeyPress}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div style={{ display: showFontStyle ? "block" : "none" }} className="richEditor" >
                  {/* <MyStatefulEditor
                    markup=""
                    clearEditor={clearEditor}
        setClearEditor={setClearEditor}
                    onChange={onChange}
                  /> */}
                   {/* <Editor
          value={editorValue.content}
          init={{
            height: 200,
            menubar: true
          }}
          onEditorChange={handleEditorChange}
        /> */}
    {/* <ThemeProvider theme={myTheme}>
    <MUIRichTextEditor
      label="Type something here..."
      onSave={handleEditorChange}
      inlineToolbar={true}
    />
  </ThemeProvider>, */}
                </div>
                <Form.Group className="icon-for-upload">
                  <Form.Label htmlFor="file-input" className="custom-file-upload">
                    <FiUpload />
                  </Form.Label>
                  <Form.Control
                    style={{ display: "none" }}
                    id="file-input"
                    type="file"
                    disabled={isSubmiting}
                    onChange={handleFileChange}
                  />

                </Form.Group>
                <div className="App d-flex align-items-center ps-2">
                  <BsFillMicFill
                    onClick={startRecording}
                    disabled={isRecording}
                    style={{ display: isRecording ? "none" : "block" }}
                  />

                  <BsFillMicMuteFill
                    onClick={stopRecording}
                    disabled={!isRecording}
                    style={{ display: !isRecording ? "none" : "block" }}
                  />
                  <div   onClick={stopRecording}
                   disabled={!isRecording}
                   style={{ display: !isRecording ? "none" : "block" }}>
                  <Audio
                  
  height="25"
  width="25"
  color="#07162c"
  ariaLabel="audio-loading"
  wrapperStyle={{}}
  wrapperClass="wrapper-class"
  visible={true}
/>
</div>

                </div>
                <div className="d-flex justify-content-center align-items-center ps-2 ">
                  <RxFontStyle className="w-100 rxfontstryle" onClick={showFontStyleBox} />
                </div>
              </InputGroup>
            </Form>
            {isSubmiting ? (
              <ColorRing
                visible={true}
                height="40"
                width="40"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={["rgba(0, 0, 0, 1) 0%, rgba(17, 17, 74, 1) 68%, rgba(0, 0, 0, 1) 93%"]}
              />
            ) : (
              <IoSendSharp
                disabled={true}
                className="ms-3"
                onClick={handleSendMessage}
              />
            )}
          </CardFooter>
        </Card> 
        <Card className="chatWindowProjectInfo mt-3">
          {projectData ? (
            <Form className="px-3">
              <Form.Group className="mb-3 projetStatusChat">
                <Form.Label className="fw-bold">Project Name</Form.Label>
                <Form.Control
                  type="text"
                  name="projectName"
                  disabled
                  value={projectData && projectData.projectName}
                />
              </Form.Group>
              <Form.Group className="mb-3 " controlId="formBasicPassword">
                <Form.Label className="mb-1 fw-bold">Project Status</Form.Label>
                <Form.Select
                  value={projectStatus}
                  onChange={handleStatusUpdate}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed </option>
                  <option value="qued">Qued </option>
                </Form.Select>
              </Form.Group>
              <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>File Selected</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Your file has been selected.
                  <h4> {fileForModel?.name}</h4>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-send" onClick={handleSendMessage}>
                    send
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form>
          ) : (
            <div className="d-flex mt-3 justify-content-center">
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
          )}
        </Card>
      </div>
    </div>
  );
}

export default ChatWindowScreen;