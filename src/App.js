import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Form
 } from 'react-bootstrap'
import './App.css';
import Input from './components/inputNewLineItem/input';

class App extends Component {
  constructor() { //Constructor not needed anymore (automatically included in newer versions of Babel)
    super()
    // "seed" data initially
    this.state = {
      revenue: [
      {
        name: 'Item 1',
        oneTime: 100,
        monthly: 50
      },
      {
        name: 'Item 2',
        oneTime: 50,
        monthly: 25
      },
      {
        name: 'Item 3',
        oneTime: 25,
        monthly: 85
      }],
      expenses:[{
        name: 'Expense 1',
        oneTime: 500,
        monthly: 20.00
      },
      {
        name: 'Expense 2',
        oneTime: 200,
        monthly: 40
      }],
      oneTimeRevenue: 175,
      oneTimeExpense: 700,
      monthlyRevenue: 160,
      monthlyExpense: 60,
      formInfo: 
        {
          newType: '',
          newName: '',
          newOneTime: '',
          newMonthly: '',
          error: false
        }
    };

    //NOTE: If arrow functions are used, binding isn't necessary anymore
    // this.handleDelete = this.handleDelete.bind(this)
    // this.handleAdd = this.handleAdd.bind(this)

    // // controlled form elements functions
    // this.handleTypeChange = this.handleTypeChange.bind(this)
    // this.handleNameChange = this.handleNameChange.bind(this)
    // this.handleOneTimeChange = this.handleOneTimeChange.bind(this)
    // this.handleMonthlyChange = this.handleMonthlyChange.bind(this)
  }

  // Delete expense or revenue from list
  handleDelete = (type, index) => {
    // listType will be 'expenses' or 'revenue' depending on item to delete
    let listType = this.state[type]
    // recalculate and set totals in state
    if (type === 'expenses') {
      this.setState({
        oneTimeExpense: this.state.oneTimeExpense - this.state.expenses[index]['oneTime'],
        monthlyExpense: this.state.monthlyExpense - this.state.expenses[index]['monthly'],
      })
    } else {
      // for revenue
      this.setState({
        oneTimeRevenue: this.state.oneTimeRevenue - this.state.revenue[index]['oneTime'],
        monthlyRevenue: this.state.monthlyRevenue - this.state.revenue[index]['monthly'],
      })
    }
    // remove list item from state array
    this.setState({
      [listType]: listType.splice(index, 1),
    })
  }

  //NOTE: Modified change event to encompass all changes in form
  // controlled form elements, watch for changes
  handleChange = (e) => {
    console.log(e.target);
    const formInfo = {...this.state.formInfo};
    isNaN(e.target.value) ? formInfo[e.target.name] = e.target.value : formInfo[e.target.name] = Number(e.target.value) ;
    this.setState({
      formInfo
    });
  };

  // add new expense or revenue
  handleAdd = (e) => {
    e.preventDefault()
    // handle form errors, allows one-time and revenue amounts to be 0
    if (!this.state.formInfo.newType || !this.state.formInfo.newName || (!this.state.formInfo.newOneTime && this.state.formInfo.newOneTime !== 0) || (!this.state.formInfo.newMonthly && this.state.formInfo.newMonthly !== 0)) {
      this.setState({
        error: true
      })
    }
    // if there are no form errors, add accordingly
    else {
      // typeOfAmount will be either 'expenses' or 'revenue'
      let typeOfAmount = this.state.formInfo.newType
      let monthly = typeOfAmount === 'expenses' ? 'monthlyExpense' : 'monthlyRevenue'
      let oneTime = typeOfAmount === 'expenses' ? 'oneTimeExpense' : 'oneTimeRevenue'
      // grab state array of revenues or expenses
      let items = this.state[typeOfAmount]
      items.push({
        name: this.state.formInfo.newName,
        oneTime:this.state.formInfo.newOneTime,
        monthly: this.state.formInfo.newMonthly
      })
      // set state with new totals and items array, clear errors displaying and form contents
      this.setState({
        error: false,
        [typeOfAmount]: items,
        [monthly]: this.state[monthly] + this.state.formInfo.newMonthly,
        [oneTime]: this.state[oneTime] + this.state.formInfo.newOneTime,
        //  Clear values in form
        newName: '',
        newMonthly: '',
        newOneTime: '',
        newType: ''
      })
    }
  }

