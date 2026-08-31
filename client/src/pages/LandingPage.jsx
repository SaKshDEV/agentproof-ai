import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import DashboardPreview from "../components/DashboardPreview";



function LandingPage(){
    return(
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <Hero />
            <DashboardPreview />
        </div>
    )
}
export default LandingPage;