import { useEffect, useRef, useState } from 'react'
import { services } from '@/services'
import TotalResult from '@/components/TotalResult'

export default function Home() {
  const [field, setField] = useState<any>([])
  interface Size {X: number, Y: number}
  const [size, setSize] = useState<Size>({X: 0, Y: 0})
  interface Bomb {X: number, Y: number}
  const [bombs, setBombs] = useState<Bomb>({X: 0, Y: 0})
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
    if ((markedBombs === bombs.Y && flags === bombs.Y) && (markedBombs > 0 && flags > 0)) {
      setWin(1)
      winX.current = 1
    }
  }, [markedBombs, flags])

  const fillState = (e:any) => {
    e.preventDefault()
    if (!size.X || !size.Y) {
      setError("Ошибка: размер поля не указан")
    } else if (size.X * size.Y === bombs.X) {
      setError("Ошибка: минимум одна ячейка должна быть без бомбы")
    } else if (size.X * size.Y < bombs.X) {
      setError("Ошибка: бомб больше чем ячеек на поле")
    } else if (bombs.X < 1) {
      setError("Ошибка: должна быть минимум одна бомба")
    } else {
      setField([])
      setBombs({...bombs, Y: bombs.X})
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
    while (arrayBombs.length < bombs.Y) {
      const randomCell = Math.floor(Math.random() * (size.X * size.Y));
      randomCell !== field[idX].array[id].id && !arrayBombs.includes(randomCell) ? arrayBombs.push(randomCell) : null
    }
    const fieldX = [...field]
    arrayBombs.forEach(bombId => {
      fieldX.forEach(arrayX => {
        arrayX.array.forEach((cell:{id:number, bomb:boolean}) => {
          cell.id === bombId ? cell.bomb = true : null
        })
      })
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

  const checkCell = (idX:number, id:number) => {
    const fieldX:any = [...field]
    let stack:{idX:number; id:number}[] = [{idX, id}]
    console.log("----------------")
    while (stack.length > 0) {
      const {idX, id} = stack.pop()
      fieldX[idX].array[id].click = true
      fieldX[idX].array[id].countBomb = services.saper.checkBomb(idX, id, fieldX)
      if (fieldX[idX].array[id].bomb) {
        fieldX[idX].array[id].countBomb = 0
        fieldX.forEach((arrayX: any) => {arrayX.array.forEach((cellX: any) => {cellX.bomb ? cellX.click = true : null})})
        setWin(2)
        winX.current = 2
      } else if (!fieldX[idX].array[id].countBomb) {    
        stack = services.saper.checkAround(idX, id, fieldX, stack)
      }
    }
    setField(fieldX)
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
    if (!field[idX].array[id].flag && !field[idX].array[id].click) { checkCell(idX, id) }
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

  const inputSizeX = (e:any) => { /^\d+$/.test(e.target.value) || e.target.value === '' ? setSize({...size, X: Number(e.target.value)}) : null }
  const inputSizeY = (e:any) => { /^\d+$/.test(e.target.value) || e.target.value === '' ? setSize({...size, Y: Number(e.target.value)}) : null }
  const inputBombs = (e:any) => { /^\d+$/.test(e.target.value) || e.target.value === '' ? setBombs({...bombs, X: Number(e.target.value)}) : null }
  const inputTimeX = (e:any) => {
    if ((e.target.value.charAt(0) !== "0" || e.target.value.length === 1) && (/^\d+$/.test(e.target.value) && e.target.value !== '')) {
      timeX.current = e.target.value
      setBombs({...bombs, X: bombs.X})
    }
  }

  return (
    <div className='mainPage'>
      <span className='mainSpan'>«РАЗРЫВНАЯ»</span>
      <div className='gameForm' >
        <div className='gameDiv'>
          <input className='gameInput' autoComplete="off" value={size.X} onChange={inputSizeX}></input>
          <span className='gameSpan'>X</span>
          <input className='gameInput' autoComplete="off" value={size.Y} onChange={inputSizeY}></input>
        </div>
        <div className='gameDiv'>
          <span className='bombSpan'>БОМБ: </span>
          <input className='gameInput' autoComplete="off" value={bombs.X} onChange={inputBombs}></input>
        </div>
        <div className='gameDiv'>
          <span className='bombSpan'>ВРЕМЯ: </span>
          <input className='gameTime' autoComplete="off" value={timeX.current} onChange={inputTimeX}></input>
        </div>
        <button className='gameButton' onClick={fillState}>НАЧАТЬ ИГРУ</button>
        <span className='errorSpan'>{error}</span>
      </div>
      <div className='fieldDiv'>
        <div className='fieldInfo'>
          {field.length ? <span className='fieldSpan'>БОМБ: {bombs.Y - flags}</span> : null}
          {field.length ? <span className='fieldSpan'>ВРЕМЯ: {time}с</span> : null}
        </div>
        {field?.map((cellX:any, indexX:number)=>(
          <div className='fieldCellX' key={cellX.id} onContextMenu={(e)=>{e.preventDefault()}}>
          {cellX?.array?.map((cell:any, index:number)=>(
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