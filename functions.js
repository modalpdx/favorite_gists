/**
 * CS290, Winter 2015 - Assignment 3.2, Erik Ratcliffe
 */

/**
 * Things to do when the page is through loading.
 */
window.onload = function() {

  // Build a new favorites table
  if(hasLStorage()) {
    buildFavTable();
  }

};


/**
 * Constructor for gist items.
 * @param {string} id ID of the gist
 * @param {string} desc Description of the gist
 * @param {string} url HTML URL of the gist
 * @param {string} lang Language (Text, Python, etc.) of the gist
 */
function gistItem(id, desc, url, lang) {

  this.id = id;
  this.desc = desc;
  this.url = url;
  this.lang = lang;

}


/**
 * Constructor for favorited items.
 * @param {string} id ID of the gist
 * @param {string} desc Description of the gist
 * @param {string} url HTML URL of the gist
 * @param {string} lang Language (Text, Python, etc.) of the gist
 */
function favItem(id, desc, url, lang) {

  this.id = id;
  this.desc = desc;
  this.url = url;
  this.lang = lang;

}


/**
 * Main function to build webpage using XHR/Ajax.
 */
function buildPage() {

  // Keep default form action from occurring
  event.preventDefault();

  // Build a new gist search results table
  buildGistTable();

  // Make one XHR request for each "page" the user requests
  var gist_form = document.getElementById('gist_form');
  var pages = gist_form.pages.value;
  for(var page = 1; page <= pages; page++) {
    xhrRequest(page);
  }

}


/**
 * Build & return an array of gist objects (just desc, url, language)
 * @param {object} gists Collection of gists returned from Github
 * @return {array} gistList Collection of gists reformatted to work with
 *     the site.
 */
function buildList(gists) {

  var gistList = []; // Collector of gists

  gists.forEach(function(gist) {

    // Get the gist's ID
    var id = gist.id;

    // Get the gist's description
    var desc = gist.description;
    if(!desc) {
      desc = "[No Description]";
    }

    // Get the gist's HTML URL
    var url = gist.html_url;

    // Dig for the gist's language
    var lang;
    for(var prop in gist.files) {
      var filesObj = gist.files[prop];
      lang = filesObj.language;
    }

    // Build a gist object and add it to the list
    var gItem = new gistItem(id, desc, url, lang);
    gistList.push(gItem);

  });

  return gistList;

}


/**
 * Build & return a list of languages for filtering
 * @return {array} langs Collection of languages to show in search
 */
function buildLangs() {

  var langs = []; // Collector of gist languages to show

  // Read the list of languages from the form checkboxes
  var gist_form = document.getElementById('gist_form');
  for(var i = 0; i < gist_form.lang.length; i++) {
    if(gist_form.lang[i].checked) {
      langs.push(gist_form.lang[i].value);
    }
  }

  return langs;

}


/**
 * Build an XHR/Ajax URL
 * @param {number} page Page number to add to the URL
 * @return {string} url String containing the API URL
 */
function getUrl(page) {

  // FOR LOCAL TESTING - EXPECTS EACH PAGE TO BE IN "gists#" file
  //var url = "http://localhost/gists";
  //url += page;

  // FOR PRODUCTION
  var url = "https://api.github.com/gists";
  url += ("?pages=" + page);

  return url;

}


/**
 * Common function to make XHR/Ajax requests
 * @param {number} page Page number to add to the URL
 */
function xhrRequest(page) {

  // Create the XHR object
  var requestObj = new XMLHttpRequest();
  if(!requestObj) {
    throw "Something went wrong. Ajax request failed.";
  }
  
  // Set up actions that occur when XHR is complete (ready state 4)
  requestObj.onreadystatechange = function() {
    if(this.readyState === 4) {
      var gists = JSON.parse(this.responseText);
      var gistList = buildList(gists);
      buildTableRows(gistList);
    }
  };
  
  // Make the XHR request
  var xhrUrl = getUrl(page);
  requestObj.open("GET", xhrUrl);
  requestObj.send();

}


/**
 * Start a new table to hold gist search results
 */
function buildGistTable() {

  var searchDiv = document.getElementById('search');

  // If there is a table on the page, get rid of it
  searchDiv = document.getElementById('search');
  var gTableOld = document.getElementById('gist_table');
  if(gTableOld !== null) {
    searchDiv.removeChild(gTableOld);
  }

  var gTable = document.createElement('table');
  gTable.border = "1";
  gTable.id = "gist_table";

  var gTableBody = document.createElement('tbody');
  gTableBody.id = "gist_table_body";
  gTable.appendChild(gTableBody);

  searchDiv.appendChild(gTable);

}


/**
 * Start a new table to hold Favorites
 */
function buildFavTable() {

  var favDiv = document.getElementById('favorites');

  // If there is a favorites table on the page, get rid of it
  var fTableOld = document.getElementById('fav_table');
  if(fTableOld !== null) {
    favDiv.removeChild(fTableOld);
  }

  if(localStorage.length >= 1) {
    // If there is an old favorites-empty message, get rid of it
    var fEmptyMsgOld = document.getElementById('fav_empty_msg');
    if(fEmptyMsgOld !== null) {
      favDiv.removeChild(fEmptyMsgOld);
    }

    var fTable = document.createElement('table');
    fTable.border = "1";
    fTable.id = "fav_table";

    var fTableBody = document.createElement('tbody');
    fTableBody.id = "fav_table_body";
    fTable.appendChild(fTableBody);

    favDiv.appendChild(fTable);
    buildFavTableRows();
  }
  else {
    var favEmptyMsg = document.createElement('p');
    favEmptyMsg.id = "fav_empty_msg";
    var favEmptyMsgTxt = document.createTextNode("No favorites to show.");
    favEmptyMsg.appendChild(favEmptyMsgTxt);
    favDiv.appendChild(favEmptyMsg);
  }

}


