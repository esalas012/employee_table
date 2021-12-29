import React from 'react';
import Alert from 'react-bootstrap/Alert';

const AlertComponent = ({type, closeAlert, msg, title}) => {
    return (
        <Alert variant={type} onClose={closeAlert} dismissible>
        <Alert.Heading>{title}</Alert.Heading>
        <p>
          {msg}
        </p>
      </Alert>
    )
}

export default AlertComponent;