  render() {
    // create table rows from revenue state list
    let revenueTableData = this.state.revenue.map((item, index) => {
      return (
        <tr key={"revenue" + index}>
          <td>{item.name}</td>
          <td>${item.oneTime.toFixed(2)}</td>
          <td>${item.monthly.toFixed(2)}</td>
          <td><Button onClick={() => this.handleDelete('revenue', index)}>Delete</Button></td>
        </tr>
      )
    })
    // create table rows from expenses state list
    let expensesTableData = this.state.expenses.map((expense, index) => {
      return (
        <tr key={"expense" + index}>
          <td>{expense.name}</td>
          <td>${expense.oneTime.toFixed(2)}</td>
          <td>${expense.monthly.toFixed(2)}</td>
          <td><Button onClick={() => this.handleDelete('expenses', index)}>Delete</Button></td>
        </tr>
      )
    })

    // Calculations for totals
    let totalRevenue = this.state.oneTimeRevenue + (this.state.monthlyRevenue * 12)
    let totalExpense = this.state.oneTimeExpense + (this.state.monthlyExpense * 12)
    let monthlyContributionProfit = this.state.monthlyRevenue - this.state.monthlyExpense
    let totalContributionProfit = totalRevenue - totalExpense
    // handle case where totalRevenue is 0 (to avoid -Infinity and NaN)
    let contributionMargin = totalRevenue !== 0 ? (totalContributionProfit / totalRevenue * 100).toFixed(0) : 0
    // handle case where totalExpense and totalRevenue are 0 (to avoid NaN)
    let capitalROI = (totalExpense === 0 && totalRevenue === 0) ? 0 : ((this.state.oneTimeExpense - this.state.oneTimeRevenue) / monthlyContributionProfit).toFixed(1)

    return (
      <div>
        <h1 className="text-center">ROI Calculator</h1>
        <Input 
          handleChange = {this.handleChange}
          formInfo = {this.state.formInfo}
          handleTypeChange = {this.handleTypeChange} 
          handleNameChange = {this.handleNameChange}
          handleMonthlyChange = {this.handleMonthlyChange}
          handleOneTimeChange = {this.handleOneTimeChange}
          onAdd = {this.handleAdd} 
          newType = {this.state.newType} 
          newName = {this.state.newName}
          newOneTime = {this.state.newOneTime}
          newMonthly = {this.state.newMonthly}
          revenue = {this.state.revenue} 
          expenses = {this.state.expenses} 
          oneTimeRevenue = {this.state.oneTimeRevenue} 
          oneTimeExpense = {this.state.monthlyExpense}
        />
        {/* Add new expense or revenue form */}
        {/* <Form className="addExpenseOrRevenueForm" onSubmit={this.handleAdd}>
          <Row className="input-field">
            <Col sm={{ span: 2, offset: 1}} className="input-field">
              <Form.Control
                as="select"
                onChange = {this.handleTypeChange}
                value={this.state.newType ? this.state.newType : 'choose'}
                >
                <option value="choose" disabled={true}>Select Type</option>
                <option value="revenue">Revenue</option>
                <option value="expenses">Expense</option>
              </Form.Control>
            </Col>
            <Col sm={3} className="input-field">
              <Form.Control
                type="text"
                placeholder="Name"
                onChange = {this.handleNameChange}
                value={this.state.newName ? this.state.newName : ''}
              />
            </Col>
            <Col sm={2} className="input-field">
              <Form.Control
                type="number"
                placeholder="One-Time Amount"
                onChange = {this.handleOneTimeChange}
                step="0.01"
                min="0"
                value={(this.state.newOneTime || this.state.newOneTime === 0) ? this.state.newOneTime : ''}
              />
            </Col>
            <Col sm={2} className="input-field">
              <Form.Control
                type="number"
                placeholder="Monthly Amount"
                onChange = {this.handleMonthlyChange}
                step="0.01"
                min="0"
                value={(this.state.newMonthly || this.state.newMonthly === 0) ? this.state.newMonthly : ''}
              />
            </Col>
            <Col sm={1} className="add-form-button">
              <Button type="submit">
                Add
              </Button>
            </Col>
          </Row>
        </Form> */}
        
        {/* form errors */}
        {/* { this.state.error &&
          <h4 className="error text-center">Please fill out all fields</h4>
        } */}
        <div className="roi-tables">
          {/* Revenue Table */}
          <table className="revenue-table">
            <thead>
              <tr>
                <th>Revenue</th>
              </tr>
              <tr>
                <th></th>
                <th>One-Time</th>
                <th>Monthly</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {revenueTableData}
            </tbody>
          </table>
          {/* Expenses Table */}
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Expenses</th>
              </tr>
              <tr>
                <th></th>
                <th>One-Time</th>
                <th>Monthly</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expensesTableData}
            </tbody>
          </table>
          {/* Totals Table */}
          <table className="totals-table">
            <thead>
              <tr>
                <th></th>
                <th>One-Time</th>
                <th>Monthly</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Revenue</td>
                <td>${(this.state.oneTimeRevenue).toFixed(2)}</td>
                <td>${(this.state.monthlyRevenue).toFixed(2)}</td>
                <td>${totalRevenue.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Expenses</td>
                <td>${(this.state.oneTimeExpense).toFixed(2)}</td>
                <td>${(this.state.monthlyExpense).toFixed(2)}</td>
                <td>${totalExpense.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Contribution Profit</td>
                <td></td>
                <td>${ monthlyContributionProfit.toFixed(2)}</td>
                <td>${ totalContributionProfit.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Contribution Margin</td>
                <td></td>
                <td></td>
                <td>{contributionMargin}%</td>
              </tr>
              <tr>
                <td>Capital ROI (monthly)</td>
                <td></td>
                <td></td>
                <td>{capitalROI}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
