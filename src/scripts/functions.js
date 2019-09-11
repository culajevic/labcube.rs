exports.removeElement = (element1,element2) => {
  element1.addEventListener('click', (e) => {
    e.preventDefault()
    // let itemToRemove = e.target.innerText.slice(0,e.target.innerText.length)
    let itemToRemove = e.target.innerText
    let index = element2.indexOf(itemToRemove)
    element2.splice(index,1)
    if(element1.children.length === 1) {
      e.target.remove()
      element1.remove()
    } else {
      e.target.remove() }
  })
}
