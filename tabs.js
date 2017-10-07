// Removes the "is-active" class from elements
// Warning: Can conflict with other css/js frameworks
function hideAllTabs() {
  var tab_elements = document.getElementsByClassName("is-active");
  for (var i = 0; i < tab_elements.length; i++) {
    var element = tab_elements[i];
    $("#" + element.id).removeClass("is-active");
  }
}

// All this work because Bulma.io enforces an anchor on tab titles
function switchTab(parent, tab) {
  hideAllTabs();

  var tab_elements = document.getElementsByClassName("tab");
  for (var i = 0; i < tab_elements.length; i++) {
    var element = tab_elements[i];
    element.id === tab
      ? (element.style.display = "block")
      : (element.style.display = "none");
  }

  $("#" + parent.id).addClass("is-active");
}

// Maybe it's a noob way, but it's my way
$(document).ready(function() {
  $("body").on("click", "a", function() {
    var tab = $(this).attr("is-tab");
    if (tab) {
      switchTab($(this)[0].parentElement, tab);
    }
  });
});
