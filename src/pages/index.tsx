import { useEffect, useState } from 'react'
import { services } from '@/services'

export default function Home() {
  const [field, setField] = useState<any>([])
  const [sizeX, setSizeX] = useState<number>(0)
  const [sizeY, setSizeY] = useState<number>(0)
  const [bombs, setBombs] = useState<number>(0)
  const [executed, setExecuted] = useState<boolean>(false)
  const [flags, setFlags] = useState<number>(0)
  const [win, setWin] = useState<number>(0)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    win === bombs && flags === bombs ? alert("ПОБЕДА") : null
  }, [win, flags, bombs])

  const fillState = (e: any) => {
    e.preventDefault()
    setField([])
    setExecuted(false)
    setFlags(0)
    setWin(0)
    setError("")
    if ((sizeX * sizeY) > bombs) {
      const fieldX:any = []
      let idX:number = 0
      let idY:number = 0
      for (let i = 0; i < sizeX; i++) {
        const arrayX:any = []
        for (let j = 0; j < sizeY; j++) {
          arrayX.push({
            id: idY,
            bomb: false,
            click: false,
            countBomb: 0,
            flag: false
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
    } else if (sizeX * sizeY === bombs) {
      setError("Ошибка: минимум одна ячейка должна быть без бомбы")
    } else {
      setError("Ошибка: бомб больше чем ячеек на поле")
    }
  }

  const randomBomb = (idX: number, id: number) => {
    const arrayBombs:any = []
    while (arrayBombs.length < bombs) {
      const randomCell = Math.floor(Math.random() * ((sizeX * sizeY) + 1));
      if (randomCell !== field[idX].array[id].id && !arrayBombs.includes(randomCell)) {
        arrayBombs.push(randomCell)
      }
    }
    const fieldX:any = field
    for (let bombId of arrayBombs) {
      fieldX.map((arrayX: any) => arrayX.array.map((cell: any) => cell.id === bombId ? cell.bomb = true : null))
    }
    setField(fieldX)
  }

  const cellClick = (idX: number, id: number) => {
    if (!executed) {
      setExecuted(true)
      randomBomb(idX, id)
    }
    const fieldX = [...field]
    fieldX[idX].array[id].click = true 
    fieldX[idX].array[id].flag = false
    if (field[idX].array[id].bomb === true) {
      fieldX.map((arrayX: any) => arrayX.array.map((cellX: any) => {
        cellX.bomb ? cellX.click = true : null
        cellX.flag ? cellX.flag = false : null
      }))
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
  }

  const putFlag = (e: any, idX: number, id: number) => {
    e.preventDefault()
    let flagsX:number = flags
    let winX:number = win
    const fieldX = [...field]
    if (!fieldX[idX].array[id].click && !fieldX[idX].array[id].flag) {
      fieldX[idX].array[id].flag = true
      setFlags(flagsX + 1)
      fieldX[idX].array[id].countBomb = 'F'
      fieldX[idX].array[id].bomb === true ? setWin(winX += 1) : null
    } else if (!fieldX[idX].array[id].click && fieldX[idX].array[id].flag) {
      fieldX[idX].array[id].flag = false
      setFlags(flagsX - 1)
      fieldX[idX].array[id].countBomb = 0
      fieldX[idX].array[id].bomb === true ? setWin(winX-=1) : null 
    }
    setField(fieldX)
  }

  return (
    <div className='mainPage'>
      <span className='mainSpan'>«САПЕР ОФФЛАЙН»</span>
      <form className='gameForm' onSubmit={fillState}>
        <div className='gameDiv'>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setSizeX(Number(e.target.value))}></input>
          <span className='gameSpan'>X</span>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setSizeY(Number(e.target.value))}></input>
        </div>
        <div className='gameDiv'>
          <span className='bombSpan'>БОМБ: </span>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setBombs(Number(e.target.value))}></input>
        </div>
        <button className='gameButton'>НАЧАТЬ ИГРУ</button>
        <span className='errorSpan'>{error}</span>
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
            cell.flag === true ? 'flag' :
            null}`} key={cell.id} onClick={(e)=>cellClick(indexX, index)} onContextMenu={(e)=>putFlag(e, indexX, index)}>{cell.countBomb}</button>
          ))}
          </div>
        ))}
      </div>
    </div>
  )
}
