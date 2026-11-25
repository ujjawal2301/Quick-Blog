import { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../assets/assets";
import Quill from 'quill'
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { parse } from 'marked'

export default function CreateBlog() {
    const { axios } = useAppContext()
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setloading] = useState(false);

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [image, setImage] = useState(false);
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [category, setCategory] = useState('Startup');
    const [isPublished, setIsPublished] = useState(false);

    const generateContent = async () => {
        if (!title) return toast.error('Please enter a title')

        try {
            setloading(true);
            const { data } = await axios.post('/api/blog/generate', { prompt: title })

            if (data.success) {
                quillRef.current.root.innerHTML = parse(data.content)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setloading(false)
        }
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setIsAdding(true)

            const blog = {
                title, subTitle, description: quillRef.current.root.innerHTML,
                category, isPublished
            }

            const formData = new FormData();
            formData.append('blog', JSON.stringify(blog))
            formData.append('image', image)

            const { data } = await axios.post('/api/blog/add', formData);
            if (data.success) {
                toast.success(data.message);
                setImage(false)
                setTitle('')
                quillRef.current.root.innerHTML = ''
                setCategory('Startup')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsAdding(false);
        }
    }

    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
        }
    }, [])

    return (
        <div className="min-h-screen bg-blue-50/50 px-4 py-12">

            {/* Page Heading */}
            <div className="text-center bg-blue-50/50 p-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Create Your Blog
                </h1>

                <p className="text-gray-500 mt-3">
                    Share your thoughts, ideas, and stories with the world.
                </p>
            </div>

          
            <form
                onSubmit={onSubmitHandler}
                className="w-full max-w-3xl mx-auto"
            >
                <div className="bg-white w-full max-w-2xl p-4 ml-1/2 md:p-10 sm:m-10 shadow rounded-xl">
                    <p>Upload Thumbnail</p>
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className="mt-2 h-16 rounded cursor-pointer" />
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                    </label>

                    <p className="mt-4">Blog title</p>
                    <input type="text" placeholder="Type here" required className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded" onChange={(e) => setTitle(e.target.value)} value={title} />

                    <p className="mt-4">Sub title</p>
                    <input type="text" placeholder="Type here" required className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded" onChange={(e) => setSubTitle(e.target.value)} value={subTitle} />

                    <p className="mt-4">Blog Description</p>
                    <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
                        <div ref={editorRef}></div>
                        {loading && (
                            <div className="absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2">
                                <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
                            </div>
                        )}
                        <button disabled={loading} type="button" onClick={generateContent} className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer">
                            {loading ? 'fetching..' : ' Generate with AI'}</button>
                    </div>

                    <p className="mt-4">Blog category</p>
                    <select name="category" onChange={e => setCategory(e.target.value)} className="mt-2 px-3 border text-gray-500 border-gray-300 outline-none rounded">
                        <option value="">Select category</option>
                        {blogCategories.map((item, index) => {
                            return <option value={item} key={index}>{item}</option>
                        })}
                    </select>
                    <br />

                    <button disabled={isAdding} type="submit" className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm">
                        {isAdding ? 'Publishing...' : 'Create Blog'}
                    </button>

                </div>
            </form>
        </div>
    );
}