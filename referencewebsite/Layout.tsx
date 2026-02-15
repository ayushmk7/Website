import { Github, Linkedin, Mail, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router";

export default function Layout() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/yourusername",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/yourprofile",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:your.email@example.com",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b-2 border-black dark:border-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="text-xl md:text-2xl tracking-tight hover:text-blue-600 transition-colors">
              AYUSH MADHAV KUMAR
            </NavLink>

            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-foreground/5'
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/resume"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-foreground/5'
                    }`
                  }
                >
                  Resume
                </NavLink>
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-foreground/5'
                    }`
                  }
                >
                  Projects
                </NavLink>
              </nav>

              <div className="hidden sm:flex items-center gap-2">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border-2 border-black dark:border-white bg-background hover:bg-foreground hover:text-background transition-all duration-300 rounded-xl"
                    aria-label={link.name}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}

                <button
                  onClick={toggleTheme}
                  className="p-2 border-2 border-black dark:border-white bg-background hover:bg-foreground hover:text-background transition-all duration-300 rounded-xl"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <nav className="flex md:hidden items-center gap-1 mt-3 border-t-2 border-black dark:border-white pt-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex-1 text-center px-3 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-foreground/5'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/resume"
              className={({ isActive }) =>
                `flex-1 text-center px-3 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-foreground/5'
                }`
              }
            >
              Resume
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `flex-1 text-center px-3 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-foreground/5'
                }`
              }
            >
              Projects
            </NavLink>
          </nav>

          <div className="flex sm:hidden items-center justify-center gap-2 mt-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border-2 border-black dark:border-white bg-background hover:bg-foreground hover:text-background transition-all duration-300 rounded-xl"
                aria-label={link.name}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}

            <button
              onClick={toggleTheme}
              className="p-2 border-2 border-black dark:border-white bg-background hover:bg-foreground hover:text-background transition-all duration-300 rounded-xl"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
