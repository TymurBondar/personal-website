// `app/dashboard/page.js` is the UI for the `/dashboard` URL
export default function Page() {
  return (
    <ul className="timeline timeline-snap-icon max-sm:timeline-compact timeline-vertical items-center">
      <li className="mt-2">
        <div className="timeline-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-success"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="timeline-start sm:text-end w-72">
          <time className="font-mono italic text-xl sm:text-right">2010</time>
          <div className="font-black sm:text-right p-0 text-2xl">
            Kid with a Dream
          </div>
          <div className="p-0 sm:text-right text-lg">
            I got my first computer when I was 7 years old, and I've been in
            love with technology ever since.
          </div>
        </div>
        <hr className="bg-success" />
      </li>
      <li>
        <hr className="bg-success" />
        <div className="timeline-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-success"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="timeline-end w-72">
          <time className="font-mono italic text-xl">2023</time>
          <div className="font-black p-0 sm:text-left text-2xl">
            SE Bootcamp Grad
          </div>
          <div className="text-lg">
            Soon after moving to NYC, I joined a 4-month Software Engineering
            bootcamp where I learned web and mobile development. During this
            time, I came up with the idea for the first app that I published.
          </div>
        </div>
        <hr className="bg-success" />
      </li>
      <li>
        <hr className="bg-success" />
        <div className="timeline-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-success"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="timeline-start sm:text-end w-72">
          <time className="font-mono italic">2024</time>
          <div className="text-2xl font-black sm:text-right p-0">First Published App</div>
          <div className="text-lg">
            I developed Fretly, a guitar companion app that helps users tune
            their instrument, view tabs, and record their practice sessions. I
            published it on the App Store and that marked the beginning of my
            journey as a software developer.
          </div>
        </div>
        <hr className="bg-success" />
      </li>
      <li>
        <hr className="bg-success" />
        <div className="timeline-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-accent"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="timeline-end w-72">
          <time className="font-mono italic">Currently</time>
          <div className="text-2xl p-0 font-black sm:text-left">CompSci Student</div>
          <div className="text-lg">
            I wanted to deepen my knowledge of computer science, so I enrolled
            in a bachelor's program in computer science. I am currently studying
            AI, Machine Learning, Web and Mobile Development and I am excited to
            see where this journey takes me.
          </div>
        </div>
        <hr className="bg-accent" />
      </li>
      <li>
        <hr className="bg-accent" />
        <div className="timeline-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="timeline-start sm:text-end w-72">
          <time className="font-mono italic"></time>
          <div className="text-2xl font-black p-0 sm:text-right">???</div>
          <div className="text-lg pb-4">
            I don't know what the future holds, but one thing is for sure: My
            passion for technology will continue to drive me forward.
          </div>
        </div>
      </li>
    </ul>
  );
}
