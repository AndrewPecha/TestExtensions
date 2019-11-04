function createWindow(options) {
    if(options.modalId === undefined)
        return;

    var settings = $.extend({
        modalContent: ""
    }, options);

    $('#' + settings.modalId).addClass('modal').html(
            "<div id=\'" + settings.modalId + "Header\' class=\'modalHeader\' onmousedown=\'moveElement(event, this)\'>" +
                "<div class='modalCloseButton' onmousedown='event.stopPropagation()' onclick='toggleElement(event, findClassFromChild(this, \"modal\"))'>X</div>" +
            "</div>" +
            "<div id='" + settings.modalId + "Content'>" +
                settings.modalContent +
            "</div>"
    );
}

function loadRemoteModalContent(url, modalId){
    $.ajax({
        url: url,
        success: function(data){
            $('#'+ modalId + "Content").html(data);
        }
    })
}

function toggleElement(e, element){                
    e.stopPropagation();
    if(element === undefined)
        return;

    $(element).toggle();
}

function moveElement(e, element){
    e.stopPropagation();
    if(element.classList.contains("modalHeader"))
        element = element.parentElement;
    $(element).data('offSetX', e.offsetX);
    $(element).data('offSetY', e.offsetY);
    
    document.onmousemove = function(f){
        setElementToEventCoords(f, element);
    }      

    document.onmouseup = function(e){
        document.onmousemove = null;
    }                
}       

function setElementToEventCoords(e, element){
        var offSetX = $(element).data('offSetX');
        var offSetY = $(element).data('offSetY');
        $(element).css({top: e.pageY - offSetY, left: e.pageX - offSetX});
}

function findClassFromChild(element, classToFind){
    if(element.classList.contains(classToFind))
        return element;

    if(element.parentElement === undefined)
        return undefined;

    return findClassFromChild(element.parentElement, classToFind);
}