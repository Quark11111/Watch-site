import { useState, useEffect } from 'react'
import '../../styles/ProductPage.css'
import { db } from '../../../firebase'
import {collection, doc, getDoc, getDocs} from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../auth'
import { addToFavorites, removeFromFavorites, checkIfFavorite, createOrder, getUserProfile } from '../../../authServices'
import Checkout from '../Checkout/Checkout'
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




const ProductPage = () => {
    const { id } = useParams();
    const {currentUser} = useAuth()
    const navigate = useNavigate()

    const [showCheckout, setShowCheckout] = useState(false)
    const [userProfile, setUserProfile] = useState(null)
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const checkStatus = async () => {
            if (currentUser && id) {
                const favExist = await checkIfFavorite(currentUser.uid, id);
                setIsFavorite(favExist);
            } else {
                setIsFavorite(false)
            }
        }
        checkStatus()
    }, [id, currentUser])

    const handleFavoriteClick = async () => {
        if (!currentUser) {
            alert('Чтобы добавлять товары в избранное, пожалуйста, войдите в аккаунт.')
            navigate('/login');
            return
        }

        try {
            if (isFavorite) {
                await removeFromFavorites(currentUser.uid, id)
                setIsFavorite(false)
            } else {
                await addToFavorites(currentUser.uid, id, product)
                setIsFavorite(true)
            }
        } catch (error) {
            console.error('Ошибка при работе с избранным', error)
        }
    }

    const handleOrderClick = async () => {
        if (!currentUser) {
            alert('Чтобы оформить заказ, пожалуйста, войдите в аккаунт')
            navigate('/login')
            return
        }
        const profile = await getUserProfile(currentUser.uid)
        setUserProfile(profile || {})
        setShowCheckout(true)
    }

    const handleConfirmOrder = async () => {
        try {
            const orderData = {
                productId: id,
                productName: product.name,
                productTitle: product.title,
                productImg: product.img,
                totalPrice: Number(product.price),
            }

            await createOrder(currentUser.uid, orderData);
            setShowCheckout(false)
            alert('Заказ успешно оформлен!')
            navigate('/profile')
        } catch (error) {
            console.error('Ошибка при оформлении заказа', error)
        }
    }


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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setProduct({id: docSnap.id, ...docSnap.data() })
                } else {
                    console.log('Товар не найден!')
                }
            } catch (error) {
                console.error('Ошибка при загрузке товаров: ', error)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchProduct()
        }
    }, [id])

    if (loading) {
        return <section><div className='loading'>Загрузка...</div></section>
    }

    if (!product) {
        return <section><div className='error'></div></section>
    }

    return (
        <section id='product-page'>

        <div className='product-page'>
            <AnimateDiv className='product-page-name'>
                <div>{product.name}  {product.collection}  {product.title}</div>
            </AnimateDiv>
            <div className='product-page-section'>
                <AnimateDiv className='product-page-img' delay={600}>
                    <img src={product.img} alt="" />
                </AnimateDiv>
                <AnimateDiv className='product-page-info' delay={1000}>
                    <div className='product-page-coll'>
                        <div className='name-element'>Коллекция</div>
                        <div className='element'>{product.collection}</div>
                    </div>
                    <div className='product-page-dia'>
                        <div className='name-element'>Диаметер</div>
                        <div className='element'>{product.diameter}</div>
                    </div>
                    <div className='product-page-mech'>
                        <div className='name-element'>Тип механизма</div>
                        <div className='element'>{product.mech}</div>
                    </div>
                    <div className='product-page-gen'>
                        <div className='name-element'>Пол</div>
                        <div className='element'>{product.gen}</div>
                    </div>
                    <div className='product-page-steel'>
                        <div className='name-element'>Материал корпуса</div>
                        <div className='element'>{product.steel}</div>
                    </div>
                    <div className='product-page-mat'>
                        <div className='name-element'>Материал ремешка</div>
                        <div className='element'>{product.material}</div>
                    </div>

                    <div className='price'>{Number(product.price).toLocaleString()} ₸</div>

                    <div className='product-page-button'>
                        <button className='button-sale' onClick={handleOrderClick} >Оформить заказ</button>
                        <button className={`button-bag ${isFavorite ? 'active': ''}`} onClick={handleFavoriteClick}><FontAwesomeIcon className='heart' icon={faHeart} /></button>
                    </div>
                </AnimateDiv>
            </div>
        </div>

        <div className='more-recommendation'>
                <AnimateDiv className='recommendation-name'>Также могут понравиться</AnimateDiv>
                    <AnimateDiv className='recommendation'>
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

        {showCheckout && userProfile && (
            <Checkout 
            product={product}
            userProfile={userProfile} onClose={() => setShowCheckout(false)}
            onConfirm={handleConfirmOrder} />
        )}
        </section>
    )
}

export default ProductPage