import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { href: "https://github.com/SamiaLuvanice", icon: Github, label: "GitHub" },
        { href: "https://linkedin.com/in/samialuvanice", icon: Linkedin, label: "LinkedIn" },
        { href: "mailto:samia.luvanice.dev@gmail.com", icon: Mail, label: "Email" },
    ];

    return (
        <footer className="border-t border-border/60 bg-background">
            <div className="container mx-auto max-w-5xl px-6 py-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                            Sâmia Luvanice
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Desenvolvedora Full Stack
                        </p>
                    </div>

                    <div className="space-y-3 md:text-right">
                        <h4 className="text-sm font-medium text-foreground/80">Me encontre</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground md:justify-end">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 transition-smooth hover:text-primary"
                                    title={social.label}
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                    <span>{social.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                    <p>Portfolio pessoal - Sâmia Luvanice © {currentYear}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
