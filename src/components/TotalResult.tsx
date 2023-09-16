export default function TotalResult({gameStart, setField, win, setWin, winX, executed, timerWork, size, bombs, timeX, time}:any) {
  const newGame = () => {
      setTimeout(() => {
      gameStart.current = false
      setField([])
      setWin(0)
      winX.current = 0
      executed.current = false
      timerWork.current = false
    }, 100)
  }

  const timeSpent = `${Math.floor((timeX.current - time) / 60)}:${((timeX.current - time) % 60).toString().padStart(2, '0')}`

  return(
    <div className="totalDiv">
      {win === 1 ? 
      <span className="win">ОБЕЗВРЕЖЕННО</span> :
      <span className="lose">ПОДОРВАН</span>}
      <span className="totalSpan">ПОЛЕ: {size.X} X {size.Y}</span>
      <span className="totalSpan">БОМБ: {bombs.Y}</span>
      {timeX.current ? <span className="totalSpan">ВРЕМЯ: {timeSpent}</span> : null}
      <button className="totalButton" onClick={newGame}>НОВАЯ ИГРА</button>
    </div>
  )
}