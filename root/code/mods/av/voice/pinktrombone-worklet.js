const log=(...args)=>{console.log(...args)}
const cwarn=(...args)=>{console.warn(...args);};
const jlog=(arg)=>{console.log(JSON.stringify(arg,null,"  "))}
! function(t) {//«
	var e = {};
	function i(n) {//«
		if (e[n]) return e[n].exports;
		var r = e[n] = {
			i: n,
			l: !1,
			exports: {}
		};
		return t[n].call(r.exports, r, r.exports, i), r.l = !0, r.exports
	}//»
	i.m = t,
	i.c = e,
	i.d = function(t, e, n) {
		i.o(t, e) || Object.defineProperty(t, e, {
			enumerable: !0,
			get: n
		})
	},
	i.r = function(t) {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
			value: "Module"
		}), Object.defineProperty(t, "__esModule", {
			value: !0
		})
	},
	i.t = function(t, e) {
		if (1 & e && (t = i(t)), 8 & e) return t;
		if (4 & e && "object" == typeof t && t && t.__esModule) return t;
		var n = Object.create(null);
		if (i.r(n), Object.defineProperty(n, "default", {
				enumerable: !0,
				value: t
			}), 2 & e && "string" != typeof t)
			for (var r in t) i.d(n, r, function(e) {
				return t[e]
			}.bind(null, r));
		return n
	},
	i.n = function(t) {
		var e = t && t.__esModule ? function() {
			return t.default
		} : function() {
			return t
		};
		return i.d(e, "a", e), e
	},
	i.o = function(t, e) {
		return Object.prototype.hasOwnProperty.call(t, e)
	},
	i.p = "", 
	i(i.s = 0)
}//»
([
function(t, e, i) {//«
	"use strict";
	i.r(e);
	var n = [{//«
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
		defaultValue: 0,
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
	}];//»
	n.numberOfConstrictions = 4;
	for (var r = 0; r < n.numberOfConstrictions; r++) {//«
		var s = [{
			name: "constriction" + r + "index",
			defaultValue: 0,
			automationRate: "k-rate"
		}, {
			name: "constriction" + r + "diameter",
			defaultValue: 0,
			automationRate: "k-rate"
		}];
		n.push.apply(n, s)
	}//»
	var o = n;
	function a(t, e, i) {//«
		return (a = function() {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0
			} catch (t) {
				return !1
			}
		}() ? Reflect.construct : function(t, e, i) {
			var n = [null];
			n.push.apply(n, e);
			var r = new(Function.bind.apply(t, n));
			return i && h(r, i.prototype), r
		}).apply(null, arguments)
	}//»
	function h(t, e) {//«
		return (h = Object.setPrototypeOf || function(t, e) {
			return t.__proto__ = e, t
		})(t, e)
	}//»
	function l(t) {//«
		return function(t) {
			if (Array.isArray(t)) {
				for (var e = 0, i = new Array(t.length); e < t.length; e++) i[e] = t[e];
				return i
			}
		}(t) || function(t) {
			if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
		}(t) || function() {
			throw new TypeError("Invalid attempt to spread non-iterable instance")
		}()
	}//»
	function u() {//«
		var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
			e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
			i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
		this.x = t, this.y = e, this.z = i
	}//»
	function c() {//«
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
			return a(u, l(t))
		}), this.p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180], this.perm = new Array(Math.pow(2, 9)), this.gradP = new Array(Math.pow(2, 9)), this.F2 = .5 * (Math.sqrt(3) - 1), this.G2 = (3 - Math.sqrt(3)) / 6, this.F3 = 1 / 3, this.G3 = 1 / 6, this.seed(Date.now())
	}//»
	Object.defineProperties(u.prototype, {//«
		dot2: {
			value: function(t, e) {
				return this.x * t + this.y * e
			}
		},
		dot3: {
			value: function(t, e, i) {
				return this.dot2(t, e) + this.z * i
			}
		}
	}),//»
	Object.defineProperties(c.prototype, {//«
		seed: {
			value: function(t) {
				t > 0 && t < 1 && (t *= Math.pow(2, 16)), (t = Math.floor(t)) < Math.pow(2, 8) && (t |= t << Math.pow(2, 3));
				for (var e = 0; e < Math.pow(2, 8); e++) {
					var i = 1 & e ? 0 : Math.pow(2, 3),
						n = this.p[e] ^ t >> i & Math.pow(2, 8) - 1;
					this.perm[e] = this.perm[e + Math.pow(2, 8)] = n, this.gradP[e] = this.gradP[e + Math.pow(2, 8)] = this.grad3[n % this.grad3.length]
				}
			}
		},
		simplex2: {
			value: function(t, e) {
				var i = (t + e) * this.F2,
					n = Math.floor(t + i),
					r = Math.floor(e + i),
					s = (n + r) * this.G2,
					o = t - n + s,
					a = e - r + s,
					h = o > a ? 1 : 0,
					l = 1 - h,
					u = o - h + this.G2,
					c = a - l + this.G2,
					f = o - 1 + 2 * this.G2,
					p = a - 1 + 2 * this.G2;
				n &= Math.pow(2, 8) - 1, r &= Math.pow(2, 8) - 1;
				var d = this.gradP[n + this.perm[r]],
					m = this.gradP[n + h + this.perm[r + l]],
					g = this.gradP[n + 1 + this.perm[r + 1]],
					v = .5 - Math.pow(o, 2) - Math.pow(a, 2),
					y = v < 0 ? 0 : Math.pow(v, 4) * d.dot2(o, a),
					b = .5 - Math.pow(u, 2) - Math.pow(c, 2),
					w = b < 0 ? 0 : Math.pow(b, 4) * m.dot2(u, c),
					M = .5 - Math.pow(f, 2) - Math.pow(p, 2);
				return 70 * (y + w + (M < 0 ? 0 : Math.pow(M, 4) * g.dot2(f, p)))
			}
		},
		simplex1: {
			value: function(t) {
				return this.simplex2(1.2 * t, -.7 * t)
			}
		}
	});//»
	var f = c;
	function p(t, e) {//«
		for (var i = 0; i < e.length; i++) {
			var n = e[i];
			n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
		}
	}//»
	Math.clamp=function(t,e,i){return t<=e ? e:t<i ? t:i};
	var d = function() {//«
		function t() {//«
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
		}//»
		var e, i, n;
		return e = t,
		(i = [
			{key: "process",//«
			value: function(t, e, i, n) {
				var r = t.intensity,
					s = t.loudness,
					o = 0;
				if (o += t.vibratoGain * Math.sin(2 * Math.PI * n * t.vibratoFrequency), o += .02 * this.noise.simplex1(4.07 * n), o += .04 * this.noise.simplex1(2.15 * n), t.vibratoWobble > 0) {
					var a = 0;
					a += .2 * this.noise.simplex1(.98 * n), o += (a += .4 * this.noise.simplex1(.5 * n)) * t.vibratoWobble
				}
				var h = t.frequency;
				h *= 1 + o;
				var l = t.tenseness;
				l += .1 * this.noise.simplex1(.46 * n), l += .05 * this.noise.simplex1(.36 * n), l += (3 - l) * (1 - r);
				var u = 1 / h,
					c = n - this.startSeconds,
					f = c / u;
				f >= 1 && (this.startSeconds = n + c % u, f = this.startSeconds / u, this._updateCoefficients(l));
				var p = 0,
					d = this._getNoiseModulator(f);
				d += 3 * (1 - l * r), t.noiseModulator = d;
				var m = t.noise;
				m *= d, m *= r, m *= r, m *= 1 - Math.sqrt(Math.max(l, 0)), m *= .02 * this.noise.simplex1(1.99 * n) + .2;
				var g = this._getNormalizedWaveform(f);
				return g *= r, p = m + (g *= s), p *= r
			}
		},//»
		{key:"update",value:function(){}},
		{key: "_updateCoefficients",//«
			value: function() {
				var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
					e = {};
				e.d = Math.clamp(3 * (1 - t), .5, 2.7), e.a = .048 * e.d - .01, e.k = .224 + .118 * e.d, e.g = e.k / 4 * (.5 + 1.2 * e.k) / (.11 * e.d - e.a * (.5 + 1.2 * e.k));
				var i = {};
				i.a = e.a, i.p = 1 / (2 * e.g), i.e = i.p + i.p * e.k, this.coefficients.epsilon = 1 / i.a, this.coefficients.shift = Math.exp(-this.coefficients.epsilon * (1 - i.e)), this.coefficients.Delta = 1 - this.coefficients.shift;
				var n = {};
				n.RHS = (1 / this.coefficients.epsilon * (this.coefficients.shift - 1) + (1 - i.e) * this.coefficients.shift) / this.coefficients.Delta, n.total = {}, n.total.lower = -(i.e - i.p) / 2 + n.RHS, n.total.upper = -n.total.lower, this.coefficients.omega = Math.PI / i.p;
				var r = Math.sin(this.coefficients.omega * i.e),
					s = -Math.PI * r * n.total.upper / (2 * i.p),
					o = Math.log(s);
				this.coefficients.alpha = o / (i.p / 2 - i.e), this.coefficients.E0 = -1 / (r * Math.exp(this.coefficients.alpha * i.e)), this.coefficients.Te = i.e
			}
		},//»
		{key: "_getNormalizedWaveform",//«
			value: function(t) {
				return t > this.coefficients.Te ? (-Math.exp(-this.coefficients.epsilon * (t - this.coefficients.Te)) + this.coefficients.shift) / this.coefficients.Delta : this.coefficients.E0 * Math.exp(this.coefficients.alpha * t) * Math.sin(this.coefficients.omega * t)
			}
		},//»
		{key: "_getNoiseModulator",//«
			value: function(t) {
				var e = 2 * Math.PI * t,
					i = Math.sin(e);
				return .2 * Math.max(0, i) + .1
			}
		}//»
		]) && p(e.prototype, i), n && p(e, n), t
	}();//»

	var m = function t(e) {//«
		! function(t, e) {
			if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
		}(this, t), this.length = Math.floor(28 * e.length / 44), this.start = e.length - this.length + 1, this.fade = 1, this.offset = .8, this.left = new Float64Array(this.length), this.left.junction = new Float64Array(this.length + 1), this.right = new Float64Array(this.length), this.right.junction = new Float64Array(this.length + 1), this.reflection = new Float64Array(this.length + 1), this.reflection.value = 0, this.reflection.new = 0, this.diameter = new Float64Array(this.length), this.amplitude = new Float64Array(this.length), this.amplitude.max = new Float64Array(this.length);
		for (var i = 0; i < this.length; i++) {
			var n = i / this.length,
				r = n < .5 ? .4 + 2 * n * 1.6 : .5 + 1.5 * (2 - 2 * n);
			this.diameter[i] = Math.min(r, 1.9)
		}
		for (var s = 0; s < this.length; s++) this.amplitude[s] = Math.pow(this.diameter[s], 2), s > 0 && (this.reflection[s] = (this.amplitude[s - 1] - this.amplitude[s]) / (this.amplitude[s - 1] + this.amplitude[s]));
		this.diameter[0] = e.velum.target
	};//»
	function g(t, e) {//«
		for (var i = 0; i < e.length; i++) {
			var n = e[i];
			n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
		}
	}//»
	var v = function() {//«
		function t(e, i) {
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this.position = e, this.startTime = i, this.timeAlive = 0, this.lifetime = .2, this.strength = .3, this.exponent = 200
		}
		var e, i, n;
		return e = t, (i = [
			{
				key: "update",
				value: function(t) {
					this.timeAlive = t - this.startTime
				}
			},
			{
				key: "amplitude",
				get: function() {
					return this.strength * Math.pow(-2, this.timeAlive * this.exponent)
				}
			},
			{
				key: "isAlive",
				get: function() {
					return this.timeAlive < this.lifetime
				}
			}
		]) && g(e.prototype, i), n && g(e, n), t
	}();//»
	function y(t, e) {//«
		for (var i = 0; i < e.length; i++) {
			var n = e[i];
			n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
		}
	}//»
	Math.interpolate=function(t,e,i){return e *(1-t)+i * t},
	Math.clamp=function(t,e,i){return t<=e ? e:t<i ? t:i};
	var b = function() {//Lips,Nose,Tract«
		function t() {//«
			var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 44;
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t),
			this.length = e,
			this.blade={start:Math.floor(10 * this.length / 44)},
			this.tip={start:Math.floor(32 * this.length / 44)},
			this.lip={start:Math.floor(39 * this.length / 44),reflection:-.85},
			this.glottis={reflection:.75},
			this.velum={target:.01},
			this.grid={offset:1.7},
			this.right = new Float64Array(this.length),
			this.right.junction = new Float64Array(this.length + 1),
			this.right.reflection={value:0,new:0},
			this.left = new Float64Array(this.length),
			this.left.junction = new Float64Array(this.length + 1),
			this.left.reflection={value:0,new:0},
			this.reflection = new Float64Array(this.length + 1),
			this.reflection.new = new Float64Array(this.length + 1),
			this.amplitude = new Float64Array(this.length),
			this.amplitude.max = new Float64Array(this.length),
			this.diameter = new Float64Array(this.length), 
			this.diameter.rest = new Float64Array(this.length),
			this.tongue = {//«
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
				},//»
				get diameter(){return this._diameter},
				set diameter(t){this._diameter=Math.clamp(t,this.range.diameter.minValue,this.range.diameter.maxValue)},
				get index(){return this._index},
				set index(t) {//«
					var e = 1 - this.range.diameter.interpolation(this.diameter),
						i = Math.pow(e, .58) - .2 * (Math.pow(e, 2) - e),
						n = this.range.index.centerOffset(i);
					this._index = Math.clamp(t, this.range.index.center - n, this.range.index.center + n)
				}//»
			},
			this.nose = new m(this),
			this.transients = [],
			this.transients.obstruction={last:-1,new:-1},
			this.previousConstrictions = [],
			this.previousConstrictions.tongue = {};
			for (var i = 0; i < this.length; i++) {//«
				var n = 0;
				n = i < 7 * this.length / 44 - .5 ? .6 : i < 12 * this.length / 44 ? 1.1 : 1.5, this.diameter[i] = n, this.diameter.rest[i] = n
			}//»
			this._updateReflection()
		}//»
		var e, i, n;
		return e = t, (i = [
		{key: "process",//«
		value: function(t, e, i, n) {//«
			this.tongue.diameter = t.tongueDiameter, this.tongue.index = t.tongueIndex, this._processTransients(n), this._processConstrictions(this.previousConstrictions, t);
			var r = e / i,
				s = Math.random() < .1,
				o = 0;
			return o += this._processLips(t, r, s),
				o += this._processNose(t, r, s),
				isNaN(o) && this.reset(),
				o
		}//»
		},//»
		{key: "_processTransients",//«
			value: function(t) {
				for (var e = this.transients.length - 1; e >= 0; e--) {
					var i = this.transients[e];
					this.left[i.position] += i.amplitude, i.update(t), i.isAlive || this.transients.splice(e, 1)
				}
			}
		}, //»
		{key: "_processConstrictions",//«
		value: function(t, e) {//«
			for (var i = 0; i < t.length; i++) {
				var n = t[i];
				if (n.index >= 2 && n.index <= this.length && n.diameter > 0) {
					var r = e.glottis;
					r *= .66 * e.noiseModulator, r *= Math.clamp(8 * (.7 - n.diameter), 0, 1) * Math.clamp(30 * (n.diameter - .3), 0, 1) / 2;
					var s = Math.floor(n.index),
						o = r * (n.index - s),
						a = s + 1,
						h = r * (a - n.index);
					this.right[s + 1] += o, this.right[a + 1] += h, this.left[s + 1] += o, this.left[a + 1] += h
				}
			}
		}//»
		},//»
		{key: "_processLips",//«
		value: function(t, e, i) {//«
			this.right.junction[0] = this.left[0] * this.glottis.reflection + t.glottis, this.left.junction[this.length] = this.right[this.length - 1] * this.lip.reflection;
			for (var n = 1; n < this.length; n++) {
				var r = Math.interpolate(e, this.reflection[n], this.reflection.new[n]) * (this.right[n - 1] + this.left[n]);
				this.right.junction[n] = this.right[n - 1] - r, this.left.junction[n] = this.left[n] + r
			}
			var s = Math.interpolate(e, this.left.reflection.new, this.left.reflection.value);
			this.left.junction[this.nose.start] = s * this.right[this.nose.start - 1] + (s + 1) * (this.nose.left[0] + this.left[this.nose.start]);
			var o = Math.interpolate(e, this.right.reflection.new, this.right.reflection.value);
			this.right.junction[this.nose.start] = o * this.left[this.nose.start] + (o + 1) * (this.nose.left[0] + this.right[this.nose.start - 1]);
			var a = Math.interpolate(e, this.nose.reflection.new, this.nose.reflection.value);
			this.nose.right.junction[0] = a * this.nose.left[0] + (a + 1) * (this.left[this.nose.start] + this.right[this.nose.start - 1]);
			for (var h = 0; h < this.length; h++)
				if (this.right[h] = .999 * this.right.junction[h], this.left[h] = .999 * this.left.junction[h + 1], i) {
					var l = Math.abs(this.left[h] + this.right[h]);
					this.amplitude.max[h] = l > this.amplitude.max[h] ? l : .999 * this.amplitude.max[h]
				} return this.right[this.length - 1]
		}//»
		},//»
		{key: "_processNose",//«
		value: function(t, e, i) {//«
			this.nose.left.junction[this.nose.length] = this.nose.right[this.nose.length - 1] * this.lip.reflection;
			for (var n = 1; n < this.nose.length; n++) {
				var r = this.nose.reflection[n] * (this.nose.left[n] + this.nose.right[n - 1]);
				this.nose.left.junction[n] = this.nose.left[n] + r, this.nose.right.junction[n] = this.nose.right[n - 1] - r
			}
			for (var s = 0; s < this.nose.length; s++)
				if (this.nose.left[s] = this.nose.left.junction[s + 1] * this.nose.fade, this.nose.right[s] = this.nose.right.junction[s] * this.nose.fade, i) {
					var o = Math.abs(this.nose.left[s] + this.nose.right[s]);
					this.nose.amplitude.max[s] = o > this.nose.amplitude.max[s] ? o : .999 * this.nose.amplitude.max[s]
				} return this.nose.right[this.nose.length - 1]
		}//»
		},//»
		{key: "update",//«
		value: function(t, e) {//«
			this._updateTract(),
			this._updateTransients(t),
			this.nose.diameter[0] = this.velum.target,
			this.nose.amplitude[0] = Math.pow(this.nose.diameter[0], 2),
			this._updateReflection(),
			this._updateConstrictions(e)
		}//»
		},//»
		{key: "_updateDiameterRest",//«
		value: function() {//«
			for (var t = this.blade.start; t < this.lip.start; t++) {
				var e = (this.tongue.index - t) / (this.tip.start - this.blade.start),
					i = 1.1 * Math.PI * e,
					n = (1.5 - (2 + (this.tongue.diameter - 2) / 1.5) + this.grid.offset) * Math.cos(i);
				t != this.blade.start - 2 && t != this.lip.start - 1 || (n *= .8), t != this.blade.start + 0 && t != this.lip.start - 2 || (n *= .94);
				var r = 1.5 - n;
				this.diameter.rest[t] = r
			}
		}//»
		},//»
		{key: "_updateConstrictions",//«
		value: function(t) {//«
			var e = !1;
			e = e || this.tongue.index !== this.previousConstrictions.tongue.index || this.tongue.diameter !== this.previousConstrictions.tongue.diameter;
			for (var i = Math.max(this.previousConstrictions.length, t.length), n = 0, r = t[0], s = this.previousConstrictions[0]; !e && n < i; r = t[++n], s = this.previousConstrictions[n]) e = void 0 !== r && void 0 !== s ? r.index !== s.index || r.diameter !== s.diameter : !(null == r && null == s);
			if (e) {
				this._updateDiameterRest();
				for (var o = 0; o < this.length; o++) this.diameter[o] = this.diameter.rest[o];
				this.velum.target = .01;
				for (var a = -1; a < t.length; a++) {
					var h = t[a] || this.tongue;
					if (h.index > this.nose.start && h.diameter < -this.nose.offset && (this.velum.target = .4), h.index >= 2 && h.index < this.length && h.diameter > -(.85 + this.nose.offset)) {
						var l = h.diameter;
						if (l -= .3, (l = Math.max(0, l)) < 3) {
							var u = 2;
							u = h.index < 25 ? 10 : h.index >= this.tip.start ? 5 : 10 - 5 * (h.index - 25) / (this.tip.start - 25);
							for (var c = Math.round(h.index), f = c - (Math.ceil(u) + 1); f < c + u + 1 && f >= 0 && f < this.length; f++) {
								var p, d = Math.abs(f - h.index) - .5;
								p = d <= 0 ? 0 : d > u ? 1 : .5 * (1 - Math.cos(Math.PI * d / u));
								var m = this.diameter[f] - l;
								m > 0 && (this.diameter[f] = l + m * p)
							}
						}
					}
				}
				this.previousConstrictions=t,this.previousConstrictions.tongue={index:this.tongue.index,diameter:this.tongue.diameter}
			}
		}//»
		},//»
		{key: "_updateTract",//«
		value: function() {//«
			for (var t = 0; t < this.length; t++) this.diameter[t] <= 0 && (this.transients.obstruction.new = t)
		}//»
		},//»
		{key: "_updateTransients",//«
		value: function(t) {//«
			this.nose.amplitude[0] < .05 && (this.transients.obstruction.last > -1 && -1 == this.transients.obstruction.new && this.transients.push(new v(this.transients.obstruction.new, t)), this.transients.obstruction.last = this.transients.obstruction.new)
		}//»
		},//»
		{key: "_updateReflection",//«
		value: function() {
			for (var t = 0; t < this.length; t++) this.amplitude[t] = Math.pow(this.diameter[t], 2), t > 0 && (this.reflection[t] = this.reflection.new[t], this.reflection.new[t] = 0 == this.amplitude[t] ? .999 : (this.amplitude[t - 1] - this.amplitude[t]) / (this.amplitude[t - 1] + this.amplitude[t]));
			var e = this.amplitude[this.nose.start] + this.amplitude[this.nose.start + 1] + this.nose.amplitude[0];
			this.left.reflection.value = this.left.reflection.new, this.left.reflection.new = (2 * this.amplitude[this.nose.start] - e) / e, this.right.reflection.value = this.right.reflection.new, this.right.reflection.new = (2 * this.amplitude[this.nose.start + 1] - e) / e, this.nose.reflection.value = this.nose.reflection.new, this.nose.reflection.new = (2 * this.nose.amplitude[0] - e) / e
		}
		},//»
		{key: "reset",//«
		value: function() {
			this.right.fill(0), this.right.junction.fill(0), this.left.fill(0), this.left.junction.fill(0), this.nose.left.fill(0), this.nose.left.junction.fill(0), this.nose.right.fill(0), this.nose.right.junction.fill(0)
		}
		}//»
		]) && y(e.prototype, i), n && y(e, n), t
	}();//»
	function w(t, e) {//«
		for (var i = 0; i < e.length; i++) {
			var n = e[i];
			n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
		}
	}//»
	var M = function() {//Glottis«
		function t() {
			! function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t), this.glottis = new d, this.tract = new b
		}
		var e, i, n;
		return e = t, (i = [{
			key: "process",
			value: function(t, e, i, n) {
				var r, s, o = 0,
					a = (r = this.glottis).process.apply(r, arguments);
				return t.glottis = a, o += (s = this.tract).process.apply(s, arguments), e += .5, o += this.tract.process(t, e, i, n), o *= .125
			}
		}, {
			key: "update",
			value: function(t, e) {
				this.glottis.update(), this.tract.update(t, e)
			}
		}]) && w(e.prototype, i), n && w(e, n), t
	}();//»
	function x(t) {//«
		return (x = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
			return typeof t
		} : function(t) {
			return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
		})(t)
	}//»
	function _(t, e) {//«
		for (var i = 0; i < e.length; i++) {
			var n = e[i];
			n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
		}
	}//»
	function j(t, e) {//«
		return !e || "object" !== x(e) && "function" != typeof e ? function(t) {
			if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return t
		}(t) : e
	}//»
	function k(t) {//«
		var e = "function" == typeof Map ? new Map : void 0;
		return (k = function(t) {
			if (null === t || (i = t, -1 === Function.toString.call(i).indexOf("[native code]"))) return t;
			var i;
			if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
			if (void 0 !== e) {
				if (e.has(t)) return e.get(t);
				e.set(t, n)
			}

			function n() {
				return V(t, arguments, P(this).constructor)
			}
			return n.prototype = Object.create(t.prototype, {
				constructor: {
					value: n,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), C(n, t)
		})(t)
	}//»
	function V(t, e, i) {//«
		return (V = function() {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0
			} catch (t) {
				return !1
			}
		}() ? Reflect.construct : function(t, e, i) {
			var n = [null];
			n.push.apply(n, e);
			var r = new(Function.bind.apply(t, n));
			return i && C(r, i.prototype), r
		}).apply(null, arguments)
	}//»
	function C(t, e) {//«
		return (C = Object.setPrototypeOf || function(t, e) {
			return t.__proto__ = e, t
		})(t, e)
	}//»
	function P(t) {//«
		return (P = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
			return t.__proto__ || Object.getPrototypeOf(t)
		})(t)
	}//»
	registerProcessor("pink-trombone-worklet-processor", function(t) {//«
		function e() {//«
			var t;
			return function(t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, e), (t = j(this, P(e).call(this))).processor = new M, t.enabledConstrictionIndices = [],
				t.port.onmessage = function(e) {
//log(e.data.name);
				switch (e.data.name) {
					case "enableConstriction":
console.warn("enable in");
						t.enabledConstrictionIndices[e.data.constrictionIndex] = !0, t.port.postMessage(e.data);
						break;
					case "disableConstriction":
						t.enabledConstrictionIndices[e.data.constrictionIndex] = !1, t.port.postMessage(e.data);
						break;
					case "enabledConstrictionIndices":
						e.data.enabledConstrictionIndices = t.enabledConstrictionIndices, t.port.postMessage(e.data);
						break;
					case "getProcessor":
console.warn("processor in");
						e.data.processor = JSON.stringify(t.processor), t.port.postMessage(e.data)
				}
			}, t
		}//»
		var i, n, r;
		return function(t, e) {//«
			if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
			t.prototype = Object.create(e && e.prototype, {
				constructor: {
					value: t,
					writable: !0,
					configurable: !0
				}
			}), e && C(t, e)
		}(e, k(AudioWorkletProcessor)),//»
		i = e,
		r=[{key:"parameterDescriptors",get:function(){return o}}],
		(n = [
		{key: "_getParameterSamples",//«
			value: function(t, e) {
				for (var i = {}, n = 0; n < this.constructor.parameterDescriptors.length; n++) {
					var r = this.constructor.parameterDescriptors[n];
					r.name.includes("constriction") || (i[r.name] = 1 == t[r.name].length ? t[r.name][0] : t[r.name][e])
				}
				return i
			}
		},//»
		{key: "_getConstrictions",//«
			value: function(t) {
				for (var e = [], i = 0; i < o.numberOfConstrictions; i++)
					if (this.enabledConstrictionIndices[i]) {
						var n = "constriction" + i,
							r = {
								index: t[n + "index"][0],
								diameter: t[n + "diameter"][0]
							};
						e[i] = r
					} return e
			}
		},//»
		{key: "process",//«
			value: function(t, e, i) {
				for (var n = this._getConstrictions(i), r = 0; r < e.length; r++)
					for (var s = 0; s < e[r].length; s++)
						for (var o = 0; o < e[r][s].length; o++) {
							var a = this._getParameterSamples(i, o),
								h = currentTime + o / sampleRate,
								l = this.processor.process(a, o, e[r][s].length, h);
							e[r][s][o] = l
						}
				return this.processor.update(currentTime + e[0][0].length / sampleRate, n), !0
			}
		}//»
		]) && _(i.prototype, n), r && _(i, r), e
	}())//»
}//»
]);
