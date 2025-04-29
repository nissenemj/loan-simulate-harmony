"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";

interface NavHeaderProps {
  onNavigate?: (path: string) => void;
}

function NavHeader({ onNavigate }: NavHeaderProps) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || 
           (path !== "/" && location.pathname.startsWith(`${path}/`));
  };

  const navItems = [
    { label: t("navigation.home"), path: "/" },
    { label: t("navigation.calculator"), path: "/calculator" },
    { label: t("navigation.debtStrategies"), path: "/debt-strategies" },
    { label: t("navigation.blog"), path: "/blog" },
    { label: t("navigation.contact"), path: "/contact" },
  ];

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border-2 border-primary bg-background p-1"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {navItems.map((item) => (
        <Tab 
          key={item.path} 
          setPosition={setPosition} 
          active={isActive(item.path)}
          onClick={() => handleNavigation(item.path)}
        >
          {item.label}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
}

interface TabProps {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<{
    left: number;
    width: number;
    opacity: number;
  }>>;
  active?: boolean;
  onClick?: () => void;
}

const Tab = ({
  children,
  setPosition,
  active,
  onClick,
}: TabProps) => {
  const ref = useRef<HTMLLIElement>(null);
  
  React.useEffect(() => {
    if (active && ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      setPosition({
        width,
        opacity: 1,
        left: ref.current.offsetLeft,
      });
    }
  }, [active, setPosition]);

  return (
    <li
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className={`relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase mix-blend-difference md:px-5 md:py-3 md:text-base ${
        active ? "font-bold" : ""
      }`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-primary md:h-12"
    />
  );
};

export default NavHeader;
