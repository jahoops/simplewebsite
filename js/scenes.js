function clearAll(){
    var canvas = document.getElementById("heartCanvas");
    canvas.width = 0;
    canvas = document.getElementById("flowers");
    canvas.width = 0;
    $('#page7 .superShadow').removeClass('superShadow');
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function do3DText() {
    var tl = new TimelineMax({
        repeat: 1,
        repeatDelay: 1,
        yoyo: false
    });
    tl.staggerTo("h2", 0.2, {
        className: "+=superShadow",
        top: "-=10px",
        ease: Power1.easeIn
    }, "0.3", "start");
    tl.staggerTo("h3", 0.2, {
        className: "+=superShadow",
        top: "-=10px",
        ease: Power1.easeIn
    }, "0.3", "start");
}

function doHearts() {
    var canvas;
    var stage;
    var container;
    var captureContainers;
    var captureIndex;

    function init() {
        canvas = document.getElementById("heartCanvas");
        stage = new createjs.Stage(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var w = canvas.width;
        var h = canvas.height;

        container = new createjs.Container();
        stage.addChild(container);

        captureContainers = [];
        captureIndex = 0;

        for (var i = 0; i < 100; i++) {
            var heart = new createjs.Shape();
            heart.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30));
            heart.graphics.moveTo(0, -12).curveTo(1, -20, 8, -20).curveTo(16, -20, 16, -10).curveTo(16, 0, 0, 12);
            heart.graphics.curveTo(-16, 0, -16, -10).curveTo(-16, -20, -8, -20).curveTo(-1, -20, 0, -12);
            heart.y = -100;

            container.addChild(heart);
        }

        for (i = 0; i < 100; i++) {
            var captureContainer = new createjs.Container();
            captureContainer.cache(0, 0, w, h);
            captureContainers.push(captureContainer);
        }

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.on("tick", tick);
    }

    function tick(event) {
        var w = canvas.width;
        var h = canvas.height;
        var l = container.numChildren;

        captureIndex = (captureIndex + 1) % captureContainers.length;
        stage.removeChildAt(0);
        var captureContainer = captureContainers[captureIndex];
        stage.addChildAt(captureContainer, 0);
        captureContainer.addChild(container);

        // iterate through all the children and move them according to their velocity:
        for (var i = 0; i < l; i++) {
            var heart = container.getChildAt(i);
            if (heart.y < -50) {
                heart._x = Math.random() * w;
                heart.y = h * (1 + Math.random()) + 50;
                heart.perX = (1 + Math.random() * 2) * h;
                heart.offX = Math.random() * h;
                heart.ampX = heart.perX * 0.1 * (0.15 + Math.random());
                heart.velY = -Math.random() * 2 - 1;
                heart.scaleX = heart.scaleY = Math.random() * 2 + 1;
                heart._rotation = Math.random() * 40 - 20;
                heart.alpha = Math.random() * 0.75 + 0.05;
                heart.compositeOperation = Math.random() < 0.33 ? "lighter" : "source-over";
            }
            var int = (heart.offX + heart.y) / heart.perX * Math.PI * 2;
            heart.y += heart.velY * heart.scaleX / 2;
            heart.x = heart._x + Math.cos(int) * heart.ampX;
            heart.rotation = heart._rotation + Math.sin(int) * 30;
        }

        captureContainer.updateCache("source-over");

        // draw the updates to stage:
        stage.update(event);
    }

    init();
}

