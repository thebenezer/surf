const mainform = document.querySelector('main');
const textareaLabel = document.querySelector('.label-textarea');
            
mainform.addEventListener("click", (e) => {
    const txtarea = document.querySelector('.textbox textarea');
    let targetElement = e.target; // clicked element

    do {
        if (targetElement == txtarea) {
            // This is a click inside. Do nothing, just return.
            textareaLabel.classList.add('small');
            txtarea.classList.add('small');
            return;
        }
        // Go up the DOM
        targetElement = targetElement.parentNode;
    } while (targetElement);

    // This is a click outside.
    textareaLabel.classList.remove('small');
    txtarea.classList.remove('small');

});