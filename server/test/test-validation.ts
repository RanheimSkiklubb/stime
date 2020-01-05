import { describe, it } from 'mocha';
import { expect } from 'chai';
import Ajv from "ajv";
import { participantSchema } from '../api/participant.schema'

describe('Participant validation', () => {
    it('should validate proper json', () => {
        const json = {
            firstName: 'Øyvind',
            lastName: 'Rønne',
            club: 'Ranheim SK',
            eventClass: 'Mini'
        }
        const ajv = new Ajv({allErrors: true});
        var validate = ajv.compile(participantSchema);
        const valid = validate(json);
        expect(valid).to.equal(true);
    })

    it('should not validate improper json', () => {
        const json = {
            firstName: 'Øyvind'
        }
        const ajv = new Ajv({allErrors: true});
        var validate = ajv.compile(participantSchema);
        const valid = validate(json);
        expect(valid).to.equal(false);
    })

});