import { Github, Linkedin, Mail, ArrowDown, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import profilePhotoDark from "@/assets/profile-photo-b.jpeg";
import profilePhotoLight from "@/assets/profile-photo-w.png";

const Hero = () => {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background decorations with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y1, opacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-hero opacity-5 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        style={{ opacity }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Photo with parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ y: y2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero blur-2xl opacity-30 scale-110" 
                   style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }} 
              />
              <div className="relative w-72 h-72 md:w-96 md:h-96 overflow-hidden border-4 border-card shadow-glow animate-blob"
                   style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
              >
                <img
                  src={theme === "dark" ? profilePhotoDark : profilePhotoLight}
                  alt="Sâmia Luvanice"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              {/* Floating badge */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-2 -right-2 bg-card px-4 py-2 rounded-full shadow-card flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Sobral, CE</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="text-center lg:text-left max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Sâmia <span className="text-gradient">Luvanice</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground mb-6"
            >
              Desenvolvedora Fullstack
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-muted-foreground mb-8 leading-relaxed"
            >
              Movida por aprendizado contínuo, colaboração em equipe e pela vontade de 
              construir soluções que gerem impacto positivo e real para as pessoas e os negócios.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap lg:flex-nowrap gap-2 justify-center lg:justify-start"
            >
              <Button variant="outline" size="lg" asChild className="gap-2">
                <a href="https://github.com/SamiaLuvanice" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="gap-2">
                <a href="https://linkedin.com/in/samialuvanice" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="gap-2">
                <a href="mailto:samia.luvanice.dev@gmail.com">
                  <Mail className="w-5 h-5" />
                  Email
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <a href="/cv-samia-luvanice.pdf" download>
                  <Download className="w-5 h-5" />
                  Download CV
                </a>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          onClick={scrollToAbout}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-smooth"
        >
          <span className="text-sm">Scroll</span>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
