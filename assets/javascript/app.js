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
    $("#txtFrequency").val("");
  })

  function fnNextArrival(startTime, Frequency){
    var timeNow = moment().format("HH:mm");
    var nextArrival = moment(startTime, "X").format("HH:mm");
    diffInDuration = moment.utc(moment(timeNow, "HH:mm").diff(moment(nextArrival,"HH:mm"))).format("HH:mm");
    diffInDuration = moment.duration(diffInDuration).asMinutes();
    //console.log("Wee" + moment.utc(moment(timeNow, "HH:mm").diff(moment(nextArrival,"HH:mm"))).format("HH:mm"));
    while(moment(timeNow, "HH:mm").isAfter(moment(nextArrival, "HH:mm"))){
      nextArrival = moment(nextArrival, "HH:mm").add(Frequency, "minutes");
    }
    return moment(nextArrival, "HH:mm").format("HH:mm");
  }

  var intervalTimer, clockRunning;
  function timerInterval(time){
    var timer = {
      time : time,
      stop: function(){
        clearInterval(intervalTimer);
        clockRUnning: false;
      },
      start: function(){
        setInterval(intervalTimer, 2*1000);
        clockRunning: true;
      },
      count: function(){
if(timerInterval.time > 0){
          timerInterval.time--;
          RefreshOnChildAdded();
        }else{
          timerInterval.stop();
           RefreshOnChildAdded();
        }
      }
    }    
  }
  RefreshOnChildAdded()
  setInterval(function() {
    RefreshOnChildAdded()
  }, 15*1000);


var i = 0;

function RefreshOnChildAdded(){
  $("#tblTrainInfo").empty();

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

  database.ref().on("child_added", function(childSnapshot){

      console.log(childSnapshot.val());

      // Store everything into a variable.
      var trainName = childSnapshot.val().name;
      var trainDestination = childSnapshot.val().destination;
      var trainStart = moment.unix(childSnapshot.val().start).format("HH:mm");
      var trainFrequency = childSnapshot.val().frequency;
      var trainNextArrival = moment(fnNextArrival(childSnapshot.val().start, trainFrequency),"HH:mm").format("HH:mm");
      console.log(moment(trainNextArrival, "HH:mm"));
      var currentTime = moment().format("HH:mm")
      console.log(currentTime)
     

      var test = moment(trainNextArrival, "HH:mm").toNow(true);
      var trainMinutesArrival = moment(trainNextArrival,"HH:mm").diff(moment(currentTime, "HH:mm"), "minutes");
      console.log("freq : " + trainFrequency + ", current : " + parseInt(trainMinutesArrival));
       percentageToArrive = (trainMinutesArrival/trainFrequency) * 100;
      console.log("test: " + test);
      console.log(trainMinutesArrival);

      var trTrainInfo = $("<tr>");
      var tdName = $("<td>");
      var tdDestination = $("<td>");
      var tdFrequency = $("<td>");
      var tdNextArrival = $("<td>");
      var tdMinutesArrival = $("<td>");
      var divMinutesArrival = $("<div>");
      divMinutesArrival.addClass("progress-bar-success progress-bar");
      divMinutesArrival.attr("role", "progressbar").attr("aria-valuenow", parseInt(trainMinutesArrival)).attr("aria-valuemin", 0).attr("aria-valuemax", trainFrequency);
      divMinutesArrival.text(trainMinutesArrival);

      tdMinutesArrival.addClass("addMinutes");

      tdName.text(trainName);
      tdDestination.text(trainDestination);
      tdFrequency.text(trainFrequency);
      tdNextArrival.text(trainNextArrival);
      tdMinutesArrival.text(trainMinutesArrival);
      trTrainInfo.append(tdName).append(tdDestination).append(tdFrequency).append(tdNextArrival).append(tdMinutesArrival);
      $("#tblTrainInfo").append(trTrainInfo);
    });
  }
