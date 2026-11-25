import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

export default function Navbar() {

    const {
        navigate,
        adminToken,
        userToken,
        user,
        setAdminToken,
        setUserToken,
        setUser,
        axios
    } = useAppContext();

    const handleLogout = () => {

        if (adminToken) {
            localStorage.removeItem('adminToken');
            setAdminToken(null);
        }

        if (userToken) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            setUserToken(null);
            setUser(null);
        }

        delete axios.defaults.headers.common['Authorization'];

        navigate('/');
    };

    return (
        <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>

            <img
                src={assets.logo}
                onClick={() => navigate('/')}
                alt="logo"
                className='w-32 sm:w-44 cursor-pointer'
            />

            <div className='flex items-center gap-4'>

                {/* Guest */}
                {!adminToken && !userToken && (
                    <>
                        <button
                            onClick={() => navigate('/login')}
                            className='text-sm cursor-pointer'
                        >
                            User Login
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            className='bg-primary text-white px-6 py-2.5 rounded-full text-sm cursor-pointer'
                        >
                            Register
                        </button>

                        <button
                            onClick={() => navigate('/admin')}
                            className='text-sm cursor-pointer border border-primary px-5 py-2.5 rounded-full'
                        >
                            Admin Login
                        </button>
                    </>
                )}

                {/* Normal User */}
                {userToken && (
                    <>
                        <span className='text-sm bg-green-500 text-white px-6 py-2.5 rounded-full text-sm cursor-pointer'>
                            Hi, {user?.name}
                        </span>

                        <button
                            onClick={() => navigate('/create-blog')}
                            className='bg-primary text-white px-6 py-2.5 rounded-full text-sm cursor-pointer'
                        >
                            Create Blog
                        </button>

                        <button
                            onClick={handleLogout}
                            className='bg-primary text-white px-6 py-2.5 rounded-full text-sm cursor-pointer'
                        >
                            Logout
                        </button>
                    </>
                )}

                {/* Admin */}
                {adminToken && (
                    <>
                        <button
                            onClick={() => navigate('/admin')}
                            className='bg-primary text-white px-6 py-2.5 rounded-full text-sm cursor-pointer'
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={handleLogout}
                            className='text-sm bg-primary text-white px-6 py-2.5 rounded-full text-sm cursor-pointer'
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>
        </div>
    );
}