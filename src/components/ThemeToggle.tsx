import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "../lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-3 rounded-lg border-2 border-foreground bg-background hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors duration-200",
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  )
}
