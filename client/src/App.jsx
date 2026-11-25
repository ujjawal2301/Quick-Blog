import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dasboard'
import AddBlog from './pages/admin/AddBlog'
import ListBlog from './pages/admin/Listblog'
import UserLogin from './pages/UserLogin'
import Register from './pages/Register'
import Login from './component/admin/Login'
import CreateBlog from './pages/CreateBlog'
import 'quill/dist/quill.snow.css'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import Comments from './pages/admin/Comments'

function App() {
  const { adminToken, userToken } = useAppContext();

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route
          path='/create-blog'
          element={userToken ? <CreateBlog /> : <UserLogin />}
        />
        <Route path='/admin' element={adminToken ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<Comments />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
