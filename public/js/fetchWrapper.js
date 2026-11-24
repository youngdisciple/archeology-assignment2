/**
 * A wrapper class for making HTTP requests using the Fetch API.
 * Provides a method to send HTTP requests with default and custom options.
 */
export class FetchWrapper {

    /**
    * Sends an HTTP request using the Fetch API.
    *
    * @param {string} uri The URI of the resource to request.
    * @param {Object} [options={}] Optional configuration object for the request.
    * @returns {Promise<Object>} A promise that resolves with the parsed JSON response body.
    * @throws {Error} Throws an error if the request fails (network errors or non-2xx status codes).
    */
    async sendRequest(uri, options = {}) {
        const defaultOptions = {
            method: 'GET',
            cache: 'no-cache'
        }
        const requestOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            }
        };
        try {
            const response = await fetch(uri, requestOptions);

            if (!response.ok) {
                const errorInfo = await response.json();
                throw new CustomError(`Request failed with status ${response.status}`, response.status, errorInfo);
            }
            return await response.json();
        } catch (error) {
            console.error('Error during fetch operation:', error);
            throw error;
        }
    }
}

export class CustomError extends Error {
    constructor(message, code, details) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
