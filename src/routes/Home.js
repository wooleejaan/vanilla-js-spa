import { Component } from '../core/kernel'
import TextField from '../components/TextField'
import Message from '../components/Message'
import Title from '../components/Title'

export default class Home extends Component {
  render(){
    this.el.innerHTML = /* html */`
      <h1>Home Page입니다.</h1>
    `

    this.el.append(
      new TextField().el,
      new Message().el,
      new Title().el
    )
  }
}