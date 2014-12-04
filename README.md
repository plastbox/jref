jref
====

Internal reference mechanic for JSON.

Overloads JSON.parse/stringify.

JSON.stringify
--------------
Builds a dictionary of all objects contained in the to-be-stringified object, with paths for each occurrence. Replaces every occurrence with the string "jref:shortest.path.to.object"

`var foo = {name: 'Ed', car: {color:'blue'}};`
`foo.car.owner = foo; // This creates a circular reference.`
`JSON.stringify(foo); // Returns "{"name":"Ed","car":{"color":"blue","owner":"jref:this"}}"`

JSON.parse
----------
Recreates all jref-references, including primitives.

`var ed = JSON.parse('{"name":"Ed","car":{"color":"blue","owner":"jref:this","owner_name":"jref:this.name"}}');`
`console.log(ed.car.owner.car.owner.car.owner); // The outmost object`
`console.log(ed.car.owner_name); // 'Ed'`
`ed.car.owner_name = 'Frank';`
`console.log(ed.name); // 'Frank'`
