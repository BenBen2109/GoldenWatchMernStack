import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import {useNavigate, useParams} from 'react-router-dom' //useNavigate thay thế useHistory

const initialState = {
    product_id: '',
    product_name: '',
    price: 0,
    description: 'Đồng hồ sang trọng cho người sang trọng',
    content: 'Thông tin về đồng hồ',
    category: '',
    _id: ''
}

function CreateProduct() {
  const state = useContext(GlobalState)

  const [product, setProduct] = useState(initialState)
  const [products] = state.productsAPI.products 

  const [categories] = state.categoriesAPI.categories

  const [images, setImages] = useState(false)

  const [loading, setLoading] = useState(false)

  const [isAdmin] = state.userAPI.isAdmin
  const [token] = state.token

  const [onEdit, setOnEdit] = useState(false) 
  const [callback, setCallback] = state.productsAPI.callback

  const navigate = useNavigate()
  const param = useParams()


  const styleUpload = {
      display: images ? "block" : "none"
  }

  useEffect(() => {
      if(param.id) {
        setOnEdit(true)
        products.forEach(product => {
            if(product._id === param.id) {
                setProduct(product)
                setImages(product.images)
            }
        })
      }else {
          setOnEdit(false)
          setProduct(initialState)
          setImages(false)
      }
  }, [param.id, products])

  const handleUpload = async e => {
      e.preventDefault()
      try {
          if(!isAdmin) return alert("Bạn không có quyền upload")
          const file = e.target.files[0]
          if(!file) return alert("File không tồn tại")

          if(file.size > 1024 * 1024 * 5) //chỉ cho file 5mb
                return alert("File không được vượt quá 5mb.")

          if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') 
                return alert("Chỉ được up file .png .jpeg và .webp")
                
        let formData = new FormData() 
        formData.append('file', file)
        
        setLoading(true)
        const res = await axios.post('/api/upload', formData, {
            headers: {'content-type': 'multipart/form-data', Authorization: token}
        })

        setLoading(false)
        setImages(res.data)

      } catch (err) {
          alert(err.response.data.msg)
      }
  }

  const handleDestroy = async () => {
      try {
          if(!isAdmin) return alert("Bạn không có quyền xóa ảnh")
          setLoading(true)
          await axios.post('/api/destroy', {public_id: images.public_id}, {
              headers: {Authorization: token}
          })
          setLoading(false)
          setImages(false)
      } catch (err) {
            alert(err.response.data.msg)
      }
  }

  const handleChangeInput = e => {
      const {name, value} = e.target 
      setProduct({...product, [name]:value})
  }

  const handleSubmit = async e => {
      e.preventDefault()
      try {
          if(!isAdmin) return alert("Bạn không có quyền tạo sản phẩm")
          if(!images) return alert("Không có hình ảnh được upload")

          if(onEdit) {
            await axios.put(`/api/products/${product._id}`, {...product, images}, {
                headers: {Authorization: token}
            })
          }else {
            await axios.post('/api/products', {...product, images}, {
                headers: {Authorization: token}
            })
          }

          setCallback(!callback)
          navigate("/")

      } catch (err) {
            alert(err.response.data.msg)
      }
  }

  return (
    <div className='create_product'>
         <div className="upload">
             <input type="file" name="file" id="file_up" onChange={handleUpload}/>
             {
                 loading ? <div id="file_img"><Loading /></div> :

                 <div id="file_img" style={styleUpload}>
                      <img src={images ? images.url : ''} alt="" />
                      <span onClick={handleDestroy}>X</span>
                </div>
             }
            
         </div>

         <form onSubmit={handleSubmit}>

             <div className='row'>
                 <label htmlFor="product_id">ID Sản Phẩm</label>
                 <input type="text" name="product_id" id="product_id" 
                 required value={product.product_id} onChange={handleChangeInput} disabled={onEdit}/>
             </div>

             <div className='row'>
                 <label htmlFor="product_name">Tên Sản Phẩm</label>
                 <input type="text" name="product_name" id="product_name" required 
                 value={product.product_name} onChange={handleChangeInput}/>
             </div>

             <div className='row'>
                 <label htmlFor="price">Giá</label>
                 <input type="number" name="price" id="price" required 
                 value={product.price} onChange={handleChangeInput}/>
             </div>

             <div className='row'>
                 <label htmlFor="description">Mô Tả</label>
                 <textarea type="text" name="description" id="description" required 
                 value={product.description} rows="5" onChange={handleChangeInput}/>
             </div>

             <div className='row'>
                 <label htmlFor="content">Thông Tin Sản Phẩm</label>
                 <textarea type="text" name="content" id="content" required 
                 value={product.content} rows="7" onChange={handleChangeInput}/>
             </div>

             <div className='row'>
                 <label htmlFor="categories">Categories: </label>
                 <select name="category" value={product.category} onChange={handleChangeInput}>
                     <option value="">Chọn Category</option>
                     {
                         categories.map(category => (
                             <option value={category._id} key={category._id}>
                                    {category.name}
                             </option>
                         ))
                     }
                 </select>
             </div>
                <button type='submit'>{onEdit ? "Sửa" : "Tạo"}</button>
         </form>
    </div>
  )
}

export default CreateProduct