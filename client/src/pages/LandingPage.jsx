import Hero from "../components/Hero";
import Navbar from "../components/Navbar";


function LandingPage(){
    return(
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <Hero />
        </div>
    )
}
export default LandingPage;