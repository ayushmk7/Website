export default function Home() {
  const interests = [
    {
      title: "Machine Learning",
      description: "Building intelligent systems that learn and adapt",
      icon: "🤖"
    },
    {
      title: "Cybersecurity", 
      description: "Protecting digital assets and ensuring data privacy",
      icon: "🔒"
    },
    {
      title: "App/Web Development",
      description: "Creating beautiful, responsive user experiences",
      icon: "💻"
    },
    {
      title: "AI Research",
      description: "Exploring cutting-edge artificial intelligence",
      icon: "🧠"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-16 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
          Software Developer
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Passionate about building innovative solutions that solve real-world problems
        </p>
      </div>

      {/* About Me Section */}
      <div className="bg-blue-600 text-white p-8 md:p-10 rounded-3xl border-4 border-black dark:border-white shadow-lg mb-8">
        <div className="w-12 h-1 bg-white/80 mb-6 rounded-full"></div>
        <h2 className="text-2xl md:text-3xl mb-6">About Me</h2>
        <div className="space-y-5 text-lg leading-relaxed max-w-4xl">
          <p>
            Passionate software developer with experience in modern web 
            technologies and machine learning. I love building innovative 
            solutions that solve real-world problems.
          </p>
          <p>
            Currently focused on cybersecurity and exploring the intersection 
            of AI and cybersecurity. Always eager to talk to people, learn new 
            technologies and contribute to open source projects.
          </p>
        </div>
      </div>

      {/* My Interests Section */}
      <div className="bg-background p-8 md:p-10 border-4 border-black dark:border-white rounded-3xl shadow-lg">
        <div className="w-12 h-1 bg-blue-600 mb-6 rounded-full"></div>
        <h2 className="text-2xl md:text-3xl mb-8">My Interests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interests.map((interest, index) => (
            <div 
              key={index}
              className="bg-background p-6 border-2 border-black dark:border-white rounded-2xl hover:border-blue-600 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {interest.icon}
                </span>
                <div>
                  <h3 className="text-xl mb-2">{interest.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {interest.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
