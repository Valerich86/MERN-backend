import {extname} from 'node:path';
import multer, {diskStorage} from 'multer';

const uploadHandler = multer({
    storage: diskStorage({
        destination: './storage/uploaded',
        filename: (req, file, cb)=>{
            const name = `${Date.now()}.` + `${Math.round(Math.random() * 1000)}`;
            const ext = extname(file.originalname);
            cb(null, `${name}${ext}`);
        }
    }),
    limits: {
        fileSize: 1024*1000,
        files: 1,
        fields: 2
    }
});

const addendumUploader = uploadHandler.single('addendum');
export {addendumUploader};
