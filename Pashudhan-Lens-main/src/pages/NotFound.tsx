import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Home as HomeIcon, Compass, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SharedLayout } from "@/components/SharedLayout";

const NotFound = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <SharedLayout background="default" className="overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-green-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl text-center">
          {/* Big 404 with gradient */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-8 inline-block"
          >
            <h1 className="font-heading text-[10rem] sm:text-[14rem] leading-none font-normal tracking-tight">
              <span className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(16,185,129,0.25)]">
                4
              </span>
              <span className="relative inline-block">
                {/* hollow zero with rotating ring */}
                <span className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                  0
                </span>
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -m-2 rounded-full border-2 border-dashed border-emerald-400/60"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                />
              </span>
              <span className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(16,185,129,0.25)]">
                4
              </span>
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-heading text-3xl sm:text-4xl text-emerald-900 mb-3"
          >
            This pasture is empty
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-emerald-800/80 max-w-xl mx-auto mb-2 leading-relaxed"
          >
            We couldn&apos;t find the page you were looking for.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="font-mono text-xs text-emerald-700/70 mb-10 break-all"
          >
            {location.pathname}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              onClick={() => navigate("/")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <HomeIcon className="w-4 h-4" />
              Return Home
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="bg-white/80 hover:bg-white border-emerald-300 text-emerald-800 px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/upload")}
              variant="outline"
              className="bg-white/60 hover:bg-white border-emerald-200 text-emerald-700 px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Try Breed Analysis
            </Button>
          </motion.div>

          {/* Decorative compass */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-14 flex items-center justify-center gap-2 text-emerald-700/70 text-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Lost? Head back to familiar ground.</span>
          </motion.div>
        </div>
      </div>
    </SharedLayout>
  );
});

NotFound.displayName = "NotFound";

export default NotFound;
