export default function TotalResult({setField, setWin, win, size, bombs}:any) {
  const newGame = () => {
    setField([])
    setWin(0)
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