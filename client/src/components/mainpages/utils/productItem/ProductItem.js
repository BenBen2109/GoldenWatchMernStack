import React from 'react'
import {Link} from 'react-router-dom'
import BtnRender from './BtnRender'


function ProductItem({product, isAdmin, deleteProduct, handleCheck}) {

  return (
    <div className="product_card">
         {
            isAdmin && <input type="checkbox" checked={product.checked} 
              onChange={() => handleCheck(product._id)}
            />
         }

          <Link id="img_view" to={`detail/${product._id}`}>
                  <img src={product.images.url} alt=""/>
            </Link>
      
        <div className='product_box'>
            <h2 title={product.product_name}>{product.product_name}</h2>
            <span>$ {product.price}</span>
            <p>{product.description}</p>
        </div>

        <BtnRender product={product} deleteProduct={deleteProduct}/>


    </div>
  )
}

export default ProductItem