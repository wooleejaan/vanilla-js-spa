import { Component } from '../core/kernel'

export default class About extends Component {
  render(){
    const { a, b } = history.state

    this.el.innerHTML = /* html */`
      <h1>About Page입니다.</h1>
      <h2>${a}</h2>
      <h2>${b}</h2>
    `
  }
}