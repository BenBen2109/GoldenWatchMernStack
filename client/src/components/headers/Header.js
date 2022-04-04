import React, {useContext} from 'react'
import {GlobalState} from '../../GlobalState'
import Menu from './icon/menu.svg'
import Close from './icon/close.svg'
import Cart from './icon/cart.svg'
import {Link} from 'react-router-dom' 
import axios from 'axios'

function Header() {
  const state = useContext(GlobalState)
  const [isLogged] = state.userAPI.isLogged
  const [isAdmin] = state.userAPI.isAdmin
  const [cart] = state.userAPI.cart

  const logoutUser = async () => {
    await axios.get('/user/logout')
    localStorage.removeItem('firstLogin')
    window.location.href = "/"
  }

  const adminRouter = () => {
    return(
      <>
        <li><Link to="/create_product">Thêm Sản Phẩm</Link></li>
        <li><Link to="/category">Categories</Link></li>
      </>
    )
  }

  const loggedRouter = () => {
    return(
      <>
        <li><Link to="/history">Lịch Sử</Link></li>
        <li><Link to="/" onClick={logoutUser}>Đăng Xuất</Link></li>
      </>
    )
  }
  return (
    <header>
        <div className='menu'>
            <img src={Menu} alt='' width="30px" />
        </div>
      
        <div className='logo'>
            <h1>
              <Link to="/">{isAdmin ? 'Admin Golden Watch' : 'Golden Watch'}</Link>
            </h1>
        </div>

        <ul>
          <li><Link to="/">{isAdmin ? 'Sản Phẩm' : 'Shop'}</Link></li>

          {isAdmin && adminRouter()}

          {
            isLogged ? loggedRouter() : <li><Link to="/login">Đăng Nhập/Đăng Kí</Link></li>
          }

          <li>
            <img src={Close} alt="" width="30px" className='menu'/>
          </li>
        </ul>

          {
            isAdmin ? '' : 
            <div className='cart-icon'>
               <span>{cart.length}</span>
               <Link to="/cart">
                 <img src={Cart} alt="" width="30" />
               </Link>
            </div>
          }

        
    </header>
  )
}

export default Header