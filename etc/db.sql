create table if not exists user(
  id int unsigned not null auto_increment primary key,
  login varchar(64) not null unique,
  password varchar(64) not null,
  email varchar(128) not null unique,
  role varchar(128) default 'user',
  token varchar(32) default null,
  name varchar(64) default null,
  second_name varchar(64) default null
);
