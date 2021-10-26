document.addEventListener("DOMContentLoaded", function () {
  const errorMessagesElem = document.querySelector(".red");
  if (errorMessagesElem.innerHTML !== "") {
    setTimeout(function () {
      errorMessagesElem.innerHTML = "";
    }, 2000);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const infoMessagesElem = document.querySelector(".green");
  if (infoMessagesElem.innerHTML !== "") {
    setTimeout(function () {
      infoMessagesElem.innerHTML = "";
    }, 2000);
  }
});
