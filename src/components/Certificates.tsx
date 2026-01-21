import { Award, ExternalLink, Calendar, Building2 } from "lucide-react";
import { motion } from "framer-motion";

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
        title: "Jornada de Especialização em Desenvolvimento de Software",
        issuer: "Koru + Grupo Boticário",
        date: "Março de 2025",
        hours: "160h",
        pdfUrl: "/certificates/programa-desenvolve-fase-2.pdf",
    },
    {
        id: 2,
        title: "Programa Residência em TIC-20 - Capacita Brasil/C-Jovem",
        issuer: "Instituto Atlântico + Universidade Estadual do Ceará (UECE)",
        date: "Janeiro de 2025",
        hours: "480h",
        pdfUrl: "/certificates/residencia-em-tic.pdf",
    }
];

const CertificateCard = ({ cert, index }: { cert: Certificate; index: number }) => (
    <motion.a
        href={cert.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:glass-strong cursor-pointer"
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
    return (
        <section id="certificates" className="py-24">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Section header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                            Certificados & <span className="text-gradient">Formações</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Cursos e programas de especialização que completei para aprimorar minhas habilidades em desenvolvimento de software.
                        </p>
                    </motion.div>

                    {/* Certificates Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {certificates.map((cert, index) => (
                            <CertificateCard key={cert.id} cert={cert} index={index} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Certificates;
