var lastUpdate = new Date()

$(document).ready(function() {
  bindEvents();
  populateTodos();
  initUpdatePolling();
});


function bindEvents () {

  $('.new-todo-button').on('click', newTodo)
  $('#todo-list').on('click', checkOrDelete)

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

function initUpdatePolling () {
  window.setInterval(checkForUpdates, 10000)
}

function checkForUpdates() {
  var request = $.ajax({
    url: '/update',
    type: 'get',
  });

  request.done( function(data) {
    var dbUpdate = new Date(JSON.parse(data).last_db_change)
    if (dbUpdate > lastUpdate) {
      lastUpdate = dbUpdate
      $('#todo-list .todo').remove();
      populateTodos();
    }
  });
}

function buildTodo(todoName, todoId, completed) {
  // gets todoTemplate stored in DOM.
  var todoTemplate = $.trim($('#todo_template').html());
  // Creates an jQueryDOMElement from the todoTemplate.
  var $todo = $(todoTemplate);
    // Modifies it's text to use the passed in todoName.
  $todo.find('.todo-content').text(todoName);
  $todo.find('.todo-content').parent().attr('id', todoId);
  if (completed) {
    $todo.find('.todo-content').addClass("completed");
  } else {
    $todo.find('.todo-content').removeClass("completed");
  }
  // Returns the jQueryDOMElement to be used elsewhere.
  return $todo;
}

//Create functions to add, remove and complete todos

function newTodo (event) {
  event.preventDefault();
  var todoField = $('.new-todo-field')
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
  var todoContainer = $('#todo-list');
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
    $('#' + todoId + ' .todo-content').addClass("completed")
  } else {
    $('#' + todoId + ' .todo-content').removeClass("completed")
  }
}

function populateDOM (data) {
  var todoId = data.id;
  var todoContent = data.todo_content;
  var todoCompleted = data.completed;
  var todoBlock = buildTodo(todoContent, todoId, todoCompleted);
  var todoContainer = $('#todo-list');
  todoContainer.prepend(todoBlock);
}


