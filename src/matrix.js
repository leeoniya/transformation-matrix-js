/*!
 *	Transformation Matrix JS v1.1 (c) Epistemex 2014
 *	www.epistemex.com
 *	License: MIT, header required.
*/

/**
 * 2D transformation matrix object initialized with identity matrix.
 *
 * The matrix can synchronize a canvas context by supplying the context
 * as an argument.
 *
 * All values are handled as floating point values.
 *
 * @param {CanvasRenderingContext2D} [context] - Optional context to sync with Matrix
 * @prop {number} a - scale x
 * @prop {number} b - skew y
 * @prop {number} c - skew x
 * @prop {number} d - scale y
 * @prop {number} e - translate x
 * @prop {number} f - translate y
 * @prop {CanvasRenderingContext2D} [context] - set or get current canvas context
 * @constructor
 */
function Matrix(context) {

	this.a = 1;
	this.b = 0;
	this.c = 0;
	this.d = 1;
	this.e = 0;
	this.f = 0;

	this.context = context;

	// reset canvas to enable 100% sync.
	if (context) context.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Adds the values to the current matrix.
 * @param {number} a - scale x
 * @param {number} b - skew y
 * @param {number} c - skew x
 * @param {number} d - scale y
 * @param {number} e - translate x
 * @param {number} f - translate y
 */
Matrix.prototype.add = function(a, b, c, d, e, f) {

	this.a += a;
	this.b += b;
	this.c += c;
	this.d += d;
	this.e += e;
	this.f += f;

	if (this.context)
		this.context.setTransform(this.a, this.b, this.c, this.d, this.e, this.f);
};

/**
 * Adds another matrix object to current matrix
 * @param {Matrix} m - matrix to add to current matrix
 */
Matrix.prototype.addMatrix = function(m) {
	this.add(m.a, m.b, m.c, m.d, m.e, m.f);
};

/**
 * Short-hand to reset current matrix to an identity matrix.
 */
Matrix.prototype.reset = function() {
	this.a = this.d = 1;
	this.b = this.c = this.e = this.f = 0;

	if (this.context)
		this.context.setTransform(1, 0, 0, 1, 0, 0);
};

/**
 * Rotates current matrix accumulative by angle.
 * @param {number} angle - angle in radians
 */
Matrix.prototype.rotate = function(angle) {

	var cos = Math.cos(angle),
		sin = Math.sin(angle);

	this.transform(cos, sin, -sin, cos, 0, 0);
};

/**
 * Scales current matrix accumulative.
 * @param {number} sx - scale factor x (1 does nothing)
 * @param {number} sy - scale factor y (1 does nothing)
 */
Matrix.prototype.scale = function(sx, sy) {
	this.transform(sx, 0, 0, sy, 0, 0);
};

/**
 * Apply skew to the current matrix accumulative.
 * @param {number} sx - amount of skew for x
 * @param {number} sy - amount of skew for y
 */
Matrix.prototype.skew = function(sx, sy) {
	this.transform(1, sy, sx, 1, 0, 0);
};

/**
 * Set current matrix to new absolute matrix.
 * @param {number} a - scale x
 * @param {number} b - skew y
 * @param {number} c - skew x
 * @param {number} d - scale y
 * @param {number} e - translate x
 * @param {number} f - translate y
 */
Matrix.prototype.setTransform = function(a, b, c, d, e, f) {

	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
	this.e = e;
	this.f = f;

	if (this.context)
		this.context.setTransform(this.a, this.b, this.c, this.d, this.e, this.f);
};

/**
 * Subtracts the values from the current matrix.
 * @param {number} a - scale x
 * @param {number} b - skew y
 * @param {number} c - skew x
 * @param {number} d - scale y
 * @param {number} e - translate x
 * @param {number} f - translate y
 */
Matrix.prototype.subtract = function(a, b, c, d, e, f) {

	this.a -= a;
	this.b -= b;
	this.c -= c;
	this.d -= d;
	this.e -= e;
	this.f -= f;

	if (this.context)
		this.context.setTransform(this.a, this.b, this.c, this.d, this.e, this.f);
};

/**
 * Subtracts another matrix object from current matrix
 * @param {Matrix} m - matrix to subtract from current matrix
 */
Matrix.prototype.subtractMatrix = function(m) {
	this.subtract(m.a, m.b, m.c, m.d, m.e, m.f);
};

/**
 * Translate current matrix accumulative.
 * @param {number} tx - translation for x
 * @param {number} ty - translation for y
 */
Matrix.prototype.translate = function(tx, ty) {
	this.transform(1, 0, 0, 1, tx, ty);
};

/**
 * Multiplies current matrix with new matrix values.
 * @param {number} a2 - scale x
 * @param {number} b2 - skew y
 * @param {number} c2 - skew x
 * @param {number} d2 - scale y
 * @param {number} e2 - translate x
 * @param {number} f2 - translate y
 */
Matrix.prototype.transform = function(a2, b2, c2, d2, e2, f2) {

	var	a1 = this.a,
		b1 = this.b,
		c1 = this.c,
		d1 = this.d,
		e1 = this.e,
		f1 = this.f;

	/* matrix order (canvas compatible):
	 *	ace
	 *	bdf
	 *	001
	 */
	this.a = a1 * a2 + c1 * b2;
	this.b = b1 * a2 + d1 * b2;
	this.c = a1 * c2 + c1 * d2;
	this.d = b1 * c2 + d1 * d2;
	this.e = a1 * e2 + c1 * f2 + e1;
	this.f = b1 * e2 + d1 * f2 + f1;

	if (this.context)
		this.context.setTransform(this.a, this.b, this.c, this.d, this.e, this.f);
};

/**
 * Get an inverse matrix of current matrix. The method returns a ne
 * matrix with values you need to use to get to an identity matrix.
 * @returns {Matrix}
 */
Matrix.prototype.getInverse = function() {

	var	a = this.a,
		b = this.b,
		c = this.c,
		d = this.d,
		e = this.e,
		f = this.f,
		m = new Matrix(),
		p = (a * d - b * c);

	m.a = d / p;
	m.b = -b / p;
	m.c = -c / p;
	m.d = a / p;
	m.e = (c * f - d * e) / p;
	m.f = -(a * f - b * e) / p;

	m.context = this.context;

	return m;
};

/**
 * Interpolate this matrix with another and produce a new matrix.
 * t is a value in the range [0.0, 1.0] where 0 is this instance and
 * 1 is equal to the second matrix. The t value is not constrained.
 *
 * @param {Matrix} m2 - the matrix to interpolate with.
 * @param {number} t - interpolation [0.0, 1.0]
 * @returns {Matrix} - new instance with the interpolated result
 */
Matrix.prototype.interpolate = function(m2, t) {

	var m = new Matrix();

	m.a = this.a + (m2.a - this.a) * t;
	m.b = this.b + (m2.b - this.b) * t;
	m.c = this.c + (m2.c - this.c) * t;
	m.d = this.d + (m2.d - this.d) * t;
	m.e = this.e + (m2.e - this.e) * t;
	m.f = this.f + (m2.f - this.f) * t;

	m.context = this.context;

	return m;
};

/**
 * Apply current matrix to x and y point.
 * Returns a point object.
 *
 * @param {number} x - value for x
 * @param {number} y - value for y
 * @returns {{x: number, y: number}} A new transformed point object
 */
Matrix.prototype.applyToPoint = function(x, y) {

	var nx, ny;

	nx = x * this.a + y * this.c + this.e;
	ny = x * this.b + y * this.d + this.f;

	return {x: nx, y: ny};
};

/**
 * Apply current matrix to array with point objects or point pairs.
 * Returns a new array with points in the same format as the input array.
 *
 * A point object is an object literal:
 *
 *     {x: x, y: y}
 *
 * so an array would contain either:
 *
 *     [{x: x1, y: y1}, {x: x2, y: y2}, ... {x: xn, y: yn}]
 *
 * or
 *     [x1, y1, x2, y2, ... xn, yn]
 *
 * @param {Array} points - array with point objects or pairs
 * @returns {Array} A new array with transformed points
 */
Matrix.prototype.applyToArray = function(points) {

	var i = 0, p, mxPoints = [], x, y;

	if (typeof points[0] === 'number') {
		for(; p = points[i]; i += 2) {

			x = p[i] * this.a + p[i+1] * this.c + this.e;
			y = p[i] * this.b + p[i+1] * this.d + this.f;

			mxPoints.push(x, y);
		}
	}
	else{
		for(; p = points[i++];) {

			x = p.x * this.a + p.y * this.c + this.e;
			y = p.x * this.b + p.y * this.d + this.f;

			mxPoints.push({x: x, y: y});
		}
	}

	return mxPoints;
};

/**
 * Returns true if matrix is an identity matrix (no transforms applied).
 * @returns {boolean} True if identity (not transformed)
 */
Matrix.prototype.isIdentity = function() {
	return (this.a === 1 && this.b === 0 && this.c === 0 &&
			this.d === 1 && this.e === 0 && this.f === 0);
};
