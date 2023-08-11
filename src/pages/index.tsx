import { useEffect, useRef, useState } from 'react'
import { services } from '@/services'
import TotalResult from '@/components/TotalResult'
//let executed:boolean = false

export default function Home() {
  const [field, setField] = useState<any>([])
  interface Size {X: number, Y: number}
  const [size, setSize] = useState<Size>({X: 0, Y: 0})
  const [bombs, setBombs] = useState<number>(0)
  const executed = useRef<boolean>(false)
  const [flags, setFlags] = useState<number>(0)
  const [markedBombs, setMarkedBombs] = useState<number>(0)
  const [win, setWin] = useState<number>(0)
  const [error, setError] = useState<string>("")
  const [time, setTime] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)

  useEffect(() => {
    if ((markedBombs === bombs && flags === bombs) && (markedBombs > 0 && flags > 0)) {
      setWin(1)
    }
  }, [markedBombs, flags])

  const fillState = (e:any) => {
    e.preventDefault()
    setField([])
    executed.current  = false
    setFlags(0)
    setMarkedBombs(0)
    setIsTimerRunning(false)
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
    } else if (bombs === 0) {
      setError("Ошибка: должна быть минимум одна бомба")
    } else {
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
      startTimer(time)
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
        arrayX.array.forEach((cell: {id:number, bomb:boolean}) => {
          if (cell.id === bombId) {
            cell.bomb = true
          }
      }))
    })
    setField(fieldX)
  }

  const startTimer = (t: number) => {
    setIsTimerRunning(true)
    setTime(t)
    const timerInterval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timerInterval)
          setIsTimerRunning(false)
          setWin(2)
          return 0
        } else {
          return prevTime - 1
        }
      })
    }, 1000)
  }

  const cellClick = (idX:number, id:number) => {
    if (!executed.current) {
      executed.current = true
      randomBomb(idX, id)
    }
    if (field[idX]?.array[id]?.flag === false) {
      const fieldX:any = [...field]
      if (!(idX < 0 || idX >= fieldX.length || id < 0 || id >= fieldX[idX].length) && fieldX[idX]?.array[id]?.click === false) {
        if (fieldX[idX]?.array[id]?.bomb === true) {
          fieldX.map((arrayX: any) => arrayX.array.map((cellX: any) => {
            cellX.bomb ? cellX.click = true : null
            cellX.flag ? cellX.flag = false : null
            setWin(2)
          }))
        } else if (fieldX[idX].array[id].click === false) {
          if (services.saper.checkBomb(idX, id, fieldX)) {
            fieldX[idX].array[id].countBomb = services.saper.checkBomb(idX, id, fieldX)
          } else {
            if (fieldX[idX].array[id].countBomb === 0) {
              fieldX[idX].array[id].click = true
              cellClick(idX - 1, id - 1)
              cellClick(idX - 1, id)
              cellClick(idX - 1, id + 1)
              cellClick(idX, id - 1)
              cellClick(idX, id + 1)
              cellClick(idX + 1, id - 1)
              cellClick(idX + 1, id)
              cellClick(idX + 1, id + 1)
            }
          }
        }
        fieldX[idX].array[id].click = true
      }
      setField(fieldX)
    }
  }

  const putFlag = (e:any, idX:number, id:number) => {
    e.preventDefault()
    let flagsX:number = flags
    let markedBombsX:number = markedBombs
    const fieldX:any = [...field]
    if (!fieldX[idX].array[id].click && !fieldX[idX].array[id].flag) {
      fieldX[idX].array[id].flag = true
      setFlags(flagsX + 1)
      fieldX[idX].array[id].countBomb = 'F'
      fieldX[idX].array[id].bomb === true ? setMarkedBombs(markedBombsX += 1) : null
    } else if (!fieldX[idX].array[id].click && fieldX[idX].array[id].flag) {
      fieldX[idX].array[id].flag = false
      setFlags(flagsX - 1)
      fieldX[idX].array[id].countBomb = 0
      fieldX[idX].array[id].bomb === true ? setMarkedBombs(markedBombsX-=1) : null 
    }
    setField(fieldX)
  }

  return (
    <div className='mainPage'>
      <span className='mainSpan'>«САПЕР ОФФЛАЙН»</span>
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
          <input className='gameTime' autoComplete="off" onChange={(e)=>setTime(Number(e.target.value))}></input>
        </div>
        <button className='gameButton' onClick={fillState}>НАЧАТЬ ИГРУ</button>
        <span className='errorSpan'>{error}</span>
      </div>
      <div className='fieldDiv'>
        {field.length ? <span className='fieldSpan'>ОТМЕЧЕНО: {flags}</span> : null}
        {field.length ? <span className='fieldSpan'>ОСТАЛОСЬ: {time}с</span> : null}
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
            null}`} key={cell.id} onClick={(e)=>cellClick(indexX, index)} onContextMenu={(e)=>putFlag(e, indexX, index)}>{cell.countBomb ? cell.countBomb : null}</button>
          ))}
          </div>
        ))}
      </div>
      {win > 0 ? <TotalResult
        setField={setField}
        setWin={setWin}
        win={win}
        size={size}
        bombs={bombs}
      /> : null}
    </div>
  )
}
