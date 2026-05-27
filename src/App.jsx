import { useState, useEffect } from 'react'
import { useRef } from 'react'
import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom'
import Home from './components/Home/Home' 
import Products from './components/Products/Products'
import './App.css'
import Profile from './components/Profile/Profile'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ProductPage from './components/ProductPage/ProductPage'
import Favorites from './components/Favorites/Favorites'
import { Login } from './components/Login/Login'
import Registration from './components/Registration/Registration'


const MainLayout = () => {
    return (
  <div className='app-wrapper'>
    <Navbar />
    <Header />
    <main className='main-content'>
      <Outlet />
    </main>
    <Footer />
  </div>)
}


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<ProductPage />}/>
        <Route path='/profile' element={<Profile />} />
        <Route path='/favorites' element={<Favorites />}/>
      </Route>

      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<Registration />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
