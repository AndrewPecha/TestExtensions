function createWindow(options) {
    if(options.modalId === undefined)
        return;

    var settings = $.extend({
        modalContent: ""
    }, options);

    var modalContentId = getModalContentId(settings.modalId);

    $('#' + settings.modalId).addClass('modal').html(
            "<div id=\'" + getModalHeaderId(settings.modalId) + "'\' class=\'modalHeader\' onmousedown=\'moveElement(event, this)\'>" +
                "<div class='modalCloseButton' onmousedown='event.stopPropagation()' onclick='toggleElement(event, findClassFromChild(this, \"modal\"))'>X</div>" +
            "</div>" +
            "<div id='" + modalContentId + "'>" +
                settings.modalContent +
            "</div>"
    );
    
    setModalContentSize(settings.modalId);
}

function setModalContentSize(modalId){
    var modalContentId = getModalContentId(modalId);
    var modalHeaderId = getModalHeaderId(modalId);

    var modalElement = document.getElementById(modalId);
    var contentElement = document.getElementById(modalContentId);
    var headerElement = document.getElementById(modalHeaderId);

    //get parent height, get header height, get border width of modal, then (parentHeight - headerHeight - borderWidth == contentHeight)
    var modalHeight = Number(getComputedStyle(modalElement).height.substring(0, getComputedStyle(modalElement).height.length - 2));
    var headerheight = Number(getComputedStyle(headerElement).height.substring(0, getComputedStyle(headerElement).height.length - 2));
    //todo need to change this when users can set the border
    var borderWidth = 1;
    var contentHeight = modalHeight - headerheight - borderWidth;

    contentElement.style.height = contentHeight;
}

function getModalHeaderId(modalId){
    return modalId + "Header";
}

function getModalContentId(modalId){
    return modalId + "Content";
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