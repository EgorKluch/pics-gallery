
create table if not exists user(
  id int unsigned not null auto_increment primary key,
  login varchar(64) not null unique,
  email varchar(128) not null unique,
  password varchar(64) not null,
  role varchar(128) default 'user',
  token varchar(32) default null,
  name varchar(64) default null,
  second_name varchar(64) default null,
);

create table if not exists picture(
  id int unsigned not null auto_increment primary key,
  user_id int unsigned not null,
  added_by int unsigned not null,
  filename varchar(64) not null,
  title varchar(64) not null,
  description varchar(256) default null,
  foreign key (user_id) references user(id),
  foreign key (added_by) references user(id)
);
