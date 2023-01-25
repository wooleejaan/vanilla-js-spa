import { Component } from '../core/kernel'

export default class TheHeader extends Component {
  constructor(){
    super({
      tagName: 'header',
    })
  }

  render(){
    this.el.innerHTML = /* html */`
      <a href="#/">Main</a>
      <a href="#/about">About</a>
    `
  }
}