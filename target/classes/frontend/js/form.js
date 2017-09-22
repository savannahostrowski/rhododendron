/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object} form data as an object literal
**/

const formToJSON = elements => {

    const today = new Date(Date.now());
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();

    const reducerInitialValue = {};
    reducerInitialValue['date'] = yyyy + "-" + mm + "-" + dd;

    // Called on each element in the array (each field)
    const aggregateFormData = (data, element) => {

        if (isValidElement(element)) {
            // Add the current field to the object.
            data[element.name] = element.value;
        }

        return data;
    };

    // Now we reduce by "call"-ing "reduce()" on "elements".
    const formData = [].reduce.call(elements, aggregateFormData, reducerInitialValue);
    // The result is then returned for use elsewhere.
    return formData;
};


const handleFormSubmit = event => {
    event.preventDefault();

    // Call our function to get the form data.
    const json = formToJSON(form.elements);
    const http = new XMLHttpRequest();
    const url = "api/add-symptoms";
    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/json");

    http.send(JSON.stringify(json));

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
