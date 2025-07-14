mysql> CREATE DATABASE score;
ERROR 1007 (HY000): Can't create database 'score'; database exists
mysql>
mysql> USE score;
Database changed
mysql>
mysql> CREATE TABLE score (
    ->   id INT AUTO_INCREMENT PRIMARY KEY,
    ->   nombre VARCHAR(100),
    ->   puntos INT,
    ->   tiempo INT,
    ->   fecha DATE
    -> );
ERROR 1050 (42S01): Table 'score' already exists