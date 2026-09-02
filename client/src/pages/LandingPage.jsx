import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import DashboardPreview from "../components/DashboardPreview";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";




function LandingPage(){
    return(
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <Hero />
            <DashboardPreview />
            <Features />
            <HowItWorks />
        </div>
    )
}
export default LandingPage;