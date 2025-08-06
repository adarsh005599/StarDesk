import express from 'express'
import { auth } from '../middleware/auth.js';
import { genreateArticle, genreateBlogTitle, genreateImage, removeImageBackground, removeObject, resumeReview } from '../controllers/aiController.js';
import { upload } from '../middleware/multer.js';

const aiRouter  = express.Router();

aiRouter.post('/write-article', auth, genreateArticle)
aiRouter.post('/blog-titles', auth, genreateBlogTitle)
aiRouter.post('/generate-image', auth, genreateImage )
aiRouter.post('/remove-bg', upload.single('image'), auth, removeImageBackground )
aiRouter.post('/remove-obj', upload.single('image'),  auth, removeObject)
aiRouter.post('/review-resume', upload.single('resume'),  auth, resumeReview)


export default  aiRouter