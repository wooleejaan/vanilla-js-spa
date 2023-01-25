import { Component } from './core/kernel'
import TheHeader from './components/TheHeader'

export default class App extends Component {
  
  render(){
    const routerView = document.createElement('router-view') // router-view는 실제로 존재하는 요소가 아니라 커스텀 요소이다. 
    
    this.el.append(
      new TheHeader().el,
      routerView
    )
  }
}