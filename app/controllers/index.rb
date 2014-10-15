get '/' do
  redirect('/todos')
end

# SHOW ALL TODOS

get '/todos' do
  erb :index
end

get '/todos/all' do
	@todos = Todo.order(:id)
	@todos.to_json
end

# ADD A TODO

post '/add_todo' do
	p params
	@todo = Todo.new(todo_content:params[:content], completed:false)
	@todo.save
	settings.last_db_change= Time.now.getutc
	{ id: @todo.id, 
		content: @todo.todo_content, 
		completed: @todo.completed }.to_json
end

# CHECK OFF A TODO

put '/todos/:id/done' do |id|
	@todo = Todo.where(id:id).first
	@todo.completed = !@todo.completed
	@todo.save
	settings.last_db_change= Time.now.getutc
	{ id: @todo.id, 
		content: @todo.todo_content, 
		completed: @todo.completed }.to_json

end

# DELETE A TODO

delete '/todos/:id' do |id|
	Todo.where(id: id).first.destroy
	settings.last_db_change= Time.now.getutc
	{ id: id }.to_json
end

# RESPOND TO LONG POLLING FOR DB CHANGES

get '/update' do
	puts settings.last_db_change
	{ last_db_change: settings.last_db_change }.to_json
end
