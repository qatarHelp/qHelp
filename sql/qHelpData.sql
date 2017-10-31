create database qHelpData;

use qHelpData;

create table user (
    id             int unsigned unique NOT NULL auto_increment,
    email         varchar(150) unique not null,
    bpassword    varchar(150) not null,
    fullname    varchar(200) not null,
    age            int unsigned not null,
    primary key    (email)
    
);

create table business (
    id                int unsigned unique NOT NULL auto_increment,
    email             varchar(150) unique not null,
    bpassword        varchar(150) not null,
    fullname        varchar(200) not null,
    years_service    int unsigned not null,
    primary key    (email)
);


/*create table request (
    id                int unsigned unique NOT NULL auto_increment,
    service             varchar(150) unique not null,
    location        varchar(150) not null,
    btime        varchar(200) not null,
    price    int unsigned not null,
    primary key    (email)
);*/


select * from business;
select * from user;