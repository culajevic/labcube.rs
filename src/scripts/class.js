/*
add description for this class
*/
module.exports = class NewElement {
  constructor(grandParent, parentElement, parentClass=['form-group'],titleElement,titleClass=['form-text'], titleText, inputClass, inputPlaceholder,inputName, inputPattern) {
    this.grandParent = grandParent,
    this.parentElement = parentElement,
    this.parentClass= parentClass,
    this.titleElement = titleElement,
    this.titleClass= titleClass,
    this.titleText = titleText,
    this.inputClass = inputClass,
    this.inputPlaceholder = inputPlaceholder,
    this.inputName = inputName,
    this.inputPattern = inputPattern
  }
  addElement() {
    // add parent div
    let newParentElement = document.createElement(this.parentElement)
    newParentElement.className += this.parentClass

    // create title and append it to parent div
    let elementTitle = document.createElement(this.titleElement)
    elementTitle.className += this.titleClass
    let elementTitleText = document.createTextNode(this.titleText)
    elementTitle.appendChild(elementTitleText)

    // create remove icon
    let removeField = document.createElement('span')
    removeField.className += 'float-right removeField'
    let removeFieldIcon = document.createTextNode('-')
    removeField.appendChild(removeFieldIcon)

    // adding remove icon to title element
    newParentElement.appendChild(removeField)
    // append title tag to parent div
    newParentElement.appendChild(elementTitle)

    // create input field and add class, placeholder and name values
    let newInputField = document.createElement('input')
    newInputField.className += this.inputClass
    newInputField.placeholder = this.inputPlaceholder
    newInputField.name= this.inputName
    newInputField.pattern = this.inputPattern

    // add input field to parent
    newParentElement.appendChild(newInputField)

    // append everything to grand parent
    let grandParent = document.querySelector(this.grandParent)
    grandParent.appendChild(newParentElement)
    // grandParent.insertBefore(newParentElement, grandParent.childNodes[this.insertBefore])

    // set focus to last created element
    newInputField.focus()
  }
  removeElement(elementName) {
    let elementToBeRemoved = document.querySelectorAll(elementName)
    elementToBeRemoved.forEach((item) => {
      item.addEventListener('click', (e) => {
        item.parentNode.remove()
      })
    })
  }
}
