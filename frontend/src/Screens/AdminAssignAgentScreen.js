import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Store } from '../Store';
import { Button, Form } from 'react-bootstrap';
import 'react-multiple-select-dropdown-lite/dist/index.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillDelete } from 'react-icons/ai';
import { MdPlaylistAdd } from 'react-icons/md';
import { IoMdRemoveCircleOutline, IoMdAddCircleOutline } from 'react-icons/io';
import { ColorRing, ThreeDots } from "react-loader-spinner";
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, projectData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SUCCESS_CATEGORY':
      return { ...state, categoryData: action.payload, loading: false };
    case 'ERROR_CATEGORY':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };
    case "FATCH_AGENTS":
      return { ...state, agentData: action.payload };
    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };
    case "FATCH_CONTRACTOR":
      return { ...state, contractorData: action.payload };
    case "FATCH_SUBMITTING":
      return { ...state, submitting: action.payload };
    case "REMOVE_SUBMITTING":
      return { ...state, agentCateRemoving: action.payload };
    case 'REMOVE_SUCCESS':
      return { ...state, successRemove: action.payload };
    default:
      return state;
  }
};

function AdminEditProject() {
  const { id } = useParams();
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const navigate = useNavigate();
  const [
    { loading, error, projectData, categoryData, successUpdate,
      agentData, contractorData, submitting, successRemove,
      agentCateRemoving },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    projectData: {},
    categoryData: {},
    successUpdate: false,
    agentData: [],
    contractorData: [],
    submitting: false,
    successRemove: false,
    agentCateRemoving: false
  });
  const [agentCateRemovingIndex, setAgentCateRemovingIndex] = useState(null);
  const [conversations, setConversation] = useState([]);
  const [agents, setAgents] = useState([]);
  const [categories, setCategories] = useState(projectData.projectCategory);
  const [projectStatus, setProjectStatus] = useState('active');
  const [projectOwner, setProjectOwner] = useState('priynashu');
  const [createdDate, setCreatedDate] = useState();
  const [endDate, setEndDate] = useState();

  // get conversation
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/api/conversation/${id}`);
        setConversation(res.data);
        console.log(res, "conversation")
      } catch (err) {
        console.log(err);
      }
    };
    if (successUpdate) {
      dispatch({ type: "UPDATE_SUCCESS" })
    }
    else if (successRemove) {
      dispatch({ type: "REMOVE_SUCCESS" })
    }
    else {
      getConversations();
    }

  }, [successUpdate, successRemove]);

  // get project
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        dispatch('FETCH_REQUEST');
        const response = await axios.get(`/api/project/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const ProjectDatas = response.data;
        console.log('ProjectDatas', ProjectDatas);
        setEndDate(
          ProjectDatas.endDate ? ProjectDatas.endDate.split('T')[0] : null
        );
        setCreatedDate(
          ProjectDatas.createdDate
            ? ProjectDatas.createdDate.split('T')[0]
            : null
        );
        setCategories(ProjectDatas.projectCategory);
        setAgents(ProjectDatas.assignedAgent);
        setProjectStatus(projectData.projectStatus);
        setProjectOwner(projectData.projectOwner);
        dispatch({ type: 'FATCH_SUCCESS', payload: ProjectDatas });
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
    if (successUpdate) {
      dispatch({ type: "UPDATE_SUCCESS" })
    }
    else if (successRemove) {
      dispatch({ type: "REMOVE_SUCCESS" })
    }
    else {
      fetchProjectData();
    }

  }, [successUpdate, successRemove, contractorData]);

  // get category
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        dispatch('FETCH_REQUEST');
        const response = await axios.get(`/api/category`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const category = response.data;
        console.log("category", category)
        dispatch({ type: 'SUCCESS_CATEGORY', payload: category });

      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, []);

  // get contractor
  useEffect(() => {

    const FatchContractorData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: "contractor" });
        const datas = response.data;
        dispatch({ type: "FATCH_CONTRACTOR", payload: datas })

      } catch (error) {
      }
    }
    FatchContractorData();

  }, [])

  // get agent
  useEffect(() => {

    const FatchAgentData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: "agent" });
        const datas = response.data;
        dispatch({ type: "FATCH_AGENTS", payload: datas })

      } catch (error) {
      }
    }
    FatchAgentData();

  }, [])

  const selectAgentByCateHandle = (index) => {
    const category = agents[index].categoryId;
    if (Array.isArray(categoryData)) {
      if (category) {
        const selectedCategory1 = categoryData.find(categoryItem => categoryItem._id === category);
        if (selectedCategory1) {
          const agentForCategory = agentData.filter(agentItem => agentItem.agentCategory === selectedCategory1._id);
          if (agentForCategory) {
            return agentForCategory
          }
        }
      }
    }
    return [];
  }

  const addDynamicFields = () => {
    setAgents([...agents, {}]);
  };

  const removeDynamicFields = (index) => {
    const updatedAgents = [...agents];
    updatedAgents.splice(index, 1);
    setAgents(updatedAgents);
  };


  const selectedCateAgent = (index, key, value) => {
    console.log("Value received:", value);
    const updatedAgents = [...agents];
    updatedAgents[index] = {
      ...updatedAgents[index],
      [key]: value,
    };

    const agentName = agentData.find((agentItem) => agentItem._id === value);
    if (agentName) {
      updatedAgents[index].agentName = agentName.first_name;
    }


    const categoryName = categoryData.find((categoryItem) => categoryItem._id === value);
    if (categoryName) {
      updatedAgents[index].categoryName = categoryName.categoryName;
    }
    if (key === 'categoryId' && value !== '') {

      const selectedCategory = categoryData.find((categoryItem) => categoryItem._id === value);

      if (selectedCategory) {

        const categoryObject = {
          categoryId: selectedCategory._id,
          categoryName: selectedCategory.categoryName,

        };
        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          updatedCategories[index] = categoryObject;
          return updatedCategories;
        });
      }
    }

    setAgents(updatedAgents);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'FATCH_SUCCESS',
      payload: {
        ...projectData,
        [name]: value,
      },
    });
  };

  const handleRemoveAgentCategory = async (agentIndex) => {
    setAgentCateRemovingIndex(agentIndex)
    if (window.confirm('are you sure to delete ?')) {
      dispatch({ type: "REMOVE_SUBMITTING", payload: true })
      try {
        const response = await axios.put(
          `/api/project/remove-agentCategoryPair/${id}`,
          { agentIndex },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (response.status === 200) {
          toast.success("Agent And Category Remove Successfully !");
          dispatch({ type: "REMOVE_SUCCESS", payload: true });
          dispatch({ type: "REMOVE_SUBMITTING", payload: false })
        }
      } catch (error) {
        console.error('API Error:', error);
        dispatch({ type: "REMOVE_SUBMITTING", payload: false })
      }
    }
    else {
      console.log("Deletion canceled.")
    }

  };
  const handleSubmit = async (e) => {

    e.preventDefault();
    const filteredAgents = agents.filter(obj => Object.keys(obj).length > 1);

    dispatch({ type: "FATCH_SUBMITTING", payload: true })
    try {
      const response = await axios.put(
        `/api/project/assign-update/${id}`,
        {
          projectName: projectData.projectName,
          projectDescription: projectData.projectDescription,

          createdDate: createdDate,
          endDate: endDate,
          assignedAgent: filteredAgents,
          projectStatus: projectStatus || projectData.projectStatus,
          projectOwner: projectOwner || projectData.projectOwner,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (response.status === 200) {
        toast.success('Project Updated Successfully !');
        navigate('/adminProjectList')
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
        dispatch({ type: "FATCH_SUBMITTING", payload: false })

      }
    } catch (error) {
      console.error('API Error:', error);
      toast.error("Issue When Assigning The Project");
      dispatch({ type: "FATCH_SUBMITTING", payload: false })
    }
  };
  const removeFields = (index) => {
    const agentCatData = agents[index];
    if (!agentCatData.agentId && !agentCatData.categoryId) {
      removeDynamicFields(index);
    } else {
      handleRemoveAgentCategory(index);
    }
  };

  return (
    <div>
      {loading ? (
        <>
          <div className='ThreeDot' >
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              className="ThreeDot justify-content-center"
              color="#0e0e3d"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </div>

        </>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>

          <div className="overlayLoading">
            {submitting && (
              <div className="overlayLoadingItem1">

                <ColorRing
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={["rgba(0, 0, 0, 1) 0%", "rgba(255, 255, 255, 1) 68%", "rgba(0, 0, 0, 1) 93%"]}
                />
              </div>
            )}

            <div className="d-flex w-100 my-3 gap-4 justify-content-center align-item-center projectScreenCard-outer ">

              <Card className={`projectScreenCard ${theme}CardBody `}>
                <Card.Header className={`${theme}CardHeader`}>
                  Project Details
                </Card.Header>
                <div className='FormContainerEdit pt-4'>
                  <Card.Body className="text-start">

                    <Form className="px-3" onSubmit={handleSubmit}>

                      <TextField
                        required
                        type="text"
                        name="projectName"
                        value={projectData.projectName}
                        onChange={handleInputChange}
                        className=" mb-3"
                        label="Project Name"
                        fullWidth
                        InputLabelProps={{
                          shrink: projectData.projectName ? true : false,

                        }}
                        disabled
                      />

                      <TextField
                        value={projectData.projectDescription}
                        onChange={handleInputChange}
                        name='projectDescription'
                        className=" mb-3"
                        label="Project Description"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: projectData.projectDescription ? true : false,
                        }}

                        disabled
                      />
                      <FormControl className="mb-3">
                        <InputLabel>Contractor</InputLabel>
                        <Select disabled
                          InputLabelProps={{
                            shrink: projectData.projectOwner ? true : false,
                          }}
                          value={projectOwner || projectData.projectOwner}
                          onChange={(e) => setProjectOwner(e.target.value)}
                        >
                          {contractorData.map((items) => (
                            <MenuItem key={items._id} value={items._id}>{items.first_name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl className="mb-3">
                        <InputLabel>Status</InputLabel>
                        <Select disabled
                          value={projectStatus || projectData.projectStatus}
                          onChange={(e) => setProjectStatus(e.target.value)}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="qued">Qued</MenuItem>
                        </Select>
                      </FormControl>


                      {/* <div className="d-flex gap-3 mb-3">
           <Form.Group className="w-100" controlId="start-date">
             <Form.Label className="fw-bold">Start Date</Form.Label>
             <Form.Control
               type="date"
               name="createdDate"
               value={createdDate}
               onChange={(e) => setCreatedDate(e.target.value)}
               placeholder="Start Date"
             />
           </Form.Group>
           <Form.Group className="w-100" controlId="end-date">
             <Form.Label className="fw-bold">End Date</Form.Label>
             <Form.Control
               type="date"
               name="endDate"
               value={endDate}
               onChange={(e) => setEndDate(e.target.value)}
               placeholder="End Date"
             />
           </Form.Group>
         </div> */}
                      <div className="d-flex gap-3 mb-3">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            disabled
                            label="Date"
                            value={createdDate}
                            onChange={(date) => setCreatedDate(date)}
                            renderInput={(params) => <TextField {...params} />}

                          />
                          <DatePicker
                            disabled
                            label="Date"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            renderInput={(params) => (
                              <TextField {...params} style={{ color: 'white' }} />
                            )}

                          />
                        </LocalizationProvider>
                      </div>
                    </Form>

                  </Card.Body>
                </div>
              </Card>

              <div className='projectScreenCard2 d-flex flex-column gap-4'>
                <Card className={`projectScreenCard2 ${theme}CardBody`}>
                  <Card.Header className={`${theme}CardHeader`}>Chats</Card.Header>
                  <Card.Body className="d-flex flex-wrap gap-3 ">
                    <div
                      className="text-center w-100"
                      style={{
                        display:
                          projectData &&
                            projectData.conversions &&
                            projectData.conversions.length < 1
                            ? 'block'
                            : 'none',
                      }}
                    >
                      No Chat Available
                    </div>

                    {projectData?.conversions?.map((conversion) => {
                      const assignedAgent = projectData.assignedAgent.find(
                        (assignedAgent) =>
                          assignedAgent.agentId === conversion.members[0]
                      );
                      return (
                        <>
                          {userInfo.role == 'agent' ? (
                            <>
                              {conversion.members.includes(userInfo._id) && (
                                <>
                                  <Card className="chatboxes">
                                    {/* <Card.Header>{assignedAgent.categoryId}</Card.Header> */}
                                    <Card.Body>
                                      <Link
                                        to={`/chatWindowScreen/${conversion._id}`}
                                      >
                                        <Button
                                          className="chatBtn"
                                          type="button"
                                        // onClick={conversionHandler(conversion._id)}
                                        >
                                          Chat Now
                                        </Button>
                                      </Link>
                                    </Card.Body>
                                  </Card>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {categoryData && assignedAgent && assignedAgent.categoryName && (
                                <Card className="chatboxes">
                                  <Card.Header>
                                    {assignedAgent.categoryName}
                                  </Card.Header>
                                  <Card.Body>
                                    <Link to={`/chatWindowScreen/${conversion._id}`}>
                                      <Button
                                        className="chatBtn"
                                        type="button"
                                      // onClick={conversionHandler(conversion._id)}
                                      >
                                        {assignedAgent.agentName}
                                      </Button>
                                    </Link>
                                  </Card.Body>
                                </Card>
                              )}

                            </>
                          )}
                        </>
                      );
                    })}
                  </Card.Body>
                </Card>
                <Card className={`projectScreenCard2 ${theme}CardBody `}>
                  <Card.Header className={`${theme}CardHeader`}>Assigned</Card.Header>
                  <Card.Body className="d-flex justify-content-center flex-wrap gap-3 FormContainerEdit assignCon">
                    <div className="FormContainerEdit">
                      <Form className='scrollInAdminproject' >
                        {agents.map((agentCatData, index) => (
                          <div className='moreFieldsDiv d-flex align-items-center gap-2 pt-3' key={index}>
                            <FormControl className="mb-3">
                              <InputLabel>Category</InputLabel>
                              <Select className='cateEdit'
                                value={agentCatData.categoryId}
                                onChange={(e) => selectedCateAgent(index, 'categoryId', e.target.value)}
                              >

                                {categoryData.map((category) => (
                                  <MenuItem key={category._id} value={category._id}
                                    disabled={agents.some((a) => a.categoryId === category._id)}
                                    className={agents.some((a) => a.categoryId === category._id) ? 'disabledMenuItem' : ''}
                                  >
                                    {category.categoryName}

                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl className="mb-3">
                              <InputLabel>Agent</InputLabel>
                              <Select className='agentEdit ml-2'
                                value={agentCatData.agentId}
                                onChange={(e) => selectedCateAgent(index, 'agentId', e.target.value)}
                              >
                                <MenuItem value="" disabled>SELECT</MenuItem>
                                {selectAgentByCateHandle(index).map((agent) => (
                                  <MenuItem key={agent._id} value={agent._id}
                                    disabled={agents.some((a) => a.agentId === agent._id)}
                                    className={agents.some((a) => a.agentId === agent._id) ? 'disabledMenuItem' : ''}
                                  >
                                    {agent.first_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <div className='d-flex'>
                              <IoMdRemoveCircleOutline className='text-bold text-danger fs-5 pointCursor' onClick={() => removeDynamicFields(index)} />
                              <IoMdAddCircleOutline onClick={addDynamicFields} className='text-success text-bold fs-5 pointCursor' />
                            </div>
                          </div>
                        ))}
                        <IoMdAddCircleOutline onClick={addDynamicFields} className='text-success text-bold fs-5 pointCursor' />
                      </Form>
                    </div>
                    {/* -------- */}
                  </Card.Body>
                </Card>
                <div className='d-flex justify-content-end'>
                  <Button variant="primary" type="submit" onClick={handleSubmit} className='globalbtnColor updatingBtn' >
                    {submitting ? "UPDATING" : "UPDATE"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
}

export default AdminEditProject;