// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// Basic
// function countReducer(prevState, action) {
//   return action
// }

// Extra credit 1
// function countReducer(prevCount, step) {
//   return prevCount + step
// }

// Extra credit 2
// function countReducer(prevState, newState) {
//   return { ...prevState, ...newState }
// }

// Extra credit 3
// function countReducer(prevState, newState) {
//   return {
//     ...prevState,
//     ...(typeof newState === 'function' ? newState(prevState) : newState),
//   }
// }

// Extra credit 4
function countReducer(prevState, action) {
  const { count } = prevState
  const { type, step } = action
  switch(type) {
    case 'INCREMENT': {
      return { count: count + step }
    }
    default: {
      throw new Error(`Unsupported action type: ${type}`)
    }
  }
}

function Counter({initialCount = 0, step = 1}) {
  // Basic
  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  // const [count, setCount] = React.useReducer(countReducer, initialCount)
  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "newState" - the value passed to setCount
  // const increment = () => setCount(count + step)

  // Extra credit 1
  // const [count, changeCount] = React.useReducer(countReducer, initialCount)
  // const increment = () => changeCount(step)

  // Extra credit 2
  // const [state, setState] = React.useReducer(countReducer, {
  //   count: initialCount,
  // })
  // const {count} = state
  // const increment = () => setState({count: count + step})

  // Extra credit 3
  // const [state, setState] = React.useReducer(countReducer, {
  //   count: initialCount,
  // })
  // const {count} = state
  // const increment = () =>
  //   setState(currentState => ({count: currentState.count + step}))

  // Extra credit 4
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state
  const increment = () => dispatch({type: 'INCREMENT', step})

  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
