import React, { useContext, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Store } from '../Store';
export default function Validations({ type, value }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);

  let validationMessage = null;

  if (type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      validationMessage = "Invalid email address";
    }
  }

  if (type === "password" && value) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      validationMessage =
        "At least 8 characters,  one uppercase letter, one lowercase letter, one digit , one special character  ";
    }
  }
  useEffect(() => {
    if (validationMessage) {
      ctxDispatch({
        type: 'VALIDATION_MSG',
        payload: validationMessage,
      });
    }
    if (!validationMessage) {
      ctxDispatch({
        type: 'VALIDATION_MSG',
        payload: null,
      });
    }
  }, [validationMessage, ctxDispatch]);

  return validationMessage ? (
    <Alert variant="danger" className="error">
      {validationMessage}
    </Alert>
  ) : null;
}
