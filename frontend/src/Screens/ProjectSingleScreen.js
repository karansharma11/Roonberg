import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Store } from '../Store';
import { Button, Form } from 'react-bootstrap';
import MultiSelect from 'react-multiple-select-dropdown-lite';
import 'react-multiple-select-dropdown-lite/dist/index.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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

    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };

    default:
      return state;
  }
};

function ProjectSingleScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [createdDate, setCreatedDate] = useState();
  const [endDate, setEndDate] = useState();
  const theme = toggleState ? 'dark' : 'light';
  const [
    { loading, error, projectData, categoryData, successUpdate },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    error: '',
    projectData: {},
    categoryData: {},
    successUpdate: false,
  });
  const [conversations, setConversation] = useState([]);
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/api/conversation/${id}`);
        setConversation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, []);

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
        setSelectedOptions(
          ProjectDatas.projectCategory.map((item) => item.categoryId).join(',')
        );

        dispatch({ type: 'FATCH_SUCCESS', payload: ProjectDatas });
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, []);
  console.log('project== datass', projectData);
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        dispatch('FETCH_REQUEST');
        const response = await axios.get(`/api/category`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const category = response.data;
        dispatch({ type: 'SUCCESS_CATEGORY', payload: category });
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, []);

  console.log('selectedOptions', selectedOptions);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Construct the updated data object
      const categoryIds = selectedOptions.split(',');
      const projectCategory = categoryIds.map((categoryId) => {
        const category = categoryData.find((cat) => cat._id === categoryId);
        return {
          categoryId,
          categoryName: category ? category.categoryName : 'Unknown Category',
        };
      });

      const updatedData = {
        projectName: projectData.projectName,
        projectDescription: projectData.projectDescription,
        projectCategory, // Assign the constructed projectCategory array here
        createdDate: createdDate,
        endDate: endDate,
      };

      const response = await axios.put(
        `/api/project/update/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (response.status === 200) {
        toast.success('Project updated Successfully !');
        console.log(response);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const options =
    categoryData && Array.isArray(categoryData)
      ? categoryData.map((item) => ({
          label: item.categoryName,
          value: item._id,
        }))
      : [];
  // console.log(projectData);

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

  const handleCategoryChange = (selected) => {
    setSelectedOptions(selected);
  };

  return (
    <div>
      {loading ? (
        <div>Loading ...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <div className="d-flex w-100 my-3 gap-4 justify-content-center align-item-center projectScreenCard-outer ">
            <Card className={`projectScreenCard ${theme}CardBody`}>
              <Card.Header className={`${theme}CardHeader`}>
                Project Details
              </Card.Header>
              <Card.Body className="text-start">
                <Form className="px-3" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Project Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="projectName"
                      value={projectData.projectName}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label className="fw-bold">
                      Project Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="projectDescription"
                      value={projectData.projectDescription}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Select Options:</Form.Label>
                    <MultiSelect
                      className="categorieslist"
                      onChange={handleCategoryChange}
                      options={options}
                      defaultValue={selectedOptions}
                    />
                  </Form.Group>
                  <div className="d-flex gap-3 mb-3">
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
                  </div>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
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
                          <Card className="chatboxes">
                            <Card.Header>
                              {categoryData && assignedAgent.categoryName}
                            </Card.Header>
                            <Card.Body>
                              <Link to={`/chatWindowScreen/${conversion._id}`}>
                                <Button
                                  className="chatBtn"
                                  type="button"
                                  // onClick={conversionHandler(conversion._id)}
                                >
                                  {categoryData && assignedAgent.agentName}
                                </Button>
                              </Link>
                            </Card.Body>
                          </Card>
                        </>
                      )}
                    </>
                  );
                })}
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectSingleScreen;
