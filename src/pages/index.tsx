import { useState } from 'react'

export default function Home() {
  const [field, setField] = useState<any>([])
  const [sizeX, setSizeX] = useState<number>(0)
  const [sizeY, setSizeY] = useState<number>(0)

  const createField = (e: any) => {
    e.preventDefault()
    setField([])
    const fieldX:any = []
    let idX:number = 0
    let idY:number = 0
    for (let i = 0; i < sizeX; i++) {
      const arrayX:any = []
      for (let j = 0; j < sizeY; j++) {
        arrayX.push({
          id: idY,
          bomb: Boolean(randomBomb()),
          click: false,
        })
        idY++
      }
      fieldX.push({
        id: idX,
        array: arrayX
      })
      idX++
    }
    setField(fieldX)
    console.log(fieldX)
  }

  const randomBomb = () => {
    const bomb = Math.random()
    return bomb < 0.1 ? 1 : 0
  }

  const cellClick = (idX: number, id: number) => {
    const fieldX = [...field]
    fieldX[idX].array[id].click = true
    setField(fieldX)
    if (field[idX].array[id].bomb === true) {
      fieldX.map((arrayX: any) => arrayX.array.map((cellX: any) => cellX.bomb ? cellX.click = true : null))
    }
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
        {field?.map((cellX:any, indexX:number)=>(
          <div className='filedCellX' key={cellX.id}>
          {cellX?.array?.map((cell:any, index: number)=>(
            <button className={`${cell.click && cell.bomb ? 'bomb' : ''}`} key={cell.id} onClick={()=>cellClick(indexX, index)}></button>
          ))}
          </div>
        ))}
      </div>
      <span className='span'>ТЫ СДОХ НАХУЙ, АМЕРИКА ЗАХУЯРИЛА ТЕБЯ ЯДЕРКОЙ</span>
    </div>
  )
}
