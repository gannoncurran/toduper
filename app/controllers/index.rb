get '/' do
  redirect('/todos')
end

# SHOW ALL TODOS

get '/todos' do
  erb :index
end

get '/todos/all' do
	@todos = Todo.all
	@todos.to_json
end

# ADD A TODO

post '/add_todo' do
	puts "*"*50
	p params
	@todo = Todo.new(todo_content:params[:content], completed:false)
	@todo.save
	{ id: @todo.id, 
		content: @todo.todo_content, 
		completed: @todo.completed }.to_json
end

# CHECK OFF A TODO

put '/todos/:id/done' do |id|
	@todo = Todo.where(id:id).first
	@todo.completed = !@todo.completed
	@todo.save
	{ id: @todo.id, 
		content: @todo.todo_content, 
		completed: @todo.completed }.to_json

end

# DELETE A TODO

delete '/todos/:id' do |id|
	puts id
	Todo.where(id: id).first.destroy
	{ id: id }.to_json
end

