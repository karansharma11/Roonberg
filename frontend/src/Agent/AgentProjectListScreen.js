import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
// import { AiFillDelete } from "react-icons/ai";
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Button, Card, Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tab from 'react-bootstrap/Tab';
import { ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { ImCross } from 'react-icons/im';
import { Link, useNavigate } from 'react-router-dom';

import { GrSubtractCircle, GrAddCircle } from 'react-icons/gr';
import { useContext, useEffect, useReducer, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, projectData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'DELETE_SUCCESS':
      return { ...state, successDelete: action.payload };

    case 'DELETE_RESET':
      return { ...state, successDelete: false };

    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };

    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };
    case 'FATCH_CATEGORY':
      return { ...state, categoryData: action.payload };
    case 'FATCH_AGENTS':
      return { ...state, agentData: action.payload };
    case 'FATCH_CONTRACTOR':
      return { ...state, contractorData: action.payload };
    default:
      return state;
  }
};

const columns = [
  { field: "_id", headerName: "ID", width: 200 },
  {
    field: 'projectName',
    headerName: 'Project Name',
    width: 100,
  },
  {
    field: 'projectDescription',
    headerName: 'Description',
    width: 100,
  },
  {
    field: 'projectCategory',
    headerName: 'Category',
    width: 100,
  },

  {
    field: "projectOwner",
    headerName: "Contractor",
    width: 100,
  },

];

export default function AgentProjectList() {
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? "dark" : "light";
  const [
    {
      loading,
      error,
      projectData,
      successDelete,
      successUpdate,
      categoryData,
      agentData,
      contractorData,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    projectData: [],
    successDelete: false,
    successUpdate: false,
    categoryData: [],
    contractorData: [],
    agentData: [],
  });

  useEffect(() => {
    const FatchCategory = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.get(`/api/category/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        dispatch({ type: 'FATCH_CATEGORY', payload: datas });
      } catch (error) {
        console.log(error);
      }
    };
    FatchCategory();
  }, []);

  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: 'contractor' });
        const datas = response.data;
        dispatch({ type: 'FATCH_CONTRACTOR', payload: datas });
      } catch (error) { }
    };
    FatchContractorData();
  }, []);

  useEffect(() => {
    const FatchAgentData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: 'agent' });
        const datas = response.data;
        dispatch({ type: 'FATCH_AGENTS', payload: datas });
      } catch (error) { }
    };
    FatchAgentData();
  }, []);

  useEffect(() => {
    const FatchProjectData = async () => {
      try {
        dispatch({ type: 'FATCH_REQUEST' });
        const response = await axios.get(`/api/project/getproject/${userInfo._id}`);
        const datas = response.data.projects;
        console.log("agentdata", datas)
        const rowData = datas.map((items) => {
          const contractor = contractorData.find(
            (contractor) => contractor._id === items.projectOwner
          );
          return {
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
            projectOwner: contractor ? contractor.first_name : '',
          };
        });
        dispatch({ type: 'FATCH_SUCCESS', payload: rowData });

      } catch (error) {
        console.error(error);
        dispatch({ type: "FATCH_ERROR", payload: error })
        if (error.response && error.response.status === 404) {
          toast.error('No projects have been assigned to you yet');
        } else {
          toast.error('An error occurred while fetching data');
        }
      }
    };
    FatchProjectData()
  }, [contractorData]);

  const projectActiveData = projectData.filter((item) => {
    return item.projectStatus === 'active';
  });
  const projectCompleteData = projectData.filter((item) => {
    return item.projectStatus === 'complete';
  });
  const projectQuedData = projectData.filter((item) => {
    return item.projectStatus === 'qued';
  });

  return (
    <>
      <div className="px-4 mt-3">
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
        ) : projectData.length < 0 || error ? (
          <div>
            <Card>
              <Card.Text>No projects have been assigned to you yet</Card.Text>
            </Card >
          </div>
        ) : (
          <>
            <div className="tabBorder mt-3">
              <Tabs
                defaultActiveKey="All"
                id="uncontrolled-tab-example"
                className={`mb-0  tab-btn ${theme}Tab`}
              >
                <Tab className="tab-color" eventKey="All" title="All">
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      className={
                        theme == "light"
                          ? `${theme}DataGrid`
                          : `tableBg ${theme}DataGrid`
                      }
                      rows={projectData}
                      columns={[...columns,
                      {

                        field: 'action',
                        headerName: 'Action',
                        width: 250,
                        renderCell: (params) => {
                          return (
                            <Grid item xs={8}>
                              <Link to={`/agentEditProject/${params.row._id}`}>
                                <Button
                                  variant="contained"
                                  className="mx-2 tableEditbtn"
                                // onClick={() => handleEdit(params.row._id)}
                                // startIcon={<MdEdit />}
                                >
                                  Edit
                                </Button>
                              </Link>
                            </Grid>
                          );
                        },
                      }]}
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
                      localeText={{ noRowsLabel: "Project Data Is Not Avalible" }}
                    />
                  </Box>
                </Tab>
                <Tab className="tab-color" eventKey="Active" title="Active">
                  <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      className={
                        theme == "light"
                          ? `${theme}DataGrid`
                          : `tableBg ${theme}DataGrid`
                      }
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
                                <Link to={`/agentEditProject/${params.row._id}`}>
                                  <Button
                                    variant="contained"
                                    className="mx-2 tableEditbtn"
                                  // onClick={() => handleEdit(params.row._id)}
                                  // startIcon={<MdEdit />}
                                  >
                                    Edit
                                  </Button>
                                </Link>
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
                      className={
                        theme == "light"
                          ? `${theme}DataGrid`
                          : `tableBg ${theme}DataGrid`
                      }
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
                                <Link to={`/agentEditProject/${params.row._id}`}>
                                  <Button
                                    variant="contained"
                                    className="mx-2 tableEditbtn"
                                  // onClick={() => handleEdit(params.row._id)}
                                  // startIcon={<MdEdit />}
                                  >
                                    Edit
                                  </Button>
                                </Link>
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
                      className={
                        theme == "light"
                          ? `${theme}DataGrid`
                          : `tableBg ${theme}DataGrid`
                      }
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
                                <Link to={`/agentEditProject/${params.row._id}`}>
                                  <Button
                                    variant="contained"
                                    className="mx-2 tableEditbtn"
                                  // onClick={() => handleEdit(params.row._id)}
                                  // startIcon={<MdEdit />}
                                  >
                                    Edit
                                  </Button>
                                </Link>
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
            </div>
          </>
        )
        }
      </div>
    </>
  );
}
