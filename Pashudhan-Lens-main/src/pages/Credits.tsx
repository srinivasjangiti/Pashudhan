import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Linkedin,
  Twitter,
  Mail,
  Phone,
  Youtube,
  ArrowUpRight,
  BookOpen,
  Code2,
  Heart,
  Home as HomeIcon,
  Upload,
  Info,
  Search,
} from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import heroImage from "@/assets/hero-wildlife.jpg";

interface CreditsProps {
  onNavigateHome: () => void;
  onGetStarted: () => void;
  onNavigateAbout: () => void;
  onNavigateLibrary: () => void;
}

interface SocialLink {
  label: string;
  handle: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string; // tailwind gradient classes
  ring: string; // hover ring color
  description: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    handle: "srinivasajan",
    url: "https://www.linkedin.com/in/srinivasajan/",
    icon: Linkedin,
    accent: "from-blue-500 to-sky-600",
    ring: "hover:ring-sky-400/60",
    description: "Professional profile & career",
  },
  {
    label: "X (Twitter)",
    handle: "@sriwanders",
    url: "https://x.com/sriwanders",
    icon: Twitter,
    accent: "from-slate-700 to-slate-900",
    ring: "hover:ring-slate-500/60",
    description: "Thoughts, builds, and quick takes",
  },
  {
    label: "Substack",
    handle: "@sriwanders",
    url: "https://substack.com/@sriwanders",
    icon: BookOpen,
    accent: "from-orange-500 to-rose-500",
    ring: "hover:ring-orange-400/60",
    description: "Long-form essays & deep dives",
  },
  {
    label: "Medium",
    handle: "@sriwanders",
    url: "https://medium.com/@sriwanders",
    icon: BookOpen,
    accent: "from-emerald-600 to-teal-700",
    ring: "hover:ring-emerald-400/60",
    description: "Articles & tutorials",
  },
  {
    label: "YouTube",
    handle: "@srinivasjan",
    url: "https://www.youtube.com/@srinivasjan",
    icon: Youtube,
    accent: "from-red-500 to-red-700",
    ring: "hover:ring-red-400/60",
    description: "Videos, demos & walkthroughs",
  },
];

const Credits = memo<CreditsProps>(
  ({ onNavigateHome, onGetStarted, onNavigateAbout, onNavigateLibrary }) => {
    const navItems = useMemo(
      () => [
        { name: "Home", url: "#home", icon: HomeIcon },
        { name: "Identify", url: "#identify", icon: Search },
        { name: "Upload", url: "#upload", icon: Upload },
        { name: "Library", url: "#library", icon: BookOpen },
        { name: "About", url: "#about", icon: Info },
      ],
      []
    );

    const handleNavClick = (item: { name: string }) => {
      if (item.name === "Upload" || item.name === "Identify") onGetStarted();
      else if (item.name === "Home") onNavigateHome();
      else if (item.name === "Library") onNavigateLibrary?.();
      else if (item.name === "About") onNavigateAbout?.();
    };

    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${heroImage})`, willChange: "auto" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/45 backdrop-blur-[2px] backdrop-saturate-150">
          <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Decorative orbs */}
        <div className="pointer-events-none absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-green-400/20 blur-3xl" />

        <NavBar
          items={navItems}
          onItemClick={handleNavClick}
          currentPage="Credits"
        />

        <div className="relative z-10 min-h-screen flex items-center pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              {/* Hero */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-12"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mx-auto mb-6 w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-600/40 ring-4 ring-white/20"
                >
                  <span className="font-heading text-4xl text-white drop-shadow-lg">
                    SJ
                  </span>
                </motion.div>

                <p className="text-emerald-300/90 text-sm font-semibold uppercase tracking-[0.25em] mb-3 drop-shadow">
                  Credits
                </p>

                <h1 className="font-heading text-5xl md:text-7xl font-normal text-white mb-4 leading-tight tracking-tight drop-shadow-2xl">
                  Srinivas Jangiti
                </h1>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="bg-white/95 backdrop-blur-sm rounded-xl border border-emerald-100/50 p-5 mb-6 shadow-lg max-w-2xl mx-auto"
                >
                  <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                    Built with care for India&apos;s farmers and livestock
                    professionals. Pashudhan Lens is an independent project by
                    Srinivas, designed to make AI-powered breed recognition
                    accessible to everyone supporting the Bharat Pashudhan App
                    ecosystem.
                  </p>
                </motion.div>
              </motion.div>

              {/* Social Links Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-10"
              >
                <h2 className="text-center text-emerald-200 font-heading text-2xl md:text-3xl mb-6 drop-shadow">
                  Find me online
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SOCIAL_LINKS.map((link, i) => {
                    const Icon = link.icon;
                    return (
                      <motion.a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.07 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          group block bg-white/95 backdrop-blur-sm
                          rounded-xl border border-white/40
                          p-5 shadow-lg hover:shadow-2xl
                          transition-all duration-300
                          ring-0 hover:ring-2 ${link.ring}
                        `}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`
                              w-11 h-11 rounded-lg flex items-center justify-center
                              bg-gradient-to-br ${link.accent}
                              shadow-md group-hover:shadow-lg transition-shadow
                            `}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-emerald-600 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>

                        <h3 className="text-lg font-heading font-semibold text-gray-800 mb-0.5">
                          {link.label}
                        </h3>
                        <p className="text-sm font-mono text-emerald-700 mb-2">
                          {link.handle}
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {link.description}
                        </p>
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.85 }}
                className="mb-10"
              >
                <h2 className="text-center text-emerald-200 font-heading text-2xl md:text-3xl mb-6 drop-shadow">
                  Get in touch
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <motion.a
                    href="mailto:srinivasajan.work@gmail.com"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/95 backdrop-blur-sm rounded-xl border border-emerald-200/50 p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-0.5">
                        Email
                      </p>
                      <p className="text-base font-mono text-gray-800 truncate">
                        srinivasajan.work@gmail.com
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-emerald-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </motion.a>

                  <motion.a
                    href="tel:+918767505121"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/95 backdrop-blur-sm rounded-xl border border-emerald-200/50 p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-0.5">
                        Mobile
                      </p>
                      <p className="text-base font-mono text-gray-800">
                        +91 8767505121
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-emerald-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                </div>
              </motion.div>

              {/* Build footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.05 }}
                className="text-center bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-100/50 p-6 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold">
                    Built with
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide
                  Icons, and the Google Gemini API.
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-emerald-700">
                  <span>Made with</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>in India</span>
                  <span className="mx-1">·</span>
                  <span>© {new Date().getFullYear()} Srinivas Jangiti</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Credits.displayName = "Credits";

export default Credits;
