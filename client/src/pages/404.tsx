import { AnimatePresence,motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const nav = useNavigate()
  return (
    <AnimatePresence>
    <div className='w-full bg-[#fffbe6] flex justify-center flex-col gap-16 items-center text-5xl font-bold h-full'>
        <span className='text-7xl'>404</span>
        <span>ページが見つかりません。</span>
        <span>This Page Was Not Found.</span>
        <motion.button
        whileHover={{scale:1.15}}
        whileTap={{scale:1.25}}
        className='bg-[#1a1a2e] text-[#fffbe6] cursor-pointer border-2 p-8 rounded-full'
        onClick={()=>{nav("/")}}>
          Go Home
          </motion.button>        
    </div></AnimatePresence>
  )
}

export default NotFound