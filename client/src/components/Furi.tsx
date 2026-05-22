interface furi {
    txt:string,
    reading:string,
    reversed?:boolean
}
const Furi = ({txt,reading,reversed=false}:furi) => {
    const pos=reversed? "top-4":"bottom-4"
  return (
    <span className="relative my-1 inline-block font-light opacity-90">
        <span className={pos+" absolute whitespace-nowrap text-[10px] flex"}>{reading}</span>
        <span className="block">{txt}</span>
    </span>
  )
}

export default Furi