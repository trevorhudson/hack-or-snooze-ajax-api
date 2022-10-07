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
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */


{/* <i class="bi bi-star"></i>
<i class="bi bi-moon-stars-fill"></i>; */}

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  // TODO: ADD A FAVORITES ICON;//
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span><i= class="bi bi-star"></i></span>
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

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gathers data from form input. Creates new story, and appends the new story
 * onto the page.
 */

async function submitNewStory(e) {
  e.preventDefault();
  const title = $(".titleInput").val();
  const author = $(".authorInput").val();
  const url = $(".linkInput").val();

  let newStory = await storyList.addStory(currentUser, {
    title: title,
    author: author,
    url: url,
  });

  $allStoriesList.prepend(generateStoryMarkup(newStory));
  $(".storyForm input").val("");
  $(".storyForm").css("display", "none");
}


/****************************************************************************
 * Area for Handling user favorite stories
 */


/** favorites button handler function:
 * On click, toggle class of icon. (from black to white)
 * add or remove item from favorites */



/** TODO:Takes in a story. Function adds the story to the favorites list if it is
   * not present, or removes it if it already exists.
   *
   *
    */
function toggleFavorite(storyId) {
  // const {story} = event.target

  const { favorites } = currentUser;
  // get story by ID



// toggle icon on or off:

// if target has class of ON
  // then remove from favorites
// if target has class of OFF
  // add to favorite


  // const eventStoryID = Story.getStoryID(story);
  const index = findIndexFavoriteStory(storyId, favorites);

  //if story already in favorites
  if (index === -1) {
    currentUser.addFavorite(story);
    // toggle favorites icon ON
    return 'Story added to favorites';

    // if story not in favorites
  } else {
    currentUser.removeFavorite(story, index);
    // toggle favorites icon OFF
    return 'Story removed to favorites';
  }

}

/** TODO:checks the current favorite stories. takes in a story ID. returns
   * the index of the story if found, or -1 if not found.
   */
function findIndexOfStory(eventStoryID, favorites) {
  return favorites.findIndex(({ storyId }) => storyId === eventStoryID);
}

/** Takes in a storyID, and a stories object. Returns the story that matches
 * the target storyID.
 */
function findStoryById(eventStoryID, {stories}){
  return stories.find(({ storyId }) => storyId === eventStoryID)
}

// TODO: click handler for favorites button submit
// calls isFavorite function

function handleFavoritesClick(e) {
  e.preventDefault();
  const storyID = $(e.target).closest('li')[0].id
  toggleFavorite(storyID);
  // call toggleFavorite(story)

  // const { story } = e.target;
  // this.toggleFavorite(story);
}

$('ol').on('click', 'span', handleFavoritesClick);

$(".storyForm").submit(submitNewStory);
