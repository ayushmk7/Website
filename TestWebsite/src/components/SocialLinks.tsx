import * as React from "react"
import { Github, Linkedin, Mail, Check, Copy } from "lucide-react"
import { cn } from "../lib/utils"
import { ThemeToggle } from "./ThemeToggle"

interface SocialLinksProps {
  className?: string
}

export function SocialLinks({ className }: SocialLinksProps) {
  const [showEmailTooltip, setShowEmailTooltip] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const email = "contactayushmadhav@gmail.com"

  const links = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/FriedOkra1",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/ayushmk",
    },
  ]

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy email", err)
    }
  }

  return (
    <div className={cn("flex justify-center gap-4", className)}>
      <div 
        className="relative"
        onMouseEnter={() => setShowEmailTooltip(true)}
        onMouseLeave={() => setShowEmailTooltip(false)}
      >
        <button
          className="p-3 rounded-lg border-2 border-foreground bg-background hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors duration-200"
          aria-label="Email"
          onClick={(e) => {
            e.preventDefault()
            setShowEmailTooltip(!showEmailTooltip)
          }}
        >
          <Mail className="w-6 h-6" />
        </button>

        {showEmailTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
            <div className="bg-background border-4 border-foreground rounded-2xl p-2 flex items-center gap-2 shadow-lg whitespace-nowrap">
              <span className="text-sm font-medium px-2">{email}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyEmail()
                }}
                className={cn(
                  "p-1.5 rounded-lg text-background transition-colors duration-200",
                  copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                )}
                aria-label="Copy email"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[2px]">
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-foreground"></div>
            </div>
          </div>
        )}
      </div>

      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-lg border-2 border-foreground bg-background hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors duration-200"
          aria-label={link.name}
        >
          <link.icon className="w-6 h-6" />
        </a>
      ))}
      <ThemeToggle />
    </div>
  )
}
