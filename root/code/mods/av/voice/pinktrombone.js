
const log = (...args)=>{console.log(...args)}
! function(t) {
	var e = {};

	function n(i) {
		if (e[i]) return e[i].exports;
		var o = e[i] = {
			i: i,
			l: !1,
			exports: {}
		};
		return t[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports
	}
	n.m = t, n.c = e, n.d = function(t, e, i) {
		n.o(t, e) || Object.defineProperty(t, e, {
			enumerable: !0,
			get: i
		})
	}, n.r = function(t) {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
			value: "Module"
		}), Object.defineProperty(t, "__esModule", {
			value: !0
		})
	}, n.t = function(t, e) {
		if (1 & e && (t = n(t)), 8 & e) return t;
		if (4 & e && "object" == typeof t && t && t.__esModule) return t;
		var i = Object.create(null);
		if (n.r(i), Object.defineProperty(i, "default", {
				enumerable: !0,
				value: t
			}), 2 & e && "string" != typeof t)
			for (var o in t) n.d(i, o, function(e) {
				return t[e]
			}.bind(null, o));
		return i
	}, n.n = function(t) {
		var e = t && t.__esModule ? function() {
			return t.default
		} : function() {
			return t
		};
		return n.d(e, "a", e), e
	}, n.o = function(t, e) {
		return Object.prototype.hasOwnProperty.call(t, e)
	}, n.p = "", n(n.s = 0)
}([function(t, e, n) {
	"use strict";
	n.r(e), Math.clamp = function(t, e, n) {
		return t <= e ? e : t < n ? t : n
	}, Math.interpolate = function(t, e, n) {
		return e * (1 - (t = Math.clamp(t, 0, 1))) + n * t
	}, window.AudioContext = window.AudioContext || window.webkitAudioContext, null == window.AudioContext.prototype.createConstantSource && (window.AudioContext.prototype.createConstantSource = function() {
		var t = this.createScriptProcessor(Math.pow(2, 14), 1, 1);
		return t._isRunning = !1, t._audioContext = this, t.offset = t, t.__interpolationMode = "none", Object.defineProperty(t, "_interpolationMode", {
			get: function() {
				return this.__interpolationMode
			},
			set: function(t) {
				["none", "linear"].includes(t) && (this.__interpolationMode = t)
			}
		}), t._startValue, t._targetValue, t._startTime, t._targetTime, t._duration, t.minValue = -3.402820018375656e38, t.maxValue = 3.402820018375656e38, t._clamp = function(t) {
			return Math.clamp(t, this.minValue, this.maxValue)
		}, t._update = function() {
			if ("none" !== this._interpolationMode) {
				var t = (this._audioContext.currentTime - this._startTime) / this._duration,
					e = t;
				switch (this._interpolationMode) {
					case "linear":
						e = t
				}
				e = Math.clamp(e, 0, 1), this._value = this._clamp(Math.interpolate(e, this._startValue, this._targetValue)), e >= 1 && (this._interpolationMode = "none")
			}
		}, t._value = 1, Object.defineProperty(t, "value", {
			get: function() {
				return this._value
			},
			set: function(t) {
				this._interpolationMode = "none", this._value = Math.clamp(t, this.minValue, this.maxValue)
			}
		}), t.linearRampToValueAtTime = function(t, e) {
			return this.value = t, this
		}, t.setValueAtTime = function(t, e) {
			return this.value = t, this
		}, t.exponentialRampToValueAtTime = function(t, e) {
			return this.value = t, this
		}, t.setTargetAtTime = function(t, e, n) {
			return this.value = t, this
		}, t.setValueAtTime = function(t, e) {
			return this.value = t, this
		}, t.setValueCurveAtTime = function(t, e, n) {
			return this.value = t, this
		}, t.onaudioprocess = function(t) {
			var e = t.inputBuffer.getChannelData(0),
				n = t.outputBuffer.getChannelData(0);
			if (this._isRunning)
				for (var i = 0; i < n.length; i++) this._update(), n[i] = e[i] + this.value
		}, t.start = function() {
			this._isRunning = !0
		}, t.stop = function() {
			this._isRunning = !1
		}, t
	}), window.AudioContext = window.AudioContext || window.webkitAudioContext, window.AudioContext.prototype.createNoise = function() {
		for (var t = this.createBufferSource(), e = this.createBuffer(1, 1 * this.sampleRate, this.sampleRate), n = e.getChannelData(0), i = 0; i < n.length; i++) n[i] = 2 * Math.random(0) - 1;
		return t.buffer = e, t.loop = !0, t.start(), t
	};
	var i = [{
		name: "noise",
		defaultValue: 0,
		minValue: -1,
		maxValue: 1
	}, {
		name: "frequency",
		defaultValue: 140,
		minValue: 0
	}, {
		name: "tenseness",
		defaultValue: .6,
		minValue: 0,
		maxValue: 1
	}, {
		name: "intensity",
		defaultValue: 1,
		minValue: 0,
		maxValue: 1
	}, {
		name: "loudness",
		defaultValue: 1,
		minValue: 0,
		maxValue: 1
	}, {
		name: "tongueIndex",
		defaultValue: 12.9
	}, {
		name: "tongueDiameter",
		defaultValue: 2.43
	}, {
		name: "vibratoWobble",
		defaultValue: 1,
		minValue: 0,
		maxValue: 1
	}, {
		name: "vibratoFrequency",
		defaultValue: 6,
		minValue: 0
	}, {
		name: "vibratoGain",
		defaultValue: .005,
		minValue: 0
	}];
	i.numberOfConstrictions = 4;
	for (var o = 0; o < i.numberOfConstrictions; o++) {
		var r = [{
			name: "constriction" + o + "index",
			defaultValue: 0,
			automationRate: "k-rate"
		}, {
			name: "constriction" + o + "diameter",
			defaultValue: 0,
			automationRate: "k-rate"
		}];
		i.push.apply(i, r)
	}
	var s = i;

	function a(t, e, n) {
		return (a = function() {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0
			} catch (t) {
				return !1
			}
		}() ? Reflect.construct : function(t, e, n) {
			var i = [null];
			i.push.apply(i, e);
			var o = new(Function.bind.apply(t, i));
			return n && c(o, n.prototype), o
		}).apply(null, arguments)
	}

	function c(t, e) {
		return (c = Object.setPrototypeOf || function(t, e) {
			return t.__proto__ = e, t
		})(t, e)
	}

	function h(t) {
		return function(t) {
			if (Array.isArray(t)) {
				for (var e = 0, n = new Array(t.length); e < t.length; e++) n[e] = t[e];
				return n
			}
		}(t) || function(t) {
			if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
		}(t) || function() {
			throw new TypeError("Invalid attempt to spread non-iterable instance")
		}()
	}

	function l() {
		var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
			e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
			n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
		this.x = t, this.y = e, this.z = n
	}

	function u() {
		this.grad3 = [
			[1, 1, 0],
			[-1, 1, 0],
			[1, -1, 0],
			[-1, -1, 0],
			[1, 0, 1],
			[-1, 0, 1],
			[1, 0, -1],
			[-1, 0, -1],
			[0, 1, 1],
			[0, -1, 1],
			[0, 1, -1],
			[0, -1, -1]
		].map(function(t) {
			return a(l, h(t))
		}), this.p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180], this.perm = new Array(Math.pow(2, 9)), this.gradP = new Array(Math.pow(2, 9)), this.F2 = .5 * (Math.sqrt(3) - 1), this.G2 = (3 - Math.sqrt(3)) / 6, this.F3 = 1 / 3, this.G3 = 1 / 6, this.seed(Date.now())
	}
	Object.defineProperties(l.prototype, {
		dot2: {
			value: function(t, e) {
				return this.x * t + this.y * e
			}
		},
		dot3: {
			value: function(t, e, n) {
				return this.dot2(t, e) + this.z * n
			}
		}
	}), Object.defineProperties(u.prototype, {
		seed: {
			value: function(t) {
				t > 0 && t < 1 && (t *= Math.pow(2, 16)), (t = Math.floor(t)) < Math.pow(2, 8) && (t |= t << Math.pow(2, 3));
				for (var e = 0; e < Math.pow(2, 8); e++) {
					var n = 1 & e ? 0 : Math.pow(2, 3),
						i = this.p[e] ^ t >> n & Math.pow(2, 8) - 1;
					this.perm[e] = this.perm[e + Math.pow(2, 8)] = i, this.gradP[e] = this.gradP[e + Math.pow(2, 8)] = this.grad3[i % this.grad3.length]
				}
			}
		},
		simplex2: {
			value: function(t, e) {
				var n = (t + e) * this.F2,
					i = Math.floor(t + n),
					o = Math.floor(e + n),
					r = (i + o) * this.G2,
					s = t - i + r,
					a = e - o + r,
					c = s > a ? 1 : 0,
					h = 1 - c,
					l = s - c + this.G2,
					u = a - h + this.G2,
					f = s - 1 + 2 * this.G2,
					d = a - 1 + 2 * this.G2;
				i &= Math.pow(2, 8) - 1, o &= Math.pow(2, 8) - 1;
				var p = this.gradP[i + this.perm[o]],
					_ = this.gradP[i + c + this.perm[o + h]],
					v = this.gradP[i + 1 + this.perm[o + 1]],
					m = .5 - Math.pow(s, 2) - Math.pow(a, 2),
					g = m < 0 ? 0 : Math.pow(m, 4) * p.dot2(s, a),
					y = .5 - Math.pow(l, 2) - Math.pow(u, 2),
					b = y < 0 ? 0 : Math.pow(y, 4) * _.dot2(l, u),
					x = .5 - Math.pow(f, 2) - Math.pow(d, 2);
				return 70 * (g + b + (x < 0 ? 0 : Math.pow(x, 4) * v.dot2(f, d)))
			}
		},
		simplex1: {
			value: function(t) {
				return this.simplex2(1.2 * t, -.7 * t)
			}
		}
	});
	var f = u;

	function d(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}
	Math.clamp = function(t, e, n) {
		return t <= e ? e : t < n ? t : n
	};
	var p = function() {
		function t() {
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this.noise = new f, this.coefficients = {
				alpha: 0,
				Delta: 0,
				E0: 0,
				epsilon: 0,
				omega: 0,
				shift: 0,
				Te: 0
			}, this.startSeconds = 0
		}
		var e, n, i;
		return e = t, (n = [{
			key: "process",
			value: function(t, e, n, i) {
				var o = t.intensity,
					r = t.loudness,
					s = 0;
				if (s += t.vibratoGain * Math.sin(2 * Math.PI * i * t.vibratoFrequency), s += .02 * this.noise.simplex1(4.07 * i), s += .04 * this.noise.simplex1(2.15 * i), t.vibratoWobble > 0) {
					var a = 0;
					a += .2 * this.noise.simplex1(.98 * i), s += (a += .4 * this.noise.simplex1(.5 * i)) * t.vibratoWobble
				}
				var c = t.frequency;
				c *= 1 + s;
				var h = t.tenseness;
				h += .1 * this.noise.simplex1(.46 * i), h += .05 * this.noise.simplex1(.36 * i), h += (3 - h) * (1 - o);
				var l = 1 / c,
					u = i - this.startSeconds,
					f = u / l;
				f >= 1 && (this.startSeconds = i + u % l, f = this.startSeconds / l, this._updateCoefficients(h));
				var d = 0,
					p = this._getNoiseModulator(f);
				p += 3 * (1 - h * o), t.noiseModulator = p;
				var _ = t.noise;
				_ *= p, _ *= o, _ *= o, _ *= 1 - Math.sqrt(Math.max(h, 0)), _ *= .02 * this.noise.simplex1(1.99 * i) + .2;
				var v = this._getNormalizedWaveform(f);
				return v *= o, d = _ + (v *= r), d *= o
			}
		}, {
			key: "update",
			value: function() {}
		}, {
			key: "_updateCoefficients",
			value: function() {
				var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
					e = {};
				e.d = Math.clamp(3 * (1 - t), .5, 2.7), e.a = .048 * e.d - .01, e.k = .224 + .118 * e.d, e.g = e.k / 4 * (.5 + 1.2 * e.k) / (.11 * e.d - e.a * (.5 + 1.2 * e.k));
				var n = {};
				n.a = e.a, n.p = 1 / (2 * e.g), n.e = n.p + n.p * e.k, this.coefficients.epsilon = 1 / n.a, this.coefficients.shift = Math.exp(-this.coefficients.epsilon * (1 - n.e)), this.coefficients.Delta = 1 - this.coefficients.shift;
				var i = {};
				i.RHS = (1 / this.coefficients.epsilon * (this.coefficients.shift - 1) + (1 - n.e) * this.coefficients.shift) / this.coefficients.Delta, i.total = {}, i.total.lower = -(n.e - n.p) / 2 + i.RHS, i.total.upper = -i.total.lower, this.coefficients.omega = Math.PI / n.p;
				var o = Math.sin(this.coefficients.omega * n.e),
					r = -Math.PI * o * i.total.upper / (2 * n.p),
					s = Math.log(r);
				this.coefficients.alpha = s / (n.p / 2 - n.e), this.coefficients.E0 = -1 / (o * Math.exp(this.coefficients.alpha * n.e)), this.coefficients.Te = n.e
			}
		}, {
			key: "_getNormalizedWaveform",
			value: function(t) {
				return t > this.coefficients.Te ? (-Math.exp(-this.coefficients.epsilon * (t - this.coefficients.Te)) + this.coefficients.shift) / this.coefficients.Delta : this.coefficients.E0 * Math.exp(this.coefficients.alpha * t) * Math.sin(this.coefficients.omega * t)
			}
		}, {
			key: "_getNoiseModulator",
			value: function(t) {
				var e = 2 * Math.PI * t,
					n = Math.sin(e);
				return .2 * Math.max(0, n) + .1
			}
		}]) && d(e.prototype, n), i && d(e, i), t
	}();
	var _ = function t(e) {
		! function(t, e) {
			if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
		}(this, t), this.length = Math.floor(28 * e.length / 44), this.start = e.length - this.length + 1, this.fade = 1, this.offset = .8, this.left = new Float64Array(this.length), this.left.junction = new Float64Array(this.length + 1), this.right = new Float64Array(this.length), this.right.junction = new Float64Array(this.length + 1), this.reflection = new Float64Array(this.length + 1), this.reflection.value = 0, this.reflection.new = 0, this.diameter = new Float64Array(this.length), this.amplitude = new Float64Array(this.length), this.amplitude.max = new Float64Array(this.length);
		for (var n = 0; n < this.length; n++) {
			var i = n / this.length,
				o = i < .5 ? .4 + 2 * i * 1.6 : .5 + 1.5 * (2 - 2 * i);
			this.diameter[n] = Math.min(o, 1.9)
		}
		for (var r = 0; r < this.length; r++) this.amplitude[r] = Math.pow(this.diameter[r], 2), r > 0 && (this.reflection[r] = (this.amplitude[r - 1] - this.amplitude[r]) / (this.amplitude[r - 1] + this.amplitude[r]));
		this.diameter[0] = e.velum.target
	};

	function v(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}
	var m = function() {
		function t(e, n) {
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this.position = e, this.startTime = n, this.timeAlive = 0, this.lifetime = .2, this.strength = .3, this.exponent = 200
		}
		var e, n, i;
		return e = t, (n = [{
			key: "update",
			value: function(t) {
				this.timeAlive = t - this.startTime
			}
		}, {
			key: "amplitude",
			get: function() {
				return this.strength * Math.pow(-2, this.timeAlive * this.exponent)
			}
		}, {
			key: "isAlive",
			get: function() {
				return this.timeAlive < this.lifetime
			}
		}]) && v(e.prototype, n), i && v(e, i), t
	}();

	function g(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}
	Math.interpolate = function(t, e, n) {
		return e * (1 - t) + n * t
	}, Math.clamp = function(t, e, n) {
		return t <= e ? e : t < n ? t : n
	};
	var y = function() {
		function t() {
			var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 44;
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this.length = e, this.blade = {
				start: Math.floor(10 * this.length / 44)
			}, this.tip = {
				start: Math.floor(32 * this.length / 44)
			}, this.lip = {
				start: Math.floor(39 * this.length / 44),
				reflection: -.85
			}, this.glottis = {
				reflection: .75
			}, this.velum = {
				target: .01
			}, this.grid = {
				offset: 1.7
			}, this.right = new Float64Array(this.length), this.right.junction = new Float64Array(this.length + 1), this.right.reflection = {
				value: 0,
				new: 0
			}, this.left = new Float64Array(this.length), this.left.junction = new Float64Array(this.length + 1), this.left.reflection = {
				value: 0,
				new: 0
			}, this.reflection = new Float64Array(this.length + 1), this.reflection.new = new Float64Array(this.length + 1), this.amplitude = new Float64Array(this.length), this.amplitude.max = new Float64Array(this.length), this.diameter = new Float64Array(this.length), this.diameter.rest = new Float64Array(this.length), this.tongue = {
				_diameter: 2.43,
				_index: 12.9,
				range: {
					diameter: {
						minValue: 2.05,
						maxValue: 3.5,
						get range() {
							return this.maxValue - this.minValue
						},
						get center() {
							return (this.maxValue + this.minValue) / 2
						},
						interpolation: function(t) {
							var e = (t - this.minValue) / this.range;
							return Math.clamp(e, 0, 1)
						}
					},
					index: {
						minValue: this.blade.start + 2,
						maxValue: this.tip.start - 3,
						get range() {
							return this.maxValue - this.minValue
						},
						get center() {
							return (this.maxValue + this.minValue) / 2
						},
						centerOffset: function(t) {
							return t * this.range / 2
						}
					}
				},
				get diameter() {
					return this._diameter
				},
				set diameter(t) {
					this._diameter = Math.clamp(t, this.range.diameter.minValue, this.range.diameter.maxValue)
				},
				get index() {
					return this._index
				},
				set index(t) {
					var e = 1 - this.range.diameter.interpolation(this.diameter),
						n = Math.pow(e, .58) - .2 * (Math.pow(e, 2) - e),
						i = this.range.index.centerOffset(n);
					this._index = Math.clamp(t, this.range.index.center - i, this.range.index.center + i)
				}
			}, this.nose = new _(this), this.transients = [], this.transients.obstruction = {
				last: -1,
				new: -1
			}, this.previousConstrictions = [], this.previousConstrictions.tongue = {};
			for (var n = 0; n < this.length; n++) {
				var i = 0;
				i = n < 7 * this.length / 44 - .5 ? .6 : n < 12 * this.length / 44 ? 1.1 : 1.5, this.diameter[n] = i, this.diameter.rest[n] = i
			}
			this._updateReflection()
		}
		var e, n, i;
		return e = t, (n = [{
			key: "process",
			value: function(t, e, n, i) {
				this.tongue.diameter = t.tongueDiameter, this.tongue.index = t.tongueIndex, this._processTransients(i), this._processConstrictions(this.previousConstrictions, t);
				var o = e / n,
					r = Math.random() < .1,
					s = 0;
				return s += this._processLips(t, o, r), s += this._processNose(t, o, r), isNaN(s) && this.reset(), s
			}
		}, {
			key: "_processTransients",
			value: function(t) {
				for (var e = this.transients.length - 1; e >= 0; e--) {
					var n = this.transients[e];
					this.left[n.position] += n.amplitude, n.update(t), n.isAlive || this.transients.splice(e, 1)
				}
			}
		}, {
			key: "_processConstrictions",
			value: function(t, e) {
				for (var n = 0; n < t.length; n++) {
					var i = t[n];
					if (i.index >= 2 && i.index <= this.length && i.diameter > 0) {
						var o = e.glottis;
						o *= .66 * e.noiseModulator, o *= Math.clamp(8 * (.7 - i.diameter), 0, 1) * Math.clamp(30 * (i.diameter - .3), 0, 1) / 2;
						var r = Math.floor(i.index),
							s = o * (i.index - r),
							a = r + 1,
							c = o * (a - i.index);
						this.right[r + 1] += s, this.right[a + 1] += c, this.left[r + 1] += s, this.left[a + 1] += c
					}
				}
			}
		}, {
			key: "_processLips",
			value: function(t, e, n) {
				this.right.junction[0] = this.left[0] * this.glottis.reflection + t.glottis, this.left.junction[this.length] = this.right[this.length - 1] * this.lip.reflection;
				for (var i = 1; i < this.length; i++) {
					var o = Math.interpolate(e, this.reflection[i], this.reflection.new[i]) * (this.right[i - 1] + this.left[i]);
					this.right.junction[i] = this.right[i - 1] - o, this.left.junction[i] = this.left[i] + o
				}
				var r = Math.interpolate(e, this.left.reflection.new, this.left.reflection.value);
				this.left.junction[this.nose.start] = r * this.right[this.nose.start - 1] + (r + 1) * (this.nose.left[0] + this.left[this.nose.start]);
				var s = Math.interpolate(e, this.right.reflection.new, this.right.reflection.value);
				this.right.junction[this.nose.start] = s * this.left[this.nose.start] + (s + 1) * (this.nose.left[0] + this.right[this.nose.start - 1]);
				var a = Math.interpolate(e, this.nose.reflection.new, this.nose.reflection.value);
				this.nose.right.junction[0] = a * this.nose.left[0] + (a + 1) * (this.left[this.nose.start] + this.right[this.nose.start - 1]);
				for (var c = 0; c < this.length; c++)
					if (this.right[c] = .999 * this.right.junction[c], this.left[c] = .999 * this.left.junction[c + 1], n) {
						var h = Math.abs(this.left[c] + this.right[c]);
						this.amplitude.max[c] = h > this.amplitude.max[c] ? h : .999 * this.amplitude.max[c]
					} return this.right[this.length - 1]
			}
		}, {
			key: "_processNose",
			value: function(t, e, n) {
				this.nose.left.junction[this.nose.length] = this.nose.right[this.nose.length - 1] * this.lip.reflection;
				for (var i = 1; i < this.nose.length; i++) {
					var o = this.nose.reflection[i] * (this.nose.left[i] + this.nose.right[i - 1]);
					this.nose.left.junction[i] = this.nose.left[i] + o, this.nose.right.junction[i] = this.nose.right[i - 1] - o
				}
				for (var r = 0; r < this.nose.length; r++)
					if (this.nose.left[r] = this.nose.left.junction[r + 1] * this.nose.fade, this.nose.right[r] = this.nose.right.junction[r] * this.nose.fade, n) {
						var s = Math.abs(this.nose.left[r] + this.nose.right[r]);
						this.nose.amplitude.max[r] = s > this.nose.amplitude.max[r] ? s : .999 * this.nose.amplitude.max[r]
					} return this.nose.right[this.nose.length - 1]
			}
		}, {
			key: "update",
			value: function(t, e) {
				this._updateTract(), this._updateTransients(t), this.nose.diameter[0] = this.velum.target, this.nose.amplitude[0] = Math.pow(this.nose.diameter[0], 2), this._updateReflection(), this._updateConstrictions(e)
			}
		}, {
			key: "_updateDiameterRest",
			value: function() {
				for (var t = this.blade.start; t < this.lip.start; t++) {
					var e = (this.tongue.index - t) / (this.tip.start - this.blade.start),
						n = 1.1 * Math.PI * e,
						i = (1.5 - (2 + (this.tongue.diameter - 2) / 1.5) + this.grid.offset) * Math.cos(n);
					t != this.blade.start - 2 && t != this.lip.start - 1 || (i *= .8), t != this.blade.start + 0 && t != this.lip.start - 2 || (i *= .94);
					var o = 1.5 - i;
					this.diameter.rest[t] = o
				}
			}
		}, {
			key: "_updateConstrictions",
			value: function(t) {
				var e = !1;
				e = e || this.tongue.index !== this.previousConstrictions.tongue.index || this.tongue.diameter !== this.previousConstrictions.tongue.diameter;
				for (var n = Math.max(this.previousConstrictions.length, t.length), i = 0, o = t[0], r = this.previousConstrictions[0]; !e && i < n; o = t[++i], r = this.previousConstrictions[i]) e = void 0 !== o && void 0 !== r ? o.index !== r.index || o.diameter !== r.diameter : !(null == o && null == r);
				if (e) {
					this._updateDiameterRest();
					for (var s = 0; s < this.length; s++) this.diameter[s] = this.diameter.rest[s];
					this.velum.target = .01;
					for (var a = -1; a < t.length; a++) {
						var c = t[a] || this.tongue;
						if (c.index > this.nose.start && c.diameter < -this.nose.offset && (this.velum.target = .4), c.index >= 2 && c.index < this.length && c.diameter > -(.85 + this.nose.offset)) {
							var h = c.diameter;
							if (h -= .3, (h = Math.max(0, h)) < 3) {
								var l = 2;
								l = c.index < 25 ? 10 : c.index >= this.tip.start ? 5 : 10 - 5 * (c.index - 25) / (this.tip.start - 25);
								for (var u = Math.round(c.index), f = u - (Math.ceil(l) + 1); f < u + l + 1 && f >= 0 && f < this.length; f++) {
									var d, p = Math.abs(f - c.index) - .5;
									d = p <= 0 ? 0 : p > l ? 1 : .5 * (1 - Math.cos(Math.PI * p / l));
									var _ = this.diameter[f] - h;
									_ > 0 && (this.diameter[f] = h + _ * d)
								}
							}
						}
					}
					this.previousConstrictions = t, this.previousConstrictions.tongue = {
						index: this.tongue.index,
						diameter: this.tongue.diameter
					}
				}
			}
		}, {
			key: "_updateTract",
			value: function() {
				for (var t = 0; t < this.length; t++) this.diameter[t] <= 0 && (this.transients.obstruction.new = t)
			}
		}, {
			key: "_updateTransients",
			value: function(t) {
				this.nose.amplitude[0] < .05 && (this.transients.obstruction.last > -1 && -1 == this.transients.obstruction.new && this.transients.push(new m(this.transients.obstruction.new, t)), this.transients.obstruction.last = this.transients.obstruction.new)
			}
		}, {
			key: "_updateReflection",
			value: function() {
				for (var t = 0; t < this.length; t++) this.amplitude[t] = Math.pow(this.diameter[t], 2), t > 0 && (this.reflection[t] = this.reflection.new[t], this.reflection.new[t] = 0 == this.amplitude[t] ? .999 : (this.amplitude[t - 1] - this.amplitude[t]) / (this.amplitude[t - 1] + this.amplitude[t]));
				var e = this.amplitude[this.nose.start] + this.amplitude[this.nose.start + 1] + this.nose.amplitude[0];
				this.left.reflection.value = this.left.reflection.new, this.left.reflection.new = (2 * this.amplitude[this.nose.start] - e) / e, this.right.reflection.value = this.right.reflection.new, this.right.reflection.new = (2 * this.amplitude[this.nose.start + 1] - e) / e, this.nose.reflection.value = this.nose.reflection.new, this.nose.reflection.new = (2 * this.nose.amplitude[0] - e) / e
			}
		}, {
			key: "reset",
			value: function() {
				this.right.fill(0), this.right.junction.fill(0), this.left.fill(0), this.left.junction.fill(0), this.nose.left.fill(0), this.nose.left.junction.fill(0), this.nose.right.fill(0), this.nose.right.junction.fill(0)
			}
		}]) && g(e.prototype, n), i && g(e, i), t
	}();

	function b(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}
	var x = function() {
		function t() {
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this.glottis = new p, this.tract = new y
		}
		var e, n, i;
		return e = t, (n = [{
			key: "process",
			value: function(t, e, n, i) {
				var o, r, s = 0,
					a = (o = this.glottis).process.apply(o, arguments);
				return t.glottis = a, s += (r = this.tract).process.apply(r, arguments), e += .5, s += this.tract.process(t, e, n, i), s *= .125
			}
		}, {
			key: "update",
			value: function(t, e) {
				this.glottis.update(), this.tract.update(t, e)
			}
		}]) && b(e.prototype, n), i && b(e, i), t
	}();

	function w(t) {
		return (w = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
			return typeof t
		} : function(t) {
			return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
		})(t)
	}

	function k(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}

	function C(t) {
		if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return t
	}

	function E(t) {
		var e = "function" == typeof Map ? new Map : void 0;
		return (E = function(t) {
			if (null === t || (n = t, -1 === Function.toString.call(n).indexOf("[native code]"))) return t;
			var n;
			if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
			if (void 0 !== e) {
				if (e.has(t)) return e.get(t);
				e.set(t, i)
			}

			function i() {
				return T(t, arguments, P(this).constructor)
			}
			return i.prototype = Object.create(t.prototype, {
				constructor: {
					value: i,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), M(i, t)
		})(t)
	}

	function T(t, e, n) {
		return (T = function() {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0
			} catch (t) {
				return !1
			}
		}() ? Reflect.construct : function(t, e, n) {
			var i = [null];
			i.push.apply(i, e);
			var o = new(Function.bind.apply(t, i));
			return n && M(o, n.prototype), o
		}).apply(null, arguments)
	}

	function M(t, e) {
		return (M = Object.setPrototypeOf || function(t, e) {
			return t.__proto__ = e, t
		})(t, e)
	}

	function P(t) {
		return (P = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
			return t.__proto__ || Object.getPrototypeOf(t)
		})(t)
	}

	function A(t) {
		t._constrictions = [];

		for (var e = function(e) {
				t._constrictions[e] = {
					_index: e,
					index: null,
					diameter: null,
					_enable: function() {
						return t._enableConstriction(e)
					},
					_disable: function() {
						return t._disableConstriction(e)
					},
					_isEnabled: !1
				}
			}, n = 0; n < s.numberOfConstrictions; n++) e(n);

		t.newConstriction = function(t, e) {
log(t,e);
			return this._constrictions.find(function(n) {
//log(n._enable);
				if (!n._isEnabled) return void 0 !== t && (n.index.value = t), void 0 !== e && (n.diameter.value = e), n._enable(), !0
			})
		}, t.removeConstriction = function(t) {
			t._disable()
		}, Object.defineProperty(t, "constrictions", {
			get: function() {
				return this._constrictions.filter(function(t) {
					return t._isEnabled
				})
			}
		}), t._parameters = {}, t.tongue = t._parameters.tongue = {
			index: null,
			diameter: null
		}, t.vibrato = t._parameters.vibrato = {
			frequency: null,
			gain: null,
			wobble: null
		}
	}

	function I(t, e, n) {
		if (n.includes("constriction")) {
			var i = Number(n.match(/[0-9]+/g)[0]),
				o = t._constrictions[i];
			o[n.includes("index") ? "index" : "diameter"] = e, t.constrictions[i] = o
		} else n.includes("vibrato") ? t.vibrato[n.replace("vibrato", "").toLowerCase()] = e : n.includes("tongue") ? t.tongue[n.replace("tongue", "").toLowerCase()] = e : t[n] = t._parameters[n] = e
	}
	if (window.AudioContext = window.AudioContext || window.webkitAudioContext, void 0 !== window.AudioWorklet) {
		var V = function(t) {
			function e(t) {
				var n, i, o;
				return function(t, e) {
					if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
				}(this, e), i = this, o = P(e).call(this, t, "pink-trombone-worklet-processor"), n = !o || "object" !== w(o) && "function" != typeof o ? C(i) : o, A(C(n)), n.parameters.forEach(function(t, e) {
					I(C(n), t, e)
				}), n.port.onmessage = function(t) {
					t.data.name
				}, n
			}
			var n, i, o;
			return function(t, e) {
				if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
				t.prototype = Object.create(e && e.prototype, {
					constructor: {
						value: t,
						writable: !0,
						configurable: !0
					}
				}), e && M(t, e)
			}(e, E(AudioWorkletNode)), n = e, (i = [{
				key: "_postMessage",
				value: function(t) {
					var e = this;
					return t.id = Math.random(), new Promise(function(n, i) {
						e.port.addEventListener("message", function i(o) {
							t.id == Number(o.data.id) && (e.port.removeEventListener("message", i), n(o))
						}), t.name==="enableConstriction"&&log(t), e.port.postMessage(t)
					})
				}
			}, {
				key: "_enableConstriction",
				value: function(t) {
					var e = this;
log("enable OUT");
					return this._postMessage({
						name: "enableConstriction",
						constrictionIndex: t
					}).then(function() {
log("ENABLED!");
						e._constrictions[t]._isEnabled = !0
					})
				}
			}, {
				key: "_disableConstriction",
				value: function(t) {
					var e = this;
					return this._postMessage({
						name: "disableConstriction",
						constrictionIndex: t
					}).then(function() {
						e._constrictions[t]._isEnabled = !1
					})
				}
			}, {
				key: "getProcessor",
				value: function() {
					return this._postMessage({
						name: "getProcessor"
					}).then(function(t) {
						return JSON.parse(t.data.processor)
					})
				}
			}]) && k(n.prototype, i), o && k(n, o), e
		}();
		window.AudioContext.prototype.createPinkTromboneNode = function() {
			return T(V, [this].concat(Array.prototype.slice.call(arguments)))
		}
	} else window.AudioContext.prototype.createPinkTromboneNode = function() {
		var t = this,
			e = this.createScriptProcessor(Math.pow(2, 11), s.length, 1);
		return e.processor = new x, A(e), e.channelMerger = this.createChannelMerger(s.length), e.channelMerger.channels = [], e.channelMerger.connect(e), s.forEach(function(n, i) {
			var o = t.createConstantSource();
			o.start();
			var r = o.offset;
			r.automationRate = n.automationRate || "a-rate", r.value = n.defaultValue || 0, o.connect(e.channelMerger, 0, i), e.channelMerger.channels[i] = n.name, I(e, r, n.name)
		}), e._getParameterChannels = function(t) {
			for (var e = {}, n = 0; n < t.numberOfChannels; n++) e[this.channelMerger.channels[n]] = t.getChannelData(n);
			return e
		}, e._getParameterSamples = function(t, e) {
			for (var n = {}, i = Object.keys(t), o = 0; o < i.length; o++) {
				var r = i[o];
				r.includes("constriction") || (n[r] = t[r][e])
			}
			return n
		}, e._getConstrictions = function(t) {
			for (var e = [], n = 0; n < this._constrictions.length; n++) {
				if (this._constrictions[n]._isEnabled) {
					var i = {
						index: t["constriction" + n + "index"][0],
						diameter: t["constriction" + n + "diameter"][0]
					};
					e[n] = i
				}
			}
			return e
		}, e.onaudioprocess = function(t) {
			for (var e = t.outputBuffer.getChannelData(0), n = this._getParameterChannels(t.inputBuffer), i = this._getConstrictions(n), o = 0; o < e.length; o++) {
				var r = this._getParameterSamples(n, o),
					s = e.length,
					a = t.playbackTime + o / t.inputBuffer.sampleRate;
				e[o] = this.processor.process(r, o, s, a, i)
			}
			this.processor.update(t.playbackTime + e.length / t.inputBuffer.sampleRate, i)
		}, e._enableConstriction = function(t) {
			this._constrictions[t]._isEnabled = !0
		}, e._disableConstriction = function(t) {
			this._constrictions[t]._isEnabled = !1
		}, e.getProcessor = function() {
			var t = this;
			return new Promise(function(e, n) {
				e(t.processor)
			})
		}, e
	};

	function j(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}

	function O(t, e, n) {
		return e && j(t.prototype, e), n && j(t, n), t
	}
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var R = function() {
		function t(e) {
			var n = this;
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this.loadPromise = this.addModules(e).then(function() {
				return n.audioContext = e, n.setupAudioGraph(), n.audioContext
			})
		}
		return O(t, [{
			key: "addModules",
			value: function(t) {
				return void 0 !== t.audioWorklet ? t.audioWorklet.addModule("/root/code/mods/av/voice/pinktrombone-worklet.js") : new Promise(function(t, e) {
					t()
				})
			}
		}]), O(t, [{
			key: "setupAudioGraph",
			value: function() {
				this._noise = this.audioContext.createNoise(), this._aspirateFilter = this.audioContext.createBiquadFilter(), this._aspirateFilter.type = "bandpass", this._aspirateFilter.frequency.value = 500, this._aspirateFilter.Q.value = .5, this._fricativeFilter = this.audioContext.createBiquadFilter(), this._fricativeFilter.type = "bandpass", this._fricativeFilter.frequency.value = 1e3, this._fricativeFilter.Q.value = .5, this._pinkTromboneNode = this.audioContext.createPinkTromboneNode(), this._noise.connect(this._aspirateFilter), this._aspirateFilter.connect(this._pinkTromboneNode.noise), this._noise.connect(this._fricativeFilter), this._fricativeFilter.connect(this._pinkTromboneNode.noise), this._gain = this.audioContext.createGain(), this._gain.gain.value = 0, this._pinkTromboneNode.connect(this._gain)
this._gain.connect(this.audioContext.destination);
			}
		}, {
			key: "connect",
			value: function() {
				var t;
				return (t = this._gain).connect.apply(t, arguments)
			}
		}, {
			key: "disconnect",
			value: function() {
				var t;
				return (t = this._gain).disconnect.apply(t, arguments)
			}
		}, {
			key: "start",
			value: function() {
				this._gain.gain.value = 1
			}
		}, {
			key: "stop",
			value: function() {
				this._gain.gain.value = 0
			}
		}, {
			key: "newConstriction",
			value: function() {
				var t;
				return (t = this._pinkTromboneNode).newConstriction.apply(t, arguments)
			}
		}, {
			key: "removeConstriction",
			value: function(t) {
				this._pinkTromboneNode.removeConstriction(t)
			}
		}, {
			key: "getProcessor",
			value: function() {
				return this._pinkTromboneNode.getProcessor()
			}
		}, {
			key: "parameters",
			get: function() {
				return this._pinkTromboneNode._parameters
			}
		}, {
			key: "constrictions",
			get: function() {
				return this._pinkTromboneNode.constrictions
			}
		}]), t
	}();
	window.AudioContext.prototype.createPinkTrombone = function() {
		return new R(this)
	};

	function S(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}
	var F = function() {
		function t() {
			var e = this;
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this._container = document.createElement("div"), this._container.style.margin = 0, this._container.style.padding = 0, this._canvases = {}, this._contexts = {}, ["tract", "background"].forEach(function(t, n) {
				var i = document.createElement("canvas");
				i.id = t, i.style.position = "absolute", i.height = 500, i.width = 600, i.style.backgroundColor = "transparent", i.style.margin = 0, i.style.padding = 0, i.style.zIndex = 1 - n, e._canvases[t] = i, e._contexts[t] = i.getContext("2d"), e._container.appendChild(i)
			}), this._canvas = this._canvases.tract, this._context = this._contexts.tract, this._tract = {
				origin: {
					x: 340,
					y: 460
				},
				radius: 298,
				scale: 60,
				scalar: 1,
				angle: {
					scale: .64,
					offset: -.25
				}
			}, 
			this._processor = null, this._parameters = {}, this._touchConstrictionIndices = [],

			this._container.addEventListener("animationFrame", function(t) {
//log("GITTIM",t);
				e._container.dispatchEvent(new CustomEvent("getProcessor", {
					bubbles: !0
				})),
				e._container.dispatchEvent(new CustomEvent("getParameter", {
					bubbles: !0,
					detail: {
						parameterName: "intensity"
					}
				}))
			}),

			this._container.addEventListener("didGetProcessor", function(t) {
				e._processor = t.detail.processor, e._resize(), e._drawTract()
			}), this._container.addEventListener("didGetParameter", function(t) {
				var n = t.detail.parameterName,
					i = t.detail.value;
				e._parameters[n] = i
			}), new MutationObserver(function(t, n) {
				document.contains(e._container) && (e._container.dispatchEvent(new CustomEvent("requestAnimationFrame", {
					bubbles: !0
				})), n.disconnect())
			}).observe(document.body, {
				subtree: !0,
				childList: !0
			}), this._canvases.tract.addEventListener("mousedown", function(t) {
				e._startEvent(t)
			}), this._canvases.tract.addEventListener("mousemove", function(t) {
				e._moveEvent(t)
			}), this._canvases.tract.addEventListener("mouseup", function(t) {
				e._endEvent(t)
			}), this._canvases.tract.addEventListener("touchstart", function(t) {
				t.preventDefault(), Array.from(t.changedTouches).forEach(function(t) {
					return e._startEvent(t)
				})
			}), this._canvases.tract.addEventListener("touchmove", function(t) {
				t.preventDefault(), Array.from(t.changedTouches).forEach(function(t) {
					return e._moveEvent(t)
				})
			}), this._canvases.tract.addEventListener("touchend", function(t) {
				t.preventDefault(), Array.from(t.changedTouches).forEach(function(t) {
					return e._endEvent(t)
				})
			}), this._canvases.tract.addEventListener("touchcancel", function(t) {
				t.preventDefault(), Array.from(t.changedTouches).forEach(function(t) {
					return e._endEvent(t)
				})
			}), this._canvases.tract.addEventListener("didNewConstriction", function(t) {
				e._touchConstrictionIndices[t.detail.touchIdentifier] = t.detail.constrictionIndex
			}), this._canvases.tract.addEventListener("didRemoveConstriction", function(t) {
				e._touchConstrictionIndices[t.detail.touchIdentifier] = void 0
			})
		}
		var e, n, i;
		return e = t, (n = [{
			key: "_resize",
			value: function() {
				this._tract.scalar = this._canvases.tract.width / this._canvases.tract.offsetWidth, this._resizeCanvases()
			}
		}, {
			key: "_resizeCanvases",
			value: function() {
				for (var t in this._canvases) this._canvases[t].style.height = this._container.offsetHeight
			}
		}, {
			key: "_drawTract",
			value: function() {
				if (!this._isDrawing) {
					this._isDrawing = !0, this._context = this._contexts.tract, this._context.clearRect(0, 0, this._canvas.width, this._canvas.height), this._context.lineCap = this._context.lineJoin = "round", this._drawTongueControl(), this._context.beginPath(), this._context.lineWidth = 2, this._context.strokeStyle = this._context.fillStyle = "pink", this._moveTo(1, 0);
					for (var t = 1; t < this._processor.tract.length; t++) this._lineTo(t, this._processor.tract.diameter[t]);
					for (var e = this._processor.tract.length - 1; e >= 2; e--) this._lineTo(e, 0);
					this._context.closePath(), this._context.stroke(), this._context.fill();
					var n = this._processor.tract.nose.diameter[0],
						i = 4 * n;
					this._context.beginPath(), this._context.lineWidth = 2, this._context.strokeStyle = this._context.fillStyle = "pink", this._moveTo(this._processor.tract.nose.start, -this._processor.tract.nose.offset);
					for (var o = 1; o < this._processor.tract.nose.length; o++) this._lineTo(o + this._processor.tract.nose.start, -this._processor.tract.nose.offset - .9 * this._processor.tract.nose.diameter[o]);
					for (var r = this._processor.tract.nose.length - 1; r >= 1; r--) this._lineTo(r + this._processor.tract.nose.start, -this._processor.tract.nose.offset);
					this._context.closePath(), this._context.fill(), this._context.beginPath(), this._context.lineWidth = 2, this._context.strokeStyle = this._context.fillStyle = "pink", this._moveTo(this._processor.tract.nose.start - 2, 0), this._lineTo(this._processor.tract.nose.start, -this._processor.tract.nose.offset), this._lineTo(this._processor.tract.nose.start + i, -this._processor.tract.nose.offset), this._lineTo(this._processor.tract.nose.start + i - 2, 0), this._context.closePath(), this._context.stroke(), this._context.fill(), this._context.fillStyle = "white", this._context.font = "20px Arial", this._context.textAlign = "center", this._context.globalAlpha = 1, this._drawText(.1 * this._processor.tract.length, .425, "throat", !1), this._drawText(.71 * this._processor.tract.length, -1.8, "nasal", !1), this._drawText(.71 * this._processor.tract.length, -1.3, "cavity", !1), this._context.font = "22px Arial", this._drawText(.6 * this._processor.tract.length, .9, "oral", !1), this._drawText(.7 * this._processor.tract.length, .9, "cavity", !1), this._drawAmplitudes(), this._context.beginPath(), this._context.lineWidth = 5, this._context.strokeStyle = "#C070C6", this._context.lineJoin = this._context.lineCap = "round", this._moveTo(1, this._processor.tract.diameter[0]);
					for (var s = 2; s < this._processor.tract.length; s++) this._lineTo(s, this._processor.tract.diameter[s]);
					this._moveTo(1, 0);
					for (var a = 2; a <= this._processor.tract.nose.start - 2; a++) this._lineTo(a, 0);
					this._moveTo(this._processor.tract.nose.start + i - 2, 0);
					for (var c = this._processor.tract.nose.start + Math.ceil(i) - 2; c < this._processor.tract.length; c++) this._lineTo(c, 0);
					this._context.stroke(), this._context.beginPath(), this._context.lineWidth = 5, this._context.strokeStyle = "#C070C6", this._context.lineJoin = "round", this._moveTo(this._processor.tract.nose.start, -this._processor.tract.nose.offset);
					for (var h = 1; h < this._processor.tract.nose.length; h++) this._lineTo(h + this._processor.tract.nose.start, -this._processor.tract.nose.offset - .9 * this._processor.tract.nose.diameter[h]);
					this._moveTo(this._processor.tract.nose.start + i, -this._processor.tract.nose.offset);
					for (var l = Math.ceil(i); l < this._processor.tract.nose.length; l++) this._lineTo(l + this._processor.tract.nose.start, -this._processor.tract.nose.offset);
					this._context.stroke(), this._context.globalAlpha = 5 * n, this._context.beginPath(), this._moveTo(this._processor.tract.nose.start - 2, 0), this._lineTo(this._processor.tract.nose.start, -this._processor.tract.nose.offset), this._lineTo(this._processor.tract.nose.start + i, -this._processor.tract.nose.offset), this._lineTo(this._processor.tract.nose.start + i - 2, 0), this._context.stroke(), this._context.fillStyle = "orchid", this._context.font = "20px Arial", this._context.textAlign = "center", this._context.globalAlpha = .7, this._drawText(.95 * this._processor.tract.length, .8 + .8 * this._processor.tract.diameter[this._processor.tract.length - 1], " lip", !1), this._context.globalAlpha = 1, this._context.fillStyle = "black", this._context.textAlign = "left", this._drawPositions(), this._isDrawing = !1
				}
			}
		}, {
			key: "_drawCircle",
			value: function(t, e, n) {
				var i = this._getAngle(t),
					o = this._getRadius(t, e);
				this._context.beginPath(), this._context.arc(this._getX(i, o), this._getY(i, o), n, 0, 2 * Math.PI), this._context.fill()
			}
		}, {
			key: "_drawTongueControl",
			value: function() {
				var t = this;
				this._context.lineCap = this._context.lineJoin = "round", this._context.strokeStyle = this._context.fillStyle = "#FFEEF5", this._context.globalAlpha = 1, this._context.beginPath(), this._context.lineWidth = 45, this._moveTo(this._processor.tract.tongue.range.index.minValue, this._processor.tract.tongue.diameter.minValue);
				for (var e = this._processor.tract.tongue.range.index.minValue + 1; e <= this._processor.tract.tongue.range.maxValue; e++) this._lineTo(e, this._processor.tract.tongue.range.diameter.minValue);
				this._lineTo(this._processor.tract.tongue.range.index.center, this._processor.tract.tongue.range.diameter.maxValue), this._context.closePath(), this._context.stroke(), this._context.fill(), this._context.fillStyle = "orchid", this._context.globalAlpha = .3, [0, -4.25, -8.5, 4.25, 8.5, -6.1, 6.1, 0, 0].forEach(function(e, n) {
					var i = n < 5 ? t._processor.tract.tongue.range.diameter.minValue : n < 8 ? t._processor.tract.tongue.range.diameter.center : t._processor.tract.tongue.range.diameter.maxValue;
					t._drawCircle(t._processor.tract.tongue.range.index.center + e, i, 3)
				});
				var n = this._getAngle(this._processor.tract.tongue.index),
					i = this._getRadius(this._processor.tract.tongue.index, this._processor.tract.tongue.diameter);
				this._context.lineWidth = 4, this._context.strokeStyle = "orchid", this._context.globalAlpha = .7, this._context.beginPath(), this._context.arc(this._getX(n, i), this._getY(n, i), 18, 0, 2 * Math.PI), this._context.stroke(), this._context.globalAlpha = .15, this._context.fill(), this._context.globalAlpha = 1, this._context.fillStyle = "orchid"
			}
		}, {
			key: "_drawAmplitudes",
			value: function() {
				this._context.strokeStyle = "orchid", this._context.lineCap = "butt", this._context.globalAlpha = .3;
				for (var t = 2; t < this._processor.tract.length - 1; t++) this._context.beginPath(), this._context.lineWidth = 3 * Math.sqrt(this._processor.tract.amplitude.max[t]), this._moveTo(t, 0), this._lineTo(t, this._processor.tract.diameter[t]), this._context.stroke();
				for (var e = 1; e < this._processor.tract.nose.length - 1; e++) this._context.beginPath(), this._context.lineWidth = 3 * Math.sqrt(this._processor.tract.nose.amplitude.max[e]), this._moveTo(this._processor.tract.nose.start + e, -this._processor.tract.nose.offset), this._lineTo(this._processor.tract.nose.start + e, -this._processor.tract.nose.offset - .9 * this._processor.tract.nose.diameter[e]), this._context.stroke();
				this._context.globalAlpha = 1
			}
		}, {
			key: "_drawPositions",
			value: function() {
				var t = this;
				this._context.fillStyle = "orchid", this._context.font = "24px Arial", this._context.textAlign = "center", this._context.globalAlpha = .6, [
					[15, .6, "??"],
					[13, .27, "a"],
					[12, 0, "??"],
					[17.7, .05, "(??)"],
					[27, .65, "??"],
					[27.4, .21, "i"],
					[20, 1, "e"],
					[18.1, .37, "??"],
					[23, .1, "(u)"],
					[21, .6, "??"]
				].forEach(function(e) {
					var n = e[0],
						i = 1.5 * e[1] + 2,
						o = e[2];
					t._drawText(n, i, o, !1)
				}), this._context.globalAlpha = .8;
				this._drawText(38, 1.1, "l", !1), this._drawText(41, 1.1, "w", !1), this._drawText(4.5, .37, "h", !1);
				var e = this._parameters.intensity > 0 ? ["??", "z", "v", "g", "d", "b"] : ["??", "s", "f", "k", "t", "p"];
				e.push("??", "n", "m");
				[31.5, 36, 41, 22, 36, 41, 22, 36, 41].forEach(function(n, i) {
					var o = i < 4 ? .3 : i < 6 ? -.4 : -1.1;
					t._drawText(n, o, e[i], !1)
				})
			}
		}, {
			key: "_drawText",
			value: function(t, e, n) {
				var i = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
					o = this._getAngle(t),
					r = this._getRadius(t, e);
				this._context.save(), this._context.translate(this._getX(o, r), this._getY(o, r) + 2), i || this._context.rotate(o - Math.PI / 2), this._context.fillText(n, 0, 0), this._context.restore()
			}
		}, {
			key: "_moveTo",
			value: function(t, e) {
				this.__to(t, e, !0)
			}
		}, {
			key: "_lineTo",
			value: function(t, e) {
				this.__to(t, e, !1)
			}
		}, {
			key: "__to",
			value: function(t, e) {
				var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
					i = this._getWobble(t),
					o = this._getAngle(t, e) + i,
					r = this._getRadius(t, e) + 100 * i,
					s = this._getX(o, r),
					a = this._getY(o, r);
				n ? this._context.moveTo(s, a) : this._context.lineTo(s, a)
			}
		}, {
			key: "_getX",
			value: function(t, e) {
				return this._tract.origin.x - e * Math.cos(t)
			}
		}, {
			key: "_getY",
			value: function(t, e) {
				return this._tract.origin.y - e * Math.sin(t)
			}
		}, {
			key: "_getAngle",
			value: function(t) {
				return this._tract.angle.offset + t * this._tract.angle.scale * Math.PI / (this._processor.tract.lip.start - 1)
			}
		}, {
			key: "_getWobble",
			value: function(t) {
				var e = this._processor.tract.amplitude.max[this._processor.tract.length - 1] + this._processor.tract.nose.amplitude.max[this._processor.tract.nose.length - 1];
				return e *= .03 * Math.sin(2 * t - Date.now() / 1e3 * 50) * t / this._processor.tract.length
			}
		}, {
			key: "_getRadius",
			value: function(t, e) {
				return this._tract.radius - this._tract.scale * e
			}
		}, {
			key: "_getIndex",
			value: function(t, e) {
				for (var n = Math.atan2(e, t); n > 0;) n -= 2 * Math.PI;
				return (Math.PI + n - this._tract.angle.offset) * (this._processor.tract.lip.start - 1) / (this._tract.angle.scale * Math.PI)
			}
		}, {
			key: "_getDiameter",
			value: function(t, e) {
				return (this._tract.radius - Math.sqrt(Math.pow(t, 2) + Math.pow(e, 2))) / this._tract.scale
			}
		}, {
			key: "_isNearTongue",
			value: function(t, e) {
				var n = !0;
				return n = (n = n && this._processor.tract.tongue.range.index.minValue - 4 <= t && t <= this._processor.tract.tongue.range.index.maxValue + 4) && this._processor.tract.tongue.range.diameter.minValue - .5 <= e && e <= this._processor.tract.tongue.range.diameter.maxValue + .5
			}
		}, {
			key: "_getEventX",
			value: function(t) {
				return (t.pageX - t.target.offsetLeft) * this._tract.scalar - this._tract.origin.x
			}
		}, {
			key: "_getEventY",
			value: function(t) {
				return (t.pageY - t.target.offsetTop) * this._tract.scalar - this._tract.origin.y
			}
		}, {
			key: "_getEventPosition",
			value: function(t) {
				var e = this._getEventX(t),
					n = this._getEventY(t);
				return {
					index: this._getIndex(e, n),
					diameter: this._getDiameter(e, n)
				}
			}
		}, {
			key: "_setTongue",
			value: function(t, e) {
				Object.keys(e).forEach(function(n) {
					t.target.dispatchEvent(new CustomEvent("setParameter", {
						bubbles: !0,
						detail: {
							parameterName: "tongue." + n,
							newValue: e[n]
						}
					}))
				})
			}
		}, {
			key: "_startEvent",
			value: function(t) {
				var e = t instanceof Touch ? t.identifier : -1;
				if (null == this._touchConstrictionIndices[e]) {
					var n = this._getEventPosition(t);
					this._isNearTongue(n.index, n.diameter) ? (this._touchConstrictionIndices[e] = -1, this._setTongue(t, n)) : t.target.dispatchEvent(new CustomEvent("newConstriction", {
						bubbles: !0,
						detail: {
							touchIdentifier: e,
							index: n.index,
							diameter: n.diameter
						}
					}))
				}
			}
		}, {
			key: "_moveEvent",
			value: function(t) {
				var e = t instanceof Touch ? t.identifier : -1;
				if (void 0 !== this._touchConstrictionIndices[e]) {
					var n = this._getEventPosition(t),
						i = this._touchConstrictionIndices[e]; - 1 == i ? this._setTongue(t, n) : t.target.dispatchEvent(new CustomEvent("setConstriction", {
						bubbles: !0,
						detail: {
							constrictionIndex: i,
							index: n.index,
							diameter: n.diameter
						}
					}))
				}
			}
		}, {
			key: "_endEvent",
			value: function(t) {
				var e = t instanceof Touch ? t.identifier : -1;
				if (void 0 !== this._touchConstrictionIndices[e]) {
					var n = this._touchConstrictionIndices[e]; - 1 == n || t.target.dispatchEvent(new CustomEvent("removeConstriction", {
						bubbles: !0,
						detail: {
							constrictionIndex: n,
							touchIdentifier: e
						}
					})), this._touchConstrictionIndices[e] = void 0
				}
			}
		}, {
			key: "node",
			get: function() {
				return this._container
			}
		}, {
			key: "width",
			get: function() {
				return this._container.offsetWidth
			}
		}, {
			key: "height",
			get: function() {
				return this._container.offsetHeight
			}
		}]) && S(e.prototype, n), i && S(e, i), t
	}();

	function N(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}
	Math.clamp = function(t) {
		var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
			n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
		return t < e ? e : t < n ? t : n
	};
	var L = function() {
		function t() {
			var e = this;
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this._frequency = {
				min: 20,
				max: 1e3,
				get range() {
					return this.max - this.min
				},
				interpolate: function(t) {
					return this.min + this.range * t
				}
			}, this._isActive = !1, this._alwaysVoice = !0, this._container = document.createElement("div"), this._container.style.border = "solid red 1px", this._container.style.backgroundColor = "pink", this._container.style.borderRadius = "20px", this._slider = document.createElement("div"), this._slider.style.position = "relative", this._slider.style.flex = 0, this._slider.style.width = "20px", this._slider.style.height = "20px", this._slider.style.borderRadius = "20px", this._slider.style.border = "solid red 5px", this._slider.style.top = "50%", this._slider.style.left = "50%", this._container.appendChild(this._slider), this._container.addEventListener("mousedown", function(t) {
				e._isActive = !0, e._eventCallback(t), e._alwaysVoice || e._container.dispatchEvent(new CustomEvent("setParameter", {
					bubbles: !0,
					detail: {
						parameterName: "intensity",
						newValue: 1
					}
				}))
			}), this._container.addEventListener("mousemove", function(t) {
				e._eventCallback(t)
			}), this._container.addEventListener("mouseup", function(t) {
				e._isActive = !1, 0 == e._alwaysVoice && e._container.dispatchEvent(new CustomEvent("setParameter", {
					bubbles: !0,
					detail: {
						parameterName: "intensity",
						newValue: 0
					}
				}))
			}), this._container.addEventListener("touchstart", function(t) {
				if (t.preventDefault(), !e._isActive) {
					e._isActive = !0;
					var n = t.changedTouches[0];
					e._touchIdentifier = n.identifier, e._eventCallback(n), e._alwaysVoice || e._container.dispatchEvent(new CustomEvent("setParameter", {
						bubbles: !0,
						detail: {
							parameterName: "intensity",
							newValue: 1
						}
					}))
				}
			}), this._container.addEventListener("touchmove", function(t) {
				t.preventDefault();
				var n = Array.from(t.changedTouches).find(function(t) {
					return t.identifier == e._touchIdentifier
				});
				void 0 !== n && e._eventCallback(n)
			}), this._container.addEventListener("touchend", function(t) {
				t.preventDefault(), e._isActive && Array.from(t.changedTouches).some(function(t) {
					return t.identifier == e._touchIdentifier
				}) && (e._isActive = !1, e._touchIdentifier = -1), e._alwaysVoice || e._container.dispatchEvent(new CustomEvent("setParameter", {
					bubbles: !0,
					detail: {
						parameterName: "intensity",
						newValue: 0
					}
				}))
			}), this._container.addEventListener("message", function(t) {
				"toggleButton" == t.detail.type && "voice" == t.detail.parameterName && (e._alwaysVoice = "true" == t.detail.newValue)
			}), new MutationObserver(function(t, n) {
				if (document.contains(e._container)) {
					var i = new CustomEvent("requestAnimationFrame", {
						bubbles: !0
					});
					e._container.dispatchEvent(i), n.disconnect()
				}
			}).observe(document.body, {
				subtree: !0,
				childList: !0
			}), this._container.addEventListener("animationFrame", function(t) {
				["frequency", "tenseness"].forEach(function(e) {
					var n = new CustomEvent("getParameter", {
						bubbles: !0,
						detail: {
							parameterName: e,
							render: !0
						}
					});
					t.target.dispatchEvent(n)
				})
			}), this._container.addEventListener("didGetParameter", function(t) {
				if (1 == t.detail.render) {
					var n, i = t.detail.parameterName,
						o = t.detail.value;
					if (["frequency", "tenseness"].includes(i)) "frequency" == i ? (n = Math.clamp((o - e._frequency.min) / e._frequency.range), e._slider.style.left = n * e._container.offsetWidth - e._slider.offsetWidth / 2) : (n = 1 - Math.acos(1 - o) / (.5 * Math.PI), e._slider.style.top = n * e._container.offsetHeight - e._slider.offsetHeight / 2)
				}
			})
		}
		var e, n, i;
		return e = t, (n = [{
			key: "_eventCallback",
			value: function(t) {
				var e = this;
				if (this._isActive) {
					var n = {
							vertical: Math.clamp((t.pageY - this._container.offsetTop) / this._container.offsetHeight, 0, .99),
							horizontal: Math.clamp((t.pageX - this._container.offsetLeft) / this._container.offsetWidth, 0, .99)
						},
						i = this._frequency.interpolate(n.horizontal),
						o = 1 - Math.cos((1 - n.vertical) * Math.PI * .5),
						r = {
							frequency: i,
							tenseness: o,
							loudness: Math.pow(o, .25)
						};
					Object.keys(r).forEach(function(t) {
						e._container.dispatchEvent(new CustomEvent("setParameter", {
							bubbles: !0,
							detail: {
								parameterName: t,
								newValue: r[t]
							}
						}))
					})
				}
			}
		}, {
			key: "node",
			get: function() {
				return this._container
			}
		}]) && N(e.prototype, n), i && N(e, i), t
	}();

	function U(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}
	var D = function() {
		function t() {
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this._container = document.createElement("div"), this._container.style.display = "flex", this._container.style.flexDirection = "column", this._buttons = {
				start: this._createButton("start"),
				wobble: this._createButton("wobble", !0, "vibrato.wobble"),
				voice: this._createButton("voice", !0, "intensity")
			}, this._buttons.start.addEventListener("didResume", function(t) {
				t.target.parentElement.removeChild(t.target)
			}), this._buttons.start.addEventListener("click", function(t) {
				t.target.dispatchEvent(new CustomEvent("resume", {
					bubbles: !0
				}))
			})
		}
		var e, n, i;
		return e = t, (n = [{
			key: "_createButton",
			value: function(t) {
				var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
					n = arguments.length > 2 ? arguments[2] : void 0,
					i = document.createElement("button");
				return i.id = t, i.value = !0, i.innerText = (e ? "disable" : "") + t, i.style.width = "100%", i.style.flex = 1, i.style.margin = "2px", i.style.borderRadius = "20px", i.style.backgroundColor = "pink", i.style.border = "solid red", this._container.appendChild(i), e && i.addEventListener("click", function(e) {
					i.value = "false" == i.value;
					var o = "true" == i.value ? "disable" : "enable";
					i.innerText = o + " " + i.id, i.dispatchEvent(new CustomEvent("setParameter", {
						bubbles: !0,
						detail: {
							parameterName: n || t,
							newValue: "true" == i.value ? 1 : 0
						}
					})), i.dispatchEvent(new CustomEvent("message", {
						bubbles: !0,
						detail: {
							type: "toggleButton",
							parameterName: t,
							newValue: i.value
						}
					}))
				}), i
			}
		}, {
			key: "node",
			get: function() {
				return this._container
			}
		}]) && U(e.prototype, n), i && U(e, i), t
	}();

	function q(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}
	var W = function() {
		function t() {
			var e = this;
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this._tractUI = new F, this._glottisUI = new L, this._buttonsUI = new D, this._container = document.createElement("div"), this._container.style.height = "100%", this._container.style.width = "100%", this._container.style.display = "grid", this._container.style.gridTemplateRows = "auto 200px 100px", this._container.style.gridTemplateColumns = "auto 100px", this._container.style.gridRowGap = "5px", this._container.appendChild(this._tractUI.node), this._tractUI.node.id = "tractUI", this._tractUI.node.style.gridColumn = "1 / span 2", this._tractUI.node.style.gridRow = "1 / span 2", this._container.appendChild(this._glottisUI.node), this._glottisUI.node.id = "glottisUI", this._glottisUI.node.style.gridColumn = "1 / span 2", this._glottisUI.node.style.gridRow = "3", this._container.appendChild(this._buttonsUI.node), this._buttonsUI.node.id = "buttonsUI", this._buttonsUI.node.style.zIndex = 1, this._buttonsUI.node.style.gridColumn = "2", this._buttonsUI.node.style.gridRow = "2", this._container.addEventListener("message", function(t) {
				t.stopPropagation(), Array.from(e._container.children).forEach(function(e) {
					e !== t.target && e.dispatchEvent(new CustomEvent("message", {
						detail: t.detail
					}))
				})
			})
		}
		var e, n, i;
		return e = t, (n = [{
			key: "show",
			value: function() {
				this.node.style.display = "grid"
			}
		}, {
			key: "hide",
			value: function() {
				this.node.style.display = "none"
			}
		}, {
			key: "node",
			get: function() {
				return this._container
			}
		}]) && q(e.prototype, n), i && q(e, i), t
	}();

	function G(t) {
		return (G = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
			return typeof t
		} : function(t) {
			return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
		})(t)
	}

	function B(t, e) {
		for (var n = 0; n < e.length; n++) {
			var i = e[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
		}
	}

	function z(t, e) {
		return !e || "object" !== G(e) && "function" != typeof e ? function(t) {
			if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return t
		}(t) : e
	}

	function H(t) {
		var e = "function" == typeof Map ? new Map : void 0;
		return (H = function(t) {
			if (null === t || (n = t, -1 === Function.toString.call(n).indexOf("[native code]"))) return t;
			var n;
			if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
			if (void 0 !== e) {
				if (e.has(t)) return e.get(t);
				e.set(t, i)
			}

			function i() {
				return X(t, arguments, J(this).constructor)
			}
			return i.prototype = Object.create(t.prototype, {
				constructor: {
					value: i,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), Y(i, t)
		})(t)
	}

	function X(t, e, n) {
		return (X = function() {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0
			} catch (t) {
				return !1
			}
		}() ? Reflect.construct : function(t, e, n) {
			var i = [null];
			i.push.apply(i, e);
			var o = new(Function.bind.apply(t, i));
			return n && Y(o, n.prototype), o
		}).apply(null, arguments)
	}

	function Y(t, e) {
		return (Y = Object.setPrototypeOf || function(t, e) {
			return t.__proto__ = e, t
		})(t, e)
	}

	function J(t) {
		return (J = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
			return t.__proto__ || Object.getPrototypeOf(t)
		})(t)
	}
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var Q = function(t) {
		function e() {
			var t;
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, e), (t = z(this, J(e).call(this)))._animationFrameObservers = [], window.customElements.whenDefined("pink-trombone").then(function() {
				t.addEventListener("requestAnimationFrame", function(e) {
					t._animationFrameObservers.includes(e.target) || t._animationFrameObservers.push(e.target);
					var n = new CustomEvent("didRequestAnimationFrame");
					e.target.dispatchEvent(n), e.stopPropagation()
				}), t.addEventListener("resume", function(e) {
					t.audioContext.resume(), t.pinkTrombone.start(), e.target.dispatchEvent(new CustomEvent("didResume"))
				}), t.addEventListener("setParameter", function(e) {
					var n = e.detail.parameterName.split(".").reduce(function(t, e) {
							return t[e]
						}, t.parameters),
						i = Number(e.detail.newValue);
					switch (e.detail.type) {
						case "linear":
							n.linearRampToValueAtTime(i, t.audioContext.currentTime + e.detail.timeOffset);
							break;
						default:
							n.value = i
					}
					e.target.dispatchEvent(new CustomEvent("didSetParameter", {
						detail: e.detail
					})), e.stopPropagation()
				}), t.addEventListener("getParameter", function(e) {
					var n = e.detail.parameterName.split(".").reduce(function(t, e) {
							return t[e]
						}, t.parameters).value,
						i = e.detail;
					i.value = n, e.target.dispatchEvent(new CustomEvent("didGetParameter", {
						detail: i
					})), e.stopPropagation()
				}), t.addEventListener("newConstriction", function(e) {
					var n = e.detail,
						i = n.index,
						o = n.diameter,
						r = t.newConstriction(i, o),
						s = e.detail;
					s.constrictionIndex = r._index, e.target.dispatchEvent(new CustomEvent("didNewConstriction", {
						detail: s
					})), e.stopPropagation()
				}), t.addEventListener("setConstriction", function(e) {
					var n = Number(e.detail.constrictionIndex),
						i = t.constrictions[n];
					if (i) {
						var o = e.detail,
							r = o.index,
							s = o.diameter,
							a = r || i.index.value,
							c = s || i.diameter.value;
						switch (e.detail.type) {
							case "linear":
								i.index.linearRampToValueAtTime(a, e.detail.endTime), i.diameter.linearRampToValueAtTime(c, e.detail.endTime);
								break;
							default:
								i.index.value = a, i.diameter.value = c
						}
						e.target.dispatchEvent(new CustomEvent("didSetConstriction"))
					}
					e.stopPropagation()
				}), t.addEventListener("getConstriction", function(e) {
					var n = Number(e.detail.constrictionIndex),
						i = t.constrictions[n];
					e.target.dispatchEvent(new CustomEvent("didGetConstriction", {
						detail: {
							index: i.index.value,
							diameter: i.diameter.value
						}
					})), e.stopPropagation()
				}), t.addEventListener("removeConstriction", function(e) {
					var n = Number(e.detail.constrictionIndex),
						i = t.constrictions[n];
					t.removeConstriction(i);
					var o = e.detail;
					e.target.dispatchEvent(new CustomEvent("didRemoveConstriction", {
						detail: o
					})), e.stopPropagation()
				}), t.addEventListener("getProcessor", function(e) {
					t.getProcessor().then(function(t) {
						e.target.dispatchEvent(new CustomEvent("didGetProcessor", {
							detail: {
								processor: t
							}
						}))
					}), e.stopPropagation()
				})
			}), null !== t.getAttribute("UI") && t.enableUI();
			var n = new Event("load");
			return t.dispatchEvent(n), t
		}
		var n, i, o;
		return function(t, e) {
			if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
			t.prototype = Object.create(e && e.prototype, {
				constructor: {
					value: t,
					writable: !0,
					configurable: !0
				}
			}), e && Y(t, e)
		}(e, H(HTMLElement)), n = e, o = [{
			key: "observedAttributes",
			get: function() {
				return ["UI"]
			}
		}], (i = [{
			key: "enableUI",
			value: function() {
				null == this.UI && (this.UI = new W, this.appendChild(this.UI.node)), this.UI.show()
			}
		}, {
			key: "disableUI",
			value: function() {
				void 0 !== this.UI && (this.UI.hide(), this.stopUI())
			}
		}, {
			key: "startUI",
			value: function() {
				var t = this;
				void 0 !== this.UI && (this._isRunning = !0, window.requestAnimationFrame(function(e) {
					t._requestAnimationFrameCallback(e)
				}))
			}
		}, {
			key: "stopUI",
			value: function() {
				this._isRunning = !1
			}
		}, {
			key: "attributeChangedCallback",
			value: function(t, e, n) {
				switch (t) {
					case "UI":
						null !== n ? this.enableUI() : this.disableUI()
				}
			}
		}, {
			key: "setAudioContext",
			value: function() {
				var t = this,
					e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : new window.AudioContext;
				return this.pinkTrombone = e.createPinkTrombone(), this.loadPromise = this.pinkTrombone.loadPromise.then(function(e) {
					for (var n in t.parameters = t.pinkTrombone.parameters, t.pinkTrombone.parameters) t[n] = t.pinkTrombone.parameters[n];
					return t.pinkTrombone
				}), this.loadPromise
			}
		}, {
			key: "connect",
			value: function() {
				var t;
				if (this.pinkTrombone) return (t = this.pinkTrombone).connect.apply(t, arguments)
			}
		}, {
			key: "disconnect",
			value: function() {
				var t;
				if (this.pinkTrombone) return (t = this.pinkTrombone).disconnect.apply(t, arguments)
			}
		}, {
			key: "start",
			value: function() {
				if (!this.pinkTrombone) throw "Pink Trombone hasn't been set yet";
				this.pinkTrombone.start(), this.startUI()
			}
		}, {
			key: "stop",
			value: function() {
				if (!this.pinkTrombone) throw "Pink Trombone hasn't been set yet";
				this.pinkTrombone.stop(), this.stopUI()
			}
		}, {
			key: "_requestAnimationFrameCallback",
			value: function(t) {
				var e = this;
				this._isRunning && (this._animationFrameObservers.forEach(function(e) {
					var n = new CustomEvent("animationFrame", {
						detail: {
							highResTimeStamp: t
						}
					});
					e.dispatchEvent(n)
				}), window.requestAnimationFrame(function(t) {
					return e._requestAnimationFrameCallback.call(e, t)
				}))
			}
		}, {
			key: "newConstriction",
			value: function() {
				var t;
				return (t = this.pinkTrombone).newConstriction.apply(t, arguments)
			}
		}, {
			key: "removeConstriction",
			value: function(t) {
				return this.pinkTrombone.removeConstriction(t)
			}
		}, {
			key: "getProcessor",
			value: function() {
				return this.pinkTrombone.getProcessor()
			}
		}, {
			key: "audioContext",
			get: function() {
				if (this.pinkTrombone) return this.pinkTrombone.audioContext;
				throw "Audio Context has not been set"
			},
			set: function(t) {
				this.setAudioContext(t)
			}
		}, {
			key: "constrictions",
			get: function() {
				return this.pinkTrombone.constrictions
			}
		}]) && B(n.prototype, i), o && B(n, o), e
	}();
	document.createElement("pink-trombone").constructor == HTMLElement && window.customElements.define("pink-trombone", Q);
	e.default = Q
}]);

export const mod = {};

