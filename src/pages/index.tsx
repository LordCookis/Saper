import { useEffect, useRef, useState } from 'react'
import { services } from '@/services'
import TotalResult from '@/components/TotalResult'

export default function Home() {
  const [field, setField] = useState<any>([])
  interface Size {X: number, Y: number}
  const [size, setSize] = useState<Size>({X: 0, Y: 0})
  const [bombs, setBombs] = useState<number>(0)
  const executed = useRef<boolean>(false)
  const [flags, setFlags] = useState<number>(0)
  const [markedBombs, setMarkedBombs] = useState<number>(0)
  const winX = useRef<number>(0)
  const [win, setWin] = useState<number>(0)
  const [error, setError] = useState<string>("")
  const [time, setTime] = useState<number>(0)
  const timeX = useRef<number>(0)
  const timerWork = useRef<boolean>(false)
  const gameStart = useRef<boolean>(false)

  useEffect(() => {
    if ((markedBombs === bombs && flags === bombs) && (markedBombs > 0 && flags > 0)) {
      setWin(1)
      winX.current = 1
    }
  }, [markedBombs, flags])

  const fillState = (e:any) => {
    e.preventDefault()
    if (isNaN(size.X) || isNaN(size.Y)) {
      setError("Ошибка: размер поля должен быть числом")
    } else if (!size.X || !size.Y) {
      setError("Ошибка: размер поля не указан")
    } else if (isNaN(bombs)) {
      setError("Ошибка: количество бомб должно быть числом")
    } else if (size.X * size.Y === bombs) {
      setError("Ошибка: минимум одна ячейка должна быть без бомбы")
    } else if (size.X * size.Y < bombs) {
      setError("Ошибка: бомб больше чем ячеек на поле")
    } else if (bombs < 1) {
      setError("Ошибка: должна быть минимум одна бомба")
    } else if (isNaN(timeX.current)) {
      setError("Ошибка: количество секунд должно быть числом")
    } else {
      setField([])
      executed.current = false
      setFlags(0)
      setMarkedBombs(0)
      setTime(timeX.current)
      timerWork.current = false
      setError("")
      const fieldX:any = []
      let idX:number = 0
      let idY:number = 0
      for (let i = 0; i < size.X; i++) {
        const arrayX:any = []
        for (let j = 0; j < size.Y; j++) {
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
    }
  }

  const randomBomb = (idX:number, id:number) => {
    const arrayBombs:number[] = []
    while (arrayBombs.length < bombs) {
      const randomCell = Math.floor(Math.random() * (size.X * size.Y));
      if (randomCell !== field[idX].array[id].id && !arrayBombs.includes(randomCell)) {
        arrayBombs.push(randomCell)
      }
    }
    const fieldX = [...field]
    arrayBombs.forEach(bombId => {
      fieldX.forEach(arrayX => 
        arrayX.array.forEach((cell:{id:number, bomb:boolean}) => {
          if (cell.id === bombId) {
            cell.bomb = true
          }
      }))
    })
    setField(fieldX)
  }

  const startTimer = () => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        if (winX.current > 0) {
          clearInterval(timer)
          timerWork.current = false
          return prevTime
        } else if (prevTime === 0 && executed.current && timerWork.current) {
          clearInterval(timer)
          winX.current = 2
          timerWork.current = false
          setField(field)
          return prevTime
        } else if (timerWork.current) {
          return prevTime - 1
        } else {
          clearInterval(timer)
          return timeX.current
        }
      })
    }, 1000)
  }

  const cellClick = (idX:number, id:number) => {
    if (winX.current) { return }
    if (!executed.current) {
      gameStart.current = true
      executed.current = true
      randomBomb(idX, id)
      if (timeX.current) {
        timerWork.current = true
        startTimer()
      }
    }
    if (!field[idX]?.array[id]?.flag) {
      let fun = true
      const fieldX:any = [...field]
      const checkCell = (idX:number, id:number) => { 
        if (!(idX < 0 || idX >= fieldX.length || id < 0 || id >= fieldX[idX].length) && fieldX[idX]?.array[id]?.click === false) {
          if (fieldX[idX]?.array[id]?.bomb === true) {
            fieldX.map((arrayX: any) => arrayX.array.map((cellX: any) => {
              cellX.bomb ? cellX.click = true : null
              cellX.flag ? cellX.flag = false : null
              setWin(2)
              winX.current = 2
            }))
          } else if (fieldX[idX].array[id].click === false) {
            fieldX[idX].array[id].countBomb = services.saper.checkBomb(idX, id, fieldX)
            if (!fieldX[idX].array[id].countBomb) {
              fieldX[idX].array[id].click = true
              if (!fieldX[idX - 1]?.array[id - 1]?.click) { checkCell(idX - 1, id - 1)} 
              if (!fieldX[idX - 1]?.array[id]?.click) { checkCell(idX - 1, id) }
              if (!fieldX[idX - 1]?.array[id + 1]?.click) { checkCell(idX - 1, id + 1) }
              if (!fieldX[idX]?.array[id - 1]?.click) { checkCell(idX, id - 1) }
              if (!fieldX[idX]?.array[id + 1]?.click) { checkCell(idX, id + 1) }
              if (!fieldX[idX + 1]?.array[id - 1]?.click ) { checkCell(idX + 1, id - 1) }
              if (!fieldX[idX + 1]?.array[id]?.click) { checkCell(idX + 1, id) }
              if (!fieldX[idX + 1]?.array[id + 1]?.click) { checkCell(idX + 1, id + 1) }
            }
          }
          fieldX[idX].array[id].click = true
        }
      }
      if (fun) {
        checkCell(idX, id)
        fun = false
      }
      setField(fieldX)
    }
  }

  const putFlag = (e:any, idX:number, id:number) => {
    if (winX.current) { return }
    e.preventDefault()
    if (!field[idX].array[id].click && executed.current) {
      let flagsX:number = flags
      let markedBombsX:number = markedBombs
      const fieldX:any = [...field]
      if (fieldX[idX].array[id].flag) {
        fieldX[idX].array[id].flag = false
        setFlags(flagsX - 1)
        fieldX[idX].array[id].countBomb = 0
        fieldX[idX].array[id].bomb === true ? setMarkedBombs(markedBombsX -= 1) : null 
      } else {
        fieldX[idX].array[id].flag = true
        setFlags(flagsX + 1)
        fieldX[idX].array[id].countBomb = 'F'
        fieldX[idX].array[id].bomb === true ? setMarkedBombs(markedBombsX += 1) : null
      }
      setField(fieldX)
    }
  }

  return (
    <div className='mainPage'>
      <span className='mainSpan'>«РАЗРЫВНАЯ»</span>
      <div className='gameForm' >
        <div className='gameDiv'>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setSize({...size, X: Number(e.target.value)})}></input>
          <span className='gameSpan'>X</span>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setSize({...size, Y: Number(e.target.value)})}></input>
        </div>
        <div className='gameDiv'>
          <span className='bombSpan'>БОМБ: </span>
          <input className='gameInput' autoComplete="off" onChange={(e)=>setBombs(Number(e.target.value))}></input>
        </div>
        <div className='gameDiv'>
          <span className='bombSpan'>ВРЕМЯ: </span>
          <input className='gameTime' autoComplete="off" onChange={(e)=>timeX.current = Number(e.target.value)}></input>
        </div>
        <button className='gameButton' onClick={fillState}>НАЧАТЬ ИГРУ</button>
        <span className='errorSpan'>{error}</span>
      </div>
      <div className='fieldDiv'>
        <div className='fieldInfo'>
          {field.length ? <span className='fieldSpan'>ОТМЕЧЕНО: {flags}</span> : null}
          {field.length ? <span className='fieldSpan'>ОСТАЛОСЬ: {time}с</span> : null}
        </div>
        {field?.map((cellX:any, indexX:number)=>(
          <div className='fieldCellX' key={cellX.id} onContextMenu={(e)=>{e.preventDefault()}}>
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
            null}`} key={cell.id} onClick={()=>cellClick(indexX, index)} onContextMenu={(e)=>putFlag(e, indexX, index)}>{cell?.countBomb}</button>
          ))}
          </div>
        ))}
      </div>
      {win > 0 || winX.current > 0 ? <TotalResult
        gameStart={gameStart}
        setField={setField}
        win={win}
        setWin={setWin}
        winX = {winX}
        executed={executed}
        timerWork={timerWork}
        size={size}
        bombs={bombs}
        timeX={timeX}
        time={time}
      /> : null}
    </div>
  )
}