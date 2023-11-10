import React, { useContext, useEffect, useReducer, useState } from "react";
import { Button, Card, Col, Container, Form, Row, } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import { toast } from "react-toastify";
import axios from "axios";
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const reducer = (state, action) => {
  switch (action.type) {
    case "FATCH_REQUEST":
      return { ...state, loading: true };
    case "FATCH_SUCCESS":
      return { ...state, agentData: action.payload, loading: false };
    case "FATCH_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "UPDATE_SUCCESS":
      return { ...state, successUpdate: action.payload };

    case "UPDATE_RESET":
      return { ...state, successUpdate: false };
    case "FATCH_CATEGORY":
      return { ...state, categoryDatas: action.payload };
    //   case "CATEGORY_CRATED_REQ":
    //     return { ...state, isSubmiting: true }
    default:
      return state;
  }
};

function AdminEditAgent() {

  const [selectcategory, setSelectCategory] = React.useState();
  const { id } = useParams();
  if (id) {
    console.log("id exists:", id);
  } else {
    console.log("id does not exist");
  }

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { toggleState, userInfo } = state;
  const theme = toggleState ? "dark" : "light";
  const [
    { loading, error, agentData, categoryDatas, successDelete, successUpdate, },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    agentData: {},
    successDelete: false,
    successUpdate: false,
    isSubmiting: false,
    categoryDatas: []
  });


  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');


  useEffect(() => {
    const FatchcategoryData = async () => {
      try {
        dispatch("FATCH_REQUEST");
        const response = await axios.get(
          `/api/user/${id}`);
        const datas = response.data;
        setFirstName(datas.first_name)
        setLastName(datas.last_name || 'Last Name')
        setEmail(datas.email)
        setStatus(datas.userStatus)
        setCategory(datas.agentCategory)

      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };

    FatchcategoryData();

  }, []);

  React.useEffect(() => {
    const FatchCategory = async () => {
      try {
        dispatch("FATCH_REQUEST")
        const response = await axios.get(`/api/category/`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
        const datas = response.data;

        dispatch({ type: "FATCH_CATEGORY", payload: datas });
      } catch (error) {
        console.log(error)
      }
    }
    FatchCategory();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    try {
      const data = await axios.put(
        `/api/user/update/${id}`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          userStatus: status,
          agentCategory: category || agentData.agentCategory
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" })
      toast.success("Agent Updated Successfully !");
      navigate('/adminAgentList')

    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };
  return (
    <>
      <Container className="Sign-up-container-regis d-flex w-100 profileDiv  flex-column justify-content-center align-items-center">
        <div className="ProfileScreen-inner px-4 py-3 w-100">
          <Row className="mb-3">
            <Col>
              <h4>Update Agent</h4>
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
                      <TextField
                        className="mb-3"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        label="First Name"
                        fullWidth
                        required
                      />
                      <TextField
                        className="mb-3"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
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
                        disabled

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


                      <FormControl className="mb-3">
                        <InputLabel>Category</InputLabel>
                        <Select required
                          value={category} onChange={(e) => setCategory(e.target.value)}
                        >
                          {categoryDatas.map((items) => (
                            <MenuItem key={items._id} value={items._id} >{items.categoryName}</MenuItem>
                          ))}
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

export default AdminEditAgent;