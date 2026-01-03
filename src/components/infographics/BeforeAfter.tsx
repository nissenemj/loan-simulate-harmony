import React from "react";
import { motion } from "framer-motion";

interface ComparisonData {
  label: string;
  value: string;
  details?: string[];
}

interface BeforeAfterProps {
  title: string;
  before: ComparisonData;
  after: ComparisonData;
  className?: string;
}

/**
 * BeforeAfter - Ennen/jälkeen -vertailu
 *
 * Käyttö:
 * <BeforeAfter
 *   title="Marin tilanne"
 *   before={{
 *     label: "Ennen velkajärjestelyä",
 *     value: "45 000 €",
 *     details: ["Stressaantunut", "Unettomuutta", "Perintäkirjeitä"]
 *   }}
 *   after={{
 *     label: "Velkajärjestelyn jälkeen",
 *     value: "0 €",
 *     details: ["Velaton", "Rauhallinen mieli", "Uusi alku"]
 *   }}
 * />
 */
const BeforeAfter: React.FC<BeforeAfterProps> = ({
  title,
  before,
  after,
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden my-8 ${className}`}
    >
      <h3 className="text-lg font-bold text-center py-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        {title}
      </h3>

      <div className="grid md:grid-cols-2 relative">
        {/* Ennen */}
        <motion.div
          className="p-6 bg-gray-50 dark:bg-gray-800/50"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {before.label}
            </span>
            <div className="text-4xl font-bold text-gray-700 dark:text-gray-300 mt-2">
              {before.value}
            </div>
          </div>
          {before.details && (
            <ul className="mt-4 space-y-2">
              {before.details.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm"
                >
                  <span className="text-gray-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Nuoli keskellä */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-2xl border-2 border-green-500"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
          >
            →
          </motion.div>
        </div>

        {/* Jälkeen */}
        <motion.div
          className="p-6 bg-green-50 dark:bg-green-950/30"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <span className="text-sm text-green-600 dark:text-green-400 uppercase tracking-wide">
              {after.label}
            </span>
            <div className="text-4xl font-bold text-green-700 dark:text-green-400 mt-2">
              {after.value}
            </div>
          </div>
          {after.details && (
            <ul className="mt-4 space-y-2">
              {after.details.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm"
                >
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BeforeAfter;
