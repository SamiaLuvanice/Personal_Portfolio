import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Building2, Calendar, ExternalLink } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

interface Certificate {
    id: number;
    title: string;
    issuer: string;
    date: string;
    hours: string;
    pdfUrl: string;
}

gsap.registerPlugin(ScrollTrigger);

const certificates: Certificate[] = [
    {
        id: 1,
        title: "Programa Residência em TIC-20 - Capacita Brasil/C-Jovem",
        issuer: "Instituto Atlântico + Universidade Estadual do Ceará (UECE)",
        date: "Janeiro de 2025",
        hours: "480h",
        pdfUrl: "/certificates/residencia-em-tic.pdf",
    },
    {
        id: 2,
        title: "Jornada de Especialização em Desenvolvimento de Software",
        issuer: "Koru + Grupo Boticário",
        date: "Março de 2025",
        hours: "160h",
        pdfUrl: "/certificates/programa-desenvolve-fase-2.pdf",
    },
    {
        id: 3,
        title: "DiverseDEV 2025",
        issuer: "Ada Tech + Mercado Eletrônico",
        date: "Novembro de 2025",
        hours: "360h",
        pdfUrl: "/certificates/diverse_dev.pdf",
    }
];

const CertificateCard = ({
    cert,
    index,
    className = "",
    active = false,
    desktop = false,
}: {
    cert: Certificate;
    index: number;
    className?: string;
    active?: boolean;
    desktop?: boolean;
}) => (
    <motion.a
        href={cert.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={desktop ? false : { opacity: 0, scale: 0.9 }}
        animate={
            desktop
                ? {
                    opacity: active ? 1 : 0.5,
                    scale: active ? 1 : 0.95,
                    y: active ? -12 : 4,
                    rotate: active ? 0 : -0.5,
                    filter: active ? "blur(0px) brightness(1)" : "blur(1px) brightness(0.82)",
                }
                : undefined
        }
        whileInView={desktop ? undefined : { opacity: 1, scale: 1 }}
        exit={desktop ? undefined : { opacity: 0, scale: 0.9 }}
        transition={{ duration: desktop ? 0.55 : 0.3, ease: [0.22, 1, 0.36, 1], delay: desktop ? 0 : index * 0.1 }}
        viewport={desktop ? undefined : { once: true }}
        whileHover={desktop ? { y: active ? -14 : -2, scale: active ? 1.02 : 0.98 } : { y: -8, scale: 1.02 }}
        style={desktop ? { zIndex: active ? 3 : 1 } : undefined}
        className={`group relative glass rounded-2xl border p-6 transition-smooth cursor-pointer ${desktop ? "border-border/40" : "border-transparent"} ${className}`}
    >
        {/* Icon and Badge */}
        <div className="flex items-start justify-between mb-6">
            <motion.div
                whileHover={{ rotate: 10 }}
                className="p-3 rounded-xl bg-primary/10 text-primary"
            >
                <Award className="w-6 h-6" />
            </motion.div>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {cert.hours}
            </div>
        </div>

        {/* Content */}
        <h3 className="font-display text-lg font-semibold mb-3 group-hover:text-primary transition-smooth line-clamp-2">
            {cert.title}
        </h3>

        {/* Meta info */}
        <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="line-clamp-1">{cert.issuer}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{cert.date}</span>
            </div>
        </div>

        {/* External Link Icon */}
        <div className="flex items-center justify-end">
            <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-smooth" />
        </div>
    </motion.a>
);

const Certificates = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const desktopPinRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(0);
    const lastProgressRef = useRef(0);

    useLayoutEffect(() => {
        const sectionEl = sectionRef.current;
        const pinEl = desktopPinRef.current;

        if (!sectionEl || !pinEl) {
            return;
        }

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const maxIndex = certificates.length - 1;

            const trigger = ScrollTrigger.create({
                trigger: pinEl,
                start: "top top+=96",
                end: () => `+=${window.innerHeight * Math.max(1, maxIndex)}`,
                pin: true,
                scrub: 0.22,
                snap: maxIndex > 0
                    ? {
                        snapTo: (value: number) => Math.round(value * maxIndex) / maxIndex,
                        duration: { min: 0.12, max: 0.3 },
                        delay: 0.06,
                        ease: "power2.out",
                    }
                    : undefined,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    if (maxIndex <= 0) {
                        return;
                    }

                    const currentIndex = activeIndexRef.current;
                    const scaledProgress = self.progress * maxIndex;
                    const scrollingForward = self.progress >= lastProgressRef.current;
                    const hysteresis = 0.2;

                    let nextIndex = currentIndex;

                    if (scrollingForward) {
                        const forwardThreshold = currentIndex + 0.5 + hysteresis;
                        if (scaledProgress >= forwardThreshold) {
                            nextIndex = Math.min(maxIndex, currentIndex + 1);
                        }
                    } else {
                        const backwardThreshold = currentIndex - 0.5 - hysteresis;
                        if (scaledProgress <= backwardThreshold) {
                            nextIndex = Math.max(0, currentIndex - 1);
                        }
                    }

                    lastProgressRef.current = self.progress;

                    if (nextIndex !== currentIndex) {
                        activeIndexRef.current = nextIndex;
                        setActiveIndex(nextIndex);
                    }
                },
                onEnter: () => {
                    activeIndexRef.current = 0;
                    lastProgressRef.current = 0;
                    setActiveIndex(0);
                },
                onEnterBack: () => {
                    activeIndexRef.current = maxIndex;
                    lastProgressRef.current = 1;
                    setActiveIndex(maxIndex);
                },
            });

            return () => {
                trigger.kill();
            };
        });

        mm.add("(max-width: 767px)", () => {
            activeIndexRef.current = 0;
            lastProgressRef.current = 0;
            setActiveIndex(0);
        });

        return () => {
            mm.revert();
        };
    }, []);

    return (
        <section id="certificates" ref={sectionRef} className="overflow-x-hidden py-24">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 md:hidden"
                    >
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                            Certificados & <span className="text-gradient">Formações</span>
                        </h2>
                        <p className="mt-4 text-sm text-muted-foreground md:hidden">
                            Deslize para explorar os certificados.
                        </p>
                    </motion.div>

                    <div className="md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="grid gap-6"
                        >
                            {certificates.map((cert, index) => (
                                <CertificateCard key={cert.id} cert={cert} index={index} />
                            ))}
                        </motion.div>
                    </div>

                    <div ref={desktopPinRef} className="relative hidden min-h-[78vh] md:block">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55 }}
                            viewport={{ once: true }}
                            className="text-center mb-8"
                        >
                            <h2 className="font-display text-3xl md:text-4xl font-bold">
                                Certificados & <span className="text-gradient">Formações</span>
                            </h2>
                        </motion.div>

                        <div className="mx-auto grid min-h-[62vh] max-w-6xl grid-cols-3 items-center gap-6 px-2 lg:gap-8">
                            {certificates.map((cert, index) => (
                                <CertificateCard
                                    key={cert.id}
                                    cert={cert}
                                    index={index}
                                    active={index === activeIndex}
                                    desktop
                                    className={`w-full ${index === activeIndex ? "border-primary/70 shadow-[0_18px_45px_-22px_hsl(var(--primary)/0.75)]" : "shadow-[0_10px_25px_-20px_hsl(var(--foreground)/0.45)]"}`}
                                />
                            ))}
                        </div>

                        <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-3">
                            {certificates.map((cert, index) => (
                                <button
                                    key={cert.id}
                                    type="button"
                                    onClick={() => {
                                        activeIndexRef.current = index;
                                        setActiveIndex(index);
                                    }}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${
                                        index === activeIndex ? "w-10 bg-primary" : "w-2.5 bg-border"
                                    }`}
                                    aria-label={`Ir para certificado ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Certificates;
