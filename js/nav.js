"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//Click on sumbit btn, visibility for form show,go AddNewStory function,
$(".showFormBtn").on("click", showNewStoryForm);

/** Function displays the new story form */
function showNewStoryForm(evt) {
  evt.preventDefault();
  $(".storyForm").css("display", "block");
}

$(".favoritesList").on("click", displayFavoritesList);

/** When clicked, display favorites list */
function displayFavoritesList(evt) {
  console.debug("displayFavoritesList", evt);
  evt.preventDefault();

  hidePageComponents();
  putFavoritesOnPage();
}

$(".ownStoriesList").on("click", displayOwnStories);

/** When clicked, display user stories list */
function displayOwnStories(evt) {
  console.debug("display own stories List", evt);
  evt.preventDefault();

  hidePageComponents();
  putOwnStoriesOnPage();
}
