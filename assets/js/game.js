
class Game {
	constructor() {
)
		this.canvas = document.getElementById("pong");
		this.context = this.canvas.getContext("2d");

		this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2, "green");


		this.players = [new Player(20, this.canvas.height / 2, 1), new Player(this.canvas.width - 20, this.canvas.height / 2, 2)];


		this.hud = new Hud(this);

		this.keys = [];

        // 2 event listeners voor de bestuuring van player 1 want anders pakt die hem niet goed
		window.addEventListener("KEY_DOWN", (event) => {
			switch (event.detail) {
				case "ArrowUp":
					this.keys[38] = true;
					break;
				case 38:
					this.keys[38] = true;
					break;
				case "ArrowDown":
					this.keys[40] = true;
					break;
				case 40:
					this.keys[40] = true;
					break;
			}
		});

		window.addEventListener("KEY_UP", (event) => {
			switch (event.detail) {
				case "ArrowUp":
					this.keys[38] = false;
					break;
				case 38:
					this.keys[38] = false;
					break;
				case "ArrowDown":
					this.keys[40] = false;
					break;
				case 40:
					this.keys[40] = false;
					break;
			}
		});

		let lastTime;
		const callback = (milliseconds) => { // 60 hertz gameloop
			if (lastTime) {
				this.update((milliseconds - lastTime) / 1000);
				this.draw();
			}
			lastTime = milliseconds;
			window.requestAnimFrame(callback);
		};
		callback();
	}

	checkInput(player, ball) {
		switch (player.id) { // case 1 is mens case 2 is een bot of tewel 
			case 1: 
				player.velocity.y = 0;
				player.velocity.y += this.keys[38] === true ? -400 : 0;
				player.velocity.y += this.keys[40] === true ? 400 : 0;
				break;
			case 2: 
				if (player.locked) {
					if (--player.stickyFrames === 0) {
						player.velocity.y = 0;
						player.locked = false;
						
					}
					return;
				} else {
					player.velocity.y = 0;
					player.velocity.y += ball.position.y < player.top ? -400 : 0;
					player.velocity.y += ball.position.y > player.bottom ? 400 : 0;
					player.stickyFrames = getRandomNumBetween(5, 20);
					player.locked = true;
					
				}
				break;
		}
	}

	update(deltatime) {
		if (this.ball.locked) return;

		this.ball.position.x += this.ball.velocity.x * deltatime;
		this.ball.position.y += this.ball.velocity.y * deltatime;

		this.players[0].position.y += this.players[0].velocity.y * deltatime;
		this.players[1].position.y += this.players[1].velocity.y * deltatime;

		this.players.forEach((player) => this.checkInput(player, this.ball));

		this.checkCollisions(this.players, this.ball, this.hud.edges, deltatime);
	}

	checkCollisions(players, ball, edges, deltatime) {
		for (let p = 0; p < players.length; p++) {
			if (players[p].top < edges[0].bottom) {
				players[p].position.y = edges[0].size.y + players[p].size.y / 2;
			} else if (players[p].bottom > edges[1].top) {
				players[p].position.y = this.canvas.height - edges[1].size.y - players[p].size.y / 2;
			}
		}

		if (ball.bottom > this.canvas.height - 10 || ball.top < 10) {
			ball.velocity.y = -ball.velocity.y;
		}

		if (ball.out) return;

		if (ball.left + ball.velocity.y * deltatime < players[0].right || ball.right - ball.velocity.y * deltatime > players[1].left) {
			const player = ball.position.x < this.canvas.width / 2 ? players[0] : players[1];
			if (this.collide(ball, player, deltatime)) {
				if (ball.bottom > player.top && ball.top < player.bottom) {
					console.log("frontale botsing gedetecteerd");
					ball.position.x = player.id === 1 ? player.right + ball.size.y / 2 : player.left - ball.size.y / 2;
					ball.velocity.x = -ball.velocity.x;

                    const ballY    = ball.position.y   | 0;
                    const playerY  = player.position.y | 0;
                    const distance = ballY < playerY ? Math.abs(ballY - playerY) : -Math.abs(ballY - playerY);

                    console.log( "afstand vanaf midden van bedje: "+distance );

                    if(distance !== 0)  ball.setAngle( player.id===1 ? distance : -distance+180 ); 

                    Math.floor()
                    Math.random()
                    Math.ceil()
                    Math.PI 

                    ball.setSpeed( ball.speed*1.1 );
				} else if (ball.position.y < player.position.y) {
					console.log("botsing aan de bovenkant van speler gedetecteerd");
					ball.position.y = player.top - ball.size.y / 2;
					ball.velocity.y = player.velocity.y < 0 && player.velocity.y < ball.velocity.y ? player.velocity.y * 1.1 : -ball.velocity.y;
				} else if (ball.position.y > player.position.y) {
					console.log("botsing aan de onderkant van speler gedetecteerd");
					ball.position.y = player.bottom + ball.size.y;
					ball.velocity.y = player.velocity.y > 0 && player.velocity.y > ball.velocity.y ? player.velocity.y * 1.1 : -ball.velocity.y;
				}
			}

			
			if (ball.right < 0 || ball.left > this.canvas.width) {
				this.hud.addScore(player.id === 1 ? 2 : 1);
				ball.out = true;
				setTimeout(() => {
				// 	this.ball.reset();
				// }, 1000);
			}
		}

	
	}

	collide(rect1, rect2, dt) {
		if (rect1.left + rect1.velocity.x * dt < rect2.right + rect2.velocity.x * dt && rect1.right + rect1.velocity.x * dt > rect2.left + rect2.velocity.x * dt && rect1.top + rect1.velocity.y * dt < rect2.bottom + rect2.velocity.y * dt && rect1.bottom + rect1.velocity.y * dt > rect2.top + rect2.velocity.y * dt) {
			return true;
		} else {
			return false;
		}
	}

	draw() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawRectangle(this.context, this.ball);
		for (let i = 0; i < this.players.length; i++) {
			this.drawRectangle(this.context, this.players[i]);
		}
	}

	drawRectangle(ctx, rect, color = "white") {
		ctx.fillStyle = color;
		ctx.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
	}
}