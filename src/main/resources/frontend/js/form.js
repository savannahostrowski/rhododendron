/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object} form data as an object literal
**/


const formToJSON = () => {
    const today = new Date();

    const json = {};
    json["date"] = today.toISOString().substring(0, 10);
    json["symptoms"] = form.elements["symptoms"].value;

    return json;
};


const addSymptomData = event => {
    // prevents form from submitting as normal (reload)
    event.preventDefault();

    // Get form data in JSON format
    const json = formToJSON();
    // Set up http request (POST)
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

const getMostCommon = () => {
    const http = new XMLHttpRequest();
    const url = "api/top-two-symptoms";
    http.open('GET', url, true);
    http.send();

    http.onreadystatechange = function () {
        if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
            const json = JSON.parse(http.responseText);
            const mostCommonDiv = document.getElementsByClassName("most-common")[0];
            for (let key in json) {
                const symptomSpan = document.createElement("span");
                symptomSpan.setAttribute("class", "common-symptom");
                symptomSpan.innerHTML = json[key];
                mostCommonDiv.appendChild(symptomSpan);

                let clickCount = 0;

                mostCommonDiv.addEventListener("click", function(e) {
                    clickCount += 1;
                });
                
                symptomSpan.addEventListener("click", function(e) {
                    if (clickCount === 0) {
                        document.getElementById("symptoms-list").value += this.textContent;
                    } else {
                        document.getElementById("symptoms-list").value += ("," + this.textContent);
                    }
                });
            }



        }
    }
};

const getSortedKeys = json => {
    const keys = [];
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

    const headerRow = document.createElement("tr");
    const dateCol = document.createElement("td");
    const symptomCol = document.createElement("td");

    dateCol.appendChild(document.createTextNode("Date"));
    symptomCol.appendChild(document.createTextNode("Symptoms"));

    headerRow.appendChild(dateCol);
    headerRow.append(symptomCol);
    table.appendChild(headerRow);

    for (let i = 0; i < sortedKeys.length; i++) {
        const key = sortedKeys[i];

        const row = document.createElement("tr");
        const dateNode = document.createElement("td");
        dateNode.appendChild(document.createTextNode(key));
        row.appendChild(dateNode);

        const symptoms = json[key];

        const symptomsNode = document.createElement("td");
        symptomsNode.appendChild(document.createTextNode(symptoms));

        row.append(symptomsNode);
        table.appendChild(row);
    }

    visualizationDiv.appendChild(table);
};



const form = document.getElementsByClassName("symptoms-form")[0];
const historyButton = document.getElementsByClassName("symptom-history")[0];
const sadFace = document.getElementsByClassName("feeling-bad")[0];

form.addEventListener("submit", addSymptomData);
historyButton.addEventListener("click", getSymptomData);
sadFace.addEventListener("click", getMostCommon);






