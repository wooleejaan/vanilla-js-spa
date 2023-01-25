import { Component } from '../core/kernel'
import messageStore from '../store/message'

export default class Message extends Component {
  constructor(){
    super()
    // 여기 Message 컴포넌트에서 messageStore의 message 속성을 구독하겠다는 의미 
    messageStore.subscribe('message', () => {
      // message 라는 key 값을 보면서 값이 변경되면 render()를 실행해서 아래 render()에서 변경된 값이 반영될 수 있게 함. 
      this.render()
    })
  }
  render(){
    this.el.innerHTML = /* html */`
      <h2>${messageStore.state.message}</h2>
    `
  }
}