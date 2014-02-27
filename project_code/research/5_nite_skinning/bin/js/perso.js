// Generated by CoffeeScript 1.6.3
var Perso, PersoJoint, PersoPart,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PersoJoint = (function() {
  function PersoJoint(interactive) {
    this.interactive = interactive != null ? interactive : true;
    this.onMouseUp = __bind(this.onMouseUp, this);
    this.onDrag = __bind(this.onDrag, this);
    this.onMouseDown = __bind(this.onMouseDown, this);
    this.onMouseOut = __bind(this.onMouseOut, this);
    this.onMouseOver = __bind(this.onMouseOver, this);
    this.isDragged = false;
    this.bDebug = false;
    this.z = 0;
    this.view = new PIXI.Graphics();
    if (this.interactive) {
      this.view.interactive = true;
      this.view.mouseover = this.onMouseOver;
      this.view.mouseout = this.onMouseOut;
      this.view.mousedown = this.onMouseDown;
      this.view.buttonMode = true;
      this.setRadius(this.radius);
    }
  }

  PersoJoint.prototype.setRadius = function(radius) {
    this.radius = radius;
    this.view.hitArea = new PIXI.Circle(0, 0, this.radius);
    return this.draw();
  };

  PersoJoint.prototype.setDebug = function(bDebug) {
    this.bDebug = bDebug;
    return this.draw();
  };

  PersoJoint.prototype.draw = function(highlight) {
    if (highlight == null) {
      highlight = false;
    }
    this.view.clear();
    if (highlight) {
      this.view.beginFill(0x00ffff);
    } else {
      if (this.bDebug) {
        this.view.lineStyle(1, 0x000000);
      }
    }
    return this.view.drawCircle(0, 0, this.radius);
  };

  PersoJoint.prototype.onMouseOver = function() {
    this.view.alpha = 0.5;
    return this.draw(true);
  };

  PersoJoint.prototype.onMouseOut = function() {
    this.view.alpha = 1;
    return this.draw();
  };

  PersoJoint.prototype.onMouseDown = function() {
    this.isDragged = true;
    stage.mouseup = this.onMouseUp;
    return stage.mousemove = this.onDrag;
  };

  PersoJoint.prototype.onDrag = function(ev) {
    this.view.position.x = ev.originalEvent.clientX - this.view.parent.position.x;
    this.view.position.y = ev.originalEvent.clientY - this.view.parent.position.y;
    if (this.draggedCallback) {
      return this.draggedCallback();
    }
  };

  PersoJoint.prototype.onMouseUp = function() {
    this.isDragged = false;
    stage.mouseup = null;
    return stage.mousemove = null;
  };

  return PersoJoint;

})();

PersoPart = (function() {
  function PersoPart(name, color, joints, drawFunc) {
    this.name = name;
    this.color = color;
    this.joints = joints;
    this.drawFunc = drawFunc;
    this.z = 0;
    this.update();
  }

  PersoPart.prototype.update = function() {
    var i, _i, _ref;
    this.z = 0;
    for (i = _i = 0, _ref = this.joints.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.z += this.joints[i].z;
    }
    return this.z /= this.joints.length;
  };

  return PersoPart;

})();

