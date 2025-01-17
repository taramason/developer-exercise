import React, { Component } from 'react';
import {
  Row,
  Col,
  Form
 } from 'react-bootstrap';
 import '../App.css';

class ChangeTerms extends Component {
  render() {
    return (
      <Form className="changeTermsForm" onSubmit={this.props.calculateNewTerms}>
        <Form.Label>Choose a new term length!</Form.Label>
        <Row className="input-field">
          <Col sm={{ span: 3}} className="input-field">
            <Form.Control
              as="select"
              onChange = {this.props.handleTermChange}
              value={this.props.newTerm ? this.props.newTerm : 'choose'}
              name="newTerm"
              >
              <option value="choose" disabled={true}>Select Length</option>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
              <option value="48">48 months</option>
            </Form.Control>
            <Form.Text className="text-muted">
              This will recalculate your totals.
            </Form.Text>
          </Col>       
        </Row>
      </Form>
     );
  }
}
 
export default ChangeTerms;