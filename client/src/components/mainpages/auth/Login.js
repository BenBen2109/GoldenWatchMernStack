import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [user, setUser] = useState({
      email: '', password: ''
  })

  const onChangeInput = e => {
    const {name, value} = e.target;
    setUser({...user, [name]:value})
  }
  const loginSubmit = async e => {
      e.preventDefault()
      try {
        await axios.post('/user/login', {...user})

        localStorage.setItem('firstLogin', true)

        window.location.href = "/"
      } catch (err) {
        alert(err.response.data.msg)
      }
  }
  return (
    <>
      <div className='logoImg'>
        <img src="https://res.cloudinary.com/khanh2109/image/upload/v1648980971/goldenwatch/GoldenWatch_orofuu.png" alt="logo" />
      </div>
      <div className='login-page'>
         <h2>Đăng Nhập</h2>
         <form onSubmit={loginSubmit}>

           <input type="email" name="email" required 
           placeholder="Điền Email..." value={user.email} onChange={onChangeInput}/>

           <input type="password" name="password" required autoComplete="on" 
           placeholder="Điền Mật Khẩu..." value={user.password} onChange={onChangeInput}/>
                Chưa có tài khoản? 
             <Link to="/register"> Đăng Kí Ngay!!</Link>
           <div className="row">
             <button type="submit">Đăng Nhập</button>
             
           </div>
         </form>
    </div>
    </>
  )
}

export default Login