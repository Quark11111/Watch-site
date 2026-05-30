import '../../styles/Products.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../../firebase'
import { collection, getDocs, query } from 'firebase/firestore'
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


const Products = () => {
    const [products, setProducts] = useState([])
    const [brands, setBrands] = useState([])
    const [selectedBrands, setSelectedBrands] = useState([])
    const [selectedMech, setSelectedMech] = useState([])
    const [selectedGen, setSelectedGen] = useState([])
    const [selectedDiameter, setSelectedDiameter] = useState([])
    const [selectedMaterial, setSelectedMaterial] = useState([])

    const [isOpen, setIsOpen] = useState(false)

    const [filteredProducts, setFilteredProducts] = useState([])
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')

    const brandsList = ['Tissot', 'Certina', 'Hamilton', 'TAG Heuer']
    const mechList = ['Автоматические', 'Кварцевые']
    const genList = ['Мужские', 'Женские']
    const diameterList = ['19х27 мм', '20 мм', '25 мм', '30 мм', '31 мм', '40 мм', '41 мм', '42 мм', '43 мм', '45 мм', '46 мм']
    const materialList = ['Каучук', 'Сталь', 'Кожа', 'Текстиль']


    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, 'products'))
            const product = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }))
            setProducts(product);
            setFilteredProducts(product)
        }
        fetchProducts();
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
        if (products.length === 0) return

        let filtered = [...products]

        if (minPrice !== '') {
            filtered = filtered.filter(product => product.price >= Number(minPrice))
        }

        if (maxPrice !== '') {
            filtered = filtered.filter(product => product.price <= Number(maxPrice))
        }

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(product => selectedBrands.includes(product.brand))
        }

        if (selectedMech.length > 0) {
            filtered = filtered.filter(product => selectedMech.includes(product.mech))
        }

        if (selectedGen.length > 0) {
            filtered = filtered.filter(product => selectedGen.includes(product.gen))
        }

        if (selectedDiameter.length > 0) {
            filtered = filtered.filter(product => selectedDiameter.includes(product.diameter))
        }

        if (selectedMaterial.length > 0) {
            filtered = filtered.filter(product => selectedMaterial.includes(product.material))
        }

        setFilteredProducts(filtered)
    }, [minPrice, maxPrice, products, selectedBrands, selectedMech, selectedGen, selectedDiameter, selectedMaterial])
    
    const handleMinPriceChange = (e) => {
        const value = e.target.value
        if (value === '' || Number(value) >= 0) {
            setMinPrice(value)
        }
    }
    
    const handleMaxPriceChange = (e) => {
        const value = e.target.value
        if (value === '' || Number(value) >= 0) {
            setMaxPrice(value)
        }
    }

    const handleBrandChange = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand))
        } else {
            setSelectedBrands([...selectedBrands, brand])
        }
    }

    const handleMechChange = (product) => {
        if (selectedMech.includes(product)) {
            setSelectedMech(selectedMech.filter(p => p !== product ))
        } else {
            setSelectedMech([...selectedMech, product])
        }
    }
    
    const handleGenChange = (product) => {
        if (selectedGen.includes(product)) {
            setSelectedGen(selectedGen.filter(p => p !== product ))
        } else {
            setSelectedGen([...selectedGen, product])
        }
    }

    const handleDiameterChange = (product) => {
        if (selectedDiameter.includes(product)) {
            setSelectedDiameter(selectedDiameter.filter(p => p !== product))
        } else {
            setSelectedDiameter([...selectedDiameter, product])
        }
    }

    const handleMaterialChange = (product) => {
        if (selectedMaterial.includes(product)) {
            setSelectedMaterial(selectedMaterial.filter(p => p !== product))
        } else {
            setSelectedMaterial([...selectedMaterial, product])
        }
    } 
    
        return (
        <section id='catalog'>
            <AnimateDiv className='catalog-name'>Каталог</AnimateDiv>
                <section className='catalog'>
                    <button className={`filter-button ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}><span>Фильтры</span></button>
                    {isOpen && (
                        <div className='filter-overlay' onClick={() => setIsOpen(false)}></div>
                    )}
                    <div className={`aside-catalog-filter ${isOpen ? 'open' : ''}`} delay={600}>
                        <div className='filter'>Фильтры</div>


                        <div className='filter-price'>
                                <div className='min-price'>
                                    <input type="number" value={minPrice} onChange={handleMinPriceChange} min="0" />
                                    <p>МИН. ЦЕНА</p>
                                </div>
                                <div className='max-price'>
                                    <input type="number" value={maxPrice} onChange={handleMaxPriceChange} min="0" />
                                    <p>МАКС. ЦЕНА</p>
                                </div>
                        </div>


                        <div className='filter-brands'> 
                            <div className='filter-brand-name'>Бренды</div>
                            {brandsList.map(brand => (
                                <label key={brand}>
                                    <input className='brand-checkbox' type="checkbox" onChange={() => handleBrandChange(brand)} checked={selectedBrands.includes(brand)}/>
                                    <span className='brand-name'>{brand}</span>
                                </label>
                            ))}
                        </div>


                        <div className='filter-mech'>
                            <div className='filter-mech-name'>Тип механизма</div>
                            {mechList.map(mech => (
                                <label key={mech}>
                                    <input type="checkbox" onChange={() => handleMechChange(mech)} checked={selectedMech.includes(mech)}/>
                                    <span>{mech}</span>
                                </label>
                            ))}
                        </div>


                        <div className='filter-gen'>
                            <div className='filter-gen-name'>Пол</div>
                            {genList.map(gen => (
                                <label key={gen}>
                                    <input type="checkbox" onChange={() => handleGenChange(gen)} checked={selectedGen.includes(gen)}/>
                                    <span>{gen}</span>
                                </label>
                            ))}

                        </div>
                        <div className='filter-diameter'>
                            <div className='filter-diameter-name'>Диаметер</div>
                            {diameterList.map(diameter => (
                                <label key={diameter}>
                                    <input type="checkbox" onChange={() => handleDiameterChange(diameter)} checked={selectedDiameter.includes(diameter)} />
                                    <span>{diameter}</span>
                                </label>
                            ))}
                        </div>
                        <div className='filter-material'>
                            <div className='filter-material-name'>Материал ремешка</div>
                            {materialList.map(material => (
                                <label key={material}>
                                    <input type="checkbox" onChange={() => handleMaterialChange(material)} checked={selectedMaterial.includes(material)} />
                                    <span>{material}</span>
                                </label>
                            ))}
                        </div>

                    </div>
                    <AnimateDiv className='products' delay={1200}>
                        {filteredProducts.map((product) => (
                            <Link className='product-card' to={`/products/${product.id}`} key={product.id}>
                                <img className='product-img' src={product.img} alt="" />
                                <div className='product-name'>{product.name}</div>
                                <div className='product-title'>{product.title}</div>
                                <div className='product-price'>{product.price.toLocaleString()} ₸</div>
                            </Link>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div>Товар не найден</div>
                        )}

                    </AnimateDiv>
                </section>
        </section>
    )
}

export default Products