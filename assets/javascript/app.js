// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBsMGWjVc4XJ779adybXHoDALvTYO7X4_8",
    authDomain: "train-schedule-40372.firebaseapp.com",
    databaseURL: "https://train-schedule-40372.firebaseio.com",
    projectId: "train-schedule-40372",
    storageBucket: "",
    messagingSenderId: "104956141208"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  $("#cmdSubmit").on("click", function(){
    event.preventDefault();

    // Grabs user input
    var trainName = $("#txtTrainName").val().trim();
    var trainDestination = $("#txtDestination").val().trim();
    var trainStart = moment($("#txtFirstTrain").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#txtFrequency").val().trim();

    // Creates local "temporary" object for holding employee data
    var train = {
      name: trainName,
      destination: trainDestination,
      start: trainStart,
      frequency: trainFrequency
    };

    // Uploads employee data to the database
    database.ref().push(train);

    // Logs everything to console
    console.log(train.name);
    console.log(train.destination);
    console.log(train.start);
    console.log(train.frequency);

    // Alert
    alert("New train schedule added!");

    // Clears all of the text-boxes
    $("#txtTrainName").val("");
    $("#txtDestination").val("");
    $("#txtFirstTrain").val("");
    $("#txtFirstTrain").val("");
  })

  var trainInfo = {
    name : ["Trenton Express", "Oregon Trail", "Midnight Carriage", "Sing Sing Caravan", "Boston Bus", "California Caravan", "Analben's Train"],
    destination: ["Trenton", "Salem, Oregon", "Philadelphia", "Atlanta", "Boston", "San Fransisco", "Florida"],
    frequency: [25, 3600, 15, 45, 65, 6000, 25],
    nextArrival: ["9:00", "9:15", "10:00", "9:00", "8:30", "8:00", "6:00"],
    minutesArrival: [0, 0, 0, 0, 0, 0, 0]
  }

  function fnNextArrival(startTime, Frequency){
    console.log("start time: " + startTime);
    var timeNow = moment().format("HH:mm");
    console.log("time now: " + timeNow);
    var nextArrival = moment(startTime, "X").format("HH:mm");
    console.log("next arrival: " + nextArrival);
    diffInDuration = moment.utc(moment(timeNow, "HH:mm").diff(moment(nextArrival,"HH:mm"))).format("HH:mm");
    diffInDuration = moment.duration(diffInDuration).asMinutes();
    console.log("in minutes: " + diffInDuration);
    //console.log("Wee" + moment.utc(moment(timeNow, "HH:mm").diff(moment(nextArrival,"HH:mm"))).format("HH:mm"));
    while(moment(timeNow, "HH:mm").isAfter(moment(nextArrival, "HH:mm"))){
      console.log("New while loop Time Now: " + moment(timeNow, "HH:mm").format("HH:mm"));
      console.log("New while loop Next Arrival: " + moment(nextArrival, "HH:mm").format("HH:mm"));
      nextArrival = moment(nextArrival, "HH:mm").add(Frequency, "minutes");
      console.log("next arrival in new while loop: " + moment(nextArrival, "HH:mm").format("HH:mm"));
    }
    return moment(nextArrival, "HH:mm").format("HH:mm");

   /* while(diffInDuration > Frequency){
      console.log("diff in duration : " + diffInDuration);
      console.log("Frequency: " + Frequency);
      nextArrival = moment(startTime, "HH:mm").add(Frequency, "minutes").format("HH:mm");
      console.log("within while loops: " + moment(nextArrival, "x").format("HH:mm"));

      diffInDuration = diffInDuration - Frequency;
    }
    console.log(nextArrival);
      return nextArrival;*/
  }

  database.ref().on("child_added", function(childSnapshot){
      console.log(childSnapshot.val());

      // Store everything into a variable.
      var trainName = childSnapshot.val().name;
      var trainDestination = childSnapshot.val().destination;
      var trainStart = moment.unix(childSnapshot.val().start).format("HH:mm");
      console.log("train start: " + trainStart);
      var trainFrequency = childSnapshot.val().frequency;
      var trainNextArrival = moment(fnNextArrival(childSnapshot.val().start, trainFrequency),"HH:mm").format("HH:mm");
      var trainMinutesArrival = moment("HH:mm").diff(moment(trainNextArrival, "HH:mm"));
      console.log("minutes arrival: " + trainMinutesArrival);

      var thName = $("<th>");
      var thDestination = $("<th>");
      var thFrequency = $("<th>");
      var thNextArrival = $("<th>");
      var thMinutesArrival = $("<th>");
      thName.text("Train Name");
      thDestination.text("Destination");
      thFrequency.text("Frequency (min)");
      thNextArrival.text("Next Arrival");
      thMinutesArrival.text("Minutes Away");
      $("#tblTrainInfo").prepend(thMinutesArrival).prepend(thNextArrival).prepend(thFrequency).prepend(thDestination).prepend(thName);

      var trTrainInfo = $("<tr>");
      var tdName = $("<td>");
      var tdDestination = $("<td>");
      var tdFrequency = $("<td>");
      var tdNextArrival = $("<td>");
      var tdMinutesArrival = $("<td>");

      tdName.text(trainName);
      tdDestination.text(trainDestination);
      tdFrequency.text(trainFrequency);
      tdNextArrival.text(trainNextArrival);
      tdMinutesArrival.text(trainMinutesArrival);
      trTrainInfo.append(tdName).append(tdDestination).append(tdFrequency).append(tdNextArrival).append(tdMinutesArrival);
      $("#tblTrainInfo").append(trTrainInfo);

      // Employee Info
/*      console.log(trainName);
      console.log(trainDestination);
      console.log(trainStart);
      console.log(trainFrequency);*/
     });