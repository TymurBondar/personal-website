import Link from "next/link";
import fretlylogo from "../../../public/fretlylogo.jpg";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-80 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <figure>
          <Image
            src={fretlylogo}
            priority={true}
            placeholder="blur"
            alt="Fretly"
          />
        </figure>
        <div className="p-4">
          <h2 className="text-xl font-bold">Fretly!</h2>
          <p>A guitar companion mobile app written in flutter</p>
          <div className="flex justify-end mt-2">
            <Link
              href="https://github.com/TymurBondar/Fretly"
              target="_blank"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Github Repo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
