export default function TotalResult({gameStart, setField, win, executed, timerWork, size, bombs, timeX, time}:any) {
  const newGame = () => {
      setTimeout(() => {
      gameStart.current = false
      setField([])
      win.current = 0
      executed.current = false
      timerWork.current = false
    }, 100)
  }

  const timeSpent = `${Math.floor((timeX.Start - time.Start) / 60)}:${((timeX.Start - time.Start) % 60).toString().padStart(2, '0')}`

  return(
    <div className="totalDiv">
      {win.current === 1 ? 
      <span className="win">ОБЕЗВРЕЖЕННО</span> :
      <span className="lose">ПОДОРВАН</span>}
      <span className="totalSpan">ПОЛЕ: {size.X} X {size.Y}</span>
      <span className="totalSpan">БОМБ: {bombs}</span>
      <span className="totalSpan">ВРЕМЯ: {timeSpent}</span>
      <button className="totalButton" onClick={newGame}>НОВАЯ ИГРА</button>
    </div>
  )
}