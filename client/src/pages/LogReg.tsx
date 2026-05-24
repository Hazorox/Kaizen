import { MdMail, MdVpnKey } from "react-icons/md";
import {
  FaEyeSlash,
  FaRegEye,
  FaShieldAlt,
  FaUserCircle,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
const LogReg = ({ loginInit }: { loginInit: boolean }) => {
  const [login, setLogin] = useState(loginInit);
  const bgs = login ? ["bg-[#FF9A3C]", ""] : ["", "bg-[#FF9A3C]"];

  const [repeatedPass, setRepeatedPassInput] = useState("");
  const [showRepeated, setShowRepeated] = useState(false);
  const [show, setShow] = useState(true);
  const [passInput, setPassInput] = useState("");
  return (
    // LOGIN / Register
    <div className="bg-[#ff6b6b] select-text border h-[60%] rounded-2xl w-[60%] flex justify-between items-center">
      {/* Left */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 70 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 w-1/2 pl-3.5  h-full flex flex-col justify-center"
        >
          <p className="text-7xl ">改善</p>
          <p className="text-2xl ml-5 opacity-80 font-normal">かいぜん</p>
          <br />
          <p className="text-2xl font-normal">
            {" "}
            <b>1.</b> Betterment, Improvement
          </p>
          <span className="ml-6 inline mb-0">
            {[
              ["2国間", "にこくかん"],
              ["の", ""],
              ["貿易上", "ぼうえきじょう"],
              ["のアンバランスを", ""],
              ["改善", "かいぜん"],
              ["しなければならない。", ""],
            ].map(([txt, reading]) => {
              return (
                <>
                  <ruby className="font-light opacity-90">
                    {txt}
                    <rt className="text-[10px] text-center">{reading}</rt>
                  </ruby>
                </>
              );
            })}
          </span>
          <p className="ml-6 mt-0 opacity-70">
            The trade imbalance between two nations should be improved.
          </p>

          <span className="font-normal text-2xl">
            <b>2.</b> Kaizen
            <p className="ml-7 text-lg">
              Kaizen{" "}
              {"(Japanese business philosophy of continuous improvement)​"}
            </p>
          </span>
        </motion.div>
      </AnimatePresence>
      {/* Right */}
      <div className="p-12 py-8 border-l-2 w-1/2 h-full flex justify-center items-center">
        {/* FORM */}
        <div className="bg-[#fffbe6] h-fit py-8 relatve flex flex-col justify-around items-center w-full border-8 rounded-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={login ? "login" : "register"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full flex justify-center flex-col items-center gap-8"
            >
              <div className="flex border-2 hover:cursor-pointer rounded-lg w-[70%]">
                <span
                  onClick={() => {
                    setLogin((prev) => !prev);
                  }}
                  className={
                    bgs[0] +
                    " flex justify-center items-center w-1/2 border-r-2 rounded-l-md py-2"
                  }
                >
                  Login
                </span>
                <span
                  onClick={() => {
                    setLogin((prev) => !prev);
                  }}
                  className={
                    bgs[1] +
                    " flex justify-center items-center w-1/2 rounded-r-md"
                  }
                >
                  Register
                </span>
              </div>
              <div className="relative w-[70%] justify-center items-center">
                <MdMail
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80"
                />
                <input
                  type="email"
                  className="px-2 pl-10 w-full border-2 h-12 rounded-md"
                  placeholder="E-Mail Address"
                />
              </div>

              {!login && (
                <div className="relative w-[70%] justify-center items-center">
                  <FaUserCircle
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80"
                  />
                  <input
                    type="text"
                    className="px-2 pl-10 w-full border-2 h-12 rounded-md"
                    placeholder="Username"
                  />
                </div>
              )}
              <div className="relative w-[70%] justify-center items-center">
                <MdVpnKey
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80"
                />
                <input
                  type={show ? "text" : "password"}
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  className="px-2 pl-10 w-full border-2 h-12 rounded-md"
                  placeholder="Password"
                  id="passInput"
                />
                {passInput.length > 0 ? (
                  show ? (
                    <FaEyeSlash
                      onClick={() => {
                        setShow((prev) => !prev);
                      }}
                      size={20}
                      className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
                    />
                  ) : (
                    <FaRegEye
                      size={20}
                      className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => {
                        setShow((prev) => !prev);
                      }}
                    />
                  )
                ) : (
                  ""
                )}
              </div>
              {!login && (
                <div className="relative w-[70%] justify-center items-center">
                  <FaShieldAlt
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80"
                  />
                  <input
                    type={showRepeated ? "text" : "password"}
                    value={repeatedPass}
                    onChange={(e) => setRepeatedPassInput(e.target.value)}
                    className="px-2 pl-10 w-full border-2 h-12 rounded-md"
                    placeholder="Repeat Password"
                    id="repeatedPass"
                  />

                  {repeatedPass.length > 0 &&
                    (show ? (
                      <FaEyeSlash
                        onClick={() => {
                          setShowRepeated((prev) => !prev);
                        }}
                        size={20}
                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
                      />
                    ) : (
                      <FaRegEye
                        size={20}
                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => {
                          setShowRepeated((prev) => !prev);
                        }}
                      />
                    ))}
                </div>
              )}
              {login ? (
                <>
                  <button className="bg-[#FF9A3C] hover:cursor-pointer p-4 w-[70%] rounded-full text-xl -mb-4">
                    Login
                  </button>
                  <button className="bg-[#FF9A3C] p-2 w-[70%] hover:cursor-pointer rounded-full flex justify-center text-xl items-center">
                    Continue With{" "}
                    <FcGoogle className="inline ml-3" size={48} />{" "}
                  </button>
                </>
              ) : (
                <AnimatePresence>
                  <motion.div className="flex w-[70%] rounded-xl h-16 border justify-around items-center overflow-hidden">
                    <motion.button
                      whileHover={{ opacity: 0.95 }}
                      transition={{ duration: 0.15 }}
                      whileTap={{ scale: 1.1 }}
                      className="bg-[#FF9A3C] z-10 h-full text-xl w-1/2 hover:cursor-pointer"
                    >
                      Register
                    </motion.button>
                    <div className="h-full w-1 bg-[#1a1a2e] z-20" />
                    <motion.button
                      whileHover={{ opacity: 0.95 }}
                      transition={{ duration: 0.15 }}
                      whileTap={{ scale: 1.1, opacity: 1.2 }}
                      className="bg-[#FF9A3C] flex z-0 justify-center items-center w-1/2 h-full hover:cursor-pointer py-3"
                    >
                      <FcGoogle className="inline" size={48} />
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LogReg;
