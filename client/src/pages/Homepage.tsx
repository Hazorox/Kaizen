
import Dashboard from "./Dashboard";
import LogReg from "./LogReg";

const Homepage = () => {
  const authenticated = true;  
  return (
    // Main Homepage Body
    <div className="w-full select-none h-full text-[#1a1a2e] bg-[#fffbe6] font-extrabold flex justify-center items-center">
      {/* DASHBOARD */}
      {authenticated ? (
        <>
          <Dashboard />
        </>
      ) : (
        <>
          <LogReg loginInit={true} />
        </>
      )}
    </div>
  );
};

export default Homepage;
