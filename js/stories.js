"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const starType = findIndexFavStory(story) !== -1 ? "bi-star-fill" : "bi-star";

  return $(`
      <li id="${story.storyId}">
        <span class = "favorite"><i class="bi ${starType}"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  $favoriteStoriesList.hide();
  $ownStoriesList.hide();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    //if stories is in favorites list
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets list of favorited stories from current user.
 * generates HTML, and puts on page. */

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $favoriteStoriesList.empty();

  $allStoriesList.hide();
  $ownStoriesList.hide();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }

  $favoriteStoriesList.show();
}
/** Gets list of own stories for current user.
 * generates HTML, and puts on page. */

function putOwnStoriesOnPage() {
  console.debug("putOwnStoriesOnPage");

  $ownStoriesList.empty();

  $allStoriesList.hide();
  $favoriteStoriesList.hide();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $(`<span class = "trash">
        <i class = "bi bi-trash"> </i> </span>`).prependTo($story);

    $ownStoriesList.append($story);
  }
  $ownStoriesList.show();
}

/** Gathers data from form input. Creates new story, and appends the new story
 * onto the page.
 */

async function submitNewStory(e) {
  console.debug("submitNewStory");

  e.preventDefault();
  const title = $(".titleInput").val();
  const author = $(".authorInput").val();
  const url = $(".linkInput").val();

  //add Story => delivering data
  let $newStory = await storyList.addStory(currentUser, {
    title: title,
    author: author,
    url: url,
  });

  //append to the DOM. Interacting with the DOM
  $allStoriesList.prepend(generateStoryMarkup($newStory));
  //interacting with the storyList. Talking to JS. Held in JS memory *Local storage
  storyList.stories.unshift($newStory);
  //console.log(newStory, "newStory");
  //its own kinda database. Internal JS memory. *Local storage
  currentUser.ownStories.push($newStory);
  $(".storyForm input").val("");
  $(".storyForm").css("display", "none");
}

$(".storyForm").submit(submitNewStory);

/****************************************************************************
 * Area for Handling user favorite stories
 */

/** Function takes in a story, and it's favorite icon DOM element.
 * Toggles the story to add to the favorites list, or remove it.
 */
function toggleFavorite(story, targetIcon) {
  const index = findIndexFavStory(story);

  //if story not already in favorites
  if (index === -1) {
    currentUser.addFavorite(story);
    console.log("story added to favorites");

    // if story already in favorites
  } else {
    currentUser.removeFavorite(story, index);
    console.log("story removed from favorites");
  }

  // toggles icon color
  changeIcon(targetIcon);
}

/** Toggle between icons depending if story is on favorities */
function changeIcon(eventTarget) {
  let icons = ["bi-star", "bi-star-fill"];
  eventTarget.toggleClass(icons);
}

/** Function searches favorites stories for the target story
 * Takes in a story, returns the index of the story if found, or -1.
 */
function findIndexFavStory(story) {
  console.log("findIndexFavStory passes in", story);

  return currentUser.favorites.findIndex(
    ({ storyId }) => storyId === story.storyId
  );
}

/** Takes in a storyID, and a stories object. Returns the story that matches
 * the target storyID.
 */
function findStoryById(storyID, { stories }) {
  // console.log("findStoryById passes in", storyID);

  const story = stories.find(({ storyId }) => storyId === storyID);
  console.log(story);
  return story;
}

/** function handles clicks to each stories favorites icon.  */
function handleFavoritesClick(e) {
  e.preventDefault();
  const $targetIcon = $(e.target);
  const $storyLi = $targetIcon.closest("li");
  const storyId = $storyLi.attr("id");
  console.log(storyId, "storyIf");
  console.log($storyLi, "$storyList");
  const $story = findStoryById(storyId, storyList);

  toggleFavorite($story, $targetIcon);
}

$("ol").on("click", ".favorite", handleFavoritesClick);

/***********************************************************************
 * Area handles Own Stories
 */

function handleTrashClick(e) {
  e.preventDefault();

  const $targetIcon = $(e.target);
  const $storyLi = $targetIcon.closest("li");
  const storyId = $storyLi.attr("id");
  const $story = findStoryById(storyId, storyList);
  console.log($(story), story);
  currentUser.removeOwnStory($story, $targetIcon);
  $storyLi.remove();
}

$("ol").on("click", ".trash", handleTrashClick);
