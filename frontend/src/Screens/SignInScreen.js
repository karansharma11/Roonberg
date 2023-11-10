import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Card } from 'react-bootstrap/';
import { Link, useNavigate } from 'react-router-dom';
import Validations from '../Components/Validations';
import { FaEye, FaRegEyeSlash } from 'react-icons/fa';
import { useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import { Store } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';
function SignUpForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      const { email, password } = JSON.parse(rememberedUser);
      document.getElementById('username').value = email;
      document.getElementById('password').value = password;
      setEmail(email);
      setPassword(password);
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    if (rememberMe) {
      localStorage.setItem(
        'rememberedUser',
        JSON.stringify({ email, password })
      );
    }

    try {
      const { data } = await axios.post('/api/user/signin', {
        email,
        password,
      });
      if (!data.profile_picture) {
        data.profile_picture = "./avatar.png"; // Replace with your default avatar URL
      }
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));

      toast.success('Login successful');
      const socket = io('ws://localhost:8900');
      socket.on('connectionForNotify', (data) => {
        console.log('oiuhjioyhi', data);
      });
    
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  return (
    <Container className="loginPage d-flex  flex-column justify-content-center align-items-center">
      <div className="Sign-up-container-inner px-4 py-3">
        <Row className="mb-3 ">
          <Col>
            <h3>Login</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Form onSubmit={submitHandler} className="p-4 formWidth ">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box">
                    Email address
                  </Form.Label>
                  <Form.Control
                    id="username"
                    value={email}
                    type="email"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="mb-1">Password</Form.Label>
                  <div className="Password-input-eye">
                    <div className=" rounded-2">
                      <Form.Control
                        id="password"
                        value={password}
                        className="pswd-input"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div
                      className="eye-bttn "
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEye /> : <FaRegEyeSlash />}
                    </div>
                  </div>
                  <Form.Check
                    className="mt-3"
                    type="checkbox"
                    label="Remember me"
                    onChange={(e) => {
                      setRememberMe(e.target.checked);
                    }}
                  />
                  <Validations type="password" value={password} />
                </Form.Group>
                <Button
                  className="w-100 py-1 globalbtnColor"
                  variant="primary"
                  type="submit"
                  disabled={isSubmiting}
                >
                  {isSubmiting ? 'Submiting...' : 'Submit'}
                </Button>
                <Form.Group className="my-3">
                  <Link to="/ForgetPassword">Forgot Password?</Link>
                </Form.Group>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default SignUpForm;
