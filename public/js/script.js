document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-field="date"]').forEach(function(elem) {
        var originalDate = elem.innerText;
        var formattedDate = new Date(originalDate).toLocaleDateString('en-US', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
        elem.innerText = formattedDate;
    });
});
function prepareFormData(id) {
    document.querySelectorAll('[data-id="' + id + '"]').forEach((elem) => {
        const field = elem.getAttribute('data-field');
        const value = elem.innerText;
        document.getElementById(field + '-input-' + id).value = value;
    });
}