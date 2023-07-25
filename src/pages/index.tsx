import { useState } from 'react'

export default function Home() {
  const [field, setField] = useState<any>([])
  const [sizeX, setSizeX] = useState<number>()
  const [sizeY, setSizeY] = useState<number>()

  const createField = (e: any) => {
    e.preventDefault()
    let fieldX:any = []
    let idX:number
    let idY:number
    for (idX = 0; idX < sizeX; idX++) {
      const arrayX:any = []
      for (let j = 0; j < sizeY; j++) {
        arrayX.push({
          id: idY,
          bomb: true
        })
        idY++
      }
      fieldX.push({
        id: idX,
        array: arrayX
      })
    }
    setField(fieldX)
  }

  return (
    <div className='mainPage'>
      <span className='mainSpan'>«СИМУЛЯТОР ДОНБАССА»</span>
      <form className='gameForm' onSubmit={createField}>
        <div className='gameDiv'>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setSizeX(Number(e.target.value))}></input>
          <span className='gameSpan'>X</span>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setSizeY(Number(e.target.value))}></input>
        </div>
        <button className='gameButton'>НАЧАТЬ ИГРУ</button>
      </form>
      <div className='fieldDiv'>
        {field.map((cellX:any)=>(
          <div className='filedCellX' key={cellX.id}>
          {cellX.array.map((cell:any)=>(
            <div className='fieldCell' key={cell.id}></div>
          ))}
          </div>
        ))}
      </div>
    </div>
  )
}
