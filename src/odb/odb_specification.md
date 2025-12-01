# Odb - PouchDB Wrapper
Please help me with creating my PouchDB Wrapper.
This should be implemented inside src/odb subfolder with tests inside src/odb/tests

Core ideas behind this wrapper: PouchDB is good but it's async and also it doesn't have support for Dialog mode - when I need to change some objects in react GUI without writing them immediatly to db.
So I decided to create a small wrapper called Odb. It is created as follows: "new Odb(pouchDbInstance, optionalOptions)"

- Inside Odb there is a field d which is an object that stores as key-values objects from Pouch db.
- Odb does all the same as PouchDb, but is syncronious,
- When any object comes from PouchDb (wrapped with Odb) the object is wrapped to - into OdbObject. OdbObject is then stored into Odb.d
- If we call 'get' we first try reading from Odb.d and if not found - call PouchDB to get and cache it
- `const odbObject:OdbObject = useOdbObject(Odb_or_OdbTransaction, objectId)` is main hook provided by this wrapper.
    - odbObject is a class instance of OdbObject which implements all the features
    - useOdbObject should useState inside it, it should increment it internally every time any change is made to plainObject - to signal react that a rerender is needed.

Core Odb distinction features as a state manager
- PouchDB centered - Odb tries best to be synchronous version of PouchDB
- Transactions - for form dialog support
- setters, togglers and other convenient functions

Odb have
- `getObject(objectId)` - to get OdbObject of specific object
- `deleteObject(objectId)` - deletes an object
- Odb have all the same functions as OdbObject but requires additional first parameter - objectId

Core members and features of OdbObject
- Should watch for object changes in PouchDB
- `.plain()` - returns plain object
- `.reread()` reads OdbObject from PouchDb, we should check for rev and notify react with useState that I've mentioned above. About conflicts: they are very unlikely to happen here, because we rapidly write to PouchDB in setters. So we take simple conflict solving strategy here: it should print exceptions to console and update from PouchDB by default, but this is only when in Odb. OdbTransaction should always be isolated (and store deltas).
- `.write()` writes OdbObject into PouchDb if in Odb. Does nothing when inside a OdbTransaction. Does nothing if no changes in object. `.write()` should be called after each set and setter operation below, but calls to write should be delayed and aggregated.
    - `.write()` returns a promise. This promise should also be added to Odb.promises field. When the promise is resolved - it should be removed from Odb.promises automatically.
    - Odb should also have "async waitForPromises()" that just waits for all current promises over and over, until Odb.promises is finally empty. Again this is a simple strategy because PouchDB is expected to be local so there is no need for something complex here. waitForPromises can be called by app if any await is needed (say if there is an explicit "Save" button in app or if there is a status bar).
    - Whenever a field of an object is changed we should wait until all changes on that object are finished and only after that - write the object to PouchDB. These rules only apply if we operate without a transaction
        - By default we have to wait 15 seconds without any changes to an object for it to be written to PouchDB.
        - OR if object is being constantly changed, then we should write it to PouchDB every 5 minutes.
        - All this timings should be put into options of Odb
        - Also Odb.flush() function should be provided to do this manually.
- `.objectMeta()` - gets meta of an object - this feature will be described and inmplemented later, for now just return undefined. Basically this function will take 'type' field of and object and use other library to get metadata for that type. Most important metadata is about fields - these will be validated. And it will happen in set/setters, it's always sync and is optional (i.e not all objects will have objectMeta). Also this meta will be used by UI in some other use cases like choosing right component to display value of a field or object as whole.
- `.fieldMeta(fieldId)` - gets meta of an object - this feature will be described and implemented later, for now just return undefined
- `.get(fieldId)` - gets value of a field
- `.set(fieldId)` - sets values of a field
- `.clear(fieldId)` - deletes a field from object
- `.toggle(fieldId)` - toggles boolean field
- `.setter(fieldId)` - creates a setter function that writes into fieldId of OdbObject. The function is persistent per each OdbObject instance even after object changes.
- `.constSetter(fieldId, someValue)` - creates a setter that sets specific constantin into field
- `.cleaner(fieldId)` - a function that clears the field
- `.toggler(fieldId)` - toggles a field (useful for boolean fields, converts to boolean when called)
- all setter functions should be persistent so when React compares props they should be equal between calls

Advanced features of Odb
- OdbObjects should watch and react to changes of PouchDB objects
- transaction - starts a transaction, that creates a new OdbTransaction object
    - OdbTransaction have it's own 'd' collection which stores only changed object, Automerge lib should be use to do storing and commiting smart way.
    - OdbTransaction always have a parent - another OdbTransaction or Odb itself
    - OdbTransaction have `.getObject(objectId)` function to change objects inside transaction. And all the same functions as Odb have.
    - commit - commits changes to underlaying PouchDb
- Odb.autoForget() - the idea behind this is the fact that we don't really need to store many objects in runtime, when we have PouchDB. OdbObject should have `_touch()` function and store `performance.now()` each time it have been accessed - for read or for write, basically any call to any method. Instead of hardcoding performance.now() - move it to internal `_getTimestamp()` and `_checkTimestamp()` functions so it could be changed any time or even with options.
    - And later on when Odb.autoForget() is called - Odb should 'forget' objects that wasn't touched for long enough by calls  (long enough is decided by options and defaults to 5 minutes).

I'd like to start implementation of Odb from tests (TDD style).
So for the tests, first one should be:
- Create a db
- Fill it with some test data
- Get data with Odb
- Change data with Odb
- Get new data with Odb
- Try getting data from other instance of Odb on the same PouchDB
  And additionally test for transactions
- Create a transaction
- Change data in PouchDB - this should be displayed inside transaction
- Now change data inside transaction - this should create isolated objects
- Check that PouchDB wasnt changed on this step
- Now change data  in PouchDB - now this should not affect objects inside transaction
- Commit transaction
- Check that new data is written to PouchDB

Test style:
```Typescript
import test from 'node:test';  
import assert from 'node:assert/strict';  
  
test('sum adds two numbers', () => {  
    assert.equal(2 + 3, 5);  
});
```