import React from 'react'
import {Link} from 'react-router-dom'
import BtnRender from './BtnRender'

function ProductItem({product, isAdmin}) {
  return (
    <div className="product_card">
         {
            isAdmin && <input type="checkbox" checked={product.checked} />
         }

          <Link id="img_view" to={`detail/${product._id}`}>
                  <img src={product.images.url} alt=""/>
            </Link>
      
        <div className='product_box'>
            <h2 title={product.product_name}>{product.product_name}</h2>
            <span>$ {product.price}đ VND</span>
            <p>{product.description}</p>
        </div>

        <BtnRender product={product}/>


    </div>
  )
}

export default ProductItem