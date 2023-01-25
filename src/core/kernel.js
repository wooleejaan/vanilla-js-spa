/* ======================== Component ======================== */
export class Component {
  constructor(payload = {}){
    const { 
      tagName = 'div', 
      state = {},
      props = {}
    } = payload 
    this.el = document.createElement(tagName)
    this.state = state
    this.props = props
    this.render()
  }
  render(){
    // ...
  }
}

/* ======================== Router ======================== */
function routeRender(routes){

  if(!location.hash){
    history.replaceState(null, '', '/#/')
    // history.replaceState 메서드를 사용하면, 
    // history 내역에 기록을 남기지 않으면서 페이지 이동을 시켜준다. 
    // history.replaceState(상태정보, 제목, 해시정보)
    // 강제로 입력한 해시 정보에 맞는 페이지 이동을 시켜준다. 
  }

  const routerView = document.querySelector('router-view')

  // 해시 이후 모든 경로 정보를 가져오는데, 뒤에 queryString (?=) 부분은 필요없고, ? 앞 부분을 가지고 구분을 할 것이므로 
  // queryString의 경우 비어있을 수 있으므로 기본값으로 빈 문자열을 할당한다. 
  const [hash, queryString = ''] = location.hash.split('?')

  // queryString 형태 => a=123&b=456 ... 이런 식으로 key1=value1&key2=value2 ... 엠퍼센드(&)를 기준으로 나뉜다. 
  const query = queryString
                  .split('&')
                  .reduce((acc, cur) => {
                      // ['a=123', 'b=456'] 이런 식으로 배열이 된 상태에서 
                      // 처음 acc는 {} 이고 cur는 'a=123'으로 시작함 
                      const [key, value] = cur.split('=')
                      acc[key] = value
                      return acc
                    }, {})
  
  // 세번째 매개변수인 주소 부분은 생략할 수 있다.
  // replaceState나 pushState 메서드가 동작하면 => 첫번째 매개변수인 상태정보가 history 객체의 state 속성에 자동으로 채워진다. 
  history.replaceState(query, '') 


  // 위에서 획득한 hash 정보로 어떤 컴포넌트를 출력할 것인지 결정해야 한다. 
  // routes는 src/routes/index.js에서 만들어놓은 배열 데이터임. [{ path: ..., component: ... }, { path: ..., component: ... }]
  const currentRoute = routes.find(route => {
    // 정규표현식에서 ?는 "이거나", $는 앞에 오는 문자로 끝나야 한다는 의미
    // 슬래시(/)의 경우 리터럴로 만들수 없어서 생성자를 사용한다. 
    // route.path에 슬래시(/)가 붙을 수도 있고, 없고 + 그리고 이 형태로 문자가 끝나야 한다라는 의미의 $
    return new RegExp(`${route.path}/?$`).test(hash)
  })

  // 기존 내용 비워주고 컴포넌트를 삽입한다. 
  routerView.innerHTML = ''
  routerView.append(new currentRoute.component().el)

  // 여기까지 왔으면 페이지 이동은 끝났을 것이고, 페이지 이동이 끝나면 scrollTo(x, y)를 통해 스크롤 위치를 초기화시켜준다. 
  window.scrollTo(0, 0)
}

export function createRouter(routes){
  return function(){
    window.addEventListener('popstate', () => {
      routeRender(routes)
    })
    routeRender(routes) // popstate 이벤트는 처음에는 직접 동작하지 않으므로 이렇게 최초 호출을 임의로 해줘야 한다. 
  }
}

/* ======================== Store ======================== */
export class Store {
  constructor(state){
    this.state = {}
    this.observers = {} // this.observers는 결국 콜백함수들을 등록하는 객체 데이터이다. 

    for(const key in state){
      // 객체 데이터의 속성을 정의하는 메서드  
      // ==> 쓰는 이유 : 정의하고자 하는 데이터들에 새로운 값이 할당될 때마다 필요한 함수를 실행하기 위함임, 결과적으로 어떤 데이터를 감시할 때 사용하기 좋음.
      //   첫번째 매개변수 : 속성을 정의할 데이터
      //   두번째 매개변수 : 그 속성의 이름 
      //   세번쨰 매개변수 : 사용할 메서드
      Object.defineProperty(this.state, key, {
        get: () => { // { return ... }이면 ... 으로 생략 가능함. 
          return state[key]
        },
        set: (val) => {
          // console.log(val)
          state[key] = val
          // 아래에서 subsribe 메서드에서 등록한 콜백함수는 set 메서드가 동작하면 실행되도록 한다. 
          // this.observers[key]()

          // 이제 this.boservers[key]는 함수가 아니라 배열 데이터이므로 
          // val을 인수로 넣어서 필요한 경우 쓸 수 있도록까지 해준다. 
          this.observers[key].forEach(observer => observer(val))
        }
      })
    }
  }
  // 우리가 위에서 만든 this.state 객체 데이터를 구독한다는 의미 
  subscribe(key, cb){ // cb는 callback의 줄임말 
    // this.observers[key] = cb // 예를 들어 this.observers['message'] = () => {}

    // 예를 들어 { message: [cb1, cb2, cb3, ...] }
    Array.isArray(this.observers[key]) 
      ? this.observers[key].push(cb)
      : this.observers[key] = [cb]
  }
}