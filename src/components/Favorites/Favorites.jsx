import '../../styles/Favorites.css'
import React, { useState, useEffect } from 'react'
import { getDocs } from 'firebase/firestore'
import { useAuth } from '../../../auth'
import { useNavigate, Link } from 'react-router-dom'
import { getUserFavorites } from '../../../authServices'
import { db } from '../../../firebase'
import { collection } from 'firebase/firestore'
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


const Favorites = () => {
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    useEffect(() => {
        const loadFavs = async () => {
            if (currentUser) {
                try {
                    const favList = await getUserFavorites(currentUser.uid)
                    setFavorites(favList)
                } catch (error) {
                    console.error('Ошибка загрузка избранного')
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        loadFavs()
    }, [currentUser])


    useEffect(() => {
            const fetchProducts = async () => {
                const querySnapshot = await getDocs(collection(db, 'products'))
                const  Data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }))
    
                for (let i = Data.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [Data[i], Data[j]] = [Data[j], Data[i]]
                }
    
                const randomFive = Data.slice(0, 5)
    
                setProducts(randomFive);
            }
            fetchProducts();
        }, [])

    if (loading) return <div>Загрузка...</div>

    if (!currentUser) {
        return (
            <div className='fav-login'>
                <div className='fav-login-name'>Доступ ограничен</div>
                <div className='fav-login-title'>Войдите, чтобы увидеть список избранного</div>
                <button className='fav-login-button' onClick={() => navigate('/login')}>Войти</button>
            </div>
        )
    }


    return (
        <div id='favorites'>
            <AnimateDiv className='fav-name'>Избранные товары: {favorites.length}</AnimateDiv>
            <div>
            {favorites.length === 0 ? (
                <p className='fav-null'>Ваш список избранного пока пуст.</p>
            ) : (
                <AnimateDiv className='main-fav-products' delay={800}>
                <div className='fav-products'>
                    {favorites.map(product => (
                        <Link className='product-card-page' to={`/products/${product.id}`} key={product.id}>
                                <img className='product-img-page' src={product.img} alt="" />
                                <div className='product-name-page'>{product.name}</div>
                                <div className='product-title-page'>{product.title}</div>
                                <div className='product-price-page'>{Number(product.price).toLocaleString()} ₸</div>
                            </Link>
                    ))}
                </div>
                </AnimateDiv>
            )}
            </div>

            <div className='more-recommendation'>
                <AnimateDiv className='recommendation-name' delay={1300}>Также могут понравиться</AnimateDiv>
                    <AnimateDiv className='recommendation' delay={1500}>
                        {products.map(product => (
                            <Link className='product-card-page' to={`/products/${product.id}`} key={product.id}>
                                <img className='product-img-page' src={product.img} alt="" />
                                <div className='product-name-page'>{product.name}</div>
                                <div className='product-title-page'>{product.title}</div>
                                <div className='product-price-page'>{Number(product.price).toLocaleString()} ₸</div>
                            </Link>
                        ))}
                    </AnimateDiv>
            </div>
        </div>
    )
}

export default Favorites