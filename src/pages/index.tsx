import { useState } from 'react'

export default function Home() {
  const [field, setField] = useState<any>([])
  const [sizeX, setSizeX] = useState<number>()
  const [sizeY, setSizeY] = useState<number>()

  const createField = (e: any) => {
    e.preventDefault()
    setField(Array(sizeX).fill((Array(sizeY).fill({id: 0}))))
  }

  return (
    <div>
      <form onSubmit={createField}>
        <input autoComplete="off" onChange={(e)=>setSizeX(Number(e.target.value))}></input>
        <span>X</span>
        <input autoComplete="off" onChange={(e)=>setSizeY(Number(e.target.value))}></input>
        <button>НАЧАТЬ ИГРУ</button>
      </form>
      <div>
        {field.map((cellX:any)=>(
          cellX.map((cell:object)=>(
            <>1</>
          ))
        ))}
      </div>
    </div>
  )
}
