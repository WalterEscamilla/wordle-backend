# Welcome!

First of all 

     npm install
     npm run build

then

    npm run typeorm migrations:run

For database a put a file named `word_202212161533,` so you can import in your table word, after run migrations

and finally `npm run dev`

1.

     create user, 
    	route: /users/register
    	method: posts
    	bodyJson {
    			  "email": "walter@escamilla.rocks",
    			  "password": "test",
    			  "firstName": "walter",
    			  "lastName": "Escamilla"
    			}

2. 

    login user, 
        	route: /users/loing
        	method: post
        	bodyJson {
        			  "email": "walter@escamilla.rocks",
        			  "password": "test",
     
        			}
3. 
   

     new game, 
        route: /games
            	method: post

 4. 

    add word, 
        	route: /games/word
        	method: posts
        	bodyJson: {"gameId": 1, "userWord": "catos"}
			
			
			
5. 

    get 10 user with mos winds, 
        	route: /users/ranking
        	method: post
        	bodyJson: {}
6. 

    get most words guesss, 
        	route: /games/ranking
        	method: post
        	bodyJson: {}

TODO

 1. insert in game details. done, validate attemtps
 2. get users with more games win, done
 3. get words most used, done
 4. add testing
