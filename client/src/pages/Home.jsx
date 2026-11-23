import BlogList from "../component/BlogList";
import Footer from "../component/Footer";
import Header from "../component/Header";
import Navbar from "../component/Navbar";

export default function Home() {
    return(
        <>
            <Navbar />
            <Header />
            <BlogList />
            <Footer />
        </>
    )
}