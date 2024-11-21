"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Background3D from "@/components/Background3D";
import ProjectModal from "@/components/ProjectModal";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);

  return (
    <>
      <Background3D />
      
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Thejas Haridas
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8">
            Data Analytics & Computer Science
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <a
              href="#projects"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="border border-blue-600 text-blue-600 hover:bg-blue-900/20 px-6 py-3 rounded-lg transition-colors"
            >
              Contact Me
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8"
        >
          <ChevronDownIcon className="h-6 w-6 animate-bounce text-white" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">About Me</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-6 text-gray-300">
              Hello! I'm Thejas Haridas, a master's student specializing in Computer Science with a focus on Data Analytics. 
              As an aspiring Data Analyst, I have a solid foundation in Python programming, machine learning concepts, and document processing. 
              My passion lies in leveraging data-driven insights to solve real-world problems.
            </p>
            <p className="text-gray-300">
              Currently, I am gaining hands-on experience as a Research and Development intern at Digital University, 
              where I focus on cutting-edge projects involving OCR and LLMs.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-white">Featured Projects</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg cursor-pointer hover:bg-gray-800/50 transition-colors"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white">{project.title}</h3>
                  <p className="text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-blue-900/50 text-blue-200 text-sm px-3 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-white">Skills</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Programming & Frameworks</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Python</li>
                <li>TensorFlow/Keras</li>
                <li>Streamlit</li>
                <li>PyTorch</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Tools & Libraries</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Tesseract OCR</li>
                <li>Transformers</li>
                <li>Matplotlib/Seaborn</li>
                <li>Swarm Library</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">Get in Touch</h2>
          <p className="text-xl mb-8 text-gray-300">
            I'm always open to new opportunities and collaborations.
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="mailto:thejasharidas@gmail.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/thejas-haridas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/ThejasHaridas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

const projects = [
  {
    title: "Chaos-Based Audio Encryption",
    description: "Research on chaotic systems for audio encryption, comparing 2D and 3D hyperchaotic systems using spectrogram analysis.",
    technologies: ["Mathematical Modeling", "Signal Processing", "Data Visualization", "Spectrogram Analysis"],
    longDescription: "Developed a novel approach to audio encryption using chaotic systems, focusing on the comparison between 2D and 3D hyperchaotic systems.",
    challenges: [
      "Implementing complex mathematical models",
      "Optimizing encryption performance",
      "Analyzing spectrograms for security validation"
    ],
    outcomes: [
      "Enhanced encryption robustness",
      "Published research findings",
      "Improved audio security metrics"
    ]
  },
  {
    title: "Document Q&A System",
    description: "Built a system that parses PDFs into text, tables, and images using LlamaParser and indexes them in a vector database.",
    technologies: ["PDF Parsing", "Vector Database", "LLMs", "Streamlit"],
    longDescription: "Created an intelligent document processing system capable of understanding and answering questions about PDF content.",
    challenges: [
      "Handling various PDF formats",
      "Optimizing vector search",
      "Integrating multiple LLM models"
    ],
    outcomes: [
      "Improved document processing accuracy",
      "Reduced query response time",
      "Enhanced user experience"
    ]
  },
  {
    title: "BM25 Search Tool",
    description: "Developed a Streamlit app that allows users to input up to 10 PDFs and retrieve answers based on BM25 search indexing.",
    technologies: ["BM25 Algorithm", "Streamlit", "PDF Processing"],
    longDescription: "Built a powerful search tool implementing the BM25 ranking algorithm for accurate document retrieval.",
    challenges: [
      "Implementing efficient indexing",
      "Handling large PDF files",
      "Optimizing search performance"
    ],
    outcomes: [
      "Fast and accurate search results",
      "User-friendly interface",
      "Scalable architecture"
    ]
  },
  {
    title: "Deep Learning Video Detection",
    description: "Created a deep learning model for detecting sequential patterns in video data, focusing on spliced frame sequences.",
    technologies: ["TensorFlow", "OpenCV", "CNN/LSTM"],
    longDescription: "Developed an advanced video analysis system using deep learning for pattern detection and sequence analysis.",
    challenges: [
      "Processing large video datasets",
      "Training complex neural networks",
      "Real-time detection implementation"
    ],
    outcomes: [
      "High detection accuracy",
      "Real-time processing capability",
      "Reduced false positives"
    ]
  }
];
