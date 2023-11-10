import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Validations from "../Components/Validations";
import { toast } from "react-toastify";
import axios from "axios";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [submited, setSubmited] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    try {
      const { data } = await axios.post("/api/user/forget-password", { email });
      toast.success(data.message);
      setSubmited(true);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  return !submited ? (
    <Container className=" loginPage d-flex flex-column justify-content-center align-items-center forget-container">
      <Row>
        <Col>
          <h4 className="mb-3 heading4">Forget Password</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="p-4 formColor">
            <Form
              onSubmit={handleSubmit}
              className="formWidth d-flex flex-column"
            >
              <Form.Label className="textLeft text-left">
                Email Address
              </Form.Label>

              <Form.Control
                className="px-2  py-1 mb-3"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Validations type="email" value={email} />
              <Button
                type="submit"
                className="globalbtnColor px-5 py-1"
                disabled={isSubmiting}
              >
                {isSubmiting ? "Submiting..." : "Submit"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  ) : (
    <Container className="fullContainer d-flex flex-column justify-content-center align-items-center forget-container">
      <Row>
        <Col>
          <Card className="p-4 formColor">
            <h6 className="mb-4 heading4">
              We have sent a link on your registered email. please check!
            </h6>

            <Button
              onClick={handleSubmit}
              type="submit"
              className="globalbtnColor btn-resend px-5 py-1"
              disabled={isSubmiting}
            >
              {isSubmiting ? "Resending..." : "Resend"}
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
