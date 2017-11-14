const rp = require('request-promise');

const url = 'https://restcountries.eu/rest/v2/name/';

const requestOptions = {
    json: true // Automatically parses the JSON string in the response
};

const getCountryInfo = (name) => {
    const targetUrl = `${url}${name}`;
    const payload = Object.assign({}, requestOptions, {uri: targetUrl});
    return rp(payload);
};

exports.getCountryInfo = getCountryInfo;