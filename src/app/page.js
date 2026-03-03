import Image from "next/image";
import HeroPic from "../../public/HeroPic.jpg";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-8 pt-7 lg:py-0 px-4">
        <Image
          src={HeroPic}
          priority={true}
          placeholder="blur"
          alt="Picture of Tymur Bondar"
          className="rounded-lg shadow-2xl w-[275px] h-auto sm:w-[335px]"
        />
        <div>
          <h1 className="text-5xl font-bold pt-6 sm:text-center lg:text-left lg:pt-0">
            My name is Tymur
          </h1>
          <p className="pt-6">
            New York <b>BASED</b>. I've always been crazy about technology. I
            work with <b>Web</b> and <b>Mobile</b>, and I'm super excited about the
            potential of <b>AI</b>. I genuinely believe that advancements in software
            can make a real difference in people's lives. Join me as I shape the
            future of tech.
          </p>
        </div>
      </div>
    </div>
  );
}
