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
  }
}