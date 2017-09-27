/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object} form data as an object literal
**/


const formToJSON = elements => {
    const today = new Date();

    const json = {};
    json["date"] = today.toISOString().substring(0, 10);
    json["symptoms"] = form.elements["symptoms"].value;

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
    http.onreadystatechange = function () {
        if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
            getSymptomData();
        }

    };
};

const getSymptomData = () => {

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

    http.onreadystatechange = function () {
        if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
            const json = JSON.parse(http.responseText);
            const sortedKeys = getSortedKeys(json);
            buildVisualizationTable(sortedKeys, json);

        }

    };

};

const getSortedKeys = json => {
    let keys = [];
    for (let key in json) {
        if(json.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    return keys.sort();
};


const buildVisualizationTable = (sortedKeys, json) => {
    const visualizationDiv = document.getElementById("visualization");
    const table = document.createElement("table");
    table.setAttribute("class", "visualization-table");

    let headerRow = document.createElement("tr");
    let dateCol = document.createElement("td");
    let symptomCol = document.createElement("td");

    dateCol.appendChild(document.createTextNode("Date"));
    symptomCol.appendChild(document.createTextNode("Symptoms"));

    headerRow.appendChild(dateCol);
    headerRow.append(symptomCol);
    table.appendChild(headerRow);

    for (let i = 0; i < sortedKeys.length; i++) {
        let key = sortedKeys[i];

        let row = document.createElement("tr");
        let dateNode = document.createElement("td");
        dateNode.appendChild(document.createTextNode(key));
        row.appendChild(dateNode);

        let symptoms = json[key];

        let symptomsNode = document.createElement("td");
        symptomsNode.appendChild(document.createTextNode(symptoms));

        row.append(symptomsNode);
        table.appendChild(row);
    }

    visualizationDiv.appendChild(table);
};

const form = document.getElementsByClassName("symptoms-form")[0];
const historyButton = document.getElementsByClassName("symptom-history")[0];

form.addEventListener("submit", addSymptomData);
historyButton.addEventListener("click", getSymptomData);


