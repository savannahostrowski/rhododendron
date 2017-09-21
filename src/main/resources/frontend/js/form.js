/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object} form data as an object literal
**/

const formToJSON = elements => {


    // Called on each element in the array (each field)
    const aggregateFormData = (data, element) => {

        if (isValidElement(element)) {
            // Add the current field to the object.
            data[element.name] = element.value;
        }
        const today = new Date(Date.now());
        const yyyy = today.getFullYear();
        const mm = today.getMonth() + 1;
        const dd = today.getDate();

        data['date'] = "" + yyyy + mm + dd;

        return data;
    };

    const reducerInitialValue = {};


    // Now we reduce by "call"-ing "reduce()" on "elements".
    const formData = [].reduce.call(elements, aggregateFormData, reducerInitialValue);
    console.log(formData);
    // The result is then returned for use elsewhere.
    return formData;
};


const handleFormSubmit = event => {

    // Stop the form from submitting since we’re handling that with AJAX.
    event.preventDefault();

    // Call our function to get the form data.
    formToJSON(form.elements);

};

/** Checks that neither the element.name or element.value are empty
 * @param {Element} element   current element we are trying to check
 * @return {Bool}   true if the element is a valid input, false otherwise
 *
 **/
const isValidElement = element => {
    return element.name && element.value;
}

const form = document.getElementsByClassName('symptoms-form')[0];
form.addEventListener('submit', handleFormSubmit);
