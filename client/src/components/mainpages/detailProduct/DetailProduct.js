import React, {useContext, useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'

function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const addCart = state.userAPI.addCart
    const [detailProduct, setDetailProduct] = useState([])

    useEffect(() => {
        // console.log("Load Lại")
        if(params.id){
            products.forEach(product => {
                if(product._id === params.id) setDetailProduct(product)
            });
        }
    }, [params.id, products])

    if(detailProduct.length === 0) return null;
  return (
      <>
        <div className='detail'>
            <img src={detailProduct.images.url} alt=""/>
            <div className='box-detail'>
                <div className='row'>
                    <h3>{detailProduct.product_name}</h3>
                    <h4>#id: {detailProduct.product_id}</h4>
                </div>
                <span>$ {detailProduct.price} VND</span>
                <p>{detailProduct.description}</p>
                <p>{detailProduct.content}</p>
                <p>Đã Bán: {detailProduct.sold}</p>
                <Link to="/cart" className="cart" onClick={() => addCart(detailProduct)}>Mua Ngay</Link>
            </div>
        </div>

        <div>
            <h2>Sản Phẩm Liên Quan</h2>
            <div className='products'>
                {
                    products.map(product => {
                        return product.category === detailProduct.category
                        ? <ProductItem key={product._id} product={product}/> : null
                    } )
                }
            </div>
        </div>
      </>
  )
}

export default DetailProduct