export const saperServices = {
  checkBomb(idX:number, id:number, fieldX:any) {
    let countBomb = 0
    if (fieldX[idX-1]?.array[id-1]?.bomb) {
      countBomb++
    }
    if (fieldX[idX-1]?.array[id]?.bomb) {
      countBomb++
    }
    if (fieldX[idX-1]?.array[id+1]?.bomb) {
      countBomb++
    }
    if (fieldX[idX]?.array[id-1]?.bomb) {
      countBomb++
    }
    if (fieldX[idX]?.array[id+1]?.bomb) {
      countBomb++
    }
    if (fieldX[idX+1]?.array[id-1]?.bomb) {
      countBomb++
    }
    if (fieldX[idX+1]?.array[id]?.bomb) {
      countBomb++
    }
    if (fieldX[idX+1]?.array[id+1]?.bomb) {
      countBomb++
    }
    return countBomb
  },
  checkAround(idX:number, id:number, fieldX: any, stack:any) {
    const aroundCells = [
      { idX: idX - 1, id: id - 1 },
      { idX: idX - 1, id },
      { idX: idX - 1, id: id + 1 },
      { idX, id: id - 1 },
      { idX, id: id + 1 },
      { idX: idX + 1, id: id - 1 },
      { idX: idX + 1, id },
      { idX: idX + 1, id: id + 1 },
    ]
    stack.push(...aroundCells.filter(cell => (
      cell.idX >= 0 &&
      cell.idX < fieldX.length &&
      cell.id >= 0 &&
      cell.id < fieldX[cell.idX]?.array.length &&
      !fieldX[cell.idX].array[cell.id].click
    )))
    return stack
  }
}