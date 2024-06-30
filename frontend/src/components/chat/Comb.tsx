import React from 'react'
import Sidenav from '../nav/sidenav/Sidenav'
import Chat from './Chat'
import './chat.css'
import Nav from '../nav/Nav'

const Comb = () => {
  return (
    <>
      <Nav />
      <div className='combo-1'>
        <Sidenav />
        <Chat />
      </div>
    </>

  )
}

export default Comb
