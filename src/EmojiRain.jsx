import { useEffect, useReducer, useRef, useState } from 'react';

function EmojiRain({ quantity } = props) {
  useEffect(() => {
    let container = document.getElementById('animate');
    const emoji = [
      '🎓',
      '👩🏻‍🎓',
      '📚',
      '👩🏽‍🎓',
      '👨🏻‍💻',
      '👨‍🏫',
      '📓',
      '🎓',
      '🎓',
      '🎓',
      '🎓',
      '🎓',
      '🎓',
      '🎓',
      '🎄',
      '❄️',
      '🎁',
      '⛄',
    ];
    let circles = [];
    for (var i = 0; i < quantity; i++) {
      addCircle(
        i * 150,
        [10 + 0, 300],
        emoji[Math.floor(Math.random() * emoji.length)],
      );
      addCircle(
        i * 150,
        [10 + 0, -300],
        emoji[Math.floor(Math.random() * emoji.length)],
      );
      addCircle(
        i * 150,
        [10 - 200, -300],
        emoji[Math.floor(Math.random() * emoji.length)],
      );
      addCircle(
        i * 150,
        [10 + 200, 300],
        emoji[Math.floor(Math.random() * emoji.length)],
      );
      addCircle(
        i * 150,
        [10 - 400, -300],
        emoji[Math.floor(Math.random() * emoji.length)],
      );
      addCircle(
        i * 150,
        [10 + 400, 300],
        emoji[Math.floor(Math.random() * emoji.length)],
      );
      addCircle(
        i * 150,
        [10 - 600, -300],
        emoji[Math.floor(Math.random() * emoji.length)],
      );
      addCircle(
        i * 150,
        [10 + 600, 300],
        emoji[Math.floor(Math.random() * emoji.length)],
      );
    }
    function addCircle(delay, range, color) {
      setTimeout(function () {
        var c = new Circle(
          range[0] + Math.random() * range[1],
          80 + Math.random() * 4,
          color,
          {
            x: -0.15 + Math.random() * 0.3,
            y: 1 + Math.random() * 1,
          },
          range,
        );
        circles.push(c);
      }, delay);
    }
    function Circle(x, y, c, v, range) {
      var _this = this;
      this.x = x;
      this.y = y;
      this.color = c;
      this.v = v;
      this.range = range;
      this.element = document.createElement('span');
      /*this.element.style.display = 'block';*/
      this.element.style.opacity = 0;
      this.element.style.position = 'absolute';
      this.element.style.fontSize = '26px';
      this.element.style.color =
        'hsl(' + ((Math.random() * 360) | 0) + ',80%,50%)';
      this.element.innerHTML = c;
      container.appendChild(this.element);
      this.update = function () {
        if (_this.y > 800) {
          _this.y = 80 + Math.random() * 4;
          _this.x = _this.range[0] + Math.random() * _this.range[1];
        }
        _this.y += _this.v.y;
        _this.x += _this.v.x;
        this.element.style.opacity = 1;
        this.element.style.transform =
          'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
        this.element.style.webkitTransform =
          'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
        this.element.style.mozTransform =
          'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
      };
    }
  }, [quantity]);
  useEffect(() => {
    let running = true;
    function animate() {
      if (!running) {
        return;
      }
      for (var i in circles) {
        circles[i].update();
      }
      requestAnimationFrame(animate);
    }
    animate();
    return () => {
      running = false;
    };
  }, []);
  return (
    <>
      <div id="emojirain">
        <div id="container">
          <div id="animate"></div>
        </div>
      </div>
    </>
  );
  //   let x = useRef(0);
  //   let y = useRef(0);
  //   const v = 1;
  //   useEffect(() => {
  //     let running = true;
  //     const update = () => {
  //       console.log(y);
  //       if (running) {
  //         x.current += v;
  //         y.current += v;
  //         if (y.current > 100) {
  //           running = false;
  //         }
  //         requestAnimationFrame(update);
  //       }
  //     };
  //     update();
  //     return () => {
  //       running = false;
  //     };
  //   }, []);
  //   return (
  //     <span
  //       style={{
  //         display: 'block',
  //         transform: 'translate3d(' + x.current + 'px, ' + y.current + 'px, 0px)',
  //         fontSize: '26px',
  //         position: 'absolute',
  //       }}
  //     >
  //       🎓
  //     </span>
  //   );
}

export default EmojiRain;
