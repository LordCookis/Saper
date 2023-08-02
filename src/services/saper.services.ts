export const saperServices = {
  checkCell(idX: number, id: number, fieldX: any){
    if (fieldX[idX-1]?.array[id-1]?.bomb === false) {
      console.log(111, idX-1, id-1)
      fieldX[idX-1].array[id-1].click = true
    }
    if (fieldX[idX-1]?.array[id]?.bomb === false) {
      console.log(222, idX-1, id)
      fieldX[idX-1].array[id].click = true
    }
    if (fieldX[idX-1]?.array[id+1]?.bomb === false) {
      console.log(333, idX-1, id+1)
      fieldX[idX-1].array[id+1].click = true
    }
    if (fieldX[idX]?.array[id-1]?.bomb === false) {
      console.log(444, idX, id-1)
      fieldX[idX].array[id-1].click = true
    }
    if (fieldX[idX]?.array[id+1]?.bomb === false) {
      console.log(555, idX, id+1)
      fieldX[idX].array[id+1].click = true
    }
    if (fieldX[idX+1]?.array[id-1]?.bomb === false) {
      console.log(666, idX+1, id-1)
      fieldX[idX+1].array[id-1].click = true
    }
    if (fieldX[idX+1]?.array[id]?.bomb === false) {
      console.log(777, idX+1, id)
      fieldX[idX+1].array[id].click = true
    }
    if (fieldX[idX+1]?.array[id+1]?.bomb === false) {
      console.log(888, idX+1, id+1)
      fieldX[idX+1].array[id+1].click = true
    }
  },
  checkBomb(idX: number, id: number, fieldX: any) {
    let countBomb = 0
    if (fieldX[idX-1]?.array[id-1]?.bomb === true) {
      countBomb++
      console.log(111, idX-1, id-1)
    }
    if (fieldX[idX-1]?.array[id]?.bomb === true) {
      countBomb++
      console.log(222, idX-1, id)
    }
    if (fieldX[idX-1]?.array[id+1]?.bomb === true) {
      countBomb++
      console.log(333, idX-1, id+1)
    }
    if (fieldX[idX]?.array[id-1]?.bomb === true) {
      countBomb++
      console.log(444, idX, id-1)
    }
    if (fieldX[idX]?.array[id+1]?.bomb === true) {
      countBomb++
      console.log(555, idX, id+1)
    }
    if (fieldX[idX+1]?.array[id-1]?.bomb === true) {
      countBomb++
      console.log(666, idX+1, id-1)
    }
    if (fieldX[idX+1]?.array[id]?.bomb === true) {
      countBomb++
      console.log(777, idX+1, id)
    }
    if (fieldX[idX+1]?.array[id+1]?.bomb === true) {
      countBomb++
      console.log(888, idX+1, id+1)
    }
    return countBomb
  },
}