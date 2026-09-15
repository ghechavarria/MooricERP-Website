import { motion } from "framer-motion";
import { HeroCopy } from "./HeroCopy";
import { SITE_PHOTOS } from "../config/photos";

export function Hero() {
  return (
    <section id="top" className="v4-hero" aria-labelledby="hero-heading">
      <div className="layout-shell">
        <div className="v4-rail v4-hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <HeroCopy />
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="v4-hero-video">
              <video
                src={SITE_PHOTOS.hero.video}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden
              />
              <div className="v4-hero-video__veil" aria-hidden />
              <div className="v4-hero-video__copy">
                <p>Intelligent mortgage platform</p>
                <p>Empowering better closings</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
