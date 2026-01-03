import React from "react";
import { motion } from "framer-motion";

interface Step {
  emoji: string;
  title: string;
  description: string;
}

interface ProcessFlowProps {
  title: string;
  steps: Step[];
  className?: string;
}

/**
 * ProcessFlow - Prosessikaavio vaihe vaiheelta
 *
 * Käyttö:
 * <ProcessFlow
 *   title="Näin haet velkajärjestelyä"
 *   steps={[
 *     { emoji: "📞", title: "Soita", description: "Velkaneuvontaan" },
 *     { emoji: "🤝", title: "Tapaa", description: "Neuvojan kanssa" },
 *     { emoji: "📝", title: "Hae", description: "Käräjäoikeuteen" },
 *     { emoji: "✅", title: "Valmis!", description: "Maksuohjelma alkaa" },
 *   ]}
 * />
 */
const ProcessFlow: React.FC<ProcessFlowProps> = ({ title, steps, className = "" }) => {
  return (
    <div
      className={`bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-6 md:p-8 my-8 ${className}`}
    >
      <h3 className="text-xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
        {title}
      </h3>

      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex-1 flex flex-col items-center text-center relative"
          >
            {/* Numero ja emoji */}
            <div className="relative">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-3xl">
                {step.emoji}
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-blue-600 text-white rounded-full text-sm font-bold flex items-center justify-center">
                {index + 1}
              </div>
            </div>

            {/* Teksti */}
            <h4 className="font-semibold mt-4 text-gray-900 dark:text-gray-100">
              {step.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {step.description}
            </p>

            {/* Nuoli (paitsi viimeinen) - näkyy vain desktop */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute right-0 top-8 transform translate-x-1/2 text-blue-400 text-2xl">
                →
              </div>
            )}

            {/* Nuoli alas mobiilissa (paitsi viimeinen) */}
            {index < steps.length - 1 && (
              <div className="md:hidden text-blue-400 text-2xl mt-2">↓</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProcessFlow;
