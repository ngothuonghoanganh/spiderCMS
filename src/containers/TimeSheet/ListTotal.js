import React, { Component } from 'react';

class ListTotal extends Component {
  render() {
    const { list, index } = this.props;
    console.log(list);
    return (
      <tr>
        <td> {index + 1}</td>
        <td> {list.profileId}</td>
        <td> {list.month}</td>
        <td> {list.year}</td>
        <td> {list.totalWorkingHours}</td>
        <td> {list.totalOverTimeHours}</td>
        <td> {list.totalHours}</td>
        <td> {list.workDay}</td>
        <td> {list.dayMustWork}</td>
      </tr>
    );
  }
}

export default ListTotal;
