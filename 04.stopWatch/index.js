var intervalId;
var audio1 = new Audio("./sounds/tick.wav");
var audio2 = new Audio("./sounds/alarm3.wav");
var btn = document.querySelectorAll(".btn");
var sWatch = document.querySelectorAll(".time");

function handleControls(action) {
  if (action === "start") {
    var hh = Number(sWatch[0].value);
    var mi = Number(sWatch[1].value);
    var ss = Number(sWatch[2].value);

    console.log(hh, mi, ss);
    if (hh === 0 && mi === 0 && ss === 0) {
      btn[0].disabled = btn[1].disabled = true;
      sWatch[0].disabled = sWatch[1].disabled = sWatch[2].disabled = false;
    } else {
      btn[0].disabled = true;
      btn[1].disabled = btn[2].disabled = false;
      sWatch[0].disabled = sWatch[1].disabled = sWatch[2].disabled = true;
      //
      intervalId = setInterval(() => {
        // console.log("Started, Interval ID = ", intervalId);
        // console.log(sWatch[0].value);
        if (
          sWatch[0].value == 0 &&
          sWatch[1].value == 0 &&
          sWatch[2].value == 0
        ) {
          console.log("Hello Alarm");
          clearInterval(intervalId);
          audio2.play();
          btn[0].disabled = true;
          btn[1].disabled = btn[2].disabled = true;
          sWatch[0].disabled = sWatch[1].disabled = sWatch[2].disabled = false;
          sWatch[2].focus();
        } else if (Number(sWatch[2].value)) {
          --sWatch[2].value;
          audio1.play();
        } else if (Number(sWatch[1].value)) {
          --sWatch[1].value;
          audio1.play();
          sWatch[2].value = 59;
        } else if (Number(sWatch[0].value)) {
          sWatch[1].value = 59;
          audio1.play();
        }
      }, 1000);
    }
  } else if (action === "pause") {
    // console.log("Paused, Interval ID = ", intervalId);
    clearInterval(intervalId);
    btn[0].disabled = false;
    btn[1].disabled = true;
  } else if (action === "reset") {
    // console.log(intervalId);
    clearInterval(intervalId);
    btn[0].disabled = btn[1].disabled = btn[2].disabled = true;
    sWatch[0].value = sWatch[1].value = sWatch[2].value = 0;
    sWatch[0].disabled = sWatch[1].disabled = sWatch[2].disabled = false;
  }
}

window.addEventListener("DOMContentLoaded", () => {

  btn[0].disabled = btn[1].disabled = btn[2].disabled = true;

  sWatch.forEach(ele => {
    ele.addEventListener("change", () => {
      if (ele.value > 0) btn[0].disabled = false;
    });
  });

  btn[0].addEventListener("click", evt => {
    handleControls("start");
  });

  btn[1].addEventListener("click", () => {
    handleControls("pause");
  });

  btn[2].addEventListener("click", () => {
    handleControls("reset");
  });
});
