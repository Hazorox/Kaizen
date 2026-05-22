import { LuPickaxe, LuSwords } from "react-icons/lu";
import {
  MdLocalFireDepartment,
  MdOutlineLocalFireDepartment,
} from "react-icons/md";
import Card from "../components/Card";
import { IoDiamondOutline } from "react-icons/io5";
import { RiSwordFill } from "react-icons/ri";
import WordRow from "../components/WordRow";
import { FaArrowRight } from "react-icons/fa";
import Furi from "../components/Furi";

const Homepage = () => {
  const authenticated = false;
  const time = new Date().getHours();
  const streak = 3;
  const username = "Hazoro";
  return (
    // Main Homepage Body
    <div className="w-full select-none h-full text-[#1a1a2e] bg-[#fffbe6] font-extrabold flex justify-center items-center">
      {/* DASHBOARD */}
      {authenticated ? (
        // Dashboard
        <>
          {/* Navbar : Streak, Title, Immerse | Battle */}
          <div className="nav h-16  items-center justify-around bg-[#ff6b6b] mt-2 mx-2 w-[94%] rounded-3xl absolute p-2 text-3xl top-0 flex">
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
            <span className="text-8xl flex-1 mt-6 justify-center">
              {time >= 5 && time < 12
                ? "おはよう"
                : 12 <= time && time < 18
                  ? "こんにちは"
                  : "こんばんは"}
              , {username.length > 14 ? "" : username} !
              {/* //TODO: TERNARY OPERATOR HERE IF CARDS is 1, MAKE CARD NOT CARDS */}
            </span>
            {/* Cards */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-6 place-content-center justify-items-center items-center h-full">
              <Card
                style={"bg-[#ff9a3c] !border-[#e06500]"}
                title={"Anki"}
                txt={0 + " Cards Due"}
                icon={"anki.svg"}
              />
              <Card
                style={"bg-[#c9b1ff] !border-[#7c3aed]"}
                title={"Immersion"}
                txt={0 + " Words Mined Today"}
                icon={<IoDiamondOutline className="h-26 w-30" />}
              />
              <Card
                style={"bg-[#4fb3e8] !border-[#0099d4]"}
                title={"Kanji"}
                txt={0 + " Kanji Practised Today"}
                icon={"字"}
              />
              <Card
                style={"bg-[#ffe066] !border-[#ffcb00]"}
                title={"Matches"}
                txt={0 + " Wins Today"}
                icon={<RiSwordFill className="h-26 w-30" />}
              />
            </div>
            {/* Recent Words */}
            <div className="h-1/2 w-[60%] rounded-xl bg-[#fffbe6]">
              {/* Header */}
              <div className="bg-[#1a1a2e] rounded-t-xl text-[#fffbe6] py-1.5 px-6 flex justify-between">
                <span>Recent Words</span>
                <span className="opacity-60 hover:opacity-120 cursor-pointer">
                  もっと最近の言葉{" "}
                  <FaArrowRight className="inline -mt-1" />{" "}
                </span>
              </div>
              {/* Body */}
              <div className="select-text">
                <WordRow
                  content="犬"
                  furigana="いぬ"
                  meaning="Dog"
                  source="Anki"
                  learntDate={1779291006000}
                />
                <WordRow
                  content="本"
                  furigana="ほん"
                  meaning="Book"
                  source="Immersion"
                  learntDate={1779405341000}
                />
                <WordRow
                  content="勉強する"
                  furigana="べんきょうする"
                  meaning="To Study"
                  source="Kanji"
                  learntDate={1770405311000}
                />
                <WordRow
                  content="改善"
                  furigana="かいぜん"
                  meaning="Self Improvement"
                  source="Matches"
                  learntDate={1779391006000}
                />
              </div>
            </div>
          </div>
          <div className="footer w-fit p-4 hover:cursor-pointer flex font-extrabold text-xl justify-center items-center fixed bottom-4 bg-[#032d66] text-[#eb6614] rounded-full">
            Profile
          </div>
          {/* Footer : Me & Logout
          <div className=" footer text-xl px-4 bg-[#032d66] text-[#eb6614] flex justify-between w-full items-center absolute bottom-0 p-1.5">
            <span className="left flex justify-center items-center">
              <span>Hazoro</span>
            </span>
            <span className="center underline underline-offset-1 cursor-pointer hover:animate-pulse">
              Logout
            </span>
            <span className="right flex justify-center items-center">
              
              <span
                onClick={() => open("https://github.com/hazorox", "_blank")}
                className="hover:underline cursor-pointer flex items-center"
              >
                <img
                  onClick={() => open("https://github.com/hazorox", "_blank")}
                  src="https://avatars.githubusercontent.com/u/126866424"
                  className="h-10 hover:border hover:border-gray-100 cursor-pointer  mx-2 rounded-full object-cover inline"
                />
                Hazoro</span>
            </span>
          </div> */}
        </>
      ) : (
        // LOGIN / Register
        <div className="bg-[#ff6b6b] select-text border h-[60%] rounded-2xl w-[60%] flex justify-between items-center">
          {/* Left */}
          <div className="p-6 w-1/2 border-r-2 pl-3.5  h-full flex flex-col justify-center">
            <p className="text-7xl ">改善</p>
            <p className="text-2xl ml-5 opacity-80 font-normal">かいぜん</p>
            <br />
            <p className="text-2xl font-normal">
              {" "}
              <b>1.</b> Betterment, Improvement
            </p>
            <span className="ml-6 inline mb-0">
            {
            [
              ["2国間","にこくかん"],
              ['の',""],
              ["貿易上","ぼうえきじょう"],
              ["のアンバランスを",""],
              ["改善","かいぜん"],
              ["しなければならない。",""],
              
            ].map(([txt,reading])=>{
              return <Furi txt={txt} reading={reading} />
            })}</span>
            <p className="ml-6 mt-0 opacity-70" >The trade imbalance between two nations should be improved.</p>
            
            <span className="font-normal text-2xl">
              <b>2.</b> Kaizen
              <p className="ml-7 text-lg">Kaizen {"(Japanese business philosophy of continuous improvement)​"}</p>
            </span>
          </div>
          <div className="p-6 w-1/2 h-full ">Right</div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
