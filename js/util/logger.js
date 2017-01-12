function log() {
  var args = Array.prototype.slice.call(arguments);
  var msg = args.join(" ");

  var li = document.createElement("li");
  li.textContent = msg;

  var ul = document.getElementById("console");
  ul.appendChild(li);

  $("#console").scrollTop(999999);
}