Perso = (function() {
  Perso.radius = [0.020, 0, 0.008, 0.008, 0.003, 0.003, 0.003, 0.003, 0.020, 0.012, 0.012, 0.008, 0.008, 0.003, 0.003];

  Perso.palette = {
    skin: 0xdec6c2,
    cream: 0xe4e6dd,
    lightblue: 0x97c6c9,
    blue: 0x629498,
    beige: 0xcac8ad,
    lightGreen: 0xb5cec0
  };

  Perso.morph = {
    shouldersToHead: 0.6,
    shouldersAppart: 0.6,
    elbowsToShoulders: 0.25,
    torsoLow: 0.3,
    hipsCloser: 0.25,
    lowFeet: 0.2
  };

  function Perso(interactive) {
    var i, jnt, _i, _ref,
      _this = this;
    this.interactive = interactive;
    this.drawRightLowerArm = __bind(this.drawRightLowerArm, this);
    this.drawRightUpperArm = __bind(this.drawRightUpperArm, this);
    this.drawLeftLowerArm = __bind(this.drawLeftLowerArm, this);
    this.drawLeftUpperArm = __bind(this.drawLeftUpperArm, this);
    this.drawRightLowerLeg = __bind(this.drawRightLowerLeg, this);
    this.drawRightUpperLeg = __bind(this.drawRightUpperLeg, this);
    this.drawLeftLowerLeg = __bind(this.drawLeftLowerLeg, this);
    this.drawLeftUpperLeg = __bind(this.drawLeftUpperLeg, this);
    this.drawPelvis = __bind(this.drawPelvis, this);
    this.drawTorso = __bind(this.drawTorso, this);
    this.drawHead = __bind(this.drawHead, this);
    this.view = new PIXI.DisplayObjectContainer();
    this.joints = [];
    for (i = _i = 0, _ref = NiTE.NUM_JOINTS; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      jnt = new PersoJoint(this.interactive);
      jnt.draggedCallback = function() {
        return _this.update();
      };
      if (i !== NiTE.NECK) {
        this.view.addChild(jnt.view);
      }
      this.joints.push(jnt);
    }
    this.gfx = new PIXI.Graphics();
    this.view.addChildAt(this.gfx, 0);
    this.bDebug = false;
    this.parts = null;
    this.setupParts();
  }

  Perso.prototype.setupParts = function() {
    var P, capitalized, colors, p, part, parts, partsDefs, _results;
    P = Perso.palette;
    colors = {
      head: P.skin,
      torso: P.cream,
      pelvis: P.lightblue,
      leftUpperArm: P.beige,
      leftLowerArm: P.beige,
      rightUpperArm: P.lightGreen,
      rightLowerArm: P.lightGreen,
      leftUpperLeg: P.lightblue,
      leftLowerLeg: P.blue,
      rightUpperLeg: P.lightblue,
      rightLowerLeg: P.blue
    };
    partsDefs = {
      leftUpperArm: [NiTE.LEFT_SHOULDER, NiTE.LEFT_ELBOW],
      leftLowerArm: [NiTE.LEFT_ELBOW, NiTE.LEFT_HAND],
      leftUpperLeg: [NiTE.LEFT_HIP, NiTE.LEFT_KNEE],
      leftLowerLeg: [NiTE.LEFT_KNEE, NiTE.LEFT_FOOT],
      rightUpperArm: [NiTE.RIGHT_SHOULDER, NiTE.RIGHT_ELBOW],
      rightLowerArm: [NiTE.RIGHT_ELBOW, NiTE.RIGHT_HAND],
      rightUpperLeg: [NiTE.RIGHT_HIP, NiTE.RIGHT_KNEE],
      rightLowerLeg: [NiTE.RIGHT_KNEE, NiTE.RIGHT_FOOT],
      pelvis: [NiTE.TORSO, NiTE.LEFT_HIP, NiTE.RIGHT_HIP],
      torso: [NiTE.TORSO, NiTE.LEFT_SHOULDER, NiTE.RIGHT_SHOULDER],
      head: [NiTE.HEAD]
    };
    this.parts = [];
    _results = [];
    for (p in partsDefs) {
      parts = partsDefs[p];
      capitalized = p[0].toUpperCase() + p.slice(1);
      part = new PersoPart(p, colors[p], this.getJoints(parts), this['draw' + capitalized]);
      _results.push(this.parts.push(part));
    }
    return _results;
  };

  Perso.prototype.getJoints = function(types) {
    var res, type, _i, _len;
    res = [];
    for (_i = 0, _len = types.length; _i < _len; _i++) {
      type = types[_i];
      res.push(this.joints[type]);
    }
    return res;
  };

  Perso.prototype.setFromSkeleton = function(skeleton) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = skeleton.joints.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.joints[i].view.position.x = skeleton.joints[i].view.position.x;
      this.joints[i].view.position.y = skeleton.joints[i].view.position.y;
      this.joints[i].z = skeleton.joints[i].z;
      this.joints[i].setRadius(Perso.radius[i] * skeleton.width * 2);
    }
    return this.morphSkeleton();
  };

  Perso.prototype.morphSkeleton = function() {
    var headP, leftElbowP, leftFootP, leftHipP, leftKneeP, leftShouldP, leftShouldPx, rightElbowP, rightFootP, rightHipP, rightKneeP, rightShouldP, torsoP;
    headP = this.getPos(NiTE.HEAD);
    leftShouldP = this.getPos(NiTE.LEFT_SHOULDER);
    rightShouldP = this.getPos(NiTE.RIGHT_SHOULDER);
    leftElbowP = this.getPos(NiTE.LEFT_ELBOW);
    rightElbowP = this.getPos(NiTE.RIGHT_ELBOW);
    leftHipP = this.getPos(NiTE.LEFT_HIP);
    rightHipP = this.getPos(NiTE.RIGHT_HIP);
    leftKneeP = this.getPos(NiTE.LEFT_KNEE);
    rightKneeP = this.getPos(NiTE.RIGHT_KNEE);
    leftFootP = this.getPos(NiTE.LEFT_FOOT);
    rightFootP = this.getPos(NiTE.RIGHT_FOOT);
    torsoP = this.getPos(NiTE.TORSO);
    leftShouldP.y += (headP.y - leftShouldP.y) * Perso.morph.shouldersToHead;
    leftShouldP.x += (headP.x - leftShouldP.x) * Perso.morph.shouldersToHead;
    rightShouldP.y += (headP.y - rightShouldP.y) * Perso.morph.shouldersToHead;
    rightShouldP.x += (headP.x - rightShouldP.x) * Perso.morph.shouldersToHead;
    leftShouldP.x += (-rightShouldP.x + leftShouldP.x) * Perso.morph.shouldersAppart;
    rightShouldP.x += (-leftShouldP.x + rightShouldP.x) * Perso.morph.shouldersAppart;
    leftElbowP.y += (rightShouldP.y - leftElbowP.y) * Perso.morph.elbowsToShoulders;
    rightElbowP.y += (leftShouldP.y - rightElbowP.y) * Perso.morph.elbowsToShoulders;
    torsoP.y += ((rightHipP.y + leftHipP.y) / 2 - torsoP.y) * Perso.morph.torsoLow;
    torsoP.x += ((rightHipP.x + leftHipP.x) / 2 - torsoP.x) * Perso.morph.torsoLow;
    leftHipP.x += (rightHipP.x - leftHipP.x) * Perso.morph.hipsCloser;
    rightHipP.x += (leftHipP.x - rightHipP.x) * Perso.morph.hipsCloser;
    leftFootP.y += (-leftKneeP.y + leftFootP.y) * Perso.morph.lowFeet;
    rightFootP.y += (-rightKneeP.y + leftFootP.y) * Perso.morph.lowFeet;
    if (leftShouldP.x > rightShouldP.x) {
      leftShouldPx = leftShouldP.x;
      leftShouldP.x = rightShouldP.x;
      return rightShouldP.x = leftShouldPx;
    }
  };

  Perso.prototype.getPos = function(joinType) {
    return this.joints[joinType].view.position;
  };

  Perso.prototype.getPart = function(name) {
    var part, _i, _len, _ref;
    _ref = this.parts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      if (part.name === name) {
        return part;
      }
    }
  };

  Perso.prototype.update = function() {
    var lsp, np, part, rsp, _i, _len, _ref;
    if (typeof sync === 'undefined') {
      np = this.getPos(NiTE.NECK);
      rsp = this.getPos(NiTE.LEFT_SHOULDER);
      lsp = this.getPos(NiTE.RIGHT_SHOULDER);
      np.x = (lsp.x + rsp.x) / 2;
      np.y = (lsp.y + rsp.y) / 2;
    }
    this.gfx.clear();
    if (this.bDebug) {
      this.drawBones();
    }
    _ref = this.parts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      part.update();
    }
    this.getPart('head').z = this.getPart('torso').z + 2;
    this.getPart('pelvis').z = this.getPart('torso').z + 1;
    this.parts.sort(function(a, b) {
      if (a.z > b.z) {
        return 1;
      } else {
        return -1;
      }
    });
    return this.drawBody();
  };

  Perso.prototype.setDebug = function(bDebug) {
    var j, _i, _len, _ref, _results;
    this.bDebug = bDebug;
    _ref = this.joints;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      j = _ref[_i];
      _results.push(j.setDebug(this.bDebug));
    }
    return _results;
  };

  Perso.prototype.drawBones = function() {
    var bone, j1p, j2p, _i, _len, _ref, _results;
    this.gfx.lineStyle(1, 0x000000, 0.3);
    _ref = NiTE.bones;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bone = _ref[_i];
      j1p = this.getPos(bone[0]);
      j2p = this.getPos(bone[1]);
      this.gfx.moveTo(j1p.x, j1p.y);
      _results.push(this.gfx.lineTo(j2p.x, j2p.y));
    }
    return _results;
  };

  Perso.prototype.drawBody = function() {
    var i, p, _i, _ref;
    if (this.bDebug) {
      this.gfx.lineStyle(1, 0x000000, 1);
    } else {
      this.gfx.lineStyle(0);
    }
    for (i = _i = 0, _ref = this.parts.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      p = this.parts[i];
      p.drawFunc(p);
    }
  };

  Perso.prototype.drawHead = function(part) {
    var hp;
    hp = this.getPos(NiTE.HEAD);
    if (!this.bDebug) {
      this.gfx.beginFill(part.color);
    }
    this.gfx.drawCircle(hp.x, hp.y, this.joints[NiTE.HEAD].radius);
    return this.gfx.endFill();
  };

  Perso.prototype.drawTorso = function(part) {
    var head_to_left_shoulder, head_to_right_shoulder, hp, left_shoulder_to_torso, right_shoulder_to_torso, tp;
    if (this.bDebug) {
      this.drawCircleTangentsDebug(NiTE.LEFT_SHOULDER, NiTE.TORSO, [0]);
      this.drawCircleTangentsDebug(NiTE.RIGHT_SHOULDER, NiTE.TORSO, [1]);
      this.drawTangentDebug(NiTE.HEAD, NiTE.LEFT_SHOULDER, [1]);
      return this.drawTangentDebug(NiTE.HEAD, NiTE.RIGHT_SHOULDER, [0]);
    } else {
      hp = this.getPos(NiTE.HEAD);
      tp = this.getPos(NiTE.TORSO);
      this.gfx.beginFill(part.color);
      this.drawJoint(NiTE.TORSO);
      this.drawJoint(NiTE.LEFT_SHOULDER);
      this.drawJoint(NiTE.RIGHT_SHOULDER);
      head_to_right_shoulder = this.getJointTangents(hp.x, hp.y, NiTE.RIGHT_SHOULDER);
      head_to_left_shoulder = this.getJointTangents(hp.x, hp.y, NiTE.LEFT_SHOULDER);
      right_shoulder_to_torso = this.getJointCircleTangents(NiTE.RIGHT_SHOULDER, NiTE.TORSO);
      left_shoulder_to_torso = this.getJointCircleTangents(NiTE.LEFT_SHOULDER, NiTE.TORSO);
      this.gfx.moveTo(hp.x, hp.y);
      if (head_to_right_shoulder) {
        this.gfx.lineTo(head_to_right_shoulder[0][0], head_to_right_shoulder[0][1]);
      }
      if (right_shoulder_to_torso) {
        this.gfx.lineTo(right_shoulder_to_torso[1][0], right_shoulder_to_torso[1][1]);
        this.gfx.lineTo(right_shoulder_to_torso[1][2], right_shoulder_to_torso[1][3]);
      }
      if (left_shoulder_to_torso) {
        this.gfx.lineTo(left_shoulder_to_torso[0][2], left_shoulder_to_torso[0][3]);
        this.gfx.lineTo(left_shoulder_to_torso[0][0], left_shoulder_to_torso[0][1]);
      }
      if (head_to_left_shoulder) {
        this.gfx.lineTo(head_to_left_shoulder[1][0], head_to_left_shoulder[1][1]);
      }
      this.gfx.lineTo(hp.x, hp.y);
      return this.gfx.endFill();
    }
  };

  Perso.prototype.drawPelvis = function(part) {
    var lefthip_to_torso, righthip_to_lefthip, torso_to_righthip;
    if (this.bDebug) {
      this.drawCircleTangentsDebug(NiTE.LEFT_HIP, NiTE.TORSO, [1]);
      this.drawCircleTangentsDebug(NiTE.RIGHT_HIP, NiTE.TORSO, [0]);
      return this.drawCircleTangentsDebug(NiTE.RIGHT_HIP, NiTE.LEFT_HIP, [1]);
    } else {
      this.gfx.beginFill(part.color);
      torso_to_righthip = this.getJointCircleTangents(NiTE.TORSO, NiTE.RIGHT_HIP);
      righthip_to_lefthip = this.getJointCircleTangents(NiTE.RIGHT_HIP, NiTE.LEFT_HIP);
      lefthip_to_torso = this.getJointCircleTangents(NiTE.LEFT_HIP, NiTE.TORSO);
      if (!torso_to_righthip) {
        return;
      }
      this.gfx.moveTo(torso_to_righthip[1][0], torso_to_righthip[1][1]);
      this.gfx.lineTo(torso_to_righthip[1][2], torso_to_righthip[1][3]);
      if (righthip_to_lefthip) {
        this.gfx.lineTo(righthip_to_lefthip[1][0], righthip_to_lefthip[1][1]);
        this.gfx.lineTo(righthip_to_lefthip[1][2], righthip_to_lefthip[1][3]);
      }
      if (lefthip_to_torso) {
        this.gfx.lineTo(lefthip_to_torso[1][0], lefthip_to_torso[1][1]);
        this.gfx.lineTo(lefthip_to_torso[1][2], lefthip_to_torso[1][3]);
      }
      return this.gfx.endFill();
    }
  };

  Perso.prototype.drawLeftUpperLeg = function(part) {
    var lefthip_to_leftknee;
    if (this.bDebug) {
      return this.drawCircleTangentsDebug(NiTE.LEFT_HIP, NiTE.LEFT_KNEE);
    } else {
      this.gfx.beginFill(part.color);
      this.drawJoint(NiTE.LEFT_HIP);
      lefthip_to_leftknee = this.getJointCircleTangents(NiTE.LEFT_HIP, NiTE.LEFT_KNEE);
      this.drawTangetsQuad(lefthip_to_leftknee);
      return this.gfx.endFill();
    }
  };

  Perso.prototype.drawLeftLowerLeg = function(part) {
    var leftknee_to_leftfoot;
    if (this.bDebug) {
      return this.drawCircleTangentsDebug(NiTE.LEFT_KNEE, NiTE.LEFT_FOOT);
    } else {
      this.gfx.beginFill(part.color);
      leftknee_to_leftfoot = this.getJointCircleTangents(NiTE.LEFT_KNEE, NiTE.LEFT_FOOT);
      this.drawTangetsQuad(leftknee_to_leftfoot);
      this.drawJoint(NiTE.LEFT_KNEE);
      return this.gfx.endFill();
    }
  };

  Perso.prototype.drawRightUpperLeg = function(part) {
    var righthip_to_rightknee;
    if (this.bDebug) {
      return this.drawCircleTangentsDebug(NiTE.RIGHT_HIP, NiTE.RIGHT_KNEE);
    } else {
      this.gfx.beginFill(part.color);
      this.drawJoint(NiTE.RIGHT_HIP);
      righthip_to_rightknee = this.getJointCircleTangents(NiTE.RIGHT_HIP, NiTE.RIGHT_KNEE);
      this.drawTangetsQuad(righthip_to_rightknee);
      return this.gfx.endFill;
    }
  };

  Perso.prototype.drawRightLowerLeg = function(part) {
    var rightknee_to_rightfoot;
    if (this.bDebug) {
      return this.drawCircleTangentsDebug(NiTE.RIGHT_KNEE, NiTE.RIGHT_FOOT);
    } else {
      this.gfx.beginFill(part.color);
      rightknee_to_rightfoot = this.getJointCircleTangents(NiTE.RIGHT_KNEE, NiTE.RIGHT_FOOT);
      this.drawTangetsQuad(rightknee_to_rightfoot);
      this.drawJoint(NiTE.RIGHT_KNEE);
      return this.gfx.endFill();
    }
  };

  Perso.prototype.drawLeftUpperArm = function(part) {
    var leftarm_to_leftelbow;
    if (this.bDebug) {
      return this.drawCircleTangentsDebug(NiTE.LEFT_SHOULDER, NiTE.LEFT_ELBOW);
    } else {
      this.gfx.beginFill(part.color);
      this.drawJoint(NiTE.LEFT_SHOULDER);
      leftarm_to_leftelbow = this.getJointCircleTangents(NiTE.LEFT_SHOULDER, NiTE.LEFT_ELBOW);
      this.drawTangetsQuad(leftarm_to_leftelbow);
      return this.gfx.endFill();
    }
  };

  Perso.prototype.drawLeftLowerArm = function(part) {
    var leftelbow_to_lefthand;
    if (this.bDebug) {
      return this.drawCircleTangentsDebug(NiTE.LEFT_ELBOW, NiTE.LEFT_HAND);
    } else {
      this.gfx.beginFill(part.color);
      leftelbow_to_lefthand = this.getJointCircleTangents(NiTE.LEFT_ELBOW, NiTE.LEFT_HAND);
      this.drawTangetsQuad(leftelbow_to_lefthand);
      this.drawJoint(NiTE.LEFT_ELBOW);
      return this.gfx.endFill();
    }
  };

  Perso.prototype.drawRightUpperArm = function(part) {
    var rightarm_to_rightelbow;
    if (this.bDebug) {
      return this.drawCircleTangentsDebug(NiTE.RIGHT_SHOULDER, NiTE.RIGHT_ELBOW);
    } else {
      this.gfx.beginFill(part.color);
      this.drawJoint(NiTE.RIGHT_SHOULDER);
      rightarm_to_rightelbow = this.getJointCircleTangents(NiTE.RIGHT_SHOULDER, NiTE.RIGHT_ELBOW);
      this.drawTangetsQuad(rightarm_to_rightelbow);
      return this.gfx.endFill();
    }
  };

  Perso.prototype.drawRightLowerArm = function(part) {
    var rightelbow_to_righthand;
    if (this.bDebug) {
      return this.drawCircleTangentsDebug(NiTE.RIGHT_ELBOW, NiTE.RIGHT_HAND);
    } else {
      this.gfx.beginFill(part.color);
      rightelbow_to_righthand = this.getJointCircleTangents(NiTE.RIGHT_ELBOW, NiTE.RIGHT_HAND);
      this.drawTangetsQuad(rightelbow_to_righthand);
      this.drawJoint(NiTE.RIGHT_ELBOW);
      return this.gfx.endFill();
    }
  };

  Perso.prototype.drawJoint = function(joint_type) {
    var p;
    p = this.getPos(joint_type);
    return this.gfx.drawCircle(p.x, p.y, this.joints[joint_type].radius);
  };

  Perso.prototype.drawTangetsQuad = function(tangents) {
    if (!tangents || !tangents[0] || !tangents[1]) {
      return;
    }
    this.gfx.moveTo(tangents[0][0], tangents[0][1]);
    this.gfx.lineTo(tangents[1][0], tangents[1][1]);
    this.gfx.lineTo(tangents[1][2], tangents[1][3]);
    return this.gfx.lineTo(tangents[0][2], tangents[0][3]);
  };

  Perso.prototype.drawTangentDebug = function(j1_type, j2_type, indexes) {
    var i, px, py, tangents, tgt, _i, _len, _results;
    if (indexes == null) {
      indexes = [0, 1];
    }
    px = this.getPos(j1_type).x;
    py = this.getPos(j1_type).y;
    tangents = this.getJointTangents(px, py, j2_type);
    if (tangents) {
      _results = [];
      for (_i = 0, _len = indexes.length; _i < _len; _i++) {
        i = indexes[_i];
        tgt = tangents[i];
        this.gfx.moveTo(px, py);
        _results.push(this.gfx.lineTo(tgt[0], tgt[1]));
      }
      return _results;
    }
  };

  Perso.prototype.drawCircleTangentsDebug = function(j1_type, j2_type, indexes) {
    var i, tangents, tgt, _i, _len, _results;
    if (indexes == null) {
      indexes = [0, 1];
    }
    tangents = this.getJointCircleTangents(j1_type, j2_type);
    if (tangents) {
      _results = [];
      for (_i = 0, _len = indexes.length; _i < _len; _i++) {
        i = indexes[_i];
        tgt = tangents[i];
        this.gfx.moveTo(tgt[0], tgt[1]);
        _results.push(this.gfx.lineTo(tgt[2], tgt[3]));
      }
      return _results;
    }
  };

  Perso.prototype.getJointTangents = function(px, py, joint_type) {
    var cx, cy, jnt, radius;
    jnt = this.joints[joint_type];
    cx = jnt.view.position.x;
    cy = jnt.view.position.y;
    radius = jnt.radius;
    return this.getTangents(px, py, cx, cy, radius);
  };

  Perso.prototype.getJointCircleTangents = function(j1_type, j2_type) {
    var j1, j1p, j2, j2p;
    j1 = this.joints[j1_type];
    j1p = j1.view.position;
    j2 = this.joints[j2_type];
    j2p = j2.view.position;
    return this.getCircleTangents(j1p.x, j1p.y, j1.radius, j2p.x, j2p.y, j2.radius);
  };

  Perso.prototype.getTangents = function(px, py, cx, cy, radius) {
    var a, b, dd, dx, dy, t;
    dx = cx - px;
    dy = cy - py;
    dd = Math.sqrt(dx * dx + dy * dy);
    a = Math.asin(radius / dd);
    b = Math.atan2(dy, dx);
    t = [];
    t[0] = [cx + radius * Math.sin(b - a), cy + radius * -Math.cos(b - a)];
    t[1] = [cx + radius * -Math.sin(b + a), cy + radius * Math.cos(b + a)];
    return t;
  };

  Perso.prototype.getCircleTangents = function(x1, y1, r1, x2, y2, r2) {
    var a, c, d, d_sq, h, i, nx, ny, res, sign1, sign2, vx, vy, _i, _j;
    d_sq = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    if (d_sq <= (r1 - r2) * (r1 - r2)) {
      return null;
    }
    d = Math.sqrt(d_sq);
    vx = (x2 - x1) / d;
    vy = (y2 - y1) / d;
    res = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    i = 0;
    for (sign1 = _i = 1; _i >= -1; sign1 = _i += -2) {
      c = (r1 - sign1 * r2) / d;
      if (c * c > 1.0) {
        continue;
      }
      h = Math.sqrt(Math.max(0.0, 1.0 - c * c));
      for (sign2 = _j = 1; _j >= -1; sign2 = _j += -2) {
        nx = vx * c - sign2 * h * vy;
        ny = vy * c + sign2 * h * vx;
        a = res[i++];
        a[0] = x1 + r1 * nx;
        a[1] = y1 + r1 * ny;
        a[2] = x2 + sign1 * r2 * nx;
        a[3] = y2 + sign1 * r2 * ny;
      }
    }
    return res;
  };

  return Perso;

})();
