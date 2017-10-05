var packages = [];

// Checks if there is a package with a tracking already in memory
function hasPackage(id) {
  for (var index in packages) {
    var item = packages[index];
    if (item.id === id) return true;
  }
  return false;
}

// Finds the corresponding name of package tracking id
function getPackageName(id) {
  for (var index in packages) {
    var item = packages[index];
    if (item.id === id) return item.name;
  }
}

// Adds a package name and tracking id to memory and local storage
function addPackage(name, id) {
  if (!hasPackage(id)) {
    packages.push({ name, id });
    localStorage.setItem("geartrack_chrome_packages", JSON.stringify(packages));
    getPackageState(id);
  }
}

// Removes package by tracking id in memory, local storage and html
function deletePackage(id) {
  if (hasPackage(id)) {
    packages = packages.filter(function(item) {
      return item.id !== id;
    });
    localStorage.setItem("geartrack_chrome_packages", JSON.stringify(packages));
    $("#" + id).remove();
  }
}

// To avoid overflow of text in the state cell
function formatState(state) {
  if (state.length > 30) {
    return state.substring(0, 30) + "...";
  }
  return state;
}

// Fetches the package state using the tracking id
// Right now it's only using the Panasia tracker
function getPackageState(id) {
  if (hasPackage(id)) {
    $.getJSON("https://geartrack.hdn.pt/api/panasia?id=" + id, function(data) {
      var name = getPackageName(id);
      var state = data.states[0];
      $("#packageTable").append(
        `<tr id="${data.id}">
        <td>${name}</td>
        <td>${formatState(state.state)}</td>
        <td>${new Date(state.date).toLocaleString()}</td>
        <td><i id="remove_${data.id}" class="fa fa-trash"></i></td>
        </tr>`
      );
    });
  }
}

function fillTable() {
  packages = JSON.parse(localStorage.getItem("geartrack_chrome_packages"));
  console.log("Current Packages:", packages);
  for (var index in packages) {
    var item = packages[index];
    getPackageState(item.id);
  }
}

$(document).ready(function() {
  // Initial Setup
  fillTable();
  // Event handlers
  $("#submitForm").click(function() {
    var name = document.getElementById("package_name").value;
    var id = document.getElementById("package_id").value;
    addPackage(name, id);
  });
  $("body").on("click", "i", function() {
    var id = $(this)
      .attr("id")
      .substring(7, $(this).attr("id").length);
    deletePackage(id);
  });
  $("body").on("click", "a", function() {
    chrome.tabs.create({ url: $(this).attr("href") });
    return false;
  });
});
