import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface Certificate {
    id: number;
    title: string;
    issuer: string;
    date: string;
    hours: string;
    pdfUrl: string;
}

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
    },
];

const CertificateRow = ({ cert, index }: { cert: Certificate; index: number }) => (
    <motion.a
        href={cert.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: -24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ x: 4 }}
        className="group flex flex-col gap-4 border-b border-border/70 py-6 transition-smooth md:flex-row md:items-start md:justify-between md:gap-8"
    >
        <div className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Certificado {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display text-xl font-semibold leading-tight md:text-2xl group-hover:text-primary transition-smooth">
                {cert.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {cert.issuer}
            </p>
        </div>

        <div className="flex items-center gap-6 md:items-start">
            <div className="text-right">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Data</p>
                <p className="mt-2 text-sm font-medium md:text-base">{cert.date}</p>
            </div>
            <div className="text-right">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Carga</p>
                <p className="mt-2 text-sm font-medium md:text-base">{cert.hours}</p>
            </div>
            <ExternalLink className="mt-1 hidden w-5 h-5 text-muted-foreground transition-smooth group-hover:text-primary md:block" />
        </div>
    </motion.a>
);

const Certificates = () => {
    return (
        <section id="certificates" className="py-24 md:py-32">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-6xl md:grid md:grid-cols-[0.9fr_1.1fr] md:gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-10 md:sticky md:top-24 md:mb-0 md:self-start"
                    >
                        <h2 className="font-display text-4xl font-bold uppercase tracking-tight md:text-6xl">
                            <span className="text-gradient">Certificados</span>
                        </h2>
                        <div className="mt-5 h-px w-full bg-border/80" />
                    </motion.div>

                    <div className="space-y-0">
                        {certificates.map((cert, index) => (
                            <CertificateRow key={cert.id} cert={cert} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Certificates;