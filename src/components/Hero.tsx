import profilePhotoDark from "@/assets/profile-photo-b.jpeg";
import profilePhotoLight from "@/assets/profile-photo-w.png";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { useTheme } from "next-themes";
import { useLayoutEffect, useRef } from "react";

const Hero = () => {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroRef = useRef<HTMLElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const buttonItems = buttonsRef.current
        ? (Array.from(buttonsRef.current.children) as HTMLElement[])
        : [];

      const targets = [textBlockRef.current, photoRef.current, ...buttonItems].filter(Boolean) as HTMLElement[];

      gsap.set(targets, {
        willChange: "transform, opacity",
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        textBlockRef.current,
        {
          opacity: 0,
          x: isDesktop ? 240 : 0,
          y: isDesktop ? 0 : 28,
          scale: 0.97,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          ease: "power2.out",
          duration: 3,
        },
      )
        .fromTo(
          buttonItems,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.5,
          },
            "+=0.15",
          );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={heroRef} aria-labelledby="hero-title" role="region" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-24">
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

      <motion.div style={{ opacity }} className="container mx-auto px-6 lg:pr-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center w-full">
          <div ref={textBlockRef} className="lg:col-span-8 lg:pr-8 text-center lg:text-left order-2 lg:order-1">
            <h1 id="hero-title" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide text-foreground/90">
              Sâmia Luvanice
            </h1>

            <div className="origin-left h-px bg-primary/40 mt-4" />

            <p className="text-base md:text-lg text-muted-foreground mt-6 max-w-2xl leading-relaxed">
              Sou desenvolvedora de software que une criatividade a experiências digitais. Transformo ideias em produtos com foco em <span className="font-semibold">performance</span>, <span className="font-semibold">design</span> e <span className="font-semibold">qualidade de código</span>.
            </p>

            <div
              ref={buttonsRef}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3"
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

              <Button variant="outline" size="lg" className="gap-2" onClick={scrollToContact}>
                <Mail className="w-5 h-5" />
                Email
              </Button>

              <Button
                size="lg"
                asChild
                className="gap-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <a href="/curriculo.pdf" download="Curriculo-Samia-Luvanice.pdf">
                  <Download className="w-5 h-5" />
                  Currículo
                </a>
              </Button>
            </div>
          </div>

          <motion.div
            ref={photoRef}
            style={{ y: y2 }}
            className="lg:col-span-4 flex justify-center lg:justify-end order-1 lg:order-2 lg:-mt-16 xl:-mt-28 lg:translate-x-14 xl:translate-x-28"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-hero blur-2xl opacity-25 rounded-[2.75rem]" />
              <div className="relative w-[340px] h-[430px] md:w-[420px] md:h-[540px] overflow-hidden border border-border/60 shadow-glow rounded-tl-none rounded-bl-[2.75rem] rounded-tr-none rounded-br-none">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/20 z-10" />
                <img
                  src={theme === "dark" ? profilePhotoDark : profilePhotoLight}
                  alt="Retrato de Sâmia Luvanice"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover scale-105"
                />
              </div>

              <div className="absolute -bottom-3 -left-3 bg-card/95 backdrop-blur px-4 py-2 rounded-full shadow-card flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Sobral, CE</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          onClick={scrollToAbout}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-smooth"
        >
          <span className="text-sm">Scroll</span>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
