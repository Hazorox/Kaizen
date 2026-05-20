import type { ReactElement } from "react"

 
interface cardProps{
    bg:string,
    title:string,
    icon: ReactElement|string,
    value:number,
    color:string
}
const Card = (props:cardProps) => {
    const bg="bg-#[" + props.bg + '] '
  return (
    <div className={bg+"flex"}>
        
    </div>
  )
}

export default Card