function dangleText() {
    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }


    var TWOPI = Math.PI * 2;

    function distance(x1, y1, x2, y2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    var gravity = 0.5;

    // VNode class
    var VNode = function () {
        function VNode(node) {
            _classCallCheck(this, VNode);
            this.x = node.x || 0;
            this.y = node.y || 0;
            this.oldX = this.x;
            this.oldY = this.y;
            this.w = node.w || 2;
            this.angle = node.angle || 0;
            this.gravity = node.gravity || gravity;
            this.mass = node.mass || 1.0;

            this.color = node.color;
            this.letter = node.letter;

            this.pointerMove = node.pointerMove;
            this.fixed = node.fixed;
        }
        // verlet integration
        _createClass(VNode, [{
            key: 'integrate',
            value: function integrate(pointer) {

                if (this.lock && (!this.lockX || !this.lockY)) {
                    this.lockX = this.x;
                    this.lockY = this.y;
                }

                if (
                    this.pointerMove && pointer &&
                    distance(this.x, this.y, pointer.x, pointer.y) <
                    this.w + pointer.w) {
                    this.x += (pointer.x - this.x) / (this.mass * 18);
                    this.y += (pointer.y - this.y) / (this.mass * 18);
                } else if (this.lock) {
                    this.x += (this.lockX - this.x) * this.lock;
                    this.y += (this.lockY - this.y) * this.lock;
                }


                if (!this.fixed) {
                    var x = this.x;
                    var y = this.y;
                    this.x += this.x - this.oldX;
                    this.y += this.y - this.oldY + this.gravity;
                    this.oldX = x;
                    this.oldY = y;
                }
            }
        }, {
            key: 'set',
            value: function set(


                x, y) {
                this.oldX = this.x = x;
                this.oldY = this.y = y;
            }
            // draw node
        }, {
            key: 'draw',
            value: function draw(ctx) {
                if (!this.color) {
                    return;
                }
                // ctx.globalAlpha = 0.8;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;


                ctx.beginPath();
                if (this.letter) {
                    ctx.globalAlpha = 1;
                    ctx.rotate(Math.PI / 2);

                    ctx.rect(-7, 0, 14, 1);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = 'bold 75px "Bebas Neue", monospace';
                    ctx.fillStyle = '#000';
                    ctx.fillText(this.letter, 0, this.w * .25 + 4);

                    ctx.fillStyle = this.color;
                    ctx.fillText(this.letter, 0, this.w * .25);
                } else {
                    ctx.globalAlpha = 0.2;
                    ctx.rect(-this.w, -this.w, this.w * 2, this.w * 2);
                    // ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI);

                }
                ctx.closePath();
                ctx.fill();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }]);
        return VNode;
    }();

    // constraint class
    var Constraint = function () {
        function Constraint(n0, n1, stiffness) {
            _classCallCheck(this, Constraint);
            this.n0 = n0;
            this.n1 = n1;
            this.dist = distance(n0.x, n0.y, n1.x, n1.y);
            this.stiffness = stiffness || 0.5;
            this.firstRun = true;
        }
        // solve constraint
        _createClass(Constraint, [{
            key: 'solve',
            value: function solve() {
                var dx = this.n0.x - this.n1.x;
                var dy = this.n0.y - this.n1.y;

                var newAngle = Math.atan2(dy, dx);
                this.n1.angle = newAngle;

                var currentDist = distance(this.n0.x, this.n0.y, this.n1.x, this.n1.y);
                var delta = this.stiffness * (currentDist - this.dist) / currentDist;
                dx *= delta;
                dy *= delta;

                if (this.firstRun) {
                    this.firstRun = false;
                    if (!this.n1.fixed) {
                        this.n1.x += dx;
                        this.n1.y += dy;
                    }
                    if (!this.n0.fixed) {
                        this.n0.x -= dx;
                        this.n0.y -= dy;
                    }
                    return;
                }

                var m1 = this.n0.mass + this.n1.mass;
                var m2 = this.n0.mass / m1;
                m1 = this.n1.mass / m1;

                if (!this.n1.fixed) {
                    this.n1.x += dx * m2;
                    this.n1.y += dy * m2;
                }
                if (!this.n0.fixed) {
                    this.n0.x -= dx * m1;
                    this.n0.y -= dy * m1;
                }


            }
            // draw constraint
        }, {
            key: 'draw',
            value: function draw(ctx) {
                ctx.globalAlpha = 0.9;
                ctx.beginPath();
                ctx.moveTo(this.n0.x, this.n0.y);
                ctx.lineTo(this.n1.x, this.n1.y);
                ctx.strokeStyle = "#fff";
                ctx.stroke();
            }
        }]);
        return Constraint;
    }();
    var Rope = function () {
        function Rope(rope) {
            _classCallCheck(this, Rope);
            var x =
                rope.x,
                y = rope.y,
                length = rope.length,
                points = rope.points,
                vertical = rope.vertical,
                fixedEnds = rope.fixedEnds,
                startNode = rope.startNode,
                letter = rope.letter,
                endNode = rope.endNode,
                stiffness = rope.stiffness,
                constrain = rope.constrain,
                gravity = rope.gravity,
                pointerMove = rope.pointerMove;

            this.stiffness = stiffness || 1;
            this.nodes = [];
            this.constraints = [];
            if (letter === ' ') {
                return this;
            }

            var dist = length / points;

            for (var i = 0, _last = points - 1; i < points; i++) {

                var size = letter && i === _last ? 15 : 2;
                var spacing = dist * i + size;
                var node = new VNode({
                    w: size,
                    mass: .1, //(i === last ? .5 : .1),
                    fixed: fixedEnds && (i === 0 || i === _last)
                });


                node =
                    i === 0 && startNode ||
                    i === _last && endNode ||
                    node;


                node.gravity = gravity;
                //node.pointerMove = pointerMove;

                if (i === _last && letter) {
                    node.letter = letter;
                    node.color = '#FFF';
                    node.pointerMove = true;
                }

                node.oldX = node.x = x + (!vertical ? spacing : 0);
                node.oldY = node.y = y + (vertical ? spacing : 0);

                this.nodes.push(node);

            }

            constrain ? this.makeConstraints() : null;


        }
        _createClass(Rope, [{
            key: 'makeConstraints',
            value: function makeConstraints()

            {
                for (var i = 1; i < this.nodes.length; i++) {
                    this.constraints.push(
                        new Constraint(this.nodes[i - 1], this.nodes[i], this.stiffness));

                }
            }
        }, {
            key: 'run',
            value: function run(

                pointer) {
                // integration
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;
                try {
                    for (var _iterator = this.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _n = _step.value;
                        _n.integrate(pointer);
                    }
                    // solve constraints
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                for (var i = 0; i < 5; i++) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;
                    try {
                        for (var _iterator2 = this.constraints[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var n = _step2.value;
                            n.solve();
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            }

        }, {
            key: 'draw',
            value: function draw(
                ctx) {

                var vertices = Array.from(this.constraints).reduce(function (p, c, i, a) {
                    p.push(c.n0);
                    if (i == a.length - 1) p.push(c.n1);
                    return p;
                }, []);

                var h = function h(x, y) {
                    return Math.sqrt(x * x + y * y);
                };
                var tension = 0.5;

                if (!vertices.length) return;

                var controls = vertices.map(function () {
                    return null;
                });
                for (var i = 1; i < vertices.length - 1; ++i) {
                    var previous = vertices[i - 1];
                    var current = vertices[i];
                    var next = vertices[i + 1];

                    var rdx = next.x - previous.x,
                        rdy = next.y - previous.y,
                        rd = h(rdx, rdy),
                        dx = rdx / rd,
                        dy = rdy / rd;

                    var dp = h(current.x - previous.x, current.y - previous.y),
                        dn = h(current.x - next.x, current.y - next.y);

                    var cpx = current.x - dx * dp * tension,
                        cpy = current.y - dy * dp * tension,
                        cnx = current.x + dx * dn * tension,
                        cny = current.y + dy * dn * tension;

                    controls[i] = {
                        cp: {
                            x: cpx,
                            y: cpy
                        },

                        cn: {
                            x: cnx,
                            y: cny
                        }
                    };


                }

                controls[0] = {
                    cn: {
                        x: (vertices[0].x + controls[1].cp.x) / 2,
                        y: (vertices[0].y + controls[1].cp.y) / 2
                    }
                };



                controls[vertices.length - 1] = {
                    cp: {
                        x: (vertices[vertices.length - 1].x + controls[vertices.length - 2].cn.x) / 2,
                        y: (vertices[vertices.length - 1].y + controls[vertices.length - 2].cn.y) / 2
                    }
                };

                ctx.globalAlpha = 0.9;
                ctx.beginPath();
                ctx.moveTo(vertices[0].x, vertices[0].y);
                for (var _i = 1; _i < vertices.length; ++_i) {
                    var v = vertices[_i];
                    var ca = controls[_i - 1];
                    var cb = controls[_i];

                    ctx.bezierCurveTo(
                        ca.cn.x, ca.cn.y,
                        cb.cp.x, cb.cp.y,
                        v.x, v.y);

                }
                ctx.strokeStyle = 'white';
                ctx.stroke();
                ctx.closePath();

                // draw nodes
                this.nodes.forEach(function (n) {
                    n.draw(ctx);
                });
            }
        }]);
        return Rope;
    }();


    // Pointer class
    var Pointer = function (_VNode) {
        _inherits(Pointer, _VNode);

        function Pointer(canvas) {
            _classCallCheck(this, Pointer);
            var _this = _possibleConstructorReturn(this, (Pointer.__proto__ || Object.getPrototypeOf(Pointer)).call(this, {
                x: 0,
                y: 0,
                w: 8,
                color: '#F00',
                fixed: true
            }));

            _this.elem = canvas;
            canvas.addEventListener("mousemove", function (e) {
                return _this.move(e);
            }, false);
            canvas.addEventListener("touchmove", function (e) {
                return _this.move(e);
            }, false);
            return _this;
        }
        _createClass(Pointer, [{
            key: 'move',
            value: function move(
                e) {
                var touchMode = e.targetTouches;
                var pointer = e;
                if (touchMode) {
                    e.preventDefault();
                    pointer = touchMode[0];
                }
                var rect = this.elem.getBoundingClientRect();
                var cw = this.elem.width;
                var ch = this.elem.height;

                // get the scale based on actual width;
                var sx = cw / this.elem.offsetWidth;
                var sy = ch / this.elem.offsetHeight;

                this.x = (pointer.clientX - rect.left) * sx;
                this.y = (pointer.clientY - rect.top) * sy;
            }
        }]);
        return Pointer;
    }(VNode);
    var


        Scene = function () {

            function Scene(canvas) {
                _classCallCheck(this, Scene);
                this.draw = true;
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');

                this.nodes = new Set();
                this.constraints = new Set();
                this.ropes = [];

                this.pointer = new Pointer(canvas);
                this.nodes.add(this.pointer);

                this.run = this.run.bind(this);
                this.addRope = this.addRope.bind(this);
                this.add = this.add.bind(this);
            }


            // animation loop
            _createClass(Scene, [{
                key: 'run',
                value: function run() {
                    var _this2 = this;

                    // if (!canvas.isConnected) {
                    //   return;
                    // }
                    requestAnimationFrame(this.run);
                    // clear screen
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                    this.ropes.forEach(function (rope) {
                        rope.run(_this2.pointer);
                    });


                    this.ropes.forEach(function (rope) {
                        rope.draw(_this2.ctx);
                    });

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;
                    try {
                        for (var _iterator3 = this.nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var n = _step3.value;
                            n.draw(this.ctx);
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }

                }
            }, {
                key: 'addRope',
                value: function addRope(

                    rope) {
                    this.ropes.push(rope);
                }
            }, {
                key: 'add',
                value: function add(

                    struct) {

                    // load nodes
                    for (var n in struct.nodes) {
                        this.nodes.add(struct.nodes[n]);
                    }

                    // load constraints
                    for (var i = 0; i < struct.constraints.length; i++) {
                        var c = struct.constraints[i];
                        this.constraints.add(c);
                    }
                }
            }]);
            return Scene;
        }();

    var scene = new Scene(document.querySelector('#physicstext'));

    scene.run();

    // const pointer = new Pointer(canvas);

    var phrase = ' jwhooper.net ';

    var r = new Rope({
        x: scene.canvas.width * 0.15,
        y: 40,
        length: scene.canvas.width * 0.7,
        points: phrase.length,
        vertical: false,
        dangleEnd: false,
        fixedEnds: true,
        stiffness: 1.5,
        constrain: false,
        gravity: 0.1
    });


    var center = r.nodes.length / 2;

    var ropes = r.nodes.map(function (n, i) {

        n.set(n.x, 60 + 80 * (1 - Math.abs((center - i) % center / center)));

        if (phrase[i] !== ' ') {

            //if ( i !== 0 && i !== r.nodes.length - 1 ) {
            return new Rope({
                startNode: n,
                x: n.x,
                y: n.y,
                length: 60,
                points: 4,
                letter: phrase[i],
                vertical: true,
                stiffness: 1, //2.5,,
                constrain: false,
                gravity: 0.5
            });

        }

        //}
    });

    var first = r.nodes[0];
    var last = r.nodes[r.nodes.length - 1];

    first.set(2, -2);
    last.set(scene.canvas.width - 2, -2);

    r.makeConstraints();

    ropes = ropes;
    scene.addRope(r);
    ropes.filter(function (r) {
        return r;
    }).forEach(function (r) {
        r.makeConstraints();
        scene.addRope(r);
    }); {
        "use strict";
        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }




        var TWOPI = Math.PI * 2;

        function distance(x1, y1, x2, y2) {
            var dx = x1 - x2;
            var dy = y1 - y2;
            return Math.sqrt(dx * dx + dy * dy);
        }

        var gravity = 0.5;

        // VNode class
        var VNode = function () {
            function VNode(node) {
                _classCallCheck(this, VNode);
                this.x = node.x || 0;
                this.y = node.y || 0;
                this.oldX = this.x;
                this.oldY = this.y;
                this.w = node.w || 2;
                this.angle = node.angle || 0;
                this.gravity = node.gravity || gravity;
                this.mass = node.mass || 1.0;

                this.color = node.color;
                this.letter = node.letter;

                this.pointerMove = node.pointerMove;
                this.fixed = node.fixed;
            }
            // verlet integration
            _createClass(VNode, [{
                key: 'integrate',
                value: function integrate(pointer) {

                    if (this.lock && (!this.lockX || !this.lockY)) {
                        this.lockX = this.x;
                        this.lockY = this.y;
                    }

                    if (
                        this.pointerMove && pointer &&
                        distance(this.x, this.y, pointer.x, pointer.y) <
                        this.w + pointer.w) {
                        this.x += (pointer.x - this.x) / (this.mass * 18);
                        this.y += (pointer.y - this.y) / (this.mass * 18);
                    } else if (this.lock) {
                        this.x += (this.lockX - this.x) * this.lock;
                        this.y += (this.lockY - this.y) * this.lock;
                    }


                    if (!this.fixed) {
                        var x = this.x;
                        var y = this.y;
                        this.x += this.x - this.oldX;
                        this.y += this.y - this.oldY + this.gravity;
                        this.oldX = x;
                        this.oldY = y;
                    }
                }
            }, {
                key: 'set',
                value: function set(


                    x, y) {
                    this.oldX = this.x = x;
                    this.oldY = this.y = y;
                }
                // draw node
            }, {
                key: 'draw',
                value: function draw(ctx) {
                    if (!this.color) {
                        return;
                    }
                    // ctx.globalAlpha = 0.8;
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.fillStyle = this.color;


                    ctx.beginPath();
                    if (this.letter) {
                        ctx.globalAlpha = 1;
                        ctx.rotate(Math.PI / 2);

                        ctx.rect(-7, 0, 14, 1);

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.font = 'bold 75px "Bebas Neue", monospace';
                        ctx.fillStyle = '#000';
                        ctx.fillText(this.letter, 0, this.w * .25 + 4);

                        ctx.fillStyle = this.color;
                        ctx.fillText(this.letter, 0, this.w * .25);
                    } else {
                        ctx.globalAlpha = 0.2;
                        ctx.rect(-this.w, -this.w, this.w * 2, this.w * 2);
                        // ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI);

                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
            }]);
            return VNode;
        }();

        // constraint class
        var

            Constraint = function () {
                function Constraint(n0, n1, stiffness) {
                    _classCallCheck(this, Constraint);
                    this.n0 = n0;
                    this.n1 = n1;
                    this.dist = distance(n0.x, n0.y, n1.x, n1.y);
                    this.stiffness = stiffness || 0.5;
                    this.firstRun = true;
                }
                // solve constraint
                _createClass(Constraint, [{
                    key: 'solve',
                    value: function solve() {
                        var dx = this.n0.x - this.n1.x;
                        var dy = this.n0.y - this.n1.y;

                        var newAngle = Math.atan2(dy, dx);
                        this.n1.angle = newAngle;

                        var currentDist = distance(this.n0.x, this.n0.y, this.n1.x, this.n1.y);
                        var delta = this.stiffness * (currentDist - this.dist) / currentDist;
                        dx *= delta;
                        dy *= delta;

                        if (this.firstRun) {
                            this.firstRun = false;
                            if (!this.n1.fixed) {
                                this.n1.x += dx;
                                this.n1.y += dy;
                            }
                            if (!this.n0.fixed) {
                                this.n0.x -= dx;
                                this.n0.y -= dy;
                            }
                            return;
                        }

                        var m1 = this.n0.mass + this.n1.mass;
                        var m2 = this.n0.mass / m1;
                        m1 = this.n1.mass / m1;

                        if (!this.n1.fixed) {
                            this.n1.x += dx * m2;
                            this.n1.y += dy * m2;
                        }
                        if (!this.n0.fixed) {
                            this.n0.x -= dx * m1;
                            this.n0.y -= dy * m1;
                        }


                    }
                    // draw constraint
                }, {
                    key: 'draw',
                    value: function draw(ctx) {
                        ctx.globalAlpha = 0.9;
                        ctx.beginPath();
                        ctx.moveTo(this.n0.x, this.n0.y);
                        ctx.lineTo(this.n1.x, this.n1.y);
                        ctx.strokeStyle = "#fff";
                        ctx.stroke();
                    }
                }]);
                return Constraint;
            }();
        var



            Rope = function () {
                function Rope(rope) {
                    _classCallCheck(this, Rope);
                    var x =
                        rope.x,
                        y = rope.y,
                        length = rope.length,
                        points = rope.points,
                        vertical = rope.vertical,
                        fixedEnds = rope.fixedEnds,
                        startNode = rope.startNode,
                        letter = rope.letter,
                        endNode = rope.endNode,
                        stiffness = rope.stiffness,
                        constrain = rope.constrain,
                        gravity = rope.gravity,
                        pointerMove = rope.pointerMove;

                    this.stiffness = stiffness || 1;
                    this.nodes = [];
                    this.constraints = [];
                    if (letter === ' ') {
                        return this;
                    }

                    var dist = length / points;

                    for (var i = 0, _last = points - 1; i < points; i++) {

                        var size = letter && i === _last ? 15 : 2;
                        var spacing = dist * i + size;
                        var node = new VNode({
                            w: size,
                            mass: .1, //(i === last ? .5 : .1),
                            fixed: fixedEnds && (i === 0 || i === _last)
                        });


                        node =
                            i === 0 && startNode ||
                            i === _last && endNode ||
                            node;


                        node.gravity = gravity;
                        //node.pointerMove = pointerMove;

                        if (i === _last && letter) {
                            node.letter = letter;
                            node.color = '#FFF';
                            node.pointerMove = true;
                        }

                        node.oldX = node.x = x + (!vertical ? spacing : 0);
                        node.oldY = node.y = y + (vertical ? spacing : 0);

                        this.nodes.push(node);

                    }

                    constrain ? this.makeConstraints() : null;


                }
                _createClass(Rope, [{
                    key: 'makeConstraints',
                    value: function makeConstraints()

                    {
                        for (var i = 1; i < this.nodes.length; i++) {
                            this.constraints.push(
                                new Constraint(this.nodes[i - 1], this.nodes[i], this.stiffness));

                        }
                    }
                }, {
                    key: 'run',
                    value: function run(

                        pointer) {
                        // integration
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;
                        try {
                            for (var _iterator = this.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var _n = _step.value;
                                _n.integrate(pointer);
                            }
                            // solve constraints
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        for (var i = 0; i < 5; i++) {
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;
                            try {
                                for (var _iterator2 = this.constraints[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var n = _step2.value;
                                    n.solve();
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
                        }
                    }

                }, {
                    key: 'draw',
                    value: function draw(
                        ctx) {

                        var vertices = Array.from(this.constraints).reduce(function (p, c, i, a) {
                            p.push(c.n0);
                            if (i == a.length - 1) p.push(c.n1);
                            return p;
                        }, []);

                        var h = function h(x, y) {
                            return Math.sqrt(x * x + y * y);
                        };
                        var tension = 0.5;

                        if (!vertices.length) return;

                        var controls = vertices.map(function () {
                            return null;
                        });
                        for (var i = 1; i < vertices.length - 1; ++i) {
                            var previous = vertices[i - 1];
                            var current = vertices[i];
                            var next = vertices[i + 1];

                            var rdx = next.x - previous.x,
                                rdy = next.y - previous.y,
                                rd = h(rdx, rdy),
                                dx = rdx / rd,
                                dy = rdy / rd;

                            var dp = h(current.x - previous.x, current.y - previous.y),
                                dn = h(current.x - next.x, current.y - next.y);

                            var cpx = current.x - dx * dp * tension,
                                cpy = current.y - dy * dp * tension,
                                cnx = current.x + dx * dn * tension,
                                cny = current.y + dy * dn * tension;

                            controls[i] = {
                                cp: {
                                    x: cpx,
                                    y: cpy
                                },

                                cn: {
                                    x: cnx,
                                    y: cny
                                }
                            };


                        }

                        controls[0] = {
                            cn: {
                                x: (vertices[0].x + controls[1].cp.x) / 2,
                                y: (vertices[0].y + controls[1].cp.y) / 2
                            }
                        };



                        controls[vertices.length - 1] = {
                            cp: {
                                x: (vertices[vertices.length - 1].x + controls[vertices.length - 2].cn.x) / 2,
                                y: (vertices[vertices.length - 1].y + controls[vertices.length - 2].cn.y) / 2
                            }
                        };

                        ctx.globalAlpha = 0.9;
                        ctx.beginPath();
                        ctx.moveTo(vertices[0].x, vertices[0].y);
                        for (var _i = 1; _i < vertices.length; ++_i) {
                            var v = vertices[_i];
                            var ca = controls[_i - 1];
                            var cb = controls[_i];

                            ctx.bezierCurveTo(
                                ca.cn.x, ca.cn.y,
                                cb.cp.x, cb.cp.y,
                                v.x, v.y);

                        }
                        ctx.strokeStyle = 'white';
                        ctx.stroke();
                        ctx.closePath();

                        // draw nodes
                        this.nodes.forEach(function (n) {
                            n.draw(ctx);
                        });
                    }
                }]);
                return Rope;
            }();


        // Pointer class
        var Pointer = function (_VNode) {
            _inherits(Pointer, _VNode);

            function Pointer(canvas) {
                _classCallCheck(this, Pointer);
                var _this = _possibleConstructorReturn(this, (Pointer.__proto__ || Object.getPrototypeOf(Pointer)).call(this, {
                    x: 0,
                    y: 0,
                    w: 8,
                    color: '#F00',
                    fixed: true
                }));

                _this.elem = canvas;
                canvas.addEventListener("mousemove", function (e) {
                    return _this.move(e);
                }, false);
                canvas.addEventListener("touchmove", function (e) {
                    return _this.move(e);
                }, false);
                return _this;
            }
            _createClass(Pointer, [{
                key: 'move',
                value: function move(
                    e) {
                    var touchMode = e.targetTouches;
                    var pointer = e;
                    if (touchMode) {
                        e.preventDefault();
                        pointer = touchMode[0];
                    }
                    var rect = this.elem.getBoundingClientRect();
                    var cw = this.elem.width;
                    var ch = this.elem.height;

                    // get the scale based on actual width;
                    var sx = cw / this.elem.offsetWidth;
                    var sy = ch / this.elem.offsetHeight;

                    this.x = (pointer.clientX - rect.left) * sx;
                    this.y = (pointer.clientY - rect.top) * sy;
                }
            }]);
            return Pointer;
        }(VNode);
        var


            Scene = function () {

                function Scene(canvas) {
                    _classCallCheck(this, Scene);
                    this.draw = true;
                    this.canvas = canvas;
                    this.ctx = canvas.getContext('2d');

                    this.nodes = new Set();
                    this.constraints = new Set();
                    this.ropes = [];

                    this.pointer = new Pointer(canvas);
                    this.nodes.add(this.pointer);

                    this.run = this.run.bind(this);
                    this.addRope = this.addRope.bind(this);
                    this.add = this.add.bind(this);
                }

                // animation loop
                _createClass(Scene, [{
                    key: 'run',
                    value: function run() {
                        var _this2 = this;
                        requestAnimationFrame(this.run);
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                        this.ropes.forEach(function (rope) {
                            rope.run(_this2.pointer);
                        });


                        this.ropes.forEach(function (rope) {
                            rope.draw(_this2.ctx);
                        });
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;
                        try {
                            for (var _iterator3 = this.nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var n = _step3.value;
                                n.draw(this.ctx);
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }

                    }
                }, {
                    key: 'addRope',
                    value: function addRope(

                        rope) {
                        this.ropes.push(rope);
                    }
                }, {
                    key: 'add',
                    value: function add(

                        struct) {

                        // load nodes
                        for (var n in struct.nodes) {
                            this.nodes.add(struct.nodes[n]);
                        }

                        // load constraints
                        for (var i = 0; i < struct.constraints.length; i++) {
                            var c = struct.constraints[i];
                            this.constraints.add(c);
                        }
                    }
                }]);
                return Scene;
            }();





        var scene = new Scene(document.querySelector('#physicstext'));

        scene.run();

        // const pointer = new Pointer(canvas);

        var phrase = ' jwhooper.net ';

        var r = new Rope({
            x: scene.canvas.width * 0.15,
            y: 40,
            length: scene.canvas.width * 0.7,
            points: phrase.length,
            vertical: false,
            dangleEnd: false,
            fixedEnds: true,
            stiffness: 1.5,
            constrain: false,
            gravity: 0.1
        });


        var center = r.nodes.length / 2;

        var ropes = r.nodes.map(function (n, i) {

            n.set(n.x, 60 + 80 * (1 - Math.abs((center - i) % center / center)));

            if (phrase[i] !== ' ') {

                //if ( i !== 0 && i !== r.nodes.length - 1 ) {
                return new Rope({
                    startNode: n,
                    x: n.x,
                    y: n.y,
                    length: 60,
                    points: 4,
                    letter: phrase[i],
                    vertical: true,
                    stiffness: 1, //2.5,,
                    constrain: false,
                    gravity: 0.5
                });

            }

            //}
        });

        var first = r.nodes[0];
        var last = r.nodes[r.nodes.length - 1];

        first.set(2, -2);
        last.set(scene.canvas.width - 2, -2);

        r.makeConstraints();

        ropes = ropes;
        scene.addRope(r);
        ropes.filter(function (r) {
            return r;
        }).forEach(function (r) {
            r.makeConstraints();
            scene.addRope(r);
        });
    }
}

function doButterflies() {
    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var debounce = function debounce(callback, duration) {
        var timer;
        return function (event) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback(event);
            }, duration);
        };
    };

    var SIZE = 280;
    var

        Butterfly = function () {
            function Butterfly(i, texture) {
                _classCallCheck(this, Butterfly);
                this.uniforms = {
                    index: {
                        type: 'f',
                        value: i
                    },

                    time: {
                        type: 'f',
                        value: 0
                    },

                    size: {
                        type: 'f',
                        value: SIZE
                    },

                    texture: {
                        type: 't',
                        value: texture
                    }
                };


                this.physicsRenderer = null;
                this.obj = this.createObj();
            }
            _createClass(Butterfly, [{
                key: 'createObj',
                value: function createObj() {
                    var geometry = new THREE.PlaneBufferGeometry(SIZE, SIZE / 2, 24, 12);
                    var mesh = new THREE.Mesh(
                        geometry,
                        new THREE.RawShaderMaterial({
                            uniforms: this.uniforms,
                            vertexShader: 'attribute vec3 position;\nattribute vec2 uv;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float index;\nuniform float time;\nuniform float size;\n\nvarying vec3 vPosition;\nvarying vec2 vUv;\n\nvoid main() {\n  float flapTime = radians(sin(time * 6.0 - length(position.xy) / size * 2.6 + index * 2.0) * 45.0 + 30.0);\n  float hovering = cos(time * 2.0 + index * 3.0) * size / 16.0;\n  vec3 updatePosition = vec3(\n    cos(flapTime) * position.x,\n    position.y + hovering,\n    sin(flapTime) * abs(position.x) + hovering\n  );\n\n  vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);\n\n  vPosition = position;\n  vUv = uv;\n\n  gl_Position = projectionMatrix * mvPosition;\n}\n',
                            fragmentShader: 'precision highp float;\n\nuniform float index;\nuniform float time;\nuniform float size;\nuniform sampler2D texture;\n\nvarying vec3 vPosition;\nvarying vec2 vUv;\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise3(vec3 v)\n  {\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n  }\n\nvec3 convertHsvToRgb(vec3 c) {\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvoid main() {\n  vec4 texColor = texture2D(texture, vUv);\n\n  float noise = snoise3(vPosition / vec3(size * 0.25) + vec3(0.0, 0.0, time));\n  vec3 hsv = vec3(1.0 + noise * 0.2 + index * 0.7, 0.4, 1.0);\n  vec3 rgb = convertHsvToRgb(hsv);\n\n  gl_FragColor = vec4(rgb, 1.0) * texColor;\n}',
                            depthWrite: false,
                            side: THREE.DoubleSide,
                            transparent: true
                        }));
                    mesh.rotation.set(-45 * Math.PI / 180, 0, 0);
                    return mesh;
                }
            }, {
                key: 'render',
                value: function render(
                    renderer, time) {
                    this.uniforms.time.value += time;
                    this.obj.position.z = this.obj.position.z > -900 ? this.obj.position.z - 4 : 900;
                }
            }]);
            return Butterfly;
        }();


    var resolution = {
        x: 0,
        y: 0
    };

    var canvas = document.getElementById('canvas-webgl');
    var renderer = new THREE.WebGLRenderer({
        antialias: false,
        canvas: canvas
    });

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10000);
    var clock = new THREE.Clock();
    var loader = new THREE.TextureLoader();

    var vectorTouchStart = new THREE.Vector2();
    var vectorTouchMove = new THREE.Vector2();
    var vectorTouchEnd = new THREE.Vector2();

    var CAMERA_SIZE_X = 640;
    var CAMERA_SIZE_Y = 480;

    var BUTTERFLY_NUM = 7;
    var butterflies = [];

    var resizeCamera = function resizeCamera() {
        var x = Math.min(resolution.x / resolution.y / (CAMERA_SIZE_X / CAMERA_SIZE_Y), 1.0) * CAMERA_SIZE_X;
        var y = Math.min(resolution.y / resolution.x / (CAMERA_SIZE_Y / CAMERA_SIZE_X), 1.0) * CAMERA_SIZE_Y;
        camera.left = x * -0.5;
        camera.right = x * 0.5;
        camera.top = y * 0.5;
        camera.bottom = y * -0.5;
        camera.updateProjectionMatrix();
    };
    var resizeWindow = function resizeWindow() {
        resolution.x = window.innerWidth;
        resolution.y = window.innerHeight;
        canvas.width = resolution.x;
        canvas.height = resolution.y;
        resizeCamera();
        renderer.setSize(resolution.x, resolution.y);
    };
    var render = function render() {
        var time = clock.getDelta();
        for (var i = 0; i < butterflies.length; i++) {
            butterflies[i].render(renderer, time);
        }
        renderer.render(scene, camera);
    };
    var renderLoop = function renderLoop() {
        render();
        requestAnimationFrame(renderLoop);
    };
    var on = function on() {
        window.addEventListener('resize', debounce(resizeWindow), 1000);
    };

    var init = function init() {
        resizeWindow();
        on();

        renderer.setClearColor(0xeeeeee, 1.0);
        camera.position.set(250, 500, 1000);
        camera.lookAt(new THREE.Vector3());

        loader.crossOrigin = 'anonymous';
        loader.load('http://ykob.github.io/sketch-threejs/img/sketch/butterfly/tex.png', function (texture) {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;

            for (var i = 0; i < BUTTERFLY_NUM; i++) {
                butterflies[i] = new Butterfly(i, texture);
                butterflies[i].obj.position.set(((i + 1) % 3 - 1) * i * 50, 0, 1800 / BUTTERFLY_NUM * i);
                scene.add(butterflies[i].obj);
            }
            renderLoop();
        });
    };
    init();
}
function doFlowers(){
    var c = document.getElementById("flowers");
    var ctx = c.getContext("2d");
    var cw = c.width = window.innerWidth;
    var ch = c.height = window.innerHeight;
    var cX = cw / 2,
      cY = ch / 2;
    var rad = Math.PI / 180;
    var howMany = 100;
    // size of the tangent
    var t = 1 / 5;
    
    ctx.strokeStyle = "white";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "#333";
    ctx.globalAlpha = .85;
    
    var colors = ["#930c37", "#ea767a", "#ee6133", "#ecac43", "#fb9983", "#f9bc9f", "#f8ed38", "#a8e3f9", "#d1f2fd", "#ecd5f5", "#fee4fd", "#8520b4", "#FA2E59", "#FF703F", "#FF703F", "#F7BC05", "#ECF6BB", "#76BCAD"];
    var flowers = [];
    for (var hm = 0; hm < howMany; hm++) {
      flowers[hm] = {}
      flowers[hm].cx = ~~(Math.random() * cw) + 1;
      flowers[hm].cy = ~~(Math.random() * ch) + 1;
      flowers[hm].R = randomIntFromInterval(20, 50);
      flowers[hm].Ri = randomIntFromInterval(5, 7) / 10;
      flowers[hm].k = randomIntFromInterval(5, 10) / 10;
      flowers[hm].ki = randomIntFromInterval(2, 7) / 100;
      flowers[hm].K = randomIntFromInterval(5, 16) / 10;
      flowers[hm].fs = ~~(Math.random() * colors.length) + 1;
      flowers[hm].cs = ~~(Math.random() * colors.length) + 1;
      flowers[hm].nP = randomIntFromInterval(4, 10);
      flowers[hm].spacing = randomIntFromInterval(4, 10);
    
    }
    
    function buildRy(R, k, cx, cy, nP, spacing) {
      var r = R * k;
      var A = 360 / nP; //nP num petals
      var petals = [];
      for (var i = 0; i < nP; i++) {
        var ry = [];
    
        ry[ry.length] = {
          x: cx,
          y: cy
        }
    
        var a1 = i * A + spacing;
        var x1 = ~~(cx + R * Math.cos(a1 * rad));
        var y1 = ~~(cy + R * Math.sin(a1 * rad));
    
        ry[ry.length] = {
          x: x1,
          y: y1,
          a: a1
        }
    
        var a2 = i * A + A / 2;
        var x2 = ~~(cx + r * Math.cos(a2 * rad));
        var y2 = ~~(cy + r * Math.sin(a2 * rad));
    
        ry[ry.length] = {
          x: x2,
          y: y2,
          a: a2
        }
    
        var a3 = i * A + A - spacing
        var x3 = ~~(cx + R * Math.cos(a3 * rad));
        var y3 = ~~(cy + R * Math.sin(a3 * rad));
    
        ry[ry.length] = {
          x: x3,
          y: y3,
          a: a3
        }
    
        ry[ry.length] = {
          x: cx,
          y: cy
        }
    
        petals[i] = ry;
    
      }
      return petals
    }
    
    function update() {
      ctx.clearRect(0, 0, cw, ch);
    
      for (var f = 0; f < flowers.length; f++) {
    
        if (flowers[f].k < flowers[f].K) {
          flowers[f].R += flowers[f].Ri;
          flowers[f].k += flowers[f].ki;
        }
        var R = flowers[f].R;
        var Ri = flowers[f].Ri;
        var k = flowers[f].k;
        var ki = flowers[f].ki;
        var K = flowers[f].K;
        var cx = flowers[f].cx;
        var cy = flowers[f].cy;
        var fs = colors[flowers[f].fs];
        var cs = colors[flowers[f].cs];
        var nP = flowers[f].nP;
        var spacing = flowers[f].spacing;
    
        for (var petal = 0; petal < petals.length; petal++) { //console.log(petals[petal])
          petals = buildRy(R, k, cx, cy, nP, spacing);
          ctx.fillStyle = fs;
          drawCurve(petals[petal]);
        }
        drawCenter(k, cx, cy, cs);
      }
    
      requestId = window.requestAnimationFrame(update);
    }
    
    function drawCenter(k, cx, cy, cs) {
      ctx.beginPath();
      ctx.fillStyle = cs;
      ctx.arc(cx, cy, k * 10, 0, 2 * Math.PI)
      ctx.fill();
    }
    
    function drawCurve(p) {
    
      var pc = controlPoints(p); // the control points array
    
      ctx.beginPath();
      ctx.moveTo(p[0].x, p[0].y);
      // the first & the last curve are quadratic Bezier
      // because I'm using push(), pc[i][1] comes before pc[i][0]
      ctx.quadraticCurveTo(pc[1][1].x, pc[1][1].y, p[1].x, p[1].y);
    
      if (p.length > 2) {
        // central curves are cubic Bezier
        for (var i = 1; i < p.length - 2; i++) {
          ctx.bezierCurveTo(pc[i][0].x, pc[i][0].y, pc[i + 1][1].x, pc[i + 1][1].y, p[i + 1].x, p[i + 1].y);
        }
        // the first & the last curve are quadratic Bezier
        var n = p.length - 1;
        ctx.quadraticCurveTo(pc[n - 1][0].x, pc[n - 1][0].y, p[n].x, p[n].y);
      }
      ctx.fill();
    }
    
    function controlPoints(p) {
      // given the points array p calculate the control points
      var pc = [];
      for (var i = 1; i < p.length - 1; i++) {
        var dx = p[i - 1].x - p[i + 1].x; // difference x
        var dy = p[i - 1].y - p[i + 1].y; // difference y
        // the first control point
        var x1 = p[i].x - dx * t;
        var y1 = p[i].y - dy * t;
        var o1 = {
          x: x1,
          y: y1
        };
    
        // the second control point
        var x2 = p[i].x + dx * t;
        var y2 = p[i].y + dy * t;
        var o2 = {
          x: x2,
          y: y2
        };
    
        // building the control points array
        pc[i] = [];
        pc[i].push(o1);
        pc[i].push(o2);
      }
      return pc;
    }
    
    function randomIntFromInterval(mn, mx) {
      return ~~(Math.random() * (mx - mn + 1) + mn);
    }
    
    for (var f = 0; f < flowers.length; f++) {
      var R = flowers[f].R;
      var Ri = flowers[f].Ri;
      var k = flowers[f].k;
      var ki = flowers[f].ki;
      var K = flowers[f].K;
      var cx = flowers[f].cx;
      var cy = flowers[f].cy;
      var fs = colors[flowers[f].fs];
      var cs = colors[flowers[f].cs];
      var nP = flowers[f].nP;
      var spacing = flowers[f].spacing;
      var petals = buildRy(R, k, cx, cy, nP, spacing);
      ctx.fillStyle = colors[flowers[f].fs];
      for (var i = 0; i < petals.length; i++) {
        drawCurve(petals[i]);
      }
    }
    requestId = window.requestAnimationFrame(update);
    
    window.setTimeout(function() {
      if (requestId) {
        window.cancelAnimationFrame(requestId)
      };
    }, 6000)
}