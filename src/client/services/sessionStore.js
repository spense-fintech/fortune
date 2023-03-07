function sessionSet(field, value) {
    window.sessionStorage.setItem(field, value);
}
function sessionGet(field) {
    return window.sessionStorage.getItem(field);
}
function sessionRemove(field) {
    window.sessionStorage.removeItem(field);
}

module.exports = {
    sessionGet,
    sessionSet,
    sessionRemove,
}