export default function TotalResult({gameStart, setField, win, executed, setFlags, setMarkedBombs, timerWork, size, bombs}:any) {
  const newGame = () => {
    gameStart.current = false
    setField([])
    win.current = 0
    executed.current = false
    setFlags(0)
    setMarkedBombs(0)
    timerWork.current = false
  }

  return(
    <div className="totalDiv">
      {win === 1 ? 
      <span className="win">ОБЕЗВРЕЖЕННО</span> :
      <span className="lose">ПОДОРВАН</span>}
      <span className="totalSpan">ПОЛЕ: {size.X} / {size.Y}</span>
      <span className="totalSpan">БОМБ: {bombs}</span>
      <button className="totalButton" onClick={newGame}>НОВАЯ ИГРА</button>
    </div>
  )
}