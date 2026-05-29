import '../../styles/Navbar.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'




const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav id='navigation'>
            <button className={`burger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>  
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div className={`header-nav ${isOpen ? 'open': ''}`}>
                <ul className='navigation'>
                    <Link className='link' to='/' onClick={() => setIsOpen(false)}>Главная</Link>
                    <Link className='link' to='/products' onClick={() => setIsOpen(false)}>Каталог</Link>
                </ul>
                <ul className='nav-contact'>
                    <div>timasvx@gmail.com</div>
                    <div>+7 777 777 77 77</div>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar