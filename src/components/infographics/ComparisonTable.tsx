import React from "react";
import { motion } from "framer-motion";

interface ComparisonRow {
  label: string;
  values: (string | React.ReactNode)[];
}

interface ComparisonTableProps {
  title: string;
  headers: string[];
  rows: ComparisonRow[];
  className?: string;
}

/**
 * ComparisonTable - Vertailutaulukko
 *
 * Käyttö:
 * <ComparisonTable
 *   title="Strategioiden vertailu"
 *   headers={["Lumivyöry", "Lumipallo"]}
 *   rows={[
 *     { label: "Periaate", values: ["Korkein korko ensin", "Pienin velka ensin"] },
 *     { label: "Säästö", values: ["Eniten", "Vähemmän"] },
 *     { label: "Motivaatio", values: ["Hitaampi", "Nopeampi"] },
 *   ]}
 * />
 */
const ComparisonTable: React.FC<ComparisonTableProps> = ({
  title,
  headers,
  rows,
  className = "",
}) => {
  return (
    <motion.div
      className={`my-8 overflow-x-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="p-4 text-left font-semibold border-b dark:border-gray-700 text-gray-900 dark:text-gray-100"></th>
            {headers.map((header, i) => (
              <th
                key={i}
                className="p-4 text-center font-semibold border-b dark:border-gray-700 text-gray-900 dark:text-gray-100"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={i}
              className="border-b dark:border-gray-700 last:border-0"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              viewport={{ once: true }}
            >
              <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                {row.label}
              </td>
              {row.values.map((value, j) => (
                <td
                  key={j}
                  className="p-4 text-center text-gray-600 dark:text-gray-400"
                >
                  {value}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ComparisonTable;
