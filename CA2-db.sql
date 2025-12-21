 CREATE DATABASE IF NOT EXISTS Server_side_Ca2 ;
USE Server_side_Ca2 ;
CREATE TABLE mysql_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    email VARCHAR(100),
    phone_number VARCHAR(10),
    eircode VARCHAR(6)
);

select * from mysql_table; 