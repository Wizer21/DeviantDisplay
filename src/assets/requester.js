// Request 60 next deviations
export function createRequest(username, offset, callBack){
  request('GET', `https://backend.deviantart.com/rss.xml?q=gallery%3A${username}&offset=${offset}`)
  .then(function (e) {
    const parser = new DOMParser()
    callBack(parser.parseFromString(e.target.response,"text/xml").getRootNode().getElementsByTagName('item'))
  })  
}

export function checkUser(username, callBack){
  request('GET', `https://backend.deviantart.com/rss.xml?q=gallery%3A${username}`)
  .then(function (e) {
    const parser = new DOMParser()
    callBack(parser.parseFromString(e.target.response,"text/xml").getRootNode().querySelector('description'))
  })  
}

function request(method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = resolve;
    xhr.onerror = reject;
    xhr.send();
  });
}