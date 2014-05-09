/*!
 *	Transformation Matrix JS v1.4 (c) Epistemex 2014
 *	www.epistemex.com
 *	License: MIT, this header required.
*/

/**
 * 2D transformation matrix object initialized with identity matrix.
 *
 * The matrix can synchronize a canvas context by supplying the context
 * as an argument, or later apply current absolute transform to an
 * existing context.
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
 * Flips the horizontal values.
 */
Matrix.prototype.flipX = function() {
	this.transform(-1, 0, 0, 1, 0, 0);
	return this;
};

/**
 * Flips the vertical values.
 */
Matrix.prototype.flipY = function() {
	this.transform(1, 0, 0, -1, 0, 0);
	return this;
};

/**
 * Short-hand to reset current matrix to an identity matrix.
 */
Matrix.prototype.reset = function() {

	this.a = this.d = 1;
	this.b = this.c = this.e = this.f = 0;

	this._setCtx();

	return this;
};

/**
 * Rotates current matrix accumulative by angle.
 * @param {number} angle - angle in radians
 */
Matrix.prototype.rotate = function(angle) {

	var cos = Math.cos(angle),
		sin = Math.sin(angle);

	this.transform(cos, sin, -sin, cos, 0, 0);

	return this;
};

/**
 * Helper method to make a rotation abased on angle in degrees..
 * @param {number} angle - angle in degrees
 */
Matrix.prototype.rotateDeg = function(angle) {
	this.rotate(angle * Math.PI / 180);
	return this;
};

/**
 * Scales current matrix accumulative.
 * @param {number} sx - scale factor x (1 does nothing)
 * @param {number} sy - scale factor y (1 does nothing)
 */
Matrix.prototype.scale = function(sx, sy) {
	this.transform(sx, 0, 0, sy, 0, 0);
	return this;
};

/**
 * Scales current matrix on x axis accumulative.
 * @param {number} sx - scale factor x (1 does nothing)
 */
Matrix.prototype.scaleX = function(sx) {
	this.transform(sx, 0, 0, 1, 0, 0);
	return this;
};

/**
 * Scales current matrix on y axis accumulative.
 * @param {number} sy - scale factor y (1 does nothing)
 */
Matrix.prototype.scaleY = function(sy) {
	this.transform(1, 0, 0, sy, 0, 0);
	return this;
};

/**
 * Apply skew to the current matrix accumulative.
 * @param {number} sx - amount of skew for x
 * @param {number} sy - amount of skew for y
 */
Matrix.prototype.skew = function(sx, sy) {
	this.transform(1, sy, sx, 1, 0, 0);
	return this;
};

/**
 * Apply skew for x to the current matrix accumulative.
 * @param {number} s - amount of skew for x
 */
Matrix.prototype.skewX = function(s) {
	this.transform(1, 0, s, 1, 0, 0);
	return this;
};

/**
 * Apply skew for y to the current matrix accumulative.
 * @param {number} s - amount of skew for y
 */
Matrix.prototype.skewY = function(s) {
	this.transform(1, s, 0, 1, 0, 0);
	return this;
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

	this._setCtx();

	return this;
};

/**
 * Translate current matrix accumulative.
 * @param {number} tx - translation for x
 * @param {number} ty - translation for y
 */
Matrix.prototype.translate = function(tx, ty) {
	this.transform(1, 0, 0, 1, tx, ty);
	return this;
};

/**
 * Translate current matrix on x axis accumulative.
 * @param {number} tx - translation for x
 */
Matrix.prototype.translateX = function(tx) {
	this.transform(1, 0, 0, 1, tx, 0);
	return this;
};

/**
 * Translate current matrix on y axis accumulative.
 * @param {number} ty - translation for y
 */
Matrix.prototype.translateY = function(ty) {
	this.transform(1, 0, 0, 1, 0, ty);
	return this;
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

	this._setCtx();

	return this;
};

/**
 * Get an inverse matrix of current matrix. The method returns a ne
 * matrix with values you need to use to get to an identity matrix.
 * Context from parent matrix is not applied to the returned matrix.
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
		dt = (a * d - b * c);

	m.a = d / dt;
	m.b = -b / dt;
	m.c = -c / dt;
	m.d = a / dt;
	m.e = (c * f - d * e) / dt;
	m.f = -(a * f - b * e) / dt;

	return m;
};

/**
 * Interpolate this matrix with another and produce a new matrix.
 * t is a value in the range [0.0, 1.0] where 0 is this instance and
 * 1 is equal to the second matrix. The t value is not constrained.
 *
 * Context from parent matrix is not applied to the returned matrix.
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
	else {
		for(; p = points[i++];) {

			x = p.x * this.a + p.y * this.c + this.e;
			y = p.x * this.b + p.y * this.d + this.f;

			mxPoints.push({x: x, y: y});
		}
	}

	return mxPoints;
};

/**
 * Apply to any canvas 2D context object. This does not affect the
 * context that optionally was referenced in constructor unless it is
 * the same context.
 * @param {CanvasRenderingContext2D} context
 */
Matrix.prototype.applyToContext = function(context) {
	context.setTransform(this.a, this.b, this.c, this.d, this.e, this.f);
	return this;
};

/**
 * Returns true if matrix is an identity matrix (no transforms applied).
 * @returns {boolean} True if identity (not transformed)
 */
Matrix.prototype.isIdentity = function() {

	return (this._isEqual(this.a, 1) &&
			this._isEqual(this.b, 0) &&
			this._isEqual(this.c, 0) &&
			this._isEqual(this.d, 1) &&
			this._isEqual(this.e, 0) &&
			this._isEqual(this.f, 0));
};

/**
 * Compares current matrix with another matrix. Returns true if equal
 * (within epsilon tolerance).
 * @param {Matrix} m - matrix to compare this matrix with
 * @returns {boolean}
 */
Matrix.prototype.isEqual = function(m) {

	return (this._isEqual(this.a, m.a) &&
			this._isEqual(this.b, m.b) &&
			this._isEqual(this.c, m.c) &&
			this._isEqual(this.d, m.d) &&
			this._isEqual(this.e, m.e) &&
			this._isEqual(this.f, m.f));
};

/**
 * Compares floating point values with tolerance (epsilon)
 * @param {number} f1 - float 1
 * @param {number} f2 - float 2
 * @returns {boolean}
 * @private
 */
Matrix.prototype._isEqual = function(f1, f2) {
	return Math.abs(f1 - f2) < 1e-14;
};

/**
 * Apply current absolute matrix to context if defined, to sync it.
 * @private
 */
Matrix.prototype._setCtx = function() {
	if (this.context)
		this.context.setTransform(this.a, this.b, this.c, this.d, this.e, this.f);
};
