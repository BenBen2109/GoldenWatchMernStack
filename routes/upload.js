const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//upload image
// chỉ có admin mới có thể upload
router.post('/upload',auth, authAdmin, (req, res) => {
    try {
        console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: 'Không có file được upload'})

        const file = req.files.file;
        if(file.size > 1024*1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: 'Size quá to'})//nếu fie size > 1mb
        }
        
        
        //check kiểu file
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/webp') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Định dạng file không phù hợp"})
        }
            

        //sau khi upload sẽ có file temp nằm ở thư mục tmp
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "goldenwatch"}, async(err, result) => {
            if(err) throw err;
            removeTmp(file.tempFilePath)
            res.json({public_id: result.public_id, url: result.secure_url})
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

//Delete image
router.post('/destroy',auth, authAdmin, (req, res) => {
    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg: 'Không có ảnh được chọn'})

        cloudinary.v2.uploader.destroy(public_id, async(err, result) => {
            if(err) throw err;
            res.json({msg: 'Xóa ảnh thành công'})
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}

module.exports = router