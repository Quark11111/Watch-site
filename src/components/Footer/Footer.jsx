import { Link } from 'react-router-dom'
import '../../styles/Footer.css'

const Footer = () => {
    return (
        <footer>
        <div className='line-footer'></div>
        <div className='footer'>
            <div className='footer-info-company'>
                <div className='name'>APEX TIME</div>
                <div className='info'>Время - самая дорогая роскошь.<br />Мы даем ей форму</div>
            </div>

            <div className='footer-social'>
                <div className='name'>Соц сети</div>
                <ul className='list-social'>
                <Link className='link-soc'>Instagram</Link>
                <Link className='link-soc'>Telegram</Link>
                <Link className='link-soc'>What'sup</Link>
                <Link className='link-soc'>Email</Link>
                </ul>
            </div>

            <div className='footer-nav'>
                <div className='name'>Навигация</div>
                <ul className='list-nav'>
                    <Link className='link-nav'>Все</Link>
                    <Link className='link-nav'>Мужские</Link>
                    <Link className='link-nav'>Женские</Link>
                </ul>
            </div>

            <div className='footer-number'>
                <div className='name'>Номер/Email</div>
                <ul className='list-numeml'>
                    <Link className='link-num'>+7 777 777 77 77</Link>
                    <Link className='link-eml'>timasvx@gmail.com</Link>
                </ul>
            </div>
        </div>
        </footer>
    )
}

export default Footer