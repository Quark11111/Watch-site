import '../../styles/Profile.css'
import { useAuth } from '../../../auth'
import { useNavigate } from 'react-router-dom'
import { saveUserProfile, getUserProfile, logoutUser, getUserOrders } from '../../../authServices'
import { useEffect, useState } from 'react'
import useScrollAnimation from '../../../useScrollAnimation'


const AnimateDiv = ({ children, className, delay = 0, ...props}) => {
        const ref = useScrollAnimation(delay)
        return(
            <div ref={ref} className={`animate ${className || ''}`} {...props}>
                {children}
            </div>
        )
    }

const AnimateLink = ({ children, className, delay = 0, ...props}) => {
        const ref = useScrollAnimation(delay)
        return(
            <Link ref={ref} className={`animate ${className || ''}`} {...props}>
                {children}
            </Link>
        )
    }

const Profile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();


    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [loadingData, setLoadingData] = useState(true)

    const [orders, setOrders] = useState([])

    useEffect(() => {
        const loadProfileAndOrders = async () => {
            if (currentUser) {
                try {
                    const data = await getUserProfile(currentUser.uid)
                    if (data) {
                        setFirstName(data.firstName || '')
                        setLastName(data.lastName || '')
                        setPhone(data.phone || '')
                        setAddress(data.address || '')
                    }

                    const orderList = await getUserOrders(currentUser.uid)
                    setOrders(orderList);
                } catch (error) {
                    console.error('Ошибка загрузки профиля:', error)
                } finally {
                    setLoadingData(false);
                }
            }
        }
        loadProfileAndOrders()
    }, [currentUser])


    const handleLogout = async () => {
        try {
            await logoutUser();
            alert('Вы вышли из аккаунта');
            navigate('/')
        } catch (error) {
            alert('Ошибка при выходе')
        }
    }


    if (!currentUser) {
        return (
            <div className='login-register'>
                <div className='voit'>Войдите в аккаунт</div>
                <div className='button-list'>
                    <div className='login-profile'><button onClick={() => navigate('/login')}>Войти</button></div>
                    <div className='register-profile' ><button onClick={() => navigate('/register')}>Зарегистрироваться</button></div>
                </div>
            </div>
        )
    }

    if (loadingData) {
        return <div>Загрузка данных профиля...</div>
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await saveUserProfile(currentUser.uid, {
                firstName, 
                lastName,
                phone, 
                address, 
                email: currentUser.email
            });
            alert('Изменения успешно сохраненно')
        } catch (error) {
            alert('Ошибка сохраниение')
        }
    }


    if (!currentUser) return <div>Доступ ограничен</div>
    if (loadingData) return <div>Загрузка...</div>

    return (
        <section id='profile'>
            <AnimateDiv className='profile-name'>Профиль</AnimateDiv>
            <div className='info-order'>
            <AnimateDiv className='profile-info' delay={600}>
                <div className='profile-email'>
                    {currentUser.email}
                </div>                
                <form className='information-label' onSubmit={handleSave}>
                    <div className='name-label'>
                        <label>Имя: </label>
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder='Введите имя' />
                    </div>
                    <div className='last-label'>
                        <label>Фамилия: </label>
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder='Введите фимилию'/>
                    </div>
                    <div className='phone-label'>
                        <label>Номер телефона: </label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder='+7 (7ХХ) ХХХ ХХ ХХ' />
                    </div>
                    <div className='adrress-label'>
                        <label>Адрес доставки</label>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder='Город, улица, дом, квартира' />
                    </div>

                    <div className='info-btn'>
                    <button type='submit' >
                        Сохранить изменения
                    </button>
                    </div>
                </form>
                <div className='logout-btn'><button onClick={handleLogout}>Выйти</button></div>
                
            </AnimateDiv>
            <AnimateDiv className='my-orders' delay={1000}>
                <div className='my-orders-name'>Мои заказы</div>

                {orders.length === 0 ? (
                    <div></div>
                ) : (
                    <AnimateDiv className='order'>
                        {orders.map(order => (
                            <div className='order-card'>
                                {order.productImg && (
                                    <img src={order.productImg} alt="" />
                                )}


                                <div className='order-info'>
                                    <div className='order-trackcode-status'>
                                        <div className='track-code'>Заказ #{order.id.slice(0, 6).toUpperCase()}</div>
                                        <div className='status'>{order.status || 'В обработке'}</div>
                                    </div>

                                    <div className='order-name'>
                                        {order.productName} <span>{order.productTitle}</span>
                                    </div>

                                    <div className='order-price'>
                                        Cумма: {Number(order.totalPrice).toLocaleString()} ₸
                                    </div>
                                </div>
                            </div>

                        ))}
                    </AnimateDiv>
                )}
            </AnimateDiv>
            </div>
        </section>
    )
}

export default Profile  