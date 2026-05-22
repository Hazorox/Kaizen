import type { ReactElement } from "react";

interface cardProps {
  title: string;
  icon: ReactElement | string;
  txt: string;
  txt2?: string;
  style: string;
}
const Card = ({ title, icon, txt, txt2, style }: cardProps) => {
  return (
    <div
      className={
        style +
        " flex h-30 border-4 w-100  self-center rounded-2xl p-2 gap-2 m-5"
      }
    >
      {icon == "字" ? (
        <span className="text-[100px] mb-3 text-center self-center font-bold">字</span>
      ) : typeof icon == "string" ? (
        <img src={"./" + icon} className="inline " />
      ) : (
        icon
      )}
      <span className="right flex justify-center items-center flex-col gap-3 text-center w-full">
        <span className="text-4xl">{title}</span>
        <span>
          <span className="val text-xl text-center">
            {txt}{" "}
            {txt2 ? (
              <span className="opacity-70 mx-2 text-xl">{txt2}</span>
            ) : null}
          </span>
        </span>
      </span>
    </div>
  );
};

export default Card;
