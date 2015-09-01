insert into role (name) values('user');
insert into role (name) values('admin');
insert into siteuser (email,username,password,first_name,last_name) values('test@localhost','test','{SSHA512}uCkM8QrdO61bryO4u5F2WrMw9zLaYElji8MrNh43BpSKyq/AeQx9TKsBQI8NvQ5sJqj7Bp1t+MiKFPx34njPXGjiMMuE2rGZsyWQw8IHHTM=','Test','User');
insert into siteuser_role values(1,1);
insert into siteuser_role values(1,2);
