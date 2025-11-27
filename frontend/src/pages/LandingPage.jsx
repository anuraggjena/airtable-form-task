import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="center-screen">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Build Smart Forms — Synced with Airtable ⚡
      </motion.h1>

      <motion.p
        className="max-w-lg text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .2 }}
      >
        Create forms, share with users, and automatically send submissions straight into Airtable.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: .95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: .3 }}
      >
        <Link to="/login" className="btn-primary text-lg px-8 py-4 rounded-xl">
          Get Started
        </Link>
      </motion.div>

      <motion.p
        className="text-gray-600 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .4 }}
      >
        No credit card • Secure OAuth • 100% yours
      </motion.p>
    </div>
  );
}
