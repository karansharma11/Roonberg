import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import data from '../dummyData';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { ImCross } from 'react-icons/im';
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Validations from '../Components/Validations';
import { FaEye, FaRegEyeSlash } from 'react-icons/fa';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, adminData: action.payload, loading: false };
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
    case 'FATCH_SUBMITTING':
      return { ...state, submitting: action.payload };
    default:
      return state;
  }
};

const columns = [
  { field: '_id', headerName: 'ID', width: 80 },
  {
    field: 'first_name',
    headerName: 'Admin Name',
    width: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
  {
    field: 'userStatus',
    headerName: 'Status',
    width: 200,
  },
];

export default function AdminListScreen() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const role = 'admin';
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [
    { loading, error, adminData, successDelete, successUpdate, submitting },
    dispatch,

  ] = useReducer(reducer, {
    loading: true,
    error: '',
    adminData: [],
    successDelete: false,
    successUpdate: false,
    submitting: true,
  });

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState();
  const [password, setPassword] = useState('RoonBerg@123');
  const [showPassword, setShowPassword] = useState(false);

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setIsModelOpen(true);
  };

  const handleEdit = (userid) => {
    navigate(`/superadmineditadmin/${userid}`);
  };

  useEffect(() => {
    const FatchadminData = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.post(
          `/api/user/`,
          { role: role },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        const datas = response.data;
        const rowData = datas.map((items) => {
          return {
            ...items,
            _id: items._id,
            first_name: items.first_name,
            email: items.email,
            userStatus: items.userStatus == true ? 'Active' : 'Inactive',
          };
        });
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
      FatchadminData();
    }
  }, [successDelete, successUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'FATCH_SUBMITTING', payload: true });
    try {
      const response = await axios.post(
        `/api/user/add`,
        {
          first_name: firstname,
          last_name: lastname,
          email: email,
          password: password || 'RoonBerg@123',
          role: role,
          userStatus: status || true,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success('Agent added Successfully !');
        setIsModelOpen(false);
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
        dispatch({ type: 'FATCH_SUBMITTING', payload: false });
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }

    const deleteHandle = async (userid) => {
      if (window.confirm('Are you sure to delete?')) {
        try {
          const response = await axios.delete(`/api/user/${userid}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });

          if (response.status === 200) {
            toast.success('admin data deleted successfully!');
            dispatch({
              type: 'DELETE_SUCCESS',
              payload: true,
            });
          } else {
            toast.error('Failed to delete admin data.');
          }
        } catch (error) {
          console.error(error);
          toast.error('An error occurred while deleting admin data.');
        }
      }
    };
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <>

        <h1>karan sharama</h1>
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
            <Button
              variant="outlined"
              className=" m-2 d-flex globalbtnColor"
              onClick={handleNew}
            >
              <BiPlusMedical className="mx-2" />
              Add Admin
            </Button>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                className={`tableBg mx-2 ${theme}DataGrid`}
                rows={adminData}
                columns={[
                  ...columns,
                  {
                    field: 'action',
                    headerName: 'Action',
                    width: 250,
                    renderCell: (params) => {
                      return (
                        <Grid item xs={8}>
                          <Button
                            variant="contained"
                            className="mx-2 tableEditbtn"
                            onClick={() => handleEdit(params.row._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            className="mx-2 tableDeletebtn"
                            onClick={() => deleteHandle(params.row._id)}
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
                  p: submitting ? 0 : 4,
                }}
              >
                <div className="overlayLoading">
                  {submitting && (
                    <div className="overlayLoadingItem1 y-3">

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
                  <Form onSubmit={handleSubmit} >
                    <ImCross
                      color="black"
                      className="formcrossbtn"
                      onClick={handleCloseRow}
                    />
                    <h4 className="d-flex justify-content-center">
                      Add Admin
                    </h4>

                    <TextField
                      className="mb-2"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      label="First Name"
                      fullWidth
                    />
                    <TextField
                      className="mb-2"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      label="Last Name"
                    />
                    <TextField
                      className="mb-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      label="Email"
                      type='email'
                      fullWidth
                    />
                    <Validations type="email" value={email} />
                    <div className="Password-input-eye">
                      <div className=" rounded-2">
                        <TextField
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          label="Password"
                          className="pswd-input "
                          type={showPassword ? 'text' : 'password'}
                          fullWidth
                        />
                      </div>
                      <div
                        className="eye-bttn cent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEye /> : <FaRegEyeSlash />}
                      </div>
                    </div>
                    <Validations type="password" value={password} />

                    <FormControl className="formselect">
                      <InputLabel>Choose Status</InputLabel>
                      <InputLabel>Choose Status</InputLabel>
                      <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                    <br></br>
                    <Button
                      className="mt-2 formbtn"
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting}

                    >
                      {submitting ?
                        "SUBMITTING"
                        : "SUBMIT "}
                    </Button>
                  </Form>
                </div>
              </Box>
            </Modal>
          </>
        )}
      </>
    );
  }
}