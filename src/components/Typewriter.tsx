import { useEffect, useState } from "react";
import { keyTick } from "@/lib/hackSound";

export function Typewriter({
  words,
  speed = 65,
  pause = 1400,
  className = "",
  sound = false,
}: {
  words: string[];
  speed?: number;
  pause?: number;
  className?: string;
  sound?: boolean;
}) {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    if (!del && txt === word) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && txt === "") {
      setDel(false);
      setI((v) => v + 1);
      return;
    }
    const t = setTimeout(() => {
      setTxt((prev) => del ? prev.slice(0, -1) : word.slice(0, prev.length + 1));
      if (sound && !del) keyTick();
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [txt, del, i, words, speed, pause, sound]);

  return (
    <span className={className}>
      {txt}
      <span className="cursor-blink" />
    </span>
  );
}
