import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,

} from 'react-bootstrap';
import { Store } from '../Store';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

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
    default:
      return state;
  }
};

function SuperadminEditAdmin() {
  const { id } = useParams();
  if (id) {
    console.log('id exists:', id);
  } else {
    console.log('id does not exist');
  }

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

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
    isSubmiting: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const FatchcategoryData = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.get(`/api/user/${id}`);
        const datas = response.data;
        setFirstName(datas.first_name);
        setLastName(datas.last_name);
        setEmail(datas.email);
        setStatus(datas.userStatus);

        // setStatus(datas.categoryStatus)
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };

    FatchcategoryData();
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
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success("Admin Updated Successfully !");
      navigate('/adminList-screen');
      setIsSubmiting(false);
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
              <h4>Update Admin</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="overlayLoading" >
                <Card className={`${theme}CardBody`}>
                  <div className="FormContainerEdit">

                    <>
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
                      <Form onSubmit={submitHandler} className="p-4 w-100 formWidth " >
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

                        <div className="d-flex justify-content-left mt-4">
                          <Button
                            className=" py-1 w-25 globalbtnColor editFormBtn"
                            variant="primary"
                            type="submit"
                            disabled={isSubmiting}
                          >
                            {isSubmiting ? "UPDATING" : "UPDATE"}
                          </Button>
                        </div>
                      </Form>
                    </>
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

export default SuperadminEditAdmin;
