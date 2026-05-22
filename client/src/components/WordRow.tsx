type Source = "Anki" | "Immersion" | "Kanji" | "Matches";

interface wordRowProps {
  content: string;
  furigana: string;
  meaning: string;
  source: Source;
  learntDate: number;
}
const WordRow = ({
  content,
  furigana,
  meaning,
  source,
  learntDate,
}: wordRowProps) => {
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
  let style="";
  // const style = source == "Anki"? "" : source=="Immersion"?  : source == "Kanji"
  switch (source) {
    case "Anki":
      style = "bg-[#ff9a3c] !border-[#e06500]";
      break;
    case "Immersion":
      style="bg-[#c9b1ff] !border-[#7c3aed]"
      break
    case "Kanji":
      style="bg-[#4fb3e8] !border-[#0099d4]"
      break
    case "Matches":
      style="bg-[#ffe066] !border-[#ffcb00]"
  }
  return (
    <div className="flex p-2 justify-between">
      <div className="flex gap-8">
        <span className="text-xl font-normal">{content}</span>
        <span className="opacity-75">{furigana}</span>
        <span>{meaning}</span>
      </div>
      <div className="gap-12 relative flex select-none">
        <span className={style+" w-28 absolute right-20 border-2 text-center px-2 rounded-xl"}>
          {source}
        </span>
        <span className="absolute right-1">{timePassed}</span>
      </div>
    </div>
  );
};

export default WordRow;
