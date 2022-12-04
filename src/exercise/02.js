// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

// Extra credit 3
function useSafeDispatch(dispatch) {
  const mountedRef = React.useRef(false)
  React.useLayoutEffect(() => {
    mountedRef.current = true
    console.log('Set mounted TRUE')
    return () => {
      mountedRef.current = false
      console.log('Set mounted FALSE')
    }
  }, [])
  
  const safeDispatch = React.useCallback((...args) => {
    console.log(`Mounted: `, mountedRef.current)
    if (mountedRef.current) {
      console.log(`Dispatch called with arguments: `, args)
      return dispatch(...args)
    }
  }, [dispatch])

  return safeDispatch
}

// Basic
// function useAsync(asyncCallback, initialState, dependencies) {
// Extra credit 1
// function useAsync(asyncCallback, initialState) {
// Extra credit 2
function useAsync(initialState) {
  // const [state, dispatch] = React.useReducer(asyncReducer, {
  //   state: 'idle',
  //   data: null,
  //   error: null,
  //   ...initialState,
  // })

  // Extra credit 3
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    state: 'idle',
    data: null,
    error: null,
    ...initialState,
  })
  const dispatch = useSafeDispatch(unsafeDispatch)
  
  // Basic and Extra credit 1
  // React.useEffect(() => {
    // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
    // const promise = asyncCallback()
    // if (!promise) {
    //   return
    // }
    // then you can dispatch and handle the promise etc...
    // const promise = asyncCallback()
    // if (!promise) {
    //   return
    // }
    // dispatch({type: 'pending'})
    // promise.then(
    //   data => {
    //     dispatch({type: 'resolved', data})
    //   },
    //   error => {
    //     dispatch({type: 'rejected', error})
    //   },
    // )
    // 🐨 you'll accept dependencies as an array and pass that here.
    // 🐨 because of limitations with ESLint, you'll need to ignore
    // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
  // Basic
  // }, dependencies)
  // Extra credit 1
  // }, [asyncCallback])

  // Extra credit 2
  const run = React.useCallback((promise) => {
    if (!promise) {
      return
    }
    dispatch({type: 'pending'})
    promise.then(
      data => {
        dispatch({type: 'resolved', data})
      },
      error => {
        dispatch({type: 'rejected', error})
      },
    )
  // }, [])
  // Extra credit 3
  }, [dispatch])

  return { ...state, run }
}

function PokemonInfo({pokemonName}) {
  // 🐨 move all the code between the lines into a new useAsync function.
  // 💰 look below to see how the useAsync hook is supposed to be called
  // 💰 If you want some help, here's the function signature (or delete this
  // comment really quick if you don't want the spoiler)!
  // function useAsync(asyncCallback, initialState, dependencies) {/* code in here */}

  // 🐨 here's how you'll use the new useAsync hook you're writing:
  // Basic
  // const state = useAsync(
  //   () => {
  //     if (!pokemonName) {
  //       return
  //     }
  //     return fetchPokemon(pokemonName)
  //   },
  //   {
  //     status: pokemonName ? 'pending' : 'idle',
  //   },
  //   [pokemonName],
  // )

  // Extra credit 1
  // const asyncCallback = React.useCallback(() => {
  //   if (!pokemonName) {
  //     return
  //   }
  //   return fetchPokemon(pokemonName)
  // }, [pokemonName])

  // const state = useAsync(asyncCallback, {
  //   status: pokemonName ? 'pending' : 'idle',
  // })

  // 🐨 this will change from "pokemon" to "data"
  // const {data: pokemon, status, error} = state

  // Extra credit 2
  // 💰 destructuring this here now because it just felt weird to call this
  // "state" still when it's also returning a function called "run" 🙃
  const {
    data: pokemon,
    status,
    error,
    run,
  } = useAsync({status: pokemonName ? 'pending' : 'idle'})
  
  // Extra credit 2
  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    // 💰 note the absence of `await` here. We're literally passing the promise
    // to `run` so `useAsync` can attach its own `.then` handler on it to keep
    // track of the state of the promise.
    const pokemonPromise = fetchPokemon(pokemonName)
    run(pokemonPromise)
  }, [pokemonName, run])

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
