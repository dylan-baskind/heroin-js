Injector = require('./heroin');

function fail(msg) {
  throw new Error(msg || 'fail');
};

describe('Injector', function() {

  it('injects values', function() {
    var inj = new Injector();
    inj.value('foo', 5);

    var invoked = false;
    inj.invoke(function(foo) {
      invoked = true;
      expect(foo).toBe(5);
    });

    expect(invoked).toBe(true);
  });

  it('fails if no value available', function() {
    var inj = new Injector();
    inj.value('foo', 5);

    var invoked = false;
    try {
      inj.invoke(function(bar) { invoked = true; });
      fail();
    } catch (e) {
      expect(invoked).toBe(false);
      // ok
    }
  });

  it('instantiates instances', function() {
    var inj = new Injector();
    inj.value('foo', 5);

    function MyClass(foo) {
      this.x = foo + 5;
    };

    var obj = inj.instantiate(MyClass);
    expect(obj.x).toBe(10);
  });

  it('resolves providers once', function() {
    var n = 0;
    var inj = new Injector();
    inj.value('foo', 5);
    inj.provider('bar', function(foo) {
      n++;
      return 'x' + foo;
    });

    var invoked = false;
    function func(bar) {
      expect(bar).toBe('x5');
      invoked = true;
    }
    inj.invoke(func);

    expect(invoked).toBe(true);
    expect(n).toBe(1);

    inj.invoke(func);
    expect(n).toBe(1); // still 1.
  });

  it('inherits from parent', function() {
    var n = 0;
    var inj = new Injector();
    inj.value('foo', 5);
    inj.provider('bar', function(foo) {
      n++;
      return 'x' + foo;
    });

    var child = inj.child();
    child.value('childVal', 7);

    var invoked = false;
    function func(bar, childVal) {
      expect(bar).toBe('x5');
      expect(childVal).toBe(7);
      invoked = true;
    }
    child.invoke(func);

    expect(invoked).toBe(true);
    expect(n).toBe(1);
  });

});
