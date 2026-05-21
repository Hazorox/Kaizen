import { LuPickaxe, LuSwords } from "react-icons/lu";
import {
  MdLocalFireDepartment,
  MdOutlineLocalFireDepartment,
} from "react-icons/md";
import Card from "../components/Card";
import { IoDiamondOutline } from "react-icons/io5";
import { RiSwordFill } from "react-icons/ri";

const Homepage = () => {
  const authenticated = true;
  const time = new Date().getHours();
  const streak = 3;
  const username = "Hamza";
  return (
    // Main Homepage Body
    <div className="w-full h-full text-[#1a1a2e] bg-[#fffbe6] font-extrabold flex justify-center items-center">
      {authenticated ? (
        // Dashboard
        <>
          {/* Navbar : Streak, Title, Immerse | Battle */}
          <div className="nav bg-[#ff6b6b] w-full absolute p-2 text-2xl top-0 flex">
            <span className="left flex-1">
              {streak > 0 ? (
                <MdLocalFireDepartment className="inline mb-1 mx-1" />
              ) : (
                <MdOutlineLocalFireDepartment className="inline mb-1 mx-1" />
              )}
              {streak}
            </span>
            <span className="center absolute left-1/2 -translate-x-1/2">
              改善 • Kaizen
            </span>
            <span className="right flex-1 flex items-center mr-2 justify-end">
              <LuPickaxe className="inline icon" /> Immerse{" "}
              <span className="border h-10 mx-2 w-0.75 rounded-4xl bg-[#1a1a2e]"></span>
              <LuSwords className="inline icon " /> Battle
            </span>
          </div>

          {/* Main Content : User Welcome, Stats, And Recent Words */}
          <div className="main h-[80%] flex flex-col border-2  p-4 justify-center items-center rounded-md w-[70%] bg-[#4ecdc4]">
            <span className="text-8xl flex-1 mt-10 justify-center">
              {time >= 5 && time < 12
                ? "おはよう"
                : 12 <= time && time < 18
                  ? "こんにちは"
                  : "こんばんは"}
              , {username}
              {/* //TODO: TERNARY OPERATOR HERE IF CARDS is 1, MAKE CARD NOT CARDS */}
            </span>
            {/* Cards */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-6 place-content-center justify-items-center items-center h-full">
            <Card
              style={"bg-[#ffe066] !border-[#ffcb00]"}
              title={"Anki"}
              txt={0 + " Cards Due"}
              txt2={"+12 Today"}
              icon={"anki.svg"}
            />
            <Card
              style={"bg-[#ff9a3c] !border-[#e06500]"}
              title={"Immersion"}
              txt={0 + " Words Mined Today"}
              icon={<IoDiamondOutline className="h-30 w-36" />}
            />
            <Card
              style={"bg-[#4fb3e8] !border-[#0099d4]"}
              title={"Kanji"}
              txt={0 + " Kanji Practised Today"}
              icon={"字"}
            /><Card
              style={"bg-[#c9b1ff] !border-[#7c3aed]"}
              title={"Matches"}
              txt={0 + " Wins Today"}
              icon={<RiSwordFill className="h-30 w-36" />}
            />
            </div>
          </div>

          {/* Footer : Me & Logout */}
          <div className=" footer text-xl px-4 bg-[#032d66] text-[#eb6614] flex justify-between w-full items-center absolute bottom-0 p-1.5">
            <span className="left flex justify-center items-center">
              <img
              onClick={()=>open("https://github.com/hazorox","_blank")}
                src="https://avatars.githubusercontent.com/u/126866424"
                className="h-10 hover:border hover:border-gray-100 cursor-pointer  mx-2 rounded-full object-cover"
              />
              <span onClick={()=>open("https://github.com/hazorox","_blank")} className="hover:underline cursor-pointer">Hazoro</span>
            </span>
            <span className="center underline underline-offset-1 cursor-pointer hover:animate-pulse">
              Logout
            </span>
            <span className="right flex justify-center items-center">
              Made With ❤️ in 2026
            </span>
          </div>
        </>
      ) : (
        <>NOT AUTHENTICATED</>
      )}
    </div>
  );
};

export default Homepage;
