Transformation Matrix
---------------------

A transformation matrix class for JavaScript that performs various transformations
such as rotate, scale, translate and skew.

It's useful if you need to track current transforms or need to implement
custom transforms that can't be pushed through the browser's own implementation
such as in Canvas or CSS. With the class you can apply the transform to your
own point or point arrays.

The matrix is optionally able to synchronize a canvas 2D context (but not dependent on)
so you can apply point transformation at any time and be in sync with what is on the canvas.

It can be used completely as stand-alone. No dependencies.

Usage
-----

Include the script and create a new instance like:

    var matrix = new Matrix([context]);

You can supply an optional context as argument which in case will be
synchronized with the transformations that are applied to the matrix
object.

You can now apply transformations:

    matrix.rotate(angle);    // angle in radians
    matrix.translate(x, y);
    matrix.scale(sx, sy);
    matrix.skew(sx, sy);
    matrix.transform(a, b, c, d, e, f);
    matrix.setTransform(a, b, c, d, e, f);

Get current transforms:

    var a = matrix.a;	// scale x
    var b = matrix.b;	// skew y
    var c = matrix.c;	// skew x
    var d = matrix.d;	// scale y
    var e = matrix.e;	// translate x
    var f = matrix.f;	// translate y

Apply to a point:

    var tPoint = matrix.applyToPoint({x: x, y: y});

Apply to an Array with points:

    var tPoints = matrix.applyToArray([{x: x1, y: y1}, {x: x2, y: y2}, ...]);

Get inverse transformation matrix (the matrix you need to apply to get back
to a identity matrix from whatever the matrix contains):

    var iMatrix = matrix.getInverse();

You can also interpolate between current and a new matrix. The function
returns a new matrix you need to apply:

    var iMatrix = matrix.interpolate(matrix2, t);  // t = [0.0, 1.0]

Check if there is any transforms applied:

    var status = matrix.isIdentity();  // true if identity


License
-------

Released under MIT license. You can use this class in both commercial and
non-commercial projects provided that full header (minified and developer versions)
is included.

&copy; 2014 EPISTEMEX

![Epistemex](http://i.imgur.com/uzOTLjV.png)
