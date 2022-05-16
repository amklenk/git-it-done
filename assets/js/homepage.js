var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url
  fetch(apiUrl)
  .then(function(response) {
      if (response.ok){
        response.json().then(function(data) {
        displayRepos(data, user);
      });
      } else {
          alert("Error: GitHub User Not Found");
      }
  })
.catch(function(error){
    alert("Unable to connect to GitHub");
    console.log(error);
});
};
  getUserRepos();

var formSubmitHandler = function(event) {
    event.preventDefault();
    //get value from input element

    //username is the value inputted to the inputEl
    var username = nameInputEl.value.trim();

    //if there is a value there, go to getUseRepos and get the info from that repo and clear the submit
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Plase enter a GitHub username");
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);

var displayRepos = function(repos, searchTerm) {
    //if no repos, display text
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name by getting info from that repo at i position
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class = 'fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + "issue(s)";
        } else {
            statusEl.innerHTML = "<i class = 'fas fa-check-square status-icon icon-success'></i>";
        }
        //append to container
        repoEl.appendChild(statusEl);

        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    };
  };