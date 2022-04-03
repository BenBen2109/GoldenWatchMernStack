import React, {useContext, useState} from 'react'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Products from './products/Products'
import Login from './auth/Login'
import Register from './auth/Register'
import Cart from './cart/Cart'
import NotFound from './utils/not_found/NotFound'
import DetailProduct from './detailProduct/DetailProduct'
import {GlobalState} from '../../GlobalState'

function Pages() {
  const state = useContext(GlobalState)
  const [isLogged] = state.userAPI.isLogged


  return (

    <Routes>
      <Route path="/" exact element={<Products />}/>
      <Route path="/detail/:id" exact element={<DetailProduct />}/>
      <Route path="/login" exact element={isLogged ? <NotFound />  : <Login />}/>
      <Route path="/register" exact element={isLogged ? <NotFound /> : <Register />}/>
      <Route path="/cart" exact element={<Cart />}/>

      <Route path="*" exact element={<NotFound />}/>
    </Routes>
    
  )
}

export default Pages