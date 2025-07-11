import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
    },
  }),
};

function About() {
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    setIsSending(true);

    try {
      const response = await fetch("https://formspree.io/f/xqabjdwz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("✅ Message sent successfully!");
        form.reset();
      } else {
        toast.error("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("⚠️ An error occurred. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* 🌟 Heading */}
        <motion.h1
          className="about-heading text-center text-4xl font-fancy"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          custom={0}
          viewport={{ once: true }}
        >
          About COINIQ
        </motion.h1>

        <motion.div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
          }}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          custom={0.2}
          viewport={{ once: true }}
        >
          <p className="text-lg leading-relaxed">
            Welcome to <strong>COINIQ</strong> — your all-in-one platform for
            real-time cryptocurrency tracking and market insights. Whether
            you're a seasoned investor or just exploring the world of digital
            assets, COINIQ provides live updates on trending coins, current
            prices, market capitalizations, and more — all in one place.
          </p>
        </motion.div>

        {/* 👨‍💻 Developer Info */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          custom={0.4}
          viewport={{ once: true }}
        >
          <div
            style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}
          >
            <h2 className="mb-2 text-2xl">
              👨‍💻 <span className="developer-heading">Developer</span>
            </h2>

            {/* 👤 Developer Image */}
            <motion.img
              src="/pic.jpg"
              alt="Adityaraj Singh Goud"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "50%",
                margin: "1rem auto",
                border: "4px solid #e0e0e0",
                display: "block",
              }}
            />

            <p className="mb-4">
              Hi! I'm <strong>Adityaraj Singh Goud</strong>, a passionate
              full-stack web developer with a strong foundation in building
              fast, functional, and visually appealing user interfaces. I
              specialize in React, Node.js, and MongoDB, and I enjoy crafting
              seamless, real-world web applications.
            </p>
          </div>
        </motion.div>

        {/* 🌐 Social Icons Animated */}
        <motion.div
          className="flex text-3xl mt-6"
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            gap: "2.5rem",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <a
            href="https://github.com/adityarajgoud"
            target="_blank"
            rel="noreferrer"
            className="hover:scale-110 transition-transform duration-300"
            aria-label="GitHub"
            title="GitHub"
            style={{
              color: "#555",
              boxShadow: "0 0 10px rgba(23, 21, 21, 0.15)",
            }}
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/adityaraj-singh-goud-063656245?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
            target="_blank"
            rel="noreferrer"
            className="hover:scale-110 transition-transform duration-300"
            aria-label="LinkedIn"
            title="LinkedIn"
            style={{
              color: "#0A66C2",
              boxShadow: "0 0 10px rgba(10, 102, 194, 0.15)",
            }}
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.instagram.com/aditya_goud_2?igsh=MWZpd255aXA2YzVmag=="
            target="_blank"
            rel="noreferrer"
            className="hover:scale-110 transition-transform duration-300"
            aria-label="Instagram"
            title="Instagram"
            style={{
              color: "#E1306C",
              boxShadow: "0 0 10px rgba(225, 48, 108, 0.15)",
            }}
          >
            <FaInstagram />
          </a>
        </motion.div>

        {/* 📬 Contact Form */}
        <motion.div
          className="w-full flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="w-full max-w-5xl p-6 rounded-2xl shadow-xl border border-gray-200 bg-white">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              📬 Contact Me
            </h2>
            <form onSubmit={handleSubmit} className="w-full">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="input-glow"
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    className="input-glow"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div className="mb-6" style={{ textAlign: "center" }}>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="4"
                  required
                  className="input-glow"
                  style={{
                    width: "80%",
                    maxWidth: "600px",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                ></textarea>
              </div>

              <div className="button-center" style={{ textAlign: "center" }}>
                <button
                  type="submit"
                  className="cool-btn"
                  disabled={isSending}
                  style={{
                    opacity: isSending ? 0.6 : 1,
                    pointerEvents: isSending ? "none" : "auto",
                  }}
                >
                  {isSending ? "⏳ Sending..." : "🚀 Send Message"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* 🌐 Footer */}
        <footer className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://github.com/adityarajgoud"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              Adityaraj Singh Goud
            </a>{" "}
            • Delivering live market data with precision
          </p>
        </footer>
      </div>
    </div>
  );
}

export default About;
