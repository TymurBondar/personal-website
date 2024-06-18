// `app/dashboard/page.js` is the UI for the `/dashboard` URL
import Link from "next/link";
import fretlylogo from "../../../public/fretlylogo.jpg";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex w-full justify-center">
      <div className="card w-80 bg-base-100 shadow-xl">
        <figure>
          <Image
            src={fretlylogo}
            priority={true}
            placeholder="blur"
            alt="Fretly"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Fretly!</h2>
          <p>A guitar companion mobile app written in flutter</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary"><Link href="https://github.com/TymurBondar/Fretly" target="_blank">Github Repo</Link></button>
          </div>
        </div>
      </div>
    </div>
  );
}
