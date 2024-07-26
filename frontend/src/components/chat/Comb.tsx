import React, { useContext } from 'react'
import Sidenav from '../nav/sidenav/Sidenav'
import Chat from './Chat'
import './chat.css'
import Nav from '../nav/Nav'
import { GlobalContext } from '../../App'
import Login from '../login/Login'

const Comb = () => {
  const global = useContext(GlobalContext)
  const loggedIn = global.loggedIn
  return (
    <>
    <Nav />
    {loggedIn && (
      <div className='combo-1'>
          <Sidenav />
          <Chat />
        </div>
      )}
      <Login/>
    </>

  )
}

export default Comb
