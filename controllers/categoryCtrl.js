const Category = require('../models/categoryModel')
const Products = require('../models/productModel')


const categoryCtrl = {
    getCategories: async(req, res) => {
        try {
            const categories = await Category.find()
            res.json(categories)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createCategory: async (req, res) => {
        try {
            //nếu như user có role = 1 => admin
            //Chỉ có admin có quyền thêm, xóa và sửa category
            const {name} = req.body;
            const category = await Category.findOne({name})
            if(category) return res.status(400).json({msg: "Category này đã tồn tại rồi."})

            const newCategory = new Category({name})

            await newCategory.save()
            res.json({msg: 'Tạo category thành công'})
        } catch (error) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const products = await Products.findOne({category: req.params.id})
            if(products) return res.status(400).json({msg: "Hãy xóa hết sản phẩm trong category này rồi thử lại"})

            await Category.findByIdAndDelete(req.params.id)
            res.json({msg: "Xóa category thành công"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateCategory: async (req, res) => {
        try {
            const {name} = req.body;
            await Category.findOneAndUpdate({_id: req.params.id}, {name})

            res.json({msg: "Update category thành công"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = categoryCtrl