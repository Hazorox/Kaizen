import { AnimatePresence, motion } from "motion/react";
import { lookupKanji, lookupWord } from "../api/lookupWordKanji";
import { useEffect, useState } from "react";

const LookUp = ({ text }: { text: string }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function fetchStuff() {
      if (text) setData(await lookupWord(text));
    }
    fetchStuff();
  }, [text]);
  console.log(data)
  return <AnimatePresence>test</AnimatePresence>;
};

export default LookUp;
