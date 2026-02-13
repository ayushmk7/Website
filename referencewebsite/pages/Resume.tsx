import { Briefcase, GraduationCap, Award, Code } from "lucide-react";

export default function Resume() {
  const resumeData = {
    experience: [
      {
        title: "Senior Software Developer",
        company: "Tech Company",
        period: "2022 - Present",
        description: "Leading development of scalable web applications and mentoring junior developers.",
        achievements: [
          "Improved application performance by 40%",
          "Led a team of 5 developers",
          "Implemented CI/CD pipeline"
        ]
      },
      {
        title: "Software Developer",
        company: "Startup Inc",
        period: "2020 - 2022",
        description: "Developed full-stack web applications using React and Node.js.",
        achievements: [
          "Built 3 major product features",
          "Reduced bug count by 60%",
          "Optimized database queries"
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University Name",
        period: "2016 - 2020",
        gpa: "3.8/4.0",
        highlights: [
          "Dean's List all semesters",
          "Computer Science Award 2020",
          "President of Coding Club"
        ]
      }
    ],
    skills: {
      languages: ["JavaScript", "TypeScript", "Python", "Java", "C++"],
      frameworks: ["React", "Node.js", "Express", "TensorFlow", "Django"],
      tools: ["Git", "Docker", "AWS", "MongoDB", "PostgreSQL"],
      concepts: ["Machine Learning", "Cybersecurity", "System Design", "Agile"]
    },
    certifications: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023"
      },
      {
        name: "Machine Learning Specialization",
        issuer: "Coursera",
        date: "2022"
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-1 bg-blue-600 mx-auto mb-4 rounded-full"></div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
          Resume
        </h1>
        <p className="text-lg text-muted-foreground">
          Professional Experience & Qualifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Experience Section */}
        <section className="bg-background border-4 border-black dark:border-white rounded-3xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl">Experience</h2>
          </div>
          
          <div className="space-y-6">
            {resumeData.experience.map((job, index) => (
              <div
                key={index}
                className="border-2 border-black dark:border-white rounded-2xl p-6 hover:border-blue-600 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <div>
                    <h3 className="text-xl mb-1">{job.title}</h3>
                    <p className="text-blue-600">{job.company}</p>
                  </div>
                  <span className="text-muted-foreground mt-2 md:mt-0">{job.period}</span>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {job.description}
                </p>
                <div className="space-y-2">
                  {job.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="leading-relaxed">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="bg-background border-4 border-black dark:border-white rounded-3xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl">Education</h2>
          </div>
          
          <div className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <div
                key={index}
                className="border-2 border-black dark:border-white rounded-2xl p-6 hover:border-blue-600 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <div>
                    <h3 className="text-xl mb-1">{edu.degree}</h3>
                    <p className="text-blue-600">{edu.institution}</p>
                  </div>
                  <span className="text-muted-foreground mt-2 md:mt-0">{edu.period}</span>
                </div>
                <p className="text-muted-foreground mb-4">GPA: {edu.gpa}</p>
                <div className="space-y-2">
                  {edu.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-background border-4 border-black dark:border-white rounded-3xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl">Skills</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-black dark:border-white rounded-2xl p-5">
              <h3 className="text-lg mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.languages.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm border border-black dark:border-white bg-background rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-2 border-black dark:border-white rounded-2xl p-5">
              <h3 className="text-lg mb-3">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.frameworks.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm border border-black dark:border-white bg-background rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-2 border-black dark:border-white rounded-2xl p-5">
              <h3 className="text-lg mb-3">Tools & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.tools.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm border border-black dark:border-white bg-background rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-2 border-black dark:border-white rounded-2xl p-5">
              <h3 className="text-lg mb-3">Concepts</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.concepts.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm border border-black dark:border-white bg-background rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="bg-background border-4 border-black dark:border-white rounded-3xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl">Certifications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {resumeData.certifications.map((cert, index) => (
              <div
                key={index}
                className="border-2 border-black dark:border-white rounded-2xl p-5 hover:border-blue-600 transition-all duration-300"
              >
                <h3 className="text-lg mb-2">{cert.name}</h3>
                <p className="text-muted-foreground">{cert.issuer}</p>
                <p className="text-blue-600 mt-2">{cert.date}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
