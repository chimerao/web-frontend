# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'chimerao'
set :repo_url, 'git@github.com:chimerao/web-frontend.git'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/home/webapp/frontend'

# Path to build optimized js and css files in
set :build_dir, '/home/webapp/frontend/build'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5


namespace :deploy do

  Rake::Task['publishing'].clear_actions
  task :publishing do
    invoke 'deploy:build_app'
  end

  desc 'Optimize, compress, and build javascript files'
  task :build_app do
    build_script = release_path.join('scripts', 'r.js')
    build_file = release_path.join('app', 'app.build.js')
    build_dir = fetch(:build_dir)
    on release_roles :all do
      execute :nodejs, "#{build_script} -o #{build_file} dir=#{build_dir}"
    end
  end

end
