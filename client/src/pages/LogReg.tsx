import { MdVpnKey } from "react-icons/md";
import {
  FaEyeSlash,
  FaRegEye,
  FaShieldAlt,
  FaUserCircle,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { login, register } from "../api/auth";
import { saveToken } from "../utils/token";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const LogReg = () => {
  const nav = useNavigate();
  const [loginState, setLoginState] = useState(true);
  const [repeatedPass, setRepeatedPassInput] = useState("");
  const [showRepeated, setShowRepeated] = useState(false);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [passInput, setPassInput] = useState("");
  // Atleast 2 chars, 15 at most. lower-Upper case and numbers only, dashes and underscores allowed
  const userReg = /^[a-zA-Z0-9_\- ]{2,15}$/;
  // Atleast 8 chars, contains atleast one symbol and one number
  const passReg =
    /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  const handleSubmit = async () => {
    try {
      let data;
      if (loginState) {
        data = await login(username, passInput);
        if (!data) {
          toast.error("Invalid Credentials");
          return;
        }
      } else {
        if (username.length < 2) {
          toast.error("Username must be more than 2 characters");
          return;
        }
        if (!userReg.test(username)) {
          toast.error(
            "Username must only contain alphanumeric characters, dashes, underscores and spaces.",
          );
          return;
        }
        if (passInput.length < 8) {
          toast.error("Password must be atleast 8 characters");
          return;
        }
        if (!passReg.test(passInput)) {
          toast.error("Password must contain atleast one symbol and one digit");
          return;
        }
        if (repeatedPass != passInput) {
          toast.error("The repeated password doesn't match");
          return;
        }
        data = await register(username, passInput);
        if (!data) {
          toast.error("Username Taken");
          return;
        }
      }
      saveToken(data.token);
      nav("/");
    } catch {
      toast.error("Something Went wrong during authentication");
    }
  };
  useEffect(() => {
    const listenForEnter = async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        await handleSubmit();
      }
    };
    document.addEventListener("keypress", listenForEnter);
    return () => document.removeEventListener("keypress", listenForEnter);
  });
  return (
    // LOGIN / Register
    <AnimatePresence key="logReg">
      <Toaster key="toaster" />

      <div
        key="contents"
        className="w-full select-none h-full text-[#1a1a2e] bg-[#fffbe6] font-bold flex justify-center items-center"
      >
        <motion.div
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-[#ff6b6b] select-text border h-[60%] px-4 rounded-2xl w-fit flex justify-between items-center"
        >
          {/* Left */}
          <motion.div
            key="left"
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
              ].map(([txt, reading], index) => {
                return (
                  <ruby key={index} className="font-light opacity-90">
                    {txt}
                    <rt className="text-[10px] text-center">{reading}</rt>
                  </ruby>
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
            key="right"
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
            <AnimatePresence key="FormButtons" mode="wait">
              <motion.form
                layout
                transition={{ duration: 0.2, ease: "linear" }}
                className="bg-[#fffbe6] h-fit py-8 relatve flex flex-col justify-around items-center w-full border-8 rounded-xl"
              >
                <motion.div className="w-full relative flex justify-center flex-col items-center gap-8">
                  <div className="flex border-2 hover:cursor-pointer rounded-lg overflow-hidden w-fit relative">
                    <motion.div
                      animate={{ x: loginState ? 0 : "100%" }}
                      transition={{ duration: 0.15, ease: "linear" }}
                      className="absolute top-0 left-0 w-1/2 h-full bg-[#FF9A3C] z-0"
                    />
                    <span
                      onClick={() => setLoginState(true)}
                      className="relative z-10 flex justify-center items-center py-2 w-1/2 px-10"
                    >
                      Login
                    </span>
                    <div
                      key="divider"
                      className="w-0.5 bg-[#1a1a2e] z-10 relative"
                    />
                    <span
                      onClick={() => setLoginState(false)}
                      className="relative z-10 flex justify-center items-center py-2 w-1/2 px-10"
                    >
                      Register
                    </span>
                  </div>
                  <div className="relative w-[70%] justify-center items-center">
                    <FaUserCircle
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80"
                    />
                    <motion.input
                      autoComplete="on"
                      whileFocus={{
                        boxShadow: "0 0 0 3px rgba(0,0,0, 0.2)",
                        borderColor: "#FF9A3C",
                      }}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                      id="userInput"
                      maxLength={15}
                      type="text"
                      className="px-2 pl-10 w-full border-2 h-12 rounded-md"
                      placeholder="Username"
                    />
                  </div>

                  <div className="relative w-[70%] justify-center items-center">
                    <MdVpnKey
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80"
                    />
                    <motion.input
                      autoComplete="on"
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
                  {!loginState && (
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
                        autoComplete="on"
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
                        (showRepeated ? (
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
                  {loginState ? (
                    <>
                      <motion.button
                      type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 1.2 }}
                        onClick={() => {
                          handleSubmit();
                        }}
                        className="bg-[#FF9A3C] border-3 hover:cursor-pointer p-4 w-[70%] rounded-full text-xl -mb-4"
                      >
                        Login
                      </motion.button>
                      <motion.button
                      type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 1.2 }}
                        onClick={() =>
                          (window.location.href =
                            `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`)
                        }
                        className="bg-[#FF9A3C] border-3 p-2 w-[70%] hover:cursor-pointer rounded-full flex justify-center text-xl items-center"
                      >
                        Continue With{" "}
                        <FcGoogle className="inline ml-3" size={48} />{" "}
                      </motion.button>
                    </>
                  ) : (
                    <AnimatePresence key="submitButtons">
                      <motion.div className="flex w-[70%] border-4 rounded-xl h-16 justify-around items-center overflow-hidden">
                        <motion.button
                        type="button"
                          onClick={() => {
                            handleSubmit();
                          }}
                          whileHover={{ opacity: 0.95 }}
                          transition={{ duration: 0.15 }}
                          whileTap={{ scale: 1.1 }}
                          className="bg-[#FF9A3C] z-10 h-full text-xl w-1/2 hover:cursor-pointer"
                        >
                          Register
                        </motion.button>
                        <div className="h-full w-1 bg-[#1a1a2e] z-20" />
                        <motion.button
                        type="button"
                          onClick={() =>
                            (window.location.href =
                              `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`)
                          }
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
              </motion.form>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LogReg;
