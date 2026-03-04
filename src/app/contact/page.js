export default function ContactPage() {
  return (
    <main className="px-6 pt-(--spacing-section) pb-(--spacing-section) max-w-3xl mx-auto">
      <h1
        className="text-4xl sm:text-5xl text-cream-100 mb-4"
        style={{
          fontWeight: "var(--font-weight-display)",
          letterSpacing: "var(--tracking-display)",
        }}
      >
        Get in Touch
      </h1>
      <p className="text-cream-200 text-lg mb-12">
        Feel free to reach out through email or connect on social platforms.
      </p>

      {/* Email section */}
      <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.03)] mb-8">
        <p className="text-sm text-cream-200 mb-2">Email</p>
        <a
          href="mailto:tymurbondar@outlook.com"
          className="text-xl sm:text-2xl text-forest-400 hover:text-forest-300 font-semibold transition-colors"
        >
          tymurbondar@outlook.com
        </a>
      </div>

      {/* Social links section */}
      <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.03)]">
        <p className="text-sm text-cream-200 mb-4">Connect</p>
        <div className="flex flex-col gap-4">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/tymurbondar/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-cream-100 hover:text-forest-400 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
              />
            </svg>
            <span className="text-lg font-medium">LinkedIn</span>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/BondarTymur"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-cream-100 hover:text-forest-400 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="M16 .5C7.437.5.5 7.438.5 16S7.438 31.5 16 31.5c8.563 0 15.5-6.938 15.5-15.5S24.562.5 16 .5m7.613 10.619l-2.544 11.988c-.188.85-.694 1.056-1.4.656l-3.875-2.856l-1.869 1.8c-.206.206-.381.381-.781.381l.275-3.944l7.181-6.488c.313-.275-.069-.431-.482-.156l-8.875 5.587l-3.825-1.194c-.831-.262-.85-.831.175-1.231l14.944-5.763c.694-.25 1.3.169 1.075 1.219z"
              />
            </svg>
            <span className="text-lg font-medium">Telegram</span>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/TymurBondar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-cream-100 hover:text-forest-400 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-lg font-medium">GitHub</span>
          </a>
        </div>
      </div>
    </main>
  );
}
