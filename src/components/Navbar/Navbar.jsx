import '../../styles/Navbar.css'
import { Link } from 'react-router-dom'




const Navbar = () => {
    return (
        <nav>
            <ul className='navigation'>
                <Link className='link' to='/'>Главная</Link>
                <Link className='link' to='/products'>Каталог</Link>
            </ul>
            <ul className='nav-contact'>
                <div>timasvx@gmail.com</div>
                <div>+7 777 777 77 77</div>
            </ul>
        </nav>
    )
}

export default Navbar