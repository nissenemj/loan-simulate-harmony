import React from "react";
import { motion } from "framer-motion";

type TimelineStatus = "past" | "current" | "future";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  status: TimelineStatus;
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
  className?: string;
}

/**
 * Timeline - Aikajana tapahtumille
 *
 * Käyttö:
 * <Timeline
 *   title="Velkajärjestelyn aikataulu"
 *   items={[
 *     { date: "Tammikuu", title: "Hakemus", description: "Jätä hakemus", status: "past" },
 *     { date: "Helmikuu", title: "Käsittely", description: "Käräjäoikeus käsittelee", status: "current" },
 *     { date: "Maaliskuu", title: "Päätös", description: "Saat päätöksen", status: "future" },
 *   ]}
 * />
 */
const Timeline: React.FC<TimelineProps> = ({ items, title, className = "" }) => {
  const getStatusStyles = (status: TimelineStatus) => {
    switch (status) {
      case "past":
        return {
          dot: "bg-green-500 border-green-500",
          card: "bg-green-50 dark:bg-green-950/20",
        };
      case "current":
        return {
          dot: "bg-blue-600 border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900",
          card: "bg-blue-50 dark:bg-blue-950/30",
        };
      case "future":
        return {
          dot: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
          card: "bg-gray-50 dark:bg-gray-800/50",
        };
    }
  };

  return (
    <div className={`my-8 ${className}`}>
      {title && (
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}

      <div className="relative">
        {/* Pystyviiva */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-6">
          {items.map((item, index) => {
            const styles = getStatusStyles(item.status);

            return (
              <motion.div
                key={index}
                className="relative pl-12"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                {/* Pallo */}
                <div
                  className={`absolute left-2 w-5 h-5 rounded-full border-2 ${styles.dot}`}
                />

                {/* Sisältökortti */}
                <div className={`p-4 rounded-lg ${styles.card}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.date}
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.description}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
