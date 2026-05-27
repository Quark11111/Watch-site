import '../../styles/Home.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import { collection, getDocs, query } from 'firebase/firestore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWheatAwn } from '@fortawesome/free-solid-svg-icons'
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


const Home = () => {
    const [mains, setMains] = useState([])
    const [products, setProducts] = useState([])
    const [brands, setBrands] = useState([])


    

    useEffect(() => {
        const fetchMains = async () => {
            const querySnapshot = await getDocs(collection(db, 'main'))
            const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }))
            setMains(data);
        }
        fetchMains();
    }, [])

    useEffect(() => {
        const fetchBrands = async () => {
            const querySnapshot = await getDocs(collection(db, 'brands'))
            const brand = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }))
            setBrands(brand);
        }
        fetchBrands();
    }, [])

    
    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, 'products'))
            const  allData = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }))

            for (let i = allData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allData[i], allData[j]] = [allData[j], allData[i]]
            }

            const randomEight = allData.slice(0, 10)

            setProducts(randomEight);
        }
        fetchProducts();
    }, [])


    return (
        <main id='main'>
        <div className='main'>
            {mains.map(item => (
            <AnimateDiv className='main-news' key={item.id}>
                <AnimateDiv className='news-1' delay={400}>{item.title}</AnimateDiv>
                <AnimateLink className='catalog-button' to='/products' delay={600}>Каталог</AnimateLink>
                <div className='dark'></div>
                <img src={item.img} alt="" />
            </AnimateDiv>
            ))}
        </div>
        <AnimateDiv className='name-rec' delay={1000}>Рекомендаций</AnimateDiv>
        <AnimateDiv className='recommendation'>
            {products.map(product => (
                <AnimateLink to={`/products/${product.id}`} className='product-link' key={product.id}>
                <AnimateDiv className='watch-products'>
                    <div className='products-img'><img src={product.img} alt={product.title} /></div>
                    <div className='products-name'>{product.name}</div>
                    <div className='products-title'>{product.title}</div>
                    <div className='products-price'>{Number(product.price).toLocaleString()} ₸</div>
                </AnimateDiv>
                </AnimateLink>
            ))}
        </AnimateDiv>
        <div className='wheat'><FontAwesomeIcon icon={faWheatAwn} className='whean1' /><div className='line1'></div><FontAwesomeIcon className='whean2' icon={faWheatAwn}/></div>
        <div className='wheat'><FontAwesomeIcon icon={faWheatAwn} className='whean4' /><div className='line'></div><FontAwesomeIcon className='whean3' icon={faWheatAwn}/></div>
        <div className='about-home'>
            <AnimateDiv className='name-about' delay={800}>О нас</AnimateDiv>
            <AnimateDiv className='about-info' delay={900}>
                    Apex Time — казахстанская компания, специализирующаяся на продаже оригинальных швейцарских часов премиального и средне-премиального сегментов.
                        Мы работаем напрямую с официальными дистрибьюторами, поэтому гарантируем 100% подлинность каждого экземпляра.
                        Мы собрали для вас четыре легендарных бренда — Hamilton, Tissot, Tag Heuer и Certina.
                        Каждый из них прошёл проверку десятилетиями, каждой маркой гордятся миллионы владельцев по всему миру
            </AnimateDiv>
        </div>
        <div className='wheat'><FontAwesomeIcon icon={faWheatAwn} className='whean1' /><div className='line1'></div><FontAwesomeIcon className='whean2' icon={faWheatAwn}/></div>
        <div className='wheat'><FontAwesomeIcon icon={faWheatAwn} className='whean4' /><div className='line'></div><FontAwesomeIcon className='whean3' icon={faWheatAwn}/></div>
        
        <AnimateDiv className='section-brand'>Наши бренды</AnimateDiv>
        <AnimateDiv className='brands'>
            {brands.map(brand => (
                <div className='brands-info' key={brand.id}>
                    <div className='brands-name'>{brand.name}</div>
                    <div className='brands-title'>{brand.title}</div>
                </div>
            ))}
        </AnimateDiv>
            

        </main>
    )
}

export default Home