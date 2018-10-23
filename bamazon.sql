DROP DATABASE IF EXISTS productsDB;

CREATE DATABASE productsDB;

USE productsDB;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(50) NULL,
	department_name VARCHAR(50) NULL,
	price DECIMAL(10,2) NULL,
	stock_quantity INT NULL,
	PRIMARY KEY(item_id)
);

-- 1
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blue Light Saber", "Weapons", "2499.99", "1"); 
-- 2
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Red Light Saber", "Weapons", "2499.99", "1"); 
-- 3
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Millennium Falcon Hyperdrive", "Parts", "5200.49", "4"); 
-- 4
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Jar-Jar Binx Taxidermy", "Taxidermy", "1.99", "1");
-- 5
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Storm Trooper Suit", "Uniforms", "1250.00", "100"); 
-- 6
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Millennium Falcon Hyperdrive", "Parts", "5200.49", "4"); 
-- 7
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Derjarik 2-Player Game", "Games", "49.99", "150"); 
-- 8
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hand Prosthetic", "Parts", "505.99", "1"); 
-- 9
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Voice Changer for Mask", "Parts", "75.05", "25"); 
-- 10
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("White Princess Robe", "Clothing", "150.00", "80"); 

