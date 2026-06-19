import { RiComputerLine } from "react-icons/ri"

const MobileBlock = () => {
  return (
    <div className='w-full h-full p-4 gap-8 bg-[#fffbe6] text-3xl flex flex-col justify-center items-center'>
        <RiComputerLine size={64} />
        <span className="text-center">Desktop Website Only</span>
        <span className="text-center">Immersion from phone isn't productive, please open from a desktop device. :D</span>
    </div>
  )
}

export default MobileBlock