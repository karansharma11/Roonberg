import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { AiFillDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Form } from "react-bootstrap";
import { BiPlusMedical } from "react-icons/bi";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";
import { ColorRing, ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useReducer, useState } from "react";
import Validations from "../Components/Validations";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, constructorData: action.payload, loading: false };
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
  { field: '_id', headerName: 'ID', width: 250 },
  {
    field: 'first_name',
    headerName: 'constractor',
    width: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
  // {
  //   field: 'userStatus',
  //   headerName: 'Status',
  //   width: 100,
  // },
];

export default function AdminContractorListScreen() {
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const navigate = useNavigate();
  const role = 'contractor';
  const [isModelOpen, setIsModelOpen] = useState(false);
  const theme = toggleState ? 'dark' : 'light';

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false)

  const [
    {
      loading,
      error,
      constructorData,
      successDelete,
      successUpdate,
      submitting,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',

    constructorData: [],
    successDelete: false,
    successUpdate: false,
    submitting: false,
  });

  useEffect(() => {
    const FatchconstractorData = async () => {
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
            userStatus: items.userStatus ? 'Active' : 'Inactive',
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
      FatchconstractorData();
    }
  }, [successDelete, successUpdate, userInfo]);

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
          password: password,
          role: role,
          userStatus: status,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      if (response.status === 200) {

        toast.success('Contractor Created Successfully !');
        setIsModelOpen(false);
        dispatch({ type: 'UPDATE_SUCCESS', payload: true });
        dispatch({ type: 'FATCH_SUBMITTING', payload: false });
        setFirstname('');
        setLastname('');
        setStatus('');
        setEmail('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      dispatch({ type: 'FATCH_SUBMITTING', payload: false });
    }
  };
  // --------------------------
  const deleteHandle = async (userid) => {
    setIsDeleting(true)
    if (window.confirm('Are You Sure To Delete?')) {
      try {
        const response = await axios.delete(`/api/user/${userid}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          toast.success('Constractor Deleted Successfully!');
          dispatch({
            type: 'DELETE_SUCCESS',
            payload: true,
          });
          setIsDeleting(false)

        } else {
          toast.error('Failed To Delete Constractor .');
          setIsDeleting(false)
        }
      } catch (error) {

        console.error(error);
        toast.error('An Error Occurred While Deleting Constractor .');
      }
    }
    else {
      setIsDeleting(false)
    }
  };

  const handleEdit = (userid) => {
    navigate(`/adminEditContractor/${userid}`);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleModel = () => {
    setIsModelOpen(true);
  };

  return (

    <>
      <div className="px-3 mt-3">

        {loading ? (
          <>
            <div className="ThreeDot">
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                className="ThreeDot justi`fy-content-center"
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
              onClick={handleModel}
              disabled={isDeleting}
            >
              <BiPlusMedical className="mx-2" />
              Add Contractor
            </Button>
            <div className="overlayLoading" >
              {isDeleting && (
                <div className="overlayLoadingItem1">
                  <ColorRing
                    visible={true}
                    height="40"
                    width="40"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    const colors={["white", "white", "white", "white", "white"]}
                  />
                </div>
              )}
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  className={
                    theme == 'light'
                      ? `${theme}DataGrid mx-2`
                      : `tableBg ${theme}DataGrid mx-2`
                  }
                  rows={constructorData}
                  columns={[
                    ...columns,
                    {
                      field: 'userStatus',
                      headerName: 'Status',
                      width: 100,
                      renderCell: (params) => {
                        const isInactive = params.row.userStatus === 'Inactive';
                        const cellClassName = isInactive ? 'inactive-cell' : 'active-cell';

                        return (
                          <div className={`status-cell ${cellClassName}`}>
                            {params.row.userStatus}
                          </div>
                        );
                      },
                    },
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
                  localeText={{ noRowsLabel: "Contractor Data Is Not Avalible" }}
                />
              </Box>
            </div>
            <Modal open={isModelOpen} onClose={handleCloseRow}>
              <Box
                className="modelBg modalRespnsive"
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
                <div className="overlayLoading" >
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
                  <Form onSubmit={handleSubmit} className={submitting ? 'scrollInAdminproject p-4 ' : 'scrollInAdminproject px-1'}>
                    <ImCross
                      color="black"
                      className="formcrossbtn"
                      onClick={handleCloseRow}
                    />

                    <h4 className="d-flex justify-content-center">
                      Add Contractor
                    </h4>

                    <TextField
                      className="mb-3"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      label="First Name"
                      fullWidth
                      required

                    />
                    <TextField
                      className="mb-3"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      label="Last Name"
                      fullWidth
                    />

                    <TextField
                      className="mb-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      label="Email"
                      type="email"
                      fullWidth
                      required
                    />
                    <Validations type="email" value={email} />
                    <FormControl className="formselect">
                      <InputLabel>Select Status</InputLabel>
                      <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                      >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                    <br></br>
                    <Button
                      className="mt-2 formbtn updatingBtn globalbtnColor"
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
      </div>
    </>

  );
}
