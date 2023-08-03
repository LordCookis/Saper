import { useState } from 'react'
import { services } from '@/services'

export default function Home() {
  const [field, setField] = useState<any>([])
  const [sizeX, setSizeX] = useState<number>(0)
  const [sizeY, setSizeY] = useState<number>(0)
  const [bombs, setBombs] = useState<number>(0)

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
          countBomb: 0
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
    return bomb < (bombs / 100) ? 1 : 0
  }

  const cellClick = (idX: number, id: number) => {
    const fieldX = [...field]
    fieldX[idX].array[id].click = true
    if (field[idX].array[id].bomb === true) {
      fieldX.map((arrayX: any) => arrayX.array.map((cellX: any) => cellX.bomb ? cellX.click = true : null))
    } else {
      if (services.saper.checkBomb(idX, id, fieldX)) {
        fieldX[idX].array[id].countBomb = services.saper.checkBomb(idX, id, fieldX)
      } else {
        if (fieldX[idX].array[id].countBomb === 0) {
          services.saper.checkCell(idX, id, fieldX)
        }
      }
    }
    setField(fieldX)
    console.log(fieldX)
  }

  return (
    <div className='mainPage'>
      <span className='mainSpan'>«САПЕР ОФФЛАЙН»</span>
      <form className='gameForm' onSubmit={createField}>
        <div className='gameDiv'>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setSizeX(Number(e.target.value))}></input>
          <span className='gameSpan'>X</span>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setSizeY(Number(e.target.value))}></input>
        </div>
        <div className='gameDiv'>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setBombs(Number(e.target.value))}></input>
        </div>
        <button className='gameButton'>НАЧАТЬ ИГРУ</button>
      </form>
      <div className='fieldDiv'>
        {field?.map((cellX:any, indexX:number)=>(
          <div className='filedCellX' key={cellX.id}>
          {cellX?.array?.map((cell:any, index: number)=>(
            <button className={`${cell.click && cell.bomb ? 'bomb' : ''} 
            ${cell.click && cell.countBomb === 0 ? 'click' : 
            cell.click && cell.countBomb === 1 ? 'one' : 
            cell.click && cell.countBomb === 2 ? 'two' : 
            cell.click && cell.countBomb === 3 ? 'three' : 
            cell.click && cell.countBomb === 4 ? 'four' : 
            cell.click && cell.countBomb === 5 ? 'five' : 
            cell.click && cell.countBomb === 6 ? 'six' : 
            cell.click && cell.countBomb === 7 ? 'seven' : 
            cell.click && cell.countBomb === 8 ? 'eight' : 
            null}`} key={cell.id} onClick={()=>cellClick(indexX, index)}>{cell.countBomb}</button>
          ))}
          </div>
        ))}
      </div>
    </div>
  )
}
