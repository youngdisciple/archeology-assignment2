import { FetchWrapper } from './fetchWrapper.js';

const api = new FetchWrapper();

/**
 * Reads the artifact name, type, and condition from the filter form.
 *
 * @returns {{artifact_name: string, artifact_type: string, condition: string}|undefined}
 */
function readFilters() {
  // TODO: Add value under and over.
  return {
    artifact_name: document.querySelector("#artifact-name").value.trim(),
    artifact_type: document.querySelector("#artifact-type").value.trim(),
    condition: document.querySelector("#artifact-condition").value.trim()
  }
}

/**
 * Validates filter values before a request is sent.
 *
 * @param {{artifact_name: string, artifact_type: string, condition: string}} filters
 *     The values entered by the user.
 * @returns {string[]|undefined} Validation messages once implemented.
 */
function validateFilters(filters) {
  let errors = [];
  let validConditions = ['mint', 'excellent', 'good', 'fair', 'poor'];

  const condition = filters.condition;
  if(filters.condition && validConditions.includes(condition)){
    //only check if it figures inside the valid condition IF it's not null
    errors.push(
      `The artifact's condition must be one of the following: [${validConditions.toString()}]`
    );
  }

  // TODO: under over value

  return errors;
}

/**
 * Fetches artifacts matching the validated filters.
 *
 * @param {{artifact_name: string, artifact_type: string, condition: string}} filters
 *     The validated filter values.
 * @returns {Promise<object|undefined>} The response
 */
async function getArtifacts(filters) {
  const url = new URL('/archeology2/artifacts', window.location.origin);
  const errors = validateFilters(filters);

  // early return
  if (errors.length > 0) {
    showErrors(errors);
    return;
  }

  for (let [key, filter] of Object.entries(filters)) {
    if (filter) {
      url.searchParams.set(key, filter);
    }
  }

  try {
    return await api.sendRequest(url);
  } catch (error) {
    console.log(error);
    showErrors([error]);
    return;
  }
}

/**
 * Renders artifact records as rows in the results table.
 *
 * @param {object[]} artifacts The records from the API response's data property.
 * @returns {void}
 */
function renderArtifacts(artifacts) {
  if (artifacts.length <= 0) {
    showErrors(['No artifacts.']);
  }

  const resultsBody = document.querySelector('#artifact-results');

  // clear
  resultsBody.replaceChildren();

  for (let artifact of Object.values(artifacts)) {
    const row = resultsBody.insertRow();

    for (let value of Object.values(artifact)) {
      row.insertCell().textContent = value;
    }
  }
}

/**
 * Displays error messages in the Bootstrap alert, or hides it for an empty list.
 *
 * @param {string[]} messages The validation or request errors to display.
 * @returns {void}
 */
function showErrors(messages) {
  // TODO: Clear #artifact-error-list and append each message using textContent.
  // TODO: Toggle d-none on #artifact-errors based on whether messages exist.
  const alert = document.querySelector('#artifact-errors');
  const list = document.querySelector('#artifact-error-list');
  const hasError = messages.length === 0 ? false : true;

  // clear
  list.replaceChildren();

  alert.classList.toggle('d-none', !hasError);

  if(hasError) {
    for (const message of messages) {
      const item = document.createElement('li');
      item.textContent = message;
      list.appendChild(item);
    }
  }
}

/**
 * Prevents form navigation while the search workflow is being implemented.
 *
 * @param {SubmitEvent} event The filter form submission event.
 * @returns {void}
 */
async function handleFilterSubmit(event) {
  // TODO: Read filters, validate them, and stop if there are validation errors.
  // TODO: Await getArtifacts and pass the response's data to renderArtifacts.
  event.preventDefault();

  const filters = readFilters();
  const messages = validateFilters(filters);
  const response = await getArtifacts(filters);

  if (response) {
    renderArtifacts(response.data);
  }
}

document.querySelector('#artifact-filters').addEventListener('submit', handleFilterSubmit);
