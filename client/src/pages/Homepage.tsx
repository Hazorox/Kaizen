import { LuPickaxe, LuSwords } from "react-icons/lu";
import { MdLocalFireDepartment, MdOutlineLocalFireDepartment } from "react-icons/md";

const Homepage = () => {
  const authenticated = true;
  const time = new Date().getHours();
  const streak = 3
  const username = "Hamza";
  return (
    // Main Homepage Body
    <div className="w-full h-full text-[#1a1a2e] bg-[#fffbe6] flex justify-center items-center">
      {authenticated ? (
        // Dashboard
        <>
          {/* Navbar : Streak, Title, Immerse | Battle */}
          <div className="nav bg-[#ff6b6b] w-full absolute p-2 text-2xl top-0 flex">
            <span className="left flex-1">
              {streak>0 ? <MdLocalFireDepartment className="inline mb-1 mx-1" /> : <MdOutlineLocalFireDepartment className="inline mb-1 mx-1" />}{streak}
            </span>
            <span className="center absolute left-1/2 -translate-x-1/2">改善 • Kaizen</span>
            <span className="right flex-1 flex items-center mr-2 justify-end">
              <LuPickaxe className="inline icon" /> Immerse <span className="border h-10 mx-2 w-0.75 rounded-4xl bg-[#1a1a2e]"></span>
              <LuSwords className="inline icon " /> Battle
            </span>
          </div>


          {/* Main Content : User Welcome, Stats, And Recent Words */}
          <div className="main font-extrabold border-2 p-2 justify-center items-center rounded-md w-[90%] bg-[#4ecdc4]">
            <span className="text-4xl flex justify-center">
              {time >= 5 && time < 12
                ? "おはよう"
                : 12<=time && time < 18
                  ? "こんにちは"
                  : "こんばんは"}
              , {username}
              
            </span>
          </div>

          {/* Footer : Me & Logout */}
          <div className="footer text-xl px-4 bg-[#032d66] text-[#eb6614] font-extrabold flex justify-between w-full items-center absolute bottom-0 p-1.5">
            <span className="left flex justify-center items-center">
              <img
                src="https://avatars.githubusercontent.com/u/126866424"
                className="h-10 mx-2 rounded-full object-cover"
              />
              Hazoro
            </span>
            <span className="center underline underline-offset-1">Logout</span>
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
