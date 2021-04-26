"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game =
/*#__PURE__*/
function () {
  function Game() {
    var _this = this;

    _classCallCheck(this, Game);

    this.canvas = document.getElementById('pong');
    this.context = this.canvas.getContext('2d');
    this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2, 'orange');
    this.players = [new Player(20, this.canvas.height / 2, 1), new Player(this.canvas.width - 20, this.canvas.height / 2, 2)];
    this.keys = [];
    window.addEventListener('keydown', function (Event) {
      switch (Event.detail) {
        case 'w':
          _this.keys[38] = true;
          break;

        case 'a':
          _this.keys[40] = true;
          break;
      }
    });
    var lastTime;

    var callback = function callback(milliseconds) {
      if (lastTime) {
        _this.update((milliseconds - lastTime) / 1000);

        _this.draw();
      }

      lastTime = milliseconds;
      window.requestAnimFrame(callback);
    };

    callback();
  }

  _createClass(Game, [{
    key: "checkInput",
    value: function checkInput(player, ball) {
      switch (player.id) {
        case 1:
          // Human player (links)
          player.velocity.y = 0;
          player.velocity.y += this.keys[38] === true ? -400 : 0;
          player.velocity.y += this.keys[40] === true ? 400 : 0;
          break;

        case 2:
          // Computer player (rechts)
          player.position.y = ball.position.y;
          break;
      }
    }
  }, {
    key: "update",
    value: function update(deltatime) {
      var _this2 = this;

      this.ball.position.x += this.ball.velocity.x * deltatime;
      this.ball.position.y += this.ball.velocity.y * deltatime;
      this.players[0].position.y += this.players[0].velocity.y * deltatime;
      this.players[1].position.y += this.players[1].velocity.y * deltatime;
      this.players.forEach(function (player) {
        return _this2.checkInput(player, _this2.ball);
      });
      this.checkCollisions(this.players, this.ball, this.hud.edges, deltatime);
    }
  }, {
    key: "checkCollisions",
    value: function checkCollisions(players, ball, edges, deltatime) {
      // Controleer of de bedjes van speler1 en speler2 tegen de randen aankomen
      for (var p = 0; p < players.length; p++) {
        if (players[p].top < edges[0].bottom) {
          players[p].position.y = edges[0].size.y + players[p].size.y / 2;
        } else if (players[p].bottom > edges[1].top) {
          players[p].position.y = this.canvas.height - edges[1].size.y - players[p].size.y / 2;
        }
      }

      if (this.ball.bottom > this.canvas.height || this.ball.top < 0) {
        this.ball.velocity.y = -this.ball.velocity.y;
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      this.drawRectangle(this.context, this.ball);

      for (var i = 0; i < this.players.length; i++) {
        this.drawRectangle(this.context, this.players[i]);
      }
    }
  }, {
    key: "drawRectangle",
    value: function drawRectangle(ctx, rect) {
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'white';
      ctx.fillStyle = color;
      ctx.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }
  }]);

  return Game;
}();