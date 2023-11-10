import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Toast,
} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import { Avatar, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import AvatarImage from '../Components/Avatar';
import { FaUserEdit } from 'react-icons/fa'
const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, categoryData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };

    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };
    //   case "CATEGORY_CRATED_REQ":
    //     return { ...state, isSubmiting: true }
    default:
      return state;
  }
};

function AdminEditCategory() {
  const { id } = useParams();
  if (id) {
    console.log('id exists:', id);
  } else {
    console.log('id does not exist');
  }

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [
    { loading, error, categoryData, successDelete, successUpdate },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    categoryData: {},
    successDelete: false,
    successUpdate: false,
    // isSubmiting: true,
  });

  const navigate = useNavigate();
  const [category, setCatogry] = useState(categoryData.categoryName);
  const [status, setStatus] = useState(categoryData.categoryStatus || '');
  const [categoryDesc, setCatogryDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [color, setColor] = useState('');

  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    const FatchcategoryData = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.get(`/api/category/${id}`);
        const datas = response.data;
        setCatogry(datas.categoryName);
        setCatogryDesc(datas.categoryDescription);
        setSelectedFile(datas.categoryImage);
        setStatus(datas.categoryStatus);
        dispatch({ type: 'FATCH_SUCCESS', payload: datas });
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };

    FatchcategoryData();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    const formDatas = new FormData();

    formDatas.append("file", selectedFile);
    formDatas.append("categoryName", category);
    formDatas.append("categoryDescription", categoryDesc);
    formDatas.append("categoryStatus", status);
    try {
      const data = await axios.put(
        `/api/category/CategoryUpdate/${id}`,
        formDatas,
        {
          headers: {
            "content-type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" })
      toast.success("Category Updated Successfully");
      navigate('/adminCategoriesList')

    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    function generateColorFromAscii(str) {
      let color = '#';
      const combination = str
        .split('')
        .map((char) => char.charCodeAt(0))
        .reduce((acc, value) => acc + value, 0);
      color += (combination * 12345).toString(16).slice(0, 6);
      return color;
    }

    if (categoryData && categoryData.categoryName) {
      const name = categoryData.categoryName.toLowerCase().charAt(0);
      const generatedColor = generateColorFromAscii(name);
      setColor(generatedColor);
    }
  }, [categoryData]);

  return (
    <>
      <Container className="Sign-up-container-regis d-flex w-100 profileDiv  flex-column justify-content-center align-items-center">
        <div className="ProfileScreen-inner px-4 py-3 w-100">
          <Row className="mb-3">
            <Col>
              <h4>Update Category</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="overlayLoading" >
                <Card className={`${theme}CardBody`}>
                  <div className="FormContainerEdit">

                    {isSubmiting && (
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

                    <Form onSubmit={submitHandler} className="p-4 w-100 formWidth ">
                      <Row>
                        <Col>

                          {categoryData.categoryImage !== 'null' ? (
                            <Avatar src={categoryData.categoryImage} />
                          ) : (
                            <AvatarImage name={category} bgColor={color} />
                          )}
                        </Col>
                        <Col>
                          <FaUserEdit />
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicPassword"
                          >
                            <Form.Control
                              disabled={isSubmiting}
                              className="input-box-inner"
                              type="file"
                              onChange={handleFileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>


                      <TextField
                        className="mb-3"
                        value={category}
                        label="Category Name"
                        fullWidth
                        onChange={(e) => setCatogry(e.target.value)}
                        required
                        InputLabelProps={{
                          shrink: categoryData.categoryName ? true : false,

                        }}
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
                      <div className="d-flex justify-content-start mt-4">
                        <Button
                          className=" py-1 w-25 globalbtnColor updatingBtn"
                          variant="primary"
                          type="submit"
                          disabled={isSubmiting}
                        >
                          {isSubmiting ? 'UPDATING' : 'UPDATE'}
                        </Button>
                      </div>
                    </Form>




                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}

export default AdminEditCategory;
