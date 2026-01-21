import { Github, Linkedin, Mail, Heart, Send, MessageCircle, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const socialLinks = [
        { href: "https://github.com/SamiaLuvanice", icon: Github, label: "GitHub", color: "hover:text-foreground" },
        { href: "https://linkedin.com/in/samialuvanice", icon: Linkedin, label: "LinkedIn", color: "hover:text-[hsl(201,100%,35%)]" },
        { href: "mailto:samia.luvanice.dev@gmail.com", icon: Mail, label: "Email", color: "hover:text-primary" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulating form submission - in production, connect to a backend
        setTimeout(() => {
            toast.success("Mensagem enviada com sucesso! Entrarei em contato em breve.");
            setFormData({ name: "", email: "", message: "" });
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
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
                            Vamos <span className="text-gradient">Conversar</span>?
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Estou aberta a novas oportunidades e sempre feliz em conhecer pessoas
                            interessantes. Entre em contato!
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-card rounded-2xl p-8 shadow-card">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-display text-xl font-semibold">Envie uma mensagem</h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <Input
                                            placeholder="Seu nome"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="bg-secondary border-border focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="email"
                                            placeholder="Seu email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="bg-secondary border-border focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            placeholder="Sua mensagem..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            rows={5}
                                            className="bg-secondary border-border focus:border-primary resize-none"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>Enviando...</>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Enviar Mensagem
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="flex flex-col gap-6"
                        >
                            {/* Info Cards */}
                            <div className="bg-card rounded-2xl p-8 shadow-card">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-accent/10 text-accent">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <a
                                            href="mailto:samia.luvanice.dev@gmail.com"
                                            className="font-medium hover:text-primary transition-smooth"
                                        >
                                            samia.luvanice.dev@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-[hsl(188,88%,48%)]/10 text-[hsl(188,88%,48%)]">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Localização</p>
                                        <p className="font-medium">Sobral, CE - Brasil</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                        <Download className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Currículo</p>
                                        <a
                                            href="/cv-samia-luvanice.pdf"
                                            download
                                            className="font-medium hover:text-primary transition-smooth"
                                        >
                                            Download CV (PDF)
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-card rounded-2xl p-8 shadow-card">
                                <h3 className="font-display text-lg font-semibold mb-6">Me encontre nas redes</h3>
                                <div className="flex gap-4">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={social.label}
                                            href={social.href}
                                            target={social.href.startsWith("mailto") ? undefined : "_blank"}
                                            rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -5, scale: 1.1 }}
                                            className={`p-4 rounded-xl bg-secondary shadow-sm hover:shadow-card-hover transition-smooth ${social.color}`}
                                            title={social.label}
                                        >
                                            <social.icon className="w-6 h-6" />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="mt-24 pt-8 border-t border-border"
            >
                <div className="container mx-auto px-6">
                    <p className="text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                        Designed & Developed with passion by Sâmia Luvanice © {new Date().getFullYear()}
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

export default Contact;
