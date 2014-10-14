$(document).ready(function() {
  bindEvents();
  populateTodos();
});


function bindEvents () {

  $('.new_todo_button').on('click', newTodo)
  $('#todo').on('click', checkOrDelete)

}

function populateTodos () {
  var request = $.ajax({
    url: '/todos/all',
    type: 'get',
  });

  request.done( function (data) {
    var allTodos = JSON.parse(data)
    for ( i = 0; i < allTodos.length; i++ ) {
      populateDOM(allTodos[i].todo);
    }
  });
}

function buildTodo(todoName, todoId, completed) {

  // gets todoTemplate stored in DOM.
  var todoTemplate = $.trim($('#todo_template').html());
  // Creates an jQueryDOMElement from the todoTemplate.
  var $todo = $(todoTemplate);
    // Modifies it's text to use the passed in todoName.
  $todo.find('h3').text(todoName);
  $todo.find('h3').parent().attr('id', todoId);
  if (completed) {
    $todo.find('h3').addClass("complete");
  } else {
    $todo.find('h3').removeClass("complete");
  }
  // Returns the jQueryDOMElement to be used elsewhere.
  return $todo;
}

//Create functions to add, remove and complete todos

function newTodo (event) {
  event.preventDefault();
  var todoField = $('.new_todo_field')
  var todoContent = todoField.val();
  if (todoContent) {
    todoField.val('');
    var request = $.ajax({
      url: '/add_todo',
      type: 'POST',
      data: {content: todoContent}
    });
    request.done(addDOM)
  }
}

function checkOrDelete (event) {
  targetClasses = $(event.target).attr('class');
  todoId = $(event.target).closest('.todo')[0].id
  if (targetClasses.indexOf("delete") > -1) {
    var request = $.ajax({
    url: '/todos/' + todoId,
    type: 'DELETE'
    });
  request.done(removeDOM)
  } else if (targetClasses.indexOf("complete") > -1) {
    var request = $.ajax({
    url: '/todos/' + todoId + '/done',
    type: 'PUT'
    });
  request.done(updateDOM)
  }
}

function addDOM (data) {
  var todo = JSON.parse(data)
  var todoId = todo.id;
  var todoContent = todo.content;
  var todoCompleted = todo.completed;
  var todoBlock = buildTodo(todoContent, todoId, todoCompleted);
  var todoContainer = $('#todo');
  todoContainer.prepend(todoBlock);
}

function removeDOM (data) {
  var todoId = JSON.parse(data).id;
  $('#' + todoId).remove();
}

function updateDOM (data) {
  var todo = JSON.parse(data)
  var todoId = todo.id;
  var todoCompleted = todo.completed
  if (todoCompleted) {
    $('#' + todoId + ' h3').addClass("complete")
  } else {
    $('#' + todoId + ' h3').removeClass("complete")
  }
}

function populateDOM (data) {
  var todoId = data.id;
  var todoContent = data.todo_content;
  var todoCompleted = data.completed;
  var todoBlock = buildTodo(todoContent, todoId, todoCompleted);
  var todoContainer = $('#todo');
  todoContainer.prepend(todoBlock);
}


