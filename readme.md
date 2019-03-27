2D Affine Transformation Matrix
-------------------------------

A affine transformation matrix (3x3) class for JavaScript that performs
various transformations such as rotate, scale, translate, skew, add, subtract
and multiply.

It's intended for situations where you need to track or create transforms
and want to apply it permanently/manually to your own points.

The matrix can optionally synchronize a canvas 2D context object so the transformations
on the canvas matches pixel perfect the local transformations of the Matrix object.

No dependencies.


Usage
-----

Just include the script and create a new instance like:

    var matrix = new Matrix([context]);

You can supply an optional context as argument which in case will be
synchronized with the transformations that are applied to the matrix
object.

You can now apply transformations:

    matrix.rotate(angle);    		        // angle in radians
    matrix.rotateDeg(angle);   		        // angle in degrees
    matrix.translate(x, y);
    matrix.translateX(x);
    matrix.translateY(y);
    matrix.scale(sx, sy);
    matrix.scaleX(sx);
    matrix.scaleY(sy);
    matrix.skew(sx, sy);
    matrix.skewX(sx);
    matrix.skewY(sy);
    matrix.transform(a, b, c, d, e, f);
    matrix.setTransform(a, b, c, d, e, f);
	matrix.reset();

Get current transform matrix values:

    var a = matrix.a;	// scale x
    var b = matrix.b;	// skew y
    var c = matrix.c;	// skew x
    var d = matrix.d;	// scale y
    var e = matrix.e;	// translate x
    var f = matrix.f;	// translate y

Apply to a point:

    var tPoint = matrix.applyToPoint(x, y);

Apply to an Array with point objects or point pair values:

    var tPoints = matrix.applyToArray([{x: x1, y: y1}, {x: x2, y: y2}, ...]);
    var tPoints = matrix.applyToArray([x1, y1, x2, y2, ...]);
    var tPoints = matrix.applyToTypedArray(...);

or apply to a canvas context (other than optionally referenced in constructor):

    matrix.applyToContext(myContext);

Get inverse transformation matrix (the matrix you need to apply to get back
to a identity matrix from whatever the matrix contains):

    var invmatrix = matrix.getInverse();

You can interpolate between current and a new matrix. The function
returns a new matrix:

    var imatrix = matrix.interpolate(matrix2, t);  // t = [0.0, 1.0]

Check if there is any transforms applied:

    var status = matrix.isIdentity();              // true if identity

Check if two matrices are identical:

    var status = matrix.isEqual(matrix2);          // true if equal

Reset matrix to an identity matrix:

    matrix.reset();

Clone the matrix

    matrix.clone();

Methods are also chain-able:

    matrix.rotateDeg(45).translate(100, 120);     // rotate, then translate

See documentation for full overview and usage.


License
-------

Released under [MIT license](http://choosealicense.com/licenses/mit/). You can use this class in both commercial and non-commercial projects provided that full header (minified and developer versions) is included.

*&copy; 2014 Epistmex*

![Epistemex](http://i.imgur.com/YxO8CtB.png)