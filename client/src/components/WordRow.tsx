import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {glowColors, type Source} from "../constants";


interface wordRowProps {
  content: string;
  furigana: string;
  meaning: string;
  source?: Source;
  learntDate: number;
}
const WordRow = ({
  content,
  furigana,
  meaning,
  source,
  learntDate,
}: wordRowProps) => {
  const nav = useNavigate();
  // Got some help for this const with Claude
  const diffMs = Date.now() - new Date(learntDate).getTime();
  const diffMins = Math.floor(diffMs / 1000 / 60);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);
  const timePassed =
    diffDays > 0
      ? `${diffDays}d`
      : diffHrs > 0
        ? `${diffHrs}h`
        : `${diffMins}m`;
  let style = "";
  switch (source) {
    case "Anki":
      style = "bg-[#ff9a3c] !border-[#e06500]";
      break;
    case "Immersion":
      style = "bg-[#c9b1ff] !border-[#7c3aed]";
      break;
    case "Kanji":
      style = "bg-[#4fb3e8] !border-[#0099d4]";
      break;
    case "Matches":
      style = "bg-[#ffe066] !border-[#ffcb00]";
  }
  return (
    <AnimatePresence>
      <div className="flex p-2 justify-between">
        <div className="flex gap-8">
          <span className="text-xl font-normal">{content}</span>
          <span className="opacity-75">{furigana}</span>
          <span>{meaning}</span>
        </div>
        <div className="gap-12 relative flex select-none">
          {source && (
            <motion.span
            onClick={() => nav(`/recents?type=${source.toLowerCase()}`)}
            whileHover={{
              scale: 1.15,
              boxShadow: `0 0 8px 3px ${glowColors[source]}`,
            }}
              transition={{ duration: 0.2 }}
              className={
                style +
                " w-28 absolute cursor-pointer right-20 border-2 text-center px-2 rounded-xl"
              }
            >
              {source}
            </motion.span>
          )}
          <span className="absolute right-1">{timePassed}</span>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default WordRow
