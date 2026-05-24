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
  const [repeatedPass, setRepeatedPassInput] = useState("");
  const [showRepeated, setShowRepeated] = useState(false);
  const [show, setShow] = useState(true);
  const [passInput, setPassInput] = useState("");
  return (
    // LOGIN / Register
    <AnimatePresence>
      <motion.div
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#ff6b6b] select-text border h-[60%] px-4 rounded-2xl w-fit flex justify-between items-center"
      >
        {/* Left */}
        <motion.div
          layout
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

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 0.3, ease: "linear" }}
          className="w-1 h-full bg-[#1a1a2e] z-50"
        />
        {/* Right */}
        <motion.div
          layout
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="p-12 py-8 w-1/2 h-full flex justify-center items-center"
        >
          {/* FORM */}
          <AnimatePresence mode="wait">
            <motion.div
              layout
              transition={{ duration: 0.2, ease: "linear" }}
              className="bg-[#fffbe6] h-fit py-8 relatve flex flex-col justify-around items-center w-full border-8 rounded-xl"
            >
              <motion.div className="w-full relative flex justify-center flex-col items-center gap-8">
                <div className="flex border-2 hover:cursor-pointer rounded-lg overflow-hidden w-fit relative">
                  <motion.div
                    animate={{ x: login ? 0 : "100%" }}
                    transition={{ duration: 0.15, ease: "linear" }}
                    className="absolute top-0 left-0 w-1/2 h-full bg-[#FF9A3C] z-0"
                  />
                  <span
                    onClick={() => setLogin(true)}
                    className="relative z-10 flex justify-center items-center py-2 w-1/2 px-10"
                  >
                    Login
                  </span>
                  <div className="w-0.5 bg-[#1a1a2e] z-10 relative" />
                  <span
                    onClick={() => setLogin(false)}
                    className="relative z-10 flex justify-center items-center py-2 w-1/2 px-10"
                  >
                    Register
                  </span>
                </div>
                <div className="relative w-[70%] justify-center items-center">
                  <MdMail
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80"
                  />
                  <motion.input
                    whileFocus={{
                      boxShadow: "0 0 0 3px rgba(0,0,0, 0.2)",
                      borderColor: "#FF9A3C",
                    }}
                    transition={{ duration: 0.1, ease: "linear" }}
                    type="email"
                    className="px-2 pl-10 w-full border-2 h-12 rounded-md"
                    placeholder="E-Mail Address"
                  />
                </div>

                {!login && (
                  <motion.div
                    initial={{ scale: 0.01 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.01 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="relative w-[70%] justify-center items-center"
                  >
                    <FaUserCircle
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80"
                    />
                    <motion.input
                    whileFocus={{
                      boxShadow: "0 0 0 3px rgba(0,0,0, 0.2)",
                      borderColor: "#FF9A3C",
                    }}
                      type="text"
                      className="px-2 pl-10 w-full border-2 h-12 rounded-md"
                      placeholder="Username"
                    />
                  </motion.div>
                )}
                <div className="relative w-[70%] justify-center items-center">
                  <MdVpnKey
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80"
                  />
                  <motion.input
                    whileFocus={{
                      boxShadow: "0 0 0 3px rgba(0,0,0, 0.2)",
                      borderColor: "#FF9A3C",
                    }}
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
                  <motion.div
                    layout
                    initial={{ scale: 0.01 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.01 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="relative w-[70%] justify-center items-center"
                  >
                    <FaShieldAlt
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80"
                    />
                    <motion.input
                      whileFocus={{
                      boxShadow: "0 0 0 3px rgba(0,0,0, 0.2)",
                      borderColor: "#FF9A3C",
                    }}
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
                  </motion.div>
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
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LogReg;
