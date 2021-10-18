DROP table registrations , townnames;
CREATE table townnames(
    id serial not null primary key,
    town_name text not null,
    init_town text not null
);
CREATE TABLE registrations(
    id serial not null primary key,
    num_plates text not null,
    town_id int not null,
    FOREIGN KEY (town_id) REFERENCES townnames(id)
);

insert into townnames(town_name,init_town) values('Cape Town', 'CA');
insert into townnames(town_name,init_town) values('Kraaifontein', 'CF');
insert into townnames(town_name,init_town) values('Paarl', 'CJ');