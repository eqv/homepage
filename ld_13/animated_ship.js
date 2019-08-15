// Generated by CoffeeScript 1.12.7
(function() {
  var Vec2, rot_at_frame;

  Vec2 = Crafty.math.Vector2D;

  rot_at_frame = function(frame, prev) {
    var a, b;
    if (frame.end_rot != null) {
      return frame.end_rot;
    } else if (frame.center != null) {
      a = prev.end_pos.clone().subtract(frame.center.clone());
      b = frame.end_pos.clone().subtract(frame.center.clone());
      return prev.end_rot + Crafty.math.radToDeg(a.angleBetween(b));
    } else {
      return Crafty.math.radToDeg(prev.end_pos.angleTo(frame.end_pos));
    }
  };

  Crafty.c("AnimatedShip", {
    init: function() {
      var frame, i, len, prev, ref, results;
      this.requires("2D");
      this.bind("EnterFrame", this.on_frame);
      this.start = Date.now();
      this.start_frame = {
        end_pos: this.get_pos(),
        end_time: 0,
        end_rot: this.rotation
      };
      prev = this.start_frame;
      ref = this.keyframes;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        frame = ref[i];
        frame.end_rot = rot_at_frame(frame, prev);
        results.push(prev = frame);
      }
      return results;
    },
    on_frame: function() {
      var a, angle, b, current_frame, diff, frameDuration, i, keyframe, len, next_frame, progress, ref, vec, x, y;
      diff = (Date.now() - this.start) / 1000;
      current_frame = this.start_frame;
      next_frame = null;
      ref = this.keyframes;
      for (i = 0, len = ref.length; i < len; i++) {
        keyframe = ref[i];
        if (keyframe.end_time < diff) {
          current_frame = keyframe;
        } else {
          next_frame = keyframe;
          break;
        }
      }
      if (next_frame != null) {
        frameDuration = next_frame.end_time - current_frame.end_time;
        progress = (diff - current_frame.end_time) / frameDuration;
        this.rotation = (1 - progress) * current_frame.end_rot + progress * next_frame.end_rot;
        if (next_frame.center != null) {
          a = current_frame.end_pos.clone().subtract(next_frame.center);
          b = next_frame.end_pos.clone().subtract(next_frame.center);
          angle = progress * b.angleBetween(a) + a.angleBetween(new Vec2(1, 0));
          vec = next_frame.center.clone().add(new Vec2(Math.cos(angle), -Math.sin(angle)).scaleToMagnitude(next_frame.radius));
          return this.set_pos(vec);
        } else {
          x = (1 - progress) * current_frame.end_pos.x + progress * next_frame.end_pos.x;
          y = (1 - progress) * current_frame.end_pos.y + progress * next_frame.end_pos.y;
          return this.set_pos(x, y);
        }
      } else {
        this.rotation = current_frame.end_rot;
        this.set_pos(current_frame.end_pos);
        this.removeComponent("AnimatedShip");
        this.unbind("EnterFrame", this.on_frame);
        return currentLevel.ship_finished_animating();
      }
    }
  });

}).call(this);