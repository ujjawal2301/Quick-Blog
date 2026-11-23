import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, togglePublish } from "../controllers/blogController.js";
import express from 'express'
import upload from "../middleware/multer.js";
import userOrAdminAuth from "../middleware/userOrAdminAuth.js";

const blogRouter = express.Router();

blogRouter.post("/add", userOrAdminAuth, upload.single("image"), addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", userOrAdminAuth, deleteBlogById);
blogRouter.post("/toggle-publish", userOrAdminAuth, togglePublish);

blogRouter.post("/add-comment", addComment);
blogRouter.post("/comments", getBlogComments);
blogRouter.post("/generate", userOrAdminAuth, generateContent);

export default blogRouter