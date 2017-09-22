/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object} form data as an object literal
**/

const formToJSON = form => {
    const today = new Date();

    const json = {};
    json["date"] = today.toISOString().substring(0, 10);
    json["symptoms"] = form["symptoms"].value;

    return json;
};


const addSymptomData = event => {
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

const getSymptomData = event => {
    event.preventDefault();

    // Generating today's date in YYYY-MM-DD format
    const now = new Date();

    const today = now.toISOString().substring(0, 10);

    // Generating the date one month ago in YYYY-MM-DD format
    const rawDate30 = new Date();
    rawDate30.setDate(rawDate30.getDate() - 30);
    const oneMonthAgo = rawDate30.toISOString().substring(0, 10);


    const http = new XMLHttpRequest();
    const url = "api/get-historical-symptoms?start=" + oneMonthAgo + "&end=" + today;
    http.open('GET', url, true);
    http.send();
};

const form = document.getElementsByClassName('symptoms-form')[0];

form.addEventListener('submit', addSymptomData);
form.addEventListener('submit', getSymptomData);



