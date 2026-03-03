import Image from "next/image";
import HeroPic from "../../public/HeroPic.jpg";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-10 max-w-3xl">
        <Image
          src={HeroPic}
          priority={true}
          placeholder="blur"
          alt="Picture of Tymur Bondar"
          className="rounded-2xl shadow-2xl w-[250px] h-auto sm:w-[300px]"
        />
        <div className="text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-100">
            Hi, I&apos;m Tymur
          </h1>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md">
            Developer based in <strong className="text-gray-100">Toronto</strong>.
            CS student at <strong className="text-gray-100">Purdue</strong>,
            passionate about building automated{" "}
            <strong className="text-gray-100">AI systems</strong> for{" "}
            <strong className="text-gray-100">software engineering</strong> and{" "}
            <strong className="text-gray-100">digital marketing</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
