const Products = require('../models/productModel')

//Tìm kiếm, sắp xếp, phân trang

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query
        
        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete(queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        /*  gte: greater than or equal 
            gt: greater than 
            lt: lower then
            lte: lower then or equal
            regex tìm kiếm theo chữ 
         */

        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting(){
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join()
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        }else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }
    
    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const productCtrl = {
    getProduct: async(req, res) => {
        try {
            console.log(req.query)

            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()

            const products = await features.query

            res.json({
                status:  'success',
                result: products.length,
                products: products
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createProduct: async(req, res) => {
        try {
            const {product_id, product_name, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({msg: 'Không có hình ảnh upload!'})

            const product = await Products.findOne({product_id})
            if(product) return res.status(400).json({msg: "Sản phẩm này đã tồn tại rồi!"})

            const newProduct = new Products({
                product_id, product_name: product_name.toLowerCase(), price, description, content, images, category
            })

            await newProduct.save()
            res.json({msg: "Tạo sản phẩm thành công"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteProduct: async(req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Xóa sản phẩm thành công."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateProduct: async(req, res) => {
        try {
            const {product_name, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({msg: "Không có hình ảnh upload"})
            await Products.findOneAndUpdate({_id: req.params.id}, {
                product_name: product_name.toLowerCase(), price, description, content, images, category
            })

            res.json({msg: "Sản phẩm được cập nhật."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = productCtrl