import React, { PropTypes } from 'react';
import { Col, Form, FormGroup, ControlLabel, Button, ButtonGroup } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';

function DeploymentForm(props) {
  const {
    deployNodes,
    handleSubmit,
    reset,
    submitting,
    disable,
  } = props;
  return (
    <Form horizontal >
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>
          Service ID
        </Col>
        <Col sm={10}>
          <Field name="srvcId" type="text" component="input" placeholder="Service/module ID  " disabled />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>
          Inst ID
        </Col>
        <Col sm={10}>
          <Field name="instId" type="text" component="input" placeholder="Instance ID  " disabled />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>
          Node
        </Col>
        <Col sm={10}>
          <Field name="nodeId" component="select" placeholder="select deployment node" disabled={disable} >
            <option />
            {deployNodes.map(aNode =>
              <option value={aNode.nodeId} key={aNode.nodeId}>{aNode.url}</option>)}
          </Field>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>
          Exec
        </Col>
        <Col sm={10}>
          <Field name="descriptor.exec" component="input" type="text" placeholder="Exec " disabled={disable} />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>
          Start command
        </Col>
        <Col sm={10}>
          <Field name="descriptor.cmdlineStart" component="input" type="text" placeholder="Command line start " disabled={disable} />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>
          Stop command
        </Col>
        <Col sm={10}>
          <Field name="descriptor.cmdlineStop" component="input" type="text" placeholder="Command line stop " disabled={disable} />
        </Col>
      </FormGroup>
      { disable ?
        <ButtonGroup className="pull-right">
          <Button bsStyle="warning" disabled={submitting} onClick={handleSubmit}>Delete</Button>
        </ButtonGroup>
         :
        <ButtonGroup className="pull-right">
          <Button bsStyle="primary" disabled={submitting} onClick={handleSubmit}>Submit</Button>
          <Button disabled={submitting} onClick={reset}>Reset</Button>
        </ButtonGroup>
      }
      <br /><br />
    </Form>
  );
}


DeploymentForm.propTypes = {
  deployNodes: PropTypes.arrayOf(PropTypes.shape({
    nodeId: PropTypes.string,
    url: PropTypes.string,
  })).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  disable: PropTypes.bool.isRequired,
};

export default reduxForm(
  {
    form: 'deploymentForm',
    enableReinitialize: true,
  },
)(DeploymentForm);
