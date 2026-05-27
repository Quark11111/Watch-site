import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from '../../../firebase'
import { collection, getDocs } from "firebase/firestore";
import '../../styles/SearchBar.css'


const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const searchRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)


        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([])
            setIsOpen(false)
            return
        }

        const searchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, 'products'))

            const products = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            const filtered = products.filter(product => 
                product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                product.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                product.collection?.toLowerCase().includes(searchTerm.toLowerCase()) 
            )
            setSearchResults(filtered.slice(0, 5))

            setIsOpen(true)
        }

        const timer = setTimeout(() => {
            searchProducts()
        }, 100)

        return () => clearTimeout(timer)
    }, [searchTerm])


    const clearSearch = () => {
        setSearchTerm('')
        setSearchResults([])
        setIsOpen(false)
    }



    return (
        <div className="search-and-buttons">
         <div className="searсh-container" ref={searchRef}>
            <div className="search-input-wreapper">
                <input type="text" className="search-input" placeholder="Поиск вашего счастья" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {searchTerm && (
                    <button className="search-clear" onClick={clearSearch}>
                        X
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="search-dropdown">
                    {searchResults.length === 0 ? (
                        <div className="search-no-results">
                            Ничего не найдено для "{searchTerm}"     
                        </div>
                    ) : (
                        <div className="products-from-results">
                            {searchResults.map(product => (
                                <Link to={`/products/${product.id}`} key={product.id} className="search-results-item" onClick={() => setIsOpen(false)}>
                                    <img src={product.img} alt={product.name} className="search-result-img"/>
                                    <div className="search-result-info">
                                        <div className="search-result-name">{product.name}</div>
                                        <div className="search-result-price"> 
                                            {Number(product.price).toLocaleString()} ₸
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
         </div>
        </div>
    )
}

export default SearchBar