import { useEffect, useRef, useState } from 'react'
import { services } from '@/services'
import TotalResult from '@/components/TotalResult'

export default function Home() {
  const [field, setField] = useState<any>([])
  interface Size {X: number, Y: number}
  const [size, setSize] = useState<Size>({X: 0, Y: 0})
  interface Bomb {X: number, Y: number}
  const [bombs, setBombs] = useState<Bomb>({X: 0, Y: 0})
  interface Time {X: number, Y: number}
  const [times, setTimes] = useState<Time>({X: 0, Y: 0})
  interface Flag {X: number, Y: number}
  const [flags, setFlags] = useState<Flag>({X: 0, Y: 0})
  const [error, setError] = useState<string>("")
  const gameActive = useRef<boolean>(false)
  const executed = useRef<boolean>(false)
  const win = useRef<number>(0)

  useEffect(() => {
    if (field.lenght && flags.X === flags.Y && flags.Y === bombs.Y) {
      win.current = 1
      setFlags({...flags, Y: flags.X})
    }
  }, [flags.X])

  const fillState = (e:any) => {
    e.preventDefault()
    const fieldX:any = []
    let idX:number = 0
    for (let i = 0; i < size.X; i++) {
      const arrayX:any = []
      for (let j = 0; j < size.Y; j++) {
        arrayX.push({
          id: idX,
          bomb: false,
          click: false,
          countBomb: 0,
          flag: false
        })
        idX++
      }
      fieldX.push({
        id: i,
        array: arrayX
      })
      idX++
    }
    setField(fieldX)
    setBombs({...bombs, Y: bombs.X})
    setTimes({...times, Y: times.X})
    setFlags({X: 0, Y: 0})
    gameActive.current = true
    executed.current = false
    setError("")
  }

  const randomBomb = (cell:any) => {
    const arrayBombs:any = []
    while (arrayBombs.length < bombs.Y) {
      const randomCell = Math.floor(Math.random() * (field.length * field[0].array.length))
      randomCell !== cell.id && !arrayBombs.includes(randomCell) ? arrayBombs.push(randomCell) : null
    }
    const fieldX = [...field]
    fieldX.map((arrayX) => {
      arrayX.array.map((cellX:any) => arrayBombs.includes(cellX.id) ? cellX.bomb = true : null)
    })
    setField(fieldX)
  }

  const startTimer = () => {
    let timeX = times.Y
    const timer = setInterval(() => {
      if (timeX === 1) {
        clearInterval(timer)
        win.current = 2
        timeX--
        setTimes({...times, Y: timeX})
      } else if (win.current > 0) {
        clearInterval(timer)
      } else {
        timeX--
        setTimes({...times, Y: timeX})
      }
    }, 1000)
  }

  const checkCell = (idX:number, id:number) => {
    const fieldX:any = [...field]
    fieldX[idX].array[id].click = true
    let stack:{idX:number; id:number}[] = [{idX, id}]
    while (stack.length > 0) {
      const {idX, id} = stack.pop()!
      fieldX[idX].array[id].click = true
      fieldX[idX].array[id].countBomb = services.saper.checkBomb(idX, id, fieldX)
      if (fieldX[idX].array[id].bomb) {
        fieldX[idX].array[id].countBomb = 0
        fieldX.forEach((arrayX: any) => {arrayX.array.forEach((cellX: any) => {cellX.bomb ? cellX.click = true : null})})
        win.current = 2
      } else if (!fieldX[idX].array[id].countBomb) {    
        stack = services.saper.checkAround(idX, id, fieldX, stack)
      }
    }
    setField(fieldX)
  }

  const cellClick = (idX:number, id:number) => {
    let cell = field[idX].array[id]
    if (!executed.current) {
      executed.current = true
      randomBomb(cell)
      times.Y ? startTimer() : null
    }
    if (!cell.flag && !cell.click) { checkCell(idX, id) }
  }

  const putFlag = (cell:any) => {
    if (cell.click || !executed.current) { return }
    if (cell.flag) {
      cell.flag = false
      cell.bomb ? setFlags({...flags, X: flags.X - 1, Y: flags.Y - 1}) : setFlags({...flags, X: flags.X - 1})
    } else {
      cell.flag = true
      cell.bomb ? setFlags({...flags, X: flags.X + 1, Y: flags.Y + 1}) : setFlags({...flags, X: flags.X + 1})
    }
  }

  //const inputSizeX = (e:any) => { /^\d+$/.test(e.target.value) || e.target.value === '' ? setSize({...size, X: Number(e.target.value)}) : null }
  //const inputSizeY = (e:any) => { /^\d+$/.test(e.target.value) || e.target.value === '' ? setSize({...size, Y: Number(e.target.value)}) : null }
  //const inputBombs = (e:any) => { /^\d+$/.test(e.target.value) || e.target.value === '' ? setBombs({...bombs, X: Number(e.target.value)}) : null }
  //const inputTimeX = (e:any) => {
  //  if ((e.target.value.charAt(0) !== "0" || e.target.value.length === 1) && (/^\d+$/.test(e.target.value) && e.target.value !== '')) {
  //    timeX.current = e.target.value
  //    setBombs({...bombs, X: bombs.X})
  //  }
  //}

  return (
    <div className='mainPage'>
      <span className='mainSpan'>«РАЗРЫВНАЯ»</span>
      <form className='gameForm' method="get" onSubmit={fillState}>
        <div className='gameDiv'>
          <input className='gameInput' type='number' autoComplete="off" required onChange={(e)=>setSize({...size, X: Number(e.target.value)})} min={2}></input>
          <span className='gameSpan'>X</span>
          <input className='gameInput' type='number' autoComplete="off" required onChange={(e)=>setSize({...size, Y: Number(e.target.value)})} min={2}></input>
        </div>
        <div className='gameDiv'>
          <span className='bombSpan'>БОМБ: </span>
          <input className='gameInput' type='number' autoComplete="off" required onChange={(e)=>setBombs({...bombs, X: Number(e.target.value)})} min={1}></input>
        </div>
        <div className='gameDiv'>
          <span className='bombSpan'>ВРЕМЯ: </span>
          <input className='gameTime' type='number' autoComplete="off" onChange={(e)=>setTimes({...times, X: Number(e.target.value)})} min={0}></input>
        </div>
        <button className='gameButton'>НАЧАТЬ ИГРУ</button>
        <span className='errorSpan'>{error}</span>
      </form>
      <div className='fieldDiv'>
        <div className='fieldInfo'>
          {field.length ? <span className='fieldSpan'>Отмечено: {flags.X} / {bombs.Y}</span> : null}
          {field.length && times.X ? <span className='fieldSpan'>Времени: {times.Y}c</span> : null}
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
            null}`} key={cell.id} onClick={()=>cellClick(indexX, index)} onContextMenu={()=>putFlag(cell)}>{cell?.countBomb}</button>
          ))}
          </div>
        ))}
      </div>
      {win.current === 0 || 
      <TotalResult
        gameActive={gameActive}
        setField={setField}
        win={win}
        executed={executed}
        size={size}
        bombs={bombs}
        times={times}
      />}
    </div>
  )
}