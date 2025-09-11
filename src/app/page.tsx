import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center sm:text-left">
          Alabastar Project <span className="text-purple-600 text-2xl sm:text-4xl">is currently under construction !!! </span>
        </h1>
        <p className="text-xl text-center ">Check every 24 Hours for update !!!</p>
     <div className="flex flex-col items-center width-full">
   <Image
          className="dark:invert "
          src="/images/Developer.gif"
          alt="Next.js logo"
          width={500}
          height={500}
          priority
        />
      </div>
   
       
      </main>
    
    </div>
  );
}
