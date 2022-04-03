import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

function Register() {
  const [user, setUser] = useState({
      name: '',email: '', password: ''
  })

  const onChangeInput = e => {
    const {name, value} = e.target;
    setUser({...user, [name]:value})
  }
  const registerSubmit = async e => {
      e.preventDefault()
      try {
        await axios.post('/user/register', {...user})

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
         <h2>Đăng Kí</h2>
         <form onSubmit={registerSubmit}>

          <input type="name" name="name" required 
           placeholder="Điền Tên..." value={user.name} onChange={onChangeInput}/>

           <input type="email" name="email" required 
           placeholder="Điền Email..." value={user.email} onChange={onChangeInput}/>

           <input type="password" name="password" required autoComplete="on" 
           placeholder="Điền Mật Khẩu..." value={user.password} onChange={onChangeInput}/>
              Đã có tài khoản? 
             <Link to="/login"> Đăng Nhập Ngay!!</Link>
           <div className="row">
             <button type="submit">Đăng Kí</button>
             
           </div>
         </form>
    </div>
    </>  
  )
}

export default Register