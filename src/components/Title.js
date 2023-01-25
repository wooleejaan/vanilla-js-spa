import { Component } from "../core/kernel"
import messageStore from '../store/message'

export default class Title extends Component {
  constructor(){
    super({
      tagName: 'h1'
    })
    messageStore.subscribe('message', (newVal) => {
      console.log(newVal)
      this.render()
    })
  }
  render(){
    this.el.textContent = `Title: ${messageStore.state.message }`
  }
}