"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  onItemClick?: (item: NavItem) => void
  currentPage?: string
}

export function NavBar({ items, className, onItemClick, currentPage }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(currentPage || items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Update activeTab when currentPage prop changes
  useEffect(() => {
    if (currentPage) {
      setActiveTab(currentPage)
    }
  }, [currentPage])

  const handleItemClick = (item: NavItem) => {
    setActiveTab(item.name)
    if (onItemClick) {
      onItemClick(item)
    }
  }

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50",
        className,
      )}
    >
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/40 py-2 px-2 rounded-full shadow-2xl shadow-black/60">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <button
              key={item.name}
              onClick={() => handleItemClick(item)}
              className={cn(
                "relative cursor-pointer text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300",
                "text-white hover:text-white hover:bg-white/15",
                isActive && "bg-white/25 text-white shadow-lg border border-white/30",
              )}
            >
              <span className="hidden md:inline drop-shadow-2xl text-shadow">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} className="drop-shadow-2xl" />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-white/15 rounded-full -z-10 border border-white/40"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    <div className="absolute w-12 h-6 bg-white/40 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-white/50 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-white/60 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
