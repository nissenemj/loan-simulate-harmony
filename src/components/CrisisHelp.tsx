import React from "react";
import { Phone, MessageCircle, Heart } from "lucide-react";

interface CrisisHelpProps {
  variant?: "default" | "compact" | "prominent";
  className?: string;
}

const helplines = [
  {
    name: "Kriisipuhelin",
    number: "09 2525 0111",
    description: "24h, joka päivä",
    icon: Phone,
  },
  {
    name: "Talous- ja velkaneuvonta",
    number: "0295 660 123",
    description: "Maksuton, arkisin 8-16",
    icon: MessageCircle,
  },
  {
    name: "Takuusäätiö",
    number: "0800 9 8009",
    description: "Maksuton neuvonta",
    icon: Heart,
  },
];

const CrisisHelp: React.FC<CrisisHelpProps> = ({
  variant = "default",
  className = "",
}) => {
  // Compact variant - simple one-liner for tight spaces
  if (variant === "compact") {
    return (
      <div
        className={`bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}
      >
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Tarvitsetko apua?</strong> Talous- ja velkaneuvonta:{" "}
          <a
            href="tel:0295660123"
            className="font-medium hover:underline"
          >
            0295 660 123
          </a>{" "}
          (maksuton)
        </p>
      </div>
    );
  }

  // Prominent variant - for pages with serious content
  if (variant === "prominent") {
    return (
      <aside
        className={`bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-6 md:p-8 my-8 ${className}`}
        aria-label="Kriisiapu ja yhteystiedot"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span className="text-2xl">💙</span> Apua on saatavilla
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Jos tilanne ahdistaa, et ole yksin. Nämä palvelut auttavat sinua eteenpäin:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {helplines.map((line) => (
            <div
              key={line.name}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <line.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {line.name}
                </span>
              </div>
              <a
                href={`tel:${line.number.replace(/\s/g, "")}`}
                className="text-lg font-bold text-blue-700 dark:text-blue-400 hover:underline block"
              >
                {line.number}
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {line.description}
              </p>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  // Default variant - balanced display
  return (
    <aside
      className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 my-8 ${className}`}
      aria-label="Kriisiapu ja yhteystiedot"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span>💙</span> Apua on saatavilla
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Jos tilanne ahdistaa, et ole yksin. Nämä palvelut auttavat:
      </p>
      <ul className="space-y-3">
        {helplines.map((line) => (
          <li key={line.name} className="flex items-start gap-3">
            <line.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <a
                href={`tel:${line.number.replace(/\s/g, "")}`}
                className="font-medium text-blue-700 dark:text-blue-400 hover:underline"
              >
                {line.name}: {line.number}
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {line.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CrisisHelp;
