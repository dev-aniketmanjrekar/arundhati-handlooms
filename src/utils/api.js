// src/utils/api.js
import axios from 'axios';
import API_URL from '../config';

/**
 * Fetch page content from the server and ensure the returned content is an object.
 * The server may store the content as a JSON string, so we parse it if needed.
 */
export const fetchPageContent = async (pageId) => {
    const res = await axios.get(`${API_URL}/pages/${pageId}`);
    let content = res.data.content;
    if (typeof content === 'string') {
        try {
            content = JSON.parse(content);
        } catch (e) {
            console.error('Error parsing page content JSON:', e);
            content = {};
        }
    }
    return content;
};
