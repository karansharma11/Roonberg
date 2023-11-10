import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tab from 'react-bootstrap/Tab';
import { ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField, DatePicker } from '@mui/x-date-pickers';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../../Store';
import dayjs from 'dayjs';

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
    case 'DELETE_SUCCESS':
      return { ...state, successDelete: action.payload };

    case 'DELETE_RESET':
      return { ...state, successDelete: false };

    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };

    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };

    default:
      return state;
  }
};

const columns = [
  { field: '_id', headerName: 'ID', width: 90 },
  {
    field: 'projectName',
    headerName: 'Project Name',
    width: 150,
  },
  {
    field: 'projectDescription',
    headerName: 'Description',
    width: 150,
  },
  {
    field: 'projectCategory',
    headerName: 'project Category',
    width: 90,
  },
  {
    field: 'assignedAgent',
    headerName: 'Assigned Agent',
    width: 110,
  },
];

export default function ContractorProjectScreen() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [
    { loading, error, projectData, successDelete, successUpdate, categoryData },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    projectData: [],
    successDelete: false,
    successUpdate: false,
  });

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewProject(true);
  };

  useEffect(() => {
    const FatchProjectData = async () => {
      try {
        dispatch({ type: 'FATCH_REQUEST' });
        const response = await axios.get('/api/project', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        const rowData = datas.map((items) => ({
          ...items,
          _id: items._id,
          projectName: items.projectName,
          projectDescription: items.projectDescription,
          projectCategory: items.projectCategory
            ? items.projectCategory.map((cat) => cat.categoryName)
            : '',
          assignedAgent: items.assignedAgent
            ? items.assignedAgent.map((agent) => agent.agentName)
            : '',
        }));

        dispatch({ type: 'FATCH_SUCCESS', payload: rowData });
      } catch (error) {
        console.log(error);
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else if (successUpdate) {
      dispatch({ type: 'UPDATE_RESET' });
    } else {
      FatchProjectData();
    }
  }, [successDelete, successUpdate, dispatch, userInfo.token]);

  const projectActiveData = projectData.filter((item) => {
    return item.projectStatus === 'active';
  });
  const projectCompleteData = projectData.filter((item) => {
    return item.projectStatus === 'complete';
  });
  const projectQuedData = projectData.filter((item) => {
    return item.projectStatus === 'qued';
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    if (isNewProject) {
      const response = await axios.post(
        '/api/project/',
        {
          projectName: projectName,
          projectDescription: projectDescription,
          projectCategory: selectedOptions,
          createdDate: startDate,
          endDate: endDate,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        const datas = response.data;
        setIsModelOpen(false);
        setIsSubmiting(false);

        // dispatch({ type: 'FATCH_SUCCESS', payload: datas });
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
      } else if (response.status === 500) {
        toast.error(response.data.error);
        setIsSubmiting(false);
      }
    } else {
      const response = await axios.put(
        `/api/project/update/${selectedRowData._id}`,
        {
          projectName: projectName,
          projectDescription: projectDescription,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (response.status === 200) {
        toast.success(response.data);
        setIsModelOpen(false);
        setIsSubmiting(false);

        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
      } else if (response.status === 500) {
        toast.error(response.message);
        setIsSubmiting(false);
      }
    }
  };

  const deleteHandle = async (productId) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        const response = await axios.delete(`/api/project/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          toast.success('Data deleted successfully!');
          dispatch({
            type: 'DELETE_SUCCESS',
            payload: true,
          });
        } else {
          toast.error('Failed to delete data.');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while deleting data.');
      }
    }
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        dispatch('FETCH_REQUEST');
        const response = await axios.get(`/api/category`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const categoryData = response.data;
        const uniqueCategories = Array.from(
          new Set(
            categoryData.map((item) => ({
              _id: item._id,
              categoryName: item.categoryName,
            }))
          )
        );
        dispatch({ type: 'SUCCESS_CATEGORY', payload: uniqueCategories });
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, []);

  const handleChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const currentDate = dayjs();

  const validateDates = (newStartDate, newEndDate) => {
    const selectedStartDate = dayjs(newStartDate);
    const selectedEndDate = dayjs(newEndDate);

    if (
      selectedStartDate.isAfter(currentDate, 'day') ||
      selectedStartDate.isSame(currentDate, 'day')
    ) {
      setStartDate(newStartDate);
      setStartDateError('');

      if (newEndDate) {
        if (
          selectedEndDate.isAfter(selectedStartDate, 'day') ||
          selectedEndDate.isSame(selectedStartDate, 'day')
        ) {
          setEndDate(newEndDate);
          setEndDateError('');
        } else {
          setEndDateError(
            'End date must be greater than or equal to the Start Date.'
          );
        }
      }
    } else {
      setStartDateError(
        'Start date must be greater than or equal to the current date.'
      );
    }
  };
  return (
    <>
      <Button
        variant="outlined"
        className=" m-2 d-flex globalbtnColor"
        onClick={handleNew}
      >
        <BiPlusMedical className="mx-2" />
        Add Project
      </Button>
      {loading ? (
        <>
          <div className="ThreeDot">
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
        <>
          <Tabs
            defaultActiveKey="All"
            id="uncontrolled-tab-example"
            className="mb-3 mt-4 ps-4 gap-5 tab-btn"
          >
            <Tab className="tab-color" eventKey="All" title="All">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className={`tableBg mx-2 ${theme}DataGrid`}
                  rows={projectData}
                  columns={[
                    ...columns,
                    {
                      field: 'action',
                      headerName: 'Action',
                      width: 250,
                      renderCell: (params) => {
                        return (
                          <Grid item xs={8}>
                            <Link to={`/projectSingleScreen/${params.row._id}`}>
                              <Button
                                variant="contained"
                                className="mx-2 tableEditbtn"
                                // onClick={() => handleEdit(params.row._id)}
                                // startIcon={<MdEdit />}
                              >
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outlined"
                              className="mx-2 tableDeletebtn"
                              onClick={() => deleteHandle(params.row._id)}
                              startIcon={<AiFillDelete />}
                            >
                              Delete
                            </Button>
                          </Grid>
                        );
                      },
                    },
                  ]}
                  getRowId={(row) => row._id}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>
              <Modal open={isModelOpen} onClose={handleCloseRow}>
                <Box
                  className="modelBg"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <Form onSubmit={handleSubmit}>
                    {isNewProject ? (
                      <h4 className="d-flex justify-content-center">
                        Add new Project Details
                      </h4>
                    ) : (
                      <h4 className="d-flex justify-content-center">
                        Edit Project Details
                      </h4>
                    )}
                    <TextField
                      required
                      className="mb-2"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      label="Project Name"
                      fullWidth
                    />

                    <TextField
                      required
                      id="outlined-multiline-static"
                      onChange={(e) => setProjectDescription(e.target.value)}
                      label="Project Description"
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      // value={'text'}
                      // onChange={handleChange}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Categories</InputLabel>
                      <Select
                        required
                        multiple
                        value={selectedOptions}
                        onChange={handleChange}
                      >
                        {categoryData &&
                          categoryData.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                              {option.categoryName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateField
                        required
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) =>
                          validateDates(newValue, endDate)
                        }
                        format="MM-DD-YYYY"
                      />
                      {startDateError && (
                        <div style={{ color: 'red' }}>{startDateError}</div>
                      )}
                      <DateField
                        required
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) =>
                          validateDates(startDate, newValue)
                        }
                        format="MM-DD-YYYY"
                      />
                      {endDateError && (
                        <div style={{ color: 'red' }}>{endDateError}</div>
                      )}
                    </LocalizationProvider>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={startDateError || endDateError || isSubmiting}
                    >
                      {isNewProject
                        ? isSubmiting
                          ? 'Adding Project...'
                          : 'Add Project'
                        : isSubmiting
                        ? 'Saving Changes...'
                        : 'Save Changes'}
                    </Button>
                  </Form>
                </Box>
              </Modal>
            </Tab>
            <Tab className="tab-color" eventKey="Active" title="Active">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className={`tableBg mx-2 ${theme}DataGrid`}
                  rows={projectActiveData}
                  columns={[
                    ...columns,
                    {
                      field: 'action',
                      headerName: 'Action',
                      width: 250,
                      renderCell: (params) => {
                        return (
                          <Grid item xs={8}>
                            <Link to={`/projectSingleScreen/${params.row._id}`}>
                              <Button
                                variant="contained"
                                className="mx-2 tableEditbtn"
                                // onClick={() => handleEdit(params.row._id)}
                                // startIcon={<MdEdit />}
                              >
                                Edit
                              </Button>
                            </Link>

                            <Button
                              variant="outlined"
                              className="mx-2 tableDeletebtn"
                              onClick={() => deleteHandle(params.row._id)}
                              startIcon={<AiFillDelete />}
                            >
                              Delete
                            </Button>
                          </Grid>
                        );
                      },
                    },
                  ]}
                  getRowId={(row) => row._id}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>
            </Tab>
            <Tab className="tab-color" eventKey="Completed" title="Completed">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className={`tableBg mx-2 ${theme}DataGrid`}
                  rows={projectCompleteData}
                  columns={[
                    ...columns,
                    {
                      field: 'action',
                      headerName: 'Action',
                      width: 250,
                      renderCell: (params) => {
                        return (
                          <Grid item xs={8}>
                            <Link to={`/projectSingleScreen/${params.row._id}`}>
                              <Button
                                variant="contained"
                                className="mx-2 tableEditbtn"
                                // onClick={() => handleEdit(params.row._id)}
                                // startIcon={<MdEdit />}
                              >
                                Edit
                              </Button>
                            </Link>

                            <Button
                              variant="outlined"
                              className="mx-2 tableDeletebtn"
                              onClick={() => deleteHandle(params.row._id)}
                              startIcon={<AiFillDelete />}
                            >
                              Delete
                            </Button>
                          </Grid>
                        );
                      },
                    },
                  ]}
                  getRowId={(row) => row._id}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>
            </Tab>
            <Tab className="tab-color" eventKey="Qued" title="Qued">
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className={`tableBg mx-2 ${theme}DataGrid`}
                  rows={projectQuedData}
                  columns={[
                    ...columns,
                    {
                      field: 'action',
                      headerName: 'Action',
                      width: 250,
                      renderCell: (params) => {
                        return (
                          <Grid item xs={8}>
                            <Link to={`/projectSingleScreen/${params.row._id}`}>
                              <Button
                                variant="contained"
                                className="mx-2 tableEditbtn"
                                // onClick={() => handleEdit(params.row._id)}
                                // startIcon={<MdEdit />}
                              >
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outlined"
                              className="mx-2 tableDeletebtn"
                              onClick={() => deleteHandle(params.row._id)}
                              startIcon={<AiFillDelete />}
                            >
                              Delete
                            </Button>
                          </Grid>
                        );
                      },
                    },
                  ]}
                  getRowId={(row) => row._id}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>
            </Tab>
          </Tabs>
        </>
      )}
    </>
  );
}
