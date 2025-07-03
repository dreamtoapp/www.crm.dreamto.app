"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) {
    // Render a static icon/label to match SSR
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="تبديل إلى الوضع الداكن"
        className="transition-colors duration-150 hover:bg-accent hover:text-primary cursor-pointer"
        disabled
      >
        <Moon className="size-5" />
      </Button>
    )
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "تبديل إلى الوضع الفاتح" : "تبديل إلى الوضع الداكن"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="transition-colors duration-150 hover:bg-accent hover:text-primary cursor-pointer"
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  )
} 