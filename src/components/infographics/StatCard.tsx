import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

type StatCardVariant = "default" | "success" | "info" | "warning";

interface StatCardProps {
  number: number;
  unit?: string;
  label: string;
  description?: string;
  emoji?: string;
  variant?: StatCardVariant;
  className?: string;
}

/**
 * StatCard - Animoitu numerokortti
 *
 * Käyttö:
 * <StatCard
 *   emoji="💰"
 *   number={743}
 *   unit="€"
 *   label="Suojaosuus"
 *   description="Tämä summa jää sinulle aina"
 *   variant="success"
 * />
 */
const StatCard: React.FC<StatCardProps> = ({
  number,
  unit,
  label,
  description,
  emoji,
  variant = "default",
  className = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });
  const [displayNumber, setDisplayNumber] = useState(0);

  const variants: Record<StatCardVariant, string> = {
    default: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
    success: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  };

  // Animoi numero kun kortti tulee näkyviin
  useEffect(() => {
    if (isInView) {
      const controls = animate(0, number, {
        duration: 1.5,
        onUpdate(value) {
          setDisplayNumber(Math.round(value));
        },
      });

      return () => controls.stop();
    }
  }, [isInView, number]);

  return (
    <motion.div
      ref={cardRef}
      className={`rounded-xl p-6 border shadow-sm ${variants[variant]} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      {emoji && <div className="text-3xl mb-2">{emoji}</div>}
      <div className="flex items-baseline gap-1">
        <span
          ref={ref}
          className="text-4xl font-bold text-gray-900 dark:text-gray-100"
        >
          {displayNumber.toLocaleString("fi-FI")}
        </span>
        {unit && (
          <span className="text-xl text-gray-500 dark:text-gray-400">{unit}</span>
        )}
      </div>
      <div className="font-medium text-gray-900 dark:text-gray-100 mt-1">
        {label}
      </div>
      {description && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </div>
      )}
    </motion.div>
  );
};

interface StatCardGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * StatCardGrid - Wrapper numerokorteille
 *
 * Käyttö:
 * <StatCardGrid>
 *   <StatCard ... />
 *   <StatCard ... />
 *   <StatCard ... />
 * </StatCardGrid>
 */
const StatCardGrid: React.FC<StatCardGridProps> = ({ children, className = "" }) => {
  return (
    <div className={`grid md:grid-cols-3 gap-4 my-8 ${className}`}>
      {children}
    </div>
  );
};

export { StatCard, StatCardGrid };
export default StatCard;