/**
 * Build search table rows
 * @param {array} gistList Collection of gists reformatted to work with
 */
function buildTableRows(gistList) {

  // There should already be a table body. Find it.
  var gTableBodyEl = document.getElementById('gist_table_body');

  // Grab the list of gist languages to display
  var langs = buildLangs();

  gistList.forEach(function(gist) {

    // If the language in the gist is one of the languages 
    // selected in the form, display it. Otherwise, skip it.
    if(((langs.indexOf(gist.lang) >= 0) || (langs.length === 0)) && 
        (localStorage.getItem(gist.id) === null)) {
      // New table row to hold the gist. Give it an ID so
      // we can remove it when the gist is added as a favorite.
      var gTableRow = document.createElement('tr');
      gTableRow.id = gist.id;

      // Add description link and language to a new table row
      var tableCell = buildDescCell(gist);
      gTableRow.appendChild(tableCell);
      tableCell = buildLangCell(gist);
      gTableRow.appendChild(tableCell);

      // Add a Favorite button only if local storage is available
      if(hasLStorage()) {
        var favButtonClickAction = 'saveToFavorites("' + gist.id + '", "' + 
            gist.desc + '", "' + gist.url + '", "' + gist.lang + '")';
        tableCell = buildBtnCell("Favorite", favButtonClickAction);
        gTableRow.appendChild(tableCell);
      }

      // Add the table row to tbody
      gTableBodyEl.appendChild(gTableRow);

    }

  });

}


/**
 * Build favorites table rows only. Establish local storage is
 * available before executing this.
 */
function buildFavTableRows() {

  // There should already be a favorites table body. Find it.
  var fTableBodyEl = document.getElementById('fav_table_body');

  for(var i = 0; i < localStorage.length; i++) {

    // Grab data from local storage
    var lStorData = getLStorData(i);

    // Add description link and language to a new table row
    var fTableRow = document.createElement('tr');
    var tableCell = buildDescCell(lStorData);
    fTableRow.appendChild(tableCell);
    tableCell = buildLangCell(lStorData);
    fTableRow.appendChild(tableCell);

    // Add a Remove button to remove the gist from Favorites
    var remButtonClickAction = 'removeFromFavorites("' + lStorData.id + '")';
    tableCell = buildBtnCell("Remove", remButtonClickAction);
    fTableRow.appendChild(tableCell);

    // Add the table row to tbody
    fTableBodyEl.appendChild(fTableRow);

  }

}


/**
 * Build a Description link table cell
 * @param {object} data Object containing data to populate the cell
 * @return {object} tableCell Object containing a table cell to add 
 *     to a row.
 */
function buildDescCell(data) {

  var tableCellTxt = document.createTextNode(data.desc);
  var anchor = document.createElement('a');
  anchor.href = data.url;
  anchor.appendChild(tableCellTxt);
  var tableCell = document.createElement('td');
  tableCell.appendChild(anchor);

  return tableCell;

}


/**
 * Build a Language table cell
 * @param {object} data Object containing data to populate the cell
 * @return {object} tableCell Object containing a table cell to add 
 *     to a row.
 */
function buildLangCell(data) {

  var tableCellTxt = document.createTextNode(data.lang);
  var tableCell = document.createElement('td');
  tableCell.appendChild(tableCellTxt);

  return tableCell;

}


/**
 * Build a button table cell
 * @param {string} btnTxt String to display inside the button
 * @param {string} clickAction String to add as an onclick action
 * @return {object} tableCell Object containing a table cell to add 
 *     to a row.
 */
function buildBtnCell(btnTxt, clickAction) {

    var button = document.createElement('button');
    var buttonTxt = document.createTextNode(btnTxt);
    button.setAttribute('onclick', clickAction);
    button.appendChild(buttonTxt);
    var tableCell = document.createElement('td');
    tableCell.appendChild(button);

    return tableCell;

}

/**
 * Check to see if local storage is an option
 * @return {boolean} True or false
 */
function hasLStorage() {

  try {
    localStorage.setItem("testing123", "123");
    localStorage.removeItem("testing123");
    return true;
  }
  catch(e) {
    return false;
  }

}


/**
 * Get an item from local storage
 * @return {object} lStorData Object containing the item from 
 *     local storage
 */
function getLStorData(index) {

  var lStorKey = localStorage.key(index);
  var lStorData = JSON.parse(localStorage.getItem(lStorKey));

  return lStorData;

}


/**
 * Save a gist to the user's Favorites in local storage
 * @param {string} id ID of the gist
 * @param {string} desc Description of the gist
 * @param {string} url HTML URL of the gist
 * @param {string} lang Language (Text, Python, etc.) of the gist
 */
function saveToFavorites(id, desc, url, lang) {

  var fav = new favItem(id, desc, url, lang);
  localStorage.setItem(id, JSON.stringify(fav));
  buildFavTable();

  // Delete the gist from the search table
  var gTableBody = document.getElementById('gist_table_body');
  var gTableRow = document.getElementById(id);
  gTableBody.removeChild(gTableRow);

}


/**
 * Remove an item from the Favorites table
 * @param {string} id ID of the gist
 */
function removeFromFavorites(id) {

  localStorage.removeItem(id);
  buildFavTable();

}

