import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
  Avatar,
  Button,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
// import { AiFillDelete } from 'react-icons/ai';
// import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form } from 'react-bootstrap';
import { FormControl } from '@mui/material';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AvatarImage from '../Components/Avatar';
import { ImCross } from 'react-icons/im';
import { ColorRing } from 'react-loader-spinner';
import Badge from '@mui/material/Badge';
import { ThreeDots } from "react-loader-spinner";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, categoryData: action.payload, loading: false };
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
    case "CATEGORY_CRATED_REQ":
      return { ...state, isSubmiting: true };
    case "FATCH_SUBMITTING":
      return { ...state, submitting: action.payload };
    default:
      return state;
  }
};

const columns = [
  { field: '_id', headerName: 'ID', width: 250 },
  {
    field: 'categoryName',
    headerName: 'category',
    width: 100,
  },
  {
    field: 'categoryDescription',
    headerName: 'Description',
    width: 150,
  },
  {
    field: 'categoryImage',
    headerName: 'Image',
    width: 100,
    renderCell: (params) => {
      function generateColorFromAscii(str) {
        let color = '#';
        const combination = str
          .split('')
          .map((char) => char.charCodeAt(0))
          .reduce((acc, value) => acc + value, 0);
        color += (combination * 12345).toString(16).slice(0, 6);
        return color;
      }

      const name = params.row.categoryName[0].toLowerCase();
      const color = generateColorFromAscii(name);
      return (
        <>
          {params.row.categoryImage !== 'null' ? (
            <Avatar src={params.row.categoryImage} />
          ) : (
            <AvatarImage name={name} bgColor={color} />
          )}
        </>
      );
    },
  },

];

const getRowId = (row) => row._id;


export default function AdminContractorListScreen() {
  const navigate = useNavigate();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCatogry] = useState('');
  const [status, setStatus] = useState('');
  const [categoryDesc, setCatogryDesc] = useState('');
  const [isDeleting, setIsDeleting] = useState(false)
  const [
    { loading, error, categoryData, successDelete, successUpdate, isSubmiting, submitting },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    categoryData: [],
    successDelete: false,
    successUpdate: false,
    isSubmiting: false,
    submitting: false,
  });

  const handleEdit = (rowId) => {
    navigate(`/adminEditCategory/${rowId}`);


    // setSelectedRowData(params);
    // setIsModelOpen(true);
    // setIsNewCategory(false);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewCategory(true);
  };
  const handleSubmitNewCategory = () => {
    setIsModelOpen(false);
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';

  useEffect(() => {
    const FatchcategoryData = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.get(`/api/category/`);
        const datas = response.data;
        console.log(datas);
        const rowData = datas.map((items) => {
          return {
            ...items,
            _id: items._id,
            categoryName: items.categoryName,
            categoryDescription: items.categoryDescription == '' ? 'No description' : items.categoryDescription,
            categoryImage: items.categoryImage,
            categoryStatus:
              items.categoryStatus == true ? 'Active' : 'Inactive',
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
      FatchcategoryData();
    }
  }, [successDelete, successUpdate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "FATCH_SUBMITTING", payload: true })
    const formDatas = new FormData();

    formDatas.append('categoryImage', selectedFile);
    formDatas.append('categoryName', category);
    formDatas.append('categoryDescription', categoryDesc);
    formDatas.append('categoryStatus', status);

    try {
      dispatch({ type: 'CATEGORY_CRATED_REQ' });
      const { data } = await axios.post(`/api/category/`, formDatas, {
        headers: {
          'content-type': 'multipart/form-data',

          authorization: `Bearer ${userInfo.token}`,
        },
      });
      console.log(data.message);
      toast.success("Category Created Successfully !");
      dispatch({ type: "UPDATE_SUCCESS" })
      dispatch({ type: "FATCH_SUBMITTING", payload: false })
      setCatogry('');
      setCatogryDesc('');
      setSelectedFile(null)
      setStatus('')
    } catch (err) {
      toast.error(err.response?.data?.message);
      dispatch({ type: "FATCH_SUBMITTING", payload: false })
    } finally {
      setIsModelOpen(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const deleteHandle = async (userid) => {
    setIsDeleting(true);
    if (window.confirm('Are you sure to delete?')) {
      try {
        const response = await axios.delete(`/api/category/${userid}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          toast.success('Category Deleted Successfully!');
          setIsDeleting(false);
          dispatch({
            type: 'DELETE_SUCCESS',
            payload: true,
          });
        } else {
          toast.error('Failed To Delete Category.');
        }
      } catch (error) {
        setIsDeleting(false);
        console.error(error);
        toast.error('An Error Occurred While Deleting Category.');
      }
    }
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
        onClick={handleNew}
        disabled={isDeleting}
      >
        <BiPlusMedical className="mx-2" />
        Add Category
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
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            className={
              theme == 'light'
                ? `${theme}DataGrid mx-2`
                : `tableBg ${theme}DataGrid mx-2`
            }

            // rows={categoryData ? categoryData : noRows}
            rows={categoryData}
            columns={[
              ...columns,
              {
                field: 'categoryStatus',
                headerName: 'Status',
                width: 100,
                renderCell: (params) => {
                  const isInactive = params.row.categoryStatus === 'Inactive';
                  const cellClassName = isInactive ? 'inactive-cell' : 'active-cell';

                  return (
                    <div className={`status-cell ${cellClassName}`}>
                      {params.row.categoryStatus}
                    </div>
                  );
                },
              },
              {
                field: "action",
                headerName: "Action",
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
            getRowId={getRowId}
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

            // gridOptions={gridOptions}
            localeText={{ noRowsLabel: "Category Data Is Not Avalible" }}
          // getRowClassName={(params) => (params.row.categoryStatus === 'Inactive' ? 'inactive-row' : '')}

          />
        </Box>
      </div>
      <Modal open={isModelOpen} onClose={handleCloseRow}>
        <Box
          className="modelBg"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
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
            <Form className={submitting ? 'scrollInAdminproject p-4 ' : 'scrollInAdminproject px-1'}>
              <ImCross
                color="black"
                className="formcrossbtn"
                onClick={handleCloseRow}
              />
              <h4 className="d-flex justify-content-center">
                Add Category
              </h4>

              <TextField
                className="mb-3"
                value={category}
                label="Category Name"
                fullWidth
                onChange={(e) => setCatogry(e.target.value)}
                required

              />
              <TextField
                className="mb-3"
                value={categoryDesc}
                label="Add Description"
                fullWidth
                onChange={(e) => setCatogryDesc(e.target.value)}

              />
              <FormControl className="mb-3">
                <InputLabel>Select Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <MenuItem value={true} >Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
              <TextField
                className="mb-3"
                type="file"
                fullWidth
                onChange={handleFileChange}
                required
                style={{ display: 'none' }}
              />
              <FormControl className="mb-3 cateLogoImgContainer">
                <InputLabel className='cateLogoImgLabel'>Upload Category Logo</InputLabel>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  required
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button variant="contained" component="span" className='globalbtnColor'>
                    Browse
                  </Button>
                </label>
              </FormControl>
              <Button
                className="mt-2 formbtn updatingBtn globalbtnColor"
                variant="contained"
                color="primary"
                onClick={submitHandler}
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
