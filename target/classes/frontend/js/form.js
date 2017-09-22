/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object} form data as an object literal
**/

const formToJSON = elements => {
    const today = new Date();

    const json = {};
    json['date'] = today.toISOString().substring(0, 10);
    json['symptoms'] = elements["symptoms"].split(",");

    return json;
};


const handleFormSubmit = event => {
    event.preventDefault();

    // Call our function to get the form data.
    const json = formToJSON(form.elements);
    const http = new XMLHttpRequest();
    const url = "api/add-symptoms";
    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    http.send(JSON.stringify(json));
};

/** Checks that neither the element.name or element.value are empty
 * @param {Element} element   current element we are trying to check
 * @return {Bool}   true if the element is a valid input, false otherwise
 *
 **/
const isValidElement = element => {
    return element.name && element.value;
};

const getSymptomData = event => {
    const today = new Date();
    today.toISOString().substring(0, 10);
    const rawDate30 = new Date();
    rawDate30.setDate(rawDate30.getDate() - 30);
    const oneMonthAgo = rawDate30.toISOString();


    const http = new XMLHttpRequest();
    const url = "api/get-historical-symptoms?start=" + oneMonthAgo + "&end=" + today;
    http.open('GET', url, true);
    http.send();


};
const form = document.getElementsByClassName('symptoms-form')[0];
form.addEventListener('submit', handleFormSubmit);
// form.addEventListener('submit', getSymptomData);