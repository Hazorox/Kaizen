import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
interface wordRowProps {
  content: string;
  furigana: string;
  meaning: string;
}
const WordRow = ({ content, furigana, meaning }: wordRowProps) => {
  const nav = useNavigate();

  return (
    <AnimatePresence>
      <div className="flex p-2 justify-between w-full">
        <div className="flex gap-8 w-1/4 justify-around">
          <span className="text-xl font-normal">{content}</span>
          <span className="opacity-75">{furigana}</span>
        </div>
        <span className="flex w-3/4 justify-center">{meaning}</span>
      </div>
    </AnimatePresence>
  );
};

export default WordRow;
