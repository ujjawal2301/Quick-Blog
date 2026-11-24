import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import cloudinary from "../configs/cloudinary.js";
import { Readable } from "stream";
import main from "../configs/gemini.js";
import wrapAsync from "../utils/wrapAsync.js";
// import { wrap } from "module";

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if (!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: "Missing required fields" })
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "quickblog" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            Readable.from(imageFile.buffer).pipe(stream);
        });

        const image = result.secure_url;

        await Blog.create({ title, subTitle, description, category, image, isPublished, author: req.isAdmin ? null : req.user._id })
        res.json({ success: true, message: "Blog added Successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true })
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        res.json({ success: true, blog })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const deleteBlogById = wrapAsync(async (req, res) => {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(404).json({
            success: false,
            message: "Blog not found"
        });
    }

    if (!req.isAdmin && blog.author?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to delete this blog"
        });
    }

    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });

    res.json({
        success: true,
        message: "Blog deleted successfully"
    });
});


export const togglePublish = wrapAsync(async (req, res) => {
    const {id} = req.body;
    const blog = await Blog.findById(id);
    if(!blog) {
        return res.status(404).json({
            success: false,
            message: "Blog not found"
        });
    }

    const isBlogOwner = blog.author?.toString() === req.user?._id.toString();

    if(!req.isAdmin && !isBlogOwner){
        return res.status(403).json({
            success: false,
            message: "Your are not authorized to modify this blog"
        });
    }

    blog.isPublished = !blog.isPublished;

    await blog.save();

    res.json({
        success: true,
        message: "Blog status updated"
    });
});

export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        await Comment.create({ blog, name, content });
        res.json({ success: true, message: 'comment added for review' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format')
        res.json({ success: true, content });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getMyBlogs = wrapAsync(async (req,res) => {
    const blogs = await Blog.find({
        author: req.user._id
    }).sort({createdAt: -1});

    res.json({
        success: true,
        blogs
    });
});