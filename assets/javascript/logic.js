var database;
var NO_OF_SECONDS = 60;
var intervalId;
var countDown = NO_OF_SECONDS;
var clockRunning = false;

//============================================================================
// Name        : initializeFirebase
// Author      : Hai Nguyen
// Version     :
// Copyright   : 2017
// Description : This function creates firebase object and reference the 
//               database.
//============================================================================
function initializeFirebase()
{
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAnOIRDTIJSzScimdZLXEl-e0l2hAliM8E",
        authDomain: "uofdenvercodingbootcamp.firebaseapp.com",
        databaseURL: "https://uofdenvercodingbootcamp.firebaseio.com",
        projectId: "uofdenvercodingbootcamp",
        storageBucket: "uofdenvercodingbootcamp.appspot.com",
        messagingSenderId: "623979125561"
    };

    firebase.initializeApp(config);

    //Reference the database.
    database = firebase.database();
}

//============================================================================
// Name        : addTrain
// Author      : Hai Nguyen
// Version     :
// Copyright   : 2017
// Description : This function adds a train to the firebase database.
//============================================================================
function addTrain()
{
    event.preventDefault();

    var name = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = $("#first-train-time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    if (name === "") 
    {
        alert("Train name cannot be blank!");
    }
    else if (destination === "") 
    {
        alert("Destination cannot be blank!");
    }
    else if (firstTrainTime === "")
    {
        alert("First train time cannot be blank!");
    }
    else if (frequency === "")
    {
        alert("Frequency cannot be blank!");
    }
    else
    {
        //Save new value to Firebase
        database.ref("/train").push({name: name,
            destination: destination,
            firstTrainTime: firstTrainTime, 
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        clearFields();
        displayCurrentTrainSchedule();
    }
}

//============================================================================
// Name        : displayCurrentTrainSchedule
// Author      : Hai Nguyen
// Version     :
// Copyright   : 2017
// Description : This function retrieves the train schedule information from 
//               firebase and displays it in the html.
//============================================================================
function displayCurrentTrainSchedule()
{
    var htmlStr = "";
    var row = 0;

    $("#train-scheduling-data").empty();

    database.ref("/train").orderByChild("name").on("child_added", 
            function(snapshot) {

        console.log(snapshot);
        var key = snapshot.key;
        console.log("key: " + key);
        console.log(snapshot.val());
        var nm = snapshot.val().name;
        var dest = snapshot.val().destination;
        var firstTime = snapshot.val().firstTrainTime;
        var tFrequency = snapshot.val().frequency;
        console.log(nm);
        console.log(dest);
        console.log(firstTime);
        console.log(tFrequency);
        //Convert the first train time (pushed back 1 year to make sure it 
        //comes before current time)
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
        console.log(firstTimeConverted);
        //Get current time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
        //Get the difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        //Get the time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);
        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
        //Calculate the next train in minutes
        var nextTrainMin = moment().add(tMinutesTillTrain, "minutes");
        //Convert next train in minutes to (hh:mm A)
        var nextArr = moment(nextTrainMin).format("hh:mm A");
        console.log("ARRIVAL TIME: " + nextArr);
        htmlStr = "<tr>" +
                  " <td id='train-name-row" + (row+1) + "' data-name='" + nm + "'>" + nm + "</td>" +
                  " <td id='destination-row" + (row+1) + "' data-name='" + dest + "'>" + dest + "</td>" +
                  " <td id='frequency-row" + (row+1) + "' data-name='" + tFrequency + "'>" + tFrequency + "</td>" +
                  " <td id='next-arr-row" + (row+1) + "' data-name='" + nextArr + "'>" + nextArr + "</td>" +
                  " <td id='min-away-row" + (row+1) + "' data-name='" + tMinutesTillTrain + "'>" + tMinutesTillTrain + "</td>" +
                  " <td>" +
                  //"     <input key='" + key + "' type='submit' id='update-row' value='Update' data-state='update' button-no='" + (row+1) + "' />" + 
                  "       <input key='" + key + "' type='submit' class='btn btn-primary' id='update-row' value='Update' data-state='update' button-no='" + (row+1) + "' />" +
                  " </td>" +
                  " <td>" +
                  //"     <input key='" + key + "' type='submit' id='remove-row' value='Remove' data-state='remove' button-no='" + (row+1) + "' />" +
                  "       <input key='" + key + "' type='submit' class='btn btn-primary' id='remove-row' value='Remove' data-state='remove' button-no='" + (row+1) + "' />" +
                  " </td>" +
                  "</tr>";
        $("#train-scheduling-data").append(htmlStr);
        row++;
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
}

//============================================================================
// Name        : clearFields
// Author      : Hai Nguyen
// Version     :
// Copyright   : 2017
// Description : This function clears out the input fields of the form.
//============================================================================
function clearFields()
{
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
}

//============================================================================
// Name        : decrement
// Author      : Hai Nguyen
// Version     :
// Copyright   : 2017
// Description : This function decrements the count down variable. If the 
//               count down variable reaches 0, this function resets it
//============================================================================
function decrement()
{
    countDown--;

    //the clockRunning flag allows the displayCurrentTrainSchedule() function 
    //to run once.
    if (!clockRunning)
    {
        displayCurrentTrainSchedule();
        clockRunning = true;
    }

    //Once it hits zero...
    if (countDown === 0) 
    {
        countDown = NO_OF_SECONDS;
        clockRunning = false;
    }
}

//============================================================================
// Name        : run
// Author      : Hai Nguyen
// Version     :
// Copyright   : 2017
// Description : This function clears out the input fields of the form.
//============================================================================
function run()
{
    intervalId = setInterval(decrement, 1000);
}

//============================================================================
// Name        : updateRow
// Author      : Hai Nguyen
// Version     :
// Copyright   : 2017
// Description : This function turns the table rows data into editable input
//               text boxes.
//============================================================================
function updateRow()
{
    var buttonNo = $(this).attr("button-no");
    console.log("buttonNo: " + buttonNo);
    var trainNmId = $("#train-name-row" + buttonNo);
    var destId = $("#destination-row" + buttonNo);
    var freqId = $("#frequency-row" + buttonNo);
    var nextArrId = $("#next-arr-row" + buttonNo);
    var minAwayId = $("#min-away-row" + buttonNo);
    var stateVal = $(this).attr("data-state");
    if (stateVal === "update")
    {
        var trainNmVal = trainNmId.attr("data-name");
        var destVal = destId.attr("data-name");
        var freqVal = freqId.attr("data-name");
        var nextArrVal = nextArrId.attr("data-name");
        var minAwayVal = minAwayId.attr("data-name");

        console.log(trainNmVal);
        console.log(destVal);
        console.log(freqVal);
        console.log(nextArrVal);
        console.log(minAwayVal);

        trainNmId.html("<input type='text' id='train-name-text" + buttonNo + "' value='" + trainNmVal + "' button-no='" + buttonNo + "' />");
        destId.html("<input type='text' id='destination-text" + buttonNo + "' value='" + destVal + "' button-no='" + buttonNo + "' />");
        freqId.html("<input type='text' id='frequency-text" + buttonNo + "' value='" + freqVal + "' button-no='" + buttonNo + "' />");

        //change the button to save button
        $(this).attr("data-state", "save");
        $(this).attr("id", "save-row");
        $(this).attr("value", "Save");
    }
}

//============================================================================
// Name        : saveRow
// Author      : Hai Nguyen
// Version     :
// Copyright   : 2017
// Description : 
//============================================================================
function saveRow()
{
    var buttonNo = $(this).attr("button-no");
    console.log("In save(), buttonNo: " + buttonNo);
    var stateVal = $(this).attr("data-state");
    var key = $(this).attr("key");
    
    if (stateVal === "save")
    {
        //change button back to update
        $(this).attr("data-state", "update");
        $(this).attr("id", "update-row");
        $(this).attr("value", "Update");

        var trainNmVal = $("#train-name-text" + buttonNo).val().trim();
        var destVal = $("#destination-text" + buttonNo).val().trim();
        var freqVal = $("#frequency-text" + buttonNo).val().trim();

        console.log(trainNmVal);
        console.log(destVal);
        console.log(freqVal);

        //update the row in firebase
        var rowRef = database.ref("/train");
        rowRef.child(key).update({name: trainNmVal,
            destination: destVal,
            frequency: freqVal,
            dateAdded: firebase.database.ServerValue.TIMESTAMP});
        displayCurrentTrainSchedule();
    }
}

//============================================================================
// Name        : removeRow
// Author      : Hai Nguyen
// Version     :
// Copyright   : 2017
// Description : 
//============================================================================
function removeRow()
{
    var buttonNo = $(this).attr("button-no");
    var key = $(this).attr("key");
    var trainNmId = $("#train-name-row" + buttonNo);
    var destId = $("#destination-row" + buttonNo);
    var freqId = $("#frequency-row" + buttonNo);
    var nextArrId = $("#next-arr-row" + buttonNo);
    var minAwayId = $("#min-away-row" + buttonNo);

    var ret = confirm("Are you sure you want to remove?")
    //if user clicks ok button, we remove the row from the firebase, then
    //call displayCurrentTrainSchedule() to display the train schedule again.
    if (ret === true) 
    {
        var trainNmVal = trainNmId.attr("data-name");
        var destVal = destId.attr("data-name");
        var freqVal = freqId.attr("data-name");
        var nextArrVal = nextArrId.attr("data-name");
        var minAwayVal = minAwayId.attr("data-name");

        console.log(trainNmVal);
        console.log(destVal);
        console.log(freqVal);
        console.log(nextArrVal);
        console.log(minAwayVal);

        //remove row from firebase
        //todo: add code to remove row from firebase
        var trainRef = database.ref("/train");
        trainRef.child(key).remove(function(error) {
            console.log(error);
        });
        //redisplay train schedule
        displayCurrentTrainSchedule();
    }
}

//The stop function
function stop() 
{
    //Clears our intervalId
    //We just pass the name of the interval
    //o the clearInterval function.
    clearInterval(intervalId);
}

$(document).ready(function()
{
    initializeFirebase();
    run();
    // Whenever a user clicks the submit button
    $("#add-train").on("click", addTrain);

    //Need to use this form of click event listeners because the update button
    //is loaded dynamically.
    $(document).on("click", "#update-row", updateRow);

    //Need to use this form of click event listeners because the update button
    //is loaded dynamically.
    $(document).on("click", "#save-row", saveRow);

    //Need to use this form of click event listeners because the update button
    //is loaded dynamically.
    $(document).on("click", "#remove-row", removeRow);
});
