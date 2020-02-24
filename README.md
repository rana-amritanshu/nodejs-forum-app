## Requirements:
----------------
+ docker
+ node
+ npm

## Instructions:
----------------
+ npm install  
+ cp .env-example .env
+ cd docker/dev
+ sudo docker-composer up

without docker:  
npm run dev

once docker-compose is running the application will run on port 8000 of localhost  
http://localhost:8000

To change the application port:  
Edit the docker-composer file in docker/dev folder from 8000:8000 to \<custom-port\>:8000

Project uses MySQL:  
MySQL client (phpmyadmin) can be accessed on port 8080 of localhost  
http://localhost:8080

To change the MySQL client port:  
Edit the docker-composer file in docker/dev folder from 8080:80 to \<custom-port\>:80

## Application routing:
-----------------------
base route names are generated based on the folder in app **src/app** folder  
**EXAMPLE:**  

**/src/app/user**  
will generate a base route : **api/users**  

**Note:**
user is pluralized

**/src/app/thread@:topicId@topic**  
will generate a base route : **api/topics/:topicId/threads**  

**Note:**
+ both **topic** and **thread** is pluralized
+ **:topicId** is a path paramters and will be available in the request: Request params property, **req.params** inside the application

