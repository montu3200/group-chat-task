const cloudinary = require('../../config/cloudinary')
const AppError = require('../../utils/AppError');

const uploadOnCloudinary = async (filePath,check) => {
    try {
        let obj;
        if(check === true){
            obj={
                folder: process.env.CLOUDINARY_FOLDER,
                use_filename: true,
                resource_type: "raw"
            }
        }else{
            obj={
                folder: process.env.CLOUDINARY_FOLDER,
                use_filename: true
            }
        }
        return cloudinary.v2.uploader.upload(filePath, obj)
    } catch (err) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Fail to upload on cloudinary');
    }
}

module.exports = { uploadOnCloudinary } 