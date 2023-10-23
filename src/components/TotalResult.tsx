export default function TotalResult({gameActive, setField, win, executed, size, bombs, times}:any) {
  const newGame = () => {
      setTimeout(() => {
      gameActive.current = false
      setField([])
      win.current = 0
      executed.current = false
    }, 100)
  }

  const timeSpent = `${Math.floor((times.X - times.Y) / 60)}:${((times.X - times.Y) % 60).toString().padStart(2, '0')}`

  return(
    <div className="totalDiv">
      {win.current === 1 ? <span className="win">ОБЕЗВРЕЖЕННО</span> : <span className="lose">ПОДОРВАН</span>}
      <span className="totalSpan">ПОЛЕ: {size.X} X {size.Y}</span>
      <span className="totalSpan">БОМБ: {bombs.Y}</span>
      {times.X ? <time className="totalSpan">ВРЕМЯ: {timeSpent}</time> : null}
      <button className="totalButton" onClick={newGame}>НОВАЯ ИГРА</button>
    </div>
  )
}