import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Certificates from "@/components/Certificates";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Hero />
            <About />
            <Certificates />
            <Projects />
            <Contact />
        </div>
    );
};

export default Index;
