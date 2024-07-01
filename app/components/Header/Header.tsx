import Image from "next/image";
import { RiQuillPenLine } from "react-icons/ri";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  return (
    <>
      <div className="pt-16 flex justify-between">
        <div className="text-5xl flex items-baseline ">
          <div className="text-teal">
            <RiQuillPenLine className="opacity-70" />
          </div>
          <a className="font-playfair italic text-teal" href="/">
            Poetry
          </a>
          <span className="font-roboto_flex ml-2 text-text-dark"> Factory</span>
        </div>
        <div className="flex items-center">
          <a
            className="cursor-pointer hover:scale-105 "
            href="https://github.com/weaviate/healthsearch-demo"
            target="_blank"
          >
            <FaGithub className="w-10 h-10  cursor-pointer" />
          </a>
          <a
            className="hover:scale-105 transition-all duration-250"
            href="https://weaviate.io"
            target="_blank"
          >
            <Image
              src="/weaviate.png"
              alt="Weaviate logo"
              width={100}
              height={100}
            />
          </a>
        </div>
      </div>
      <div className="text-lg  py-10 text-text-dark">
        Choose your mood, select your style, and define your theme to unlock a
        world of bespoke poetry crafted just for you! Whether you crave
        whimsical verses or profound reflections, let Poetry Factory weave your
        emotions into beautifully tailored poems that resonate with your soul.
        Discover the art of self-expression with Poetry Factory, where every
        line reflects your unique spirit.
      </div>
    </>
  );
};

export default Header;
