import '../../styles/Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import { collection, getDocs } from 'firebase/firestore'
import SearchBar from  '../SearchBar/SearchBar'


const Header = () =>  {

    return (
        <header>
        <div className='main-header'>
            <div className='logo'>
                APEX TIME
            </div>
            <div className='search-bag-profile'>
            <SearchBar />
            <ul className='bag-profile'>
                <Link className='bag-button' to='/favorites'><FontAwesomeIcon icon={faCartShopping}/></Link>
                <Link className='profile-button' to='/profile'><FontAwesomeIcon icon={faCircleUser}/></Link>
            </ul>
            </div>
        </div>
        </header>
    )
}

export default Header