const assert = require('assert');
// for test
const signLib = require('../server/lib/sign');
const userModel = require('../server/model/user');

const testTicket = 'ns_2b0e49ea73f69cff3da25ba45bdb84cd';
const validSignature = 'NtnvxcPqVakp38XC3KmYvibdCOyl6BCCYwmH42hK1sOjo73ZSVnhTIEYt6th64zjLQsBJISvUHcgCae5Ej5aew==';
describe('Sign', function(){
    describe('#sign ticket', function(){
        it('should equal the valid signature', function(){
            assert.equal(signLib.uaParams({ticket: testTicket}), validSignature);
        });
    })
});


const testUser = {
    "uTicket": "ns_154768b8dd461d3d0f01672a5388bf8c",
    "name": "appadmin",
    "id": "1462350",
    "permission": [
      "authorization"
    ]
  };
describe('model', function(){
    describe('#add a unique user', function(){
        it('should report no error', function(){
            userModel.pushUnique(testUser);
        });
    });
    describe('#find a user', function(){
        it('should find the user', function(){
            let user = userModel.getOneById(testUser.id);
            assert(user.name, testUser.name);
        });
    });
    describe('#set a property', function(){
        it('should update the property', function(){
            const changeUTicket = '123456';
            let list = userModel.getListInstance();
            list.find({id: testUser.id}).set('uTicket', changeUTicket).write();

            let user = userModel.getOneById(testUser.id);
            assert(user.uTicket, changeUTicket);
        });
    })
});