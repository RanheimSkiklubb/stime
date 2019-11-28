import server from '../server';
import {request, expect, use} from 'chai';
import chaiHttp = require('chai-http');
import {describe, it} from 'mocha';

use(chaiHttp);

describe('Hello API Request', () => {
  it('should return response on call', () => {
    return request(server).get('/api/ping')
      .then(res => {
        expect(res.text).to.equal("pong");
      })
  })
})