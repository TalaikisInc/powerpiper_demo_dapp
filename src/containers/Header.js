import React from 'react'
import { Link } from 'react-router-dom'

const Header = (props) => (
  <ul className="nav nav-tabs">
    <li className="nav-item">
      <Link href='/app' to='/app' className="nav-link active">
        Home
      </Link>
    </li>
    <li className="nav-item">
      <Link href='/market-info' to='/market-info' className="nav-link active">
        Market Info
      </Link>
      </li>
    <li className="nav-item">
      <Link href='/ico' to='/ico' className="nav-link active">
        Buy Tokens
      </Link>
      </li>
    <li className="nav-item">
      <Link href='/exchange' to='/exchange' className="nav-link active">
        Exchange
      </Link>
    </li>
    <li className="nav-item">
      <Link href='/transfer' to='/transfer' className="nav-link active">
        Send
      </Link>
    </li>
  </ul>
)

export default Header
