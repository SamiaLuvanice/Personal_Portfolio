import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { href: "https://github.com/SamiaLuvanice", icon: Github, label: "GitHub" },
        { href: "https://linkedin.com/in/samialuvanice", icon: Linkedin, label: "LinkedIn" },
        { href: "mailto:samia.luvanice.dev@gmail.com", icon: Mail, label: "Email" },
    ];

    const footerLinks = [
        { label: "GitHub", href: "https://github.com/SamiaLuvanice" },
        { label: "LinkedIn", href: "https://linkedin.com/in/samialuvanice" },
        { label: "Email", href: "mailto:samia.luvanice.dev@gmail.com" },
    ];

    return (
        <footer className="relative bg-background border-t border-border">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 py-12 relative z-10">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Brand section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="font-display text-xl font-bold mb-2 text-gradient">
                            Sâmia Luvanice
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Desenvolvedora Full Stack (React/Node) | APIs • Deploy • Boas práticas
                        </p>
                    </motion.div>

                    {/* Quick links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-semibold mb-4">Links Rápidos</h4>
                        <ul className="space-y-2">
                            {[
                                { label: "Início", href: "#hero" },
                                { label: "Sobre", href: "#about" },
                                { label: "Projetos", href: "#projects" },
                                { label: "Contato", href: "#contact" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-smooth text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-semibold mb-4">Me encontre</h4>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    className="p-2 rounded-lg bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-smooth"
                                    title={social.label}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Separator */}
                <Separator className="my-8" />

                {/* Bottom section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex justify-center items-center"
                >
                    <p className="text-muted-foreground text-sm">
                        Designed & Developed with passion by Sâmia Luvanice © {currentYear}
                    </p>

                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
