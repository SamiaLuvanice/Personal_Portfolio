import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

const Contact = () => {
    const socialLinks = [
        { href: "https://github.com/SamiaLuvanice", icon: Github, label: "GitHub", color: "hover:text-foreground" },
        { href: "https://linkedin.com/in/samialuvanice", icon: Linkedin, label: "LinkedIn", color: "hover:text-[hsl(201,100%,35%)]" },
    ];

    return (
        <section id="contact" className="py-24">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-10"
                    >
                        <h2 className="font-display text-4xl font-bold uppercase tracking-tight md:text-6xl">
                            <span className="text-gradient">Contato</span>
                        </h2>
                        <div className="mt-5 h-px w-full bg-border/80" />
                    </motion.div>

                    <div className="grid gap-16 md:grid-cols-2 md:gap-20">
                        <motion.div
                            initial={{ opacity: 0, x: -18 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                    E-mail
                                </p>
                                <a
                                    href="mailto:samia.luvanice.dev@gmail.com"
                                    className="mt-3 inline-flex items-center gap-3 text-2xl font-medium tracking-tight transition-smooth hover:text-primary md:text-3xl"
                                >
                                    <span>samia.luvanice.dev@gmail.com</span>
                                    <span aria-hidden="true">↗</span>
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 18 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="space-y-10 md:border-l md:border-border/80 md:pl-10"
                        >
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                    Redes sociais
                                </p>
                                <div className="mt-4 space-y-3">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={social.label}
                                            href={social.href}
                                            target={social.href.startsWith("mailto") ? undefined : "_blank"}
                                            rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.35, delay: 0.22 + index * 0.08 }}
                                            viewport={{ once: true }}
                                            whileHover={{ x: 4 }}
                                            className={`flex items-center gap-3 text-lg font-medium tracking-tight transition-smooth ${social.color}`}
                                            title={social.label}
                                        >
                                            <span aria-hidden="true">↗</span>
                                            <span>{social.label.toLowerCase()}</span>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                    Currículo
                                </p>
                                <a
                                    href="/curriculo.pdf"
                                    download="Curriculo-Samia-Luvanice.pdf"
                                    className="mt-3 inline-flex items-center gap-3 text-lg font-medium tracking-tight transition-smooth hover:text-primary"
                                >
                                    <span>download cv (pdf)</span>
                                    <span aria-hidden="true">↗</